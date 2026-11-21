import Razorpay from "razorpay";
import connectDB from "@/config/db";
import Product from "@/models/Product";
import User from "@/models/User";
import Order from "@/models/Order";
import Coupon from "@/models/Coupon";
import mongoose from "mongoose";
import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { logError, trackPerf } from "@/lib/logger";
import { getAuditRequestContext, logAudit } from "@/lib/audit";

export async function POST(request) {
    let reservedItems = [];
    try {
        const { userId } = getAuth(request);
        const { address, items, paymentMethod, couponCode } = await request.json();

        if (!address || !items || items.length === 0) {
            return NextResponse.json({ success: false, message: "Invalid data" }, { status: 400 });
        }

        if (!userId) {
            return NextResponse.json({ success: false, message: "User not authenticated" }, { status: 401 });
        }

        await connectDB();

        // 1. Check stock availability for all items
        for (const item of items) {
            const product = await Product.findById(item.product);
            if (!product || product.stock < item.quantity) {
                return NextResponse.json({
                    success: false,
                    message: `Product "${product?.name || "in cart"}" has insufficient stock.`
                });
            }
        }

        // 2. Calculate Subtotal Server-side
        let amount = 0;
        for (const item of items) {
            const product = await Product.findById(item.product);
            if (product) {
                amount += product.offerPrice * item.quantity;
            }
        }

        // 3. Apply Promo/Coupon Discount
        let discount = 0;
        if (couponCode) {
            const coupon = await Coupon.findOne({ code: couponCode.toUpperCase(), isActive: true });
            if (coupon && coupon.expiryDate >= new Date() && amount >= coupon.minCartAmount) {
                if (coupon.discountType === "percentage") {
                    discount = Math.floor(amount * (coupon.discountValue / 100));
                } else if (coupon.discountType === "flat") {
                    discount = coupon.discountValue;
                }
                discount = Math.min(discount, amount);
                amount = Math.max(0, amount - discount);
            }
        }

        // 4. Calculate Total with 2% tax
        const totalAmount = amount + Math.floor(amount * 0.02);

        // ----- COD Flow: Save order immediately -----
        if (paymentMethod !== "Online") {
            for (const item of items) {
                const result = await Product.findOneAndUpdate(
                    { _id: item.product, stock: { $gte: item.quantity } },
                    { $inc: { stock: -item.quantity } },
                    { new: true }
                );
                if (!result) {
                    for (const rollback of reservedItems) {
                        await Product.findByIdAndUpdate(rollback.product, { $inc: { stock: rollback.quantity } });
                    }
                    return NextResponse.json({
                        success: false,
                        message: "One or more products became out of stock. Please verify your cart."
                    });
                }
                reservedItems.push(item);
            }

            const savedOrder = await Order.create({
                userId,
                items: items.map((item) => ({
                    product: new mongoose.Types.ObjectId(item.product),
                    quantity: item.quantity,
                })),
                amount: totalAmount,
                address: new mongoose.Types.ObjectId(address),
                status: "Order Placed",
                date: Date.now(),
                paymentMethod: "COD",
                isPaid: false,
                couponCode: couponCode ? couponCode.toUpperCase() : "",
                discount
            });

            // Clear user's cart in DB
            const user = await User.findById(userId);
            if (user) {
                user.cartItems = {};
                await user.save();
            }

            await logAudit("order.created", "order", userId, savedOrder._id.toString(), {
                itemCount: items.length,
                paymentMethod: "COD",
                couponApplied: Boolean(couponCode)
            }, {
                resourceLabel: `Order ${savedOrder._id}`,
                request: getAuditRequestContext(request),
                changes: {
                    after: { status: savedOrder.status, paymentMethod: savedOrder.paymentMethod, amount: savedOrder.amount, isPaid: savedOrder.isPaid },
                    fields: ["status", "paymentMethod", "amount", "isPaid"]
                }
            });

            return NextResponse.json({
                success: true,
                message: "Order Placed",
                orderId: savedOrder._id,
            });
        }

        // ----- Online Flow: Only initiate Razorpay, DO NOT write to MongoDB -----
        const razorpayInstance = new Razorpay({
            key_id: process.env.RAZORPAY_KEY_ID,
            key_secret: process.env.RAZORPAY_KEY_SECRET,
        });

        const razorpayOrder = await trackPerf(
            "razorpay.orders.create",
            () => razorpayInstance.orders.create({
                amount: totalAmount * 100,
                currency: "INR",
                receipt: `order_${Date.now()}`,
            }),
            "/api/order/create",
            userId
        );

        return NextResponse.json({
            success: true,
            message: "Razorpay order initiated",
            order: {
                id: razorpayOrder.id,
                amount: razorpayOrder.amount,
                currency: razorpayOrder.currency,
            }
        });

    } catch (error) {
        console.error("Order creation error:", error);
        await logError("/api/order/create", error, "", { reservedItems }, "error", "api", 500);
        if (reservedItems.length > 0) {
            for (const rollback of reservedItems) {
                await Product.findByIdAndUpdate(rollback.product, { $inc: { stock: rollback.quantity } });
            }
        }
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}
