'use client';
import box_icon from "@/assets/box_icon.svg";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useAppContext } from "@/context/AppContext";
import Footer from "@/components/seller/Footer";
import Loading from "@/components/Loading";
import axios from "axios";
import toast from "react-hot-toast";

const STATUS_OPTIONS = ['Order Placed', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];

const Orders = () => {
    const { currency, getToken, user } = useAppContext();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [updatingOrderId, setUpdatingOrderId] = useState(null);

    const fetchSellerOrders = async () => {
        try {
            const token = await getToken();
            const { data } = await axios.get('/api/order/seller-orders', {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (data.success) {
                setOrders(data.orders);
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.response?.data?.message || error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleStatusChange = async (orderId, newStatus) => {
        setUpdatingOrderId(orderId);
        try {
            const token = await getToken();
            const { data } = await axios.patch('/api/order/seller-orders', {
                orderId,
                status: newStatus
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (data.success) {
                setOrders(prev => prev.map(o => o._id === orderId ? { ...o, status: newStatus } : o));
                toast.success(`Order marked as ${newStatus}`);
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to update order status');
        } finally {
            setUpdatingOrderId(null);
        }
    };

    useEffect(() => {
        if (user) {
            fetchSellerOrders();
        }
    }, [user]);

    if (loading) return <Loading />;

    return (
        <div className="flex-1 min-h-screen flex flex-col justify-between bg-canvas text-stone-900 text-sm">
            <div className="w-full md:p-10 p-4 max-w-5xl mx-auto space-y-6">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight text-stone-950">Orders</h2>
                    <p className="text-xs text-stone-500 font-medium mt-1">
                        Manage customer purchases and update dispatch status.
                    </p>
                </div>

                {orders.length === 0 ? (
                    <div className="bg-white rounded-2xl border border-border-subtle p-12 text-center text-stone-400">
                        <p className="text-3xl mb-2">📦</p>
                        <p className="font-medium text-stone-600">No orders received yet.</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {orders.map((order) => (
                            <div
                                key={order._id}
                                className="bg-white rounded-2xl border border-border-subtle p-5 shadow-2xs flex flex-col lg:flex-row gap-5 justify-between items-start lg:items-center"
                            >
                                <div className="flex gap-4 max-w-md">
                                    <div className="size-14 shrink-0 rounded-xl bg-stone-100 flex items-center justify-center p-2 border border-stone-200">
                                        <Image className="size-9 object-contain opacity-70" src={box_icon} alt="box" />
                                    </div>
                                    <div className="space-y-1">
                                        <p className="font-semibold text-stone-900 text-sm leading-tight">
                                            {order.items.map((item) => `${item.product?.name || "Product"} × ${item.quantity}`).join(", ")}
                                        </p>
                                        <p className="text-xs text-stone-400">
                                            {order.items.length} item{order.items.length === 1 ? "" : "s"} · {new Date(order.date).toLocaleDateString()}
                                        </p>
                                        <p className="text-xs text-stone-500">
                                            <span className="font-semibold">{order.address?.fullName}</span> · {order.address?.city}, {order.address?.state} ({order.address?.phoneNumber})
                                        </p>
                                    </div>
                                </div>

                                <div className="flex flex-wrap items-center gap-6 self-stretch lg:self-auto justify-between lg:justify-end border-t lg:border-t-0 pt-4 lg:pt-0 border-stone-100">
                                    <div className="text-left lg:text-right">
                                        <p className="text-lg font-bold text-stone-950">{currency}{order.amount}</p>
                                        <span className={`inline-block text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${order.isPaid ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}`}>
                                            {order.paymentMethod === 'Online' ? 'Online' : 'COD'} · {order.isPaid ? 'Paid' : 'Pending'}
                                        </span>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <select
                                            value={order.status || 'Order Placed'}
                                            disabled={updatingOrderId === order._id}
                                            onChange={(e) => handleStatusChange(order._id, e.target.value)}
                                            className="text-xs font-semibold rounded-xl border border-border-subtle bg-white px-3 py-2 text-stone-800 focus:outline-none focus:border-amber-500 cursor-pointer disabled:opacity-50"
                                        >
                                            {STATUS_OPTIONS.map((st) => (
                                                <option key={st} value={st}>{st}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
            <Footer />
        </div>
    );
};

export default Orders;
