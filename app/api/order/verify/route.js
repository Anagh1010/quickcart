import crypto from "crypto";
import connectDB from "@/config/db";
import Order from "@/models/Order";
import User from "@/models/User";
import Product from "@/models/Product";
import Coupon from "@/models/Coupon";
import mongoose from "mongoose";
import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { getAuditRequestContext, logAudit } from "@/lib/audit";
import { logError } from "@/lib/logger";

export async function POST(request) {
    let reservedItems = [];
    try {
        const { userId } = getAuth(request);

        if (!userId) {
            return NextResponse.json({ success: false, message: "User not authenticated" }, { status: 401 });
        }

        const {
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature,
            address,
            items,
            couponCode
        } = await request.json();

        if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature || !address || !items || items.length === 0) {
            return NextResponse.json({ success: false, message: "Missing payment or order details" }, { status: 400 });
        }

        // 1. Verify Razorpay cryptographic signature using HMAC-SHA256
        const body = razorpay_order_id + "|" + razorpay_payment_id;
        const expectedSignature = crypto
            .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
            .update(body)
            .digest("hex");

        if (expectedSignature !== razorpay_signature) {
            await logAudit("payment.verification_failed", "order", userId, razorpay_order_id, {}, {
                category: "security", outcome: "failed", request: getAuditRequestContext(request)
            });
            return NextResponse.json({ success: false, message: "Payment verification failed" }, { status: 400 });
        }

        // 2. Signature verified! Now connect to MongoDB to save order and deduct stock
        await connectDB();

        // 3. Atomically reserve product inventory
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
                    message: "Product became unavailable during checkout. Please contact support."
                }, { status: 409 });
            }
            reservedItems.push(item);
        }

        // 4. Calculate final totals server-side
        let amount = 0;
        for (const item of items) {
            const product = await Product.findById(item.product);
            if (product) {
                amount += product.offerPrice * item.quantity;
            }
        }

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

        const totalAmount = amount + Math.floor(amount * 0.02);

        // 5. Save verified order to MongoDB (First and only time written to DB)
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
            paymentMethod: "Online",
            isPaid: true,
            razorpayOrderId: razorpay_order_id,
            razorpayPaymentId: razorpay_payment_id,
            razorpaySignature: razorpay_signature,
            couponCode: couponCode ? couponCode.toUpperCase() : "",
            discount
        });

        // 6. Clear user's cart in database
        const user = await User.findById(userId);
        if (user) {
            user.cartItems = {};
            await user.save();
        }

        await logAudit("payment.verified", "order", userId, savedOrder._id.toString(), {
            amount: totalAmount,
            paymentMethod: "Online"
        }, {
            resourceLabel: `Order ${savedOrder._id}`,
            request: getAuditRequestContext(request)
        });

        return NextResponse.json({
            success: true,
            message: "Payment verified successfully",
            orderId: savedOrder._id
        });

    } catch (error) {
        console.error("Payment verification error:", error);
        await logError("/api/order/verify", error, "", { reservedItems }, "error", "api", 500);
        if (reservedItems.length > 0) {
            for (const rollback of reservedItems) {
                await Product.findByIdAndUpdate(rollback.product, { $inc: { stock: rollback.quantity } });
            }
        }
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}
