import connectDB from "@/config/db";
import authSeller from "@/lib/authSeller";
import Address from "@/models/Address";
import Order from "@/models/Order";
import Product from "@/models/Product";
import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { logError } from "@/lib/logger";
import { getAuditRequestContext, logAudit } from "@/lib/audit";

const VALID_STATUSES = ['Order Placed', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];

export async function GET(request) {
    try {
        const { userId } = getAuth(request);
        const isSeller = await authSeller(userId);

        if (!isSeller) {
            return NextResponse.json({ success: false, message: 'not authorized' }, { status: 403 });
        }

        await connectDB();

        // Get only this seller's product IDs
        const sellerProducts = await Product.find({ userId }).select('_id').lean();
        const sellerProductIds = sellerProducts.map(p => p._id.toString());

        if (sellerProductIds.length === 0) {
            return NextResponse.json({ success: true, orders: [] });
        }

        // Find orders that contain at least one of this seller's products
        const orders = await Order.find({
            'items.product': { $in: sellerProductIds }
        }).populate('address items.product').sort({ date: -1 }).lean();

        // Filter each order's items to only show this seller's products
        const filteredOrders = orders.map(order => ({
            ...order,
            items: order.items.filter(item =>
                item.product && sellerProductIds.includes(item.product._id.toString())
            )
        }));

        return NextResponse.json({ success: true, orders: filteredOrders });

    } catch (error) {
        await logError('/api/order/seller-orders', error, '', {}, 'error', 'api', 500);
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}

export async function PATCH(request) {
    try {
        const { userId } = getAuth(request);
        const isSeller = await authSeller(userId);

        if (!isSeller) {
            return NextResponse.json({ success: false, message: 'not authorized' }, { status: 403 });
        }

        const { orderId, status } = await request.json();

        if (!orderId || !status || !VALID_STATUSES.includes(status)) {
            return NextResponse.json({ success: false, message: 'Invalid status or missing order ID' }, { status: 400 });
        }

        await connectDB();

        // Verify that the order contains products belonging to this seller
        const sellerProducts = await Product.find({ userId }).select('_id').lean();
        const sellerProductIds = sellerProducts.map(p => p._id.toString());

        const order = await Order.findOne({
            _id: orderId,
            'items.product': { $in: sellerProductIds }
        });

        if (!order) {
            return NextResponse.json({ success: false, message: 'Order not found or unauthorized' }, { status: 404 });
        }

        const previousStatus = order.status;
        order.status = status;
        await order.save();

        await logAudit('order.updated', 'order', userId, orderId, { previousStatus, newStatus: status }, {
            actorRole: 'seller',
            resourceLabel: `Order ${orderId}`,
            request: getAuditRequestContext(request),
            changes: { before: { status: previousStatus }, after: { status }, fields: ['status'] }
        });

        return NextResponse.json({ success: true, message: 'Order status updated', status });

    } catch (error) {
        await logError('/api/order/seller-orders', error, '', {}, 'error', 'api', 500);
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}
