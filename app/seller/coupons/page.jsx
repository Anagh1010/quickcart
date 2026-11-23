'use client'
import React, { useEffect, useState } from "react";
import { useAppContext } from "@/context/AppContext";
import Footer from "@/components/seller/Footer";
import Loading from "@/components/Loading";
import ConfirmDialog from "@/components/common/ConfirmDialog";
import axios from "axios";
import toast from "react-hot-toast";

const ManageCoupons = () => {
    const { getToken, user, currency } = useAppContext();
    const [coupons, setCoupons] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [deleteId, setDeleteId] = useState(null);
    const [deleting, setDeleting] = useState(false);

    // Form states
    const [code, setCode] = useState("");
    const [discountType, setDiscountType] = useState("percentage");
    const [discountValue, setDiscountValue] = useState("");
    const [minCartAmount, setMinCartAmount] = useState("");
    const [expiryDate, setExpiryDate] = useState("");

    const fetchCoupons = async () => {
        try {
            const token = await getToken();
            const { data } = await axios.get("/api/coupon/manage", {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (data.success) {
                setCoupons(data.coupons);
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            console.error('[seller/coupons] Failed to fetch:', error);
            toast.error(error.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (user) {
            fetchCoupons();
        }
    }, [user]);

    const handleCreateCouponSubmit = async (e) => {
        e.preventDefault();
        if (!code || !discountValue || !expiryDate) {
            toast.error("Please fill in all required fields");
            return;
        }

        setIsSubmitting(true);
        try {
            const token = await getToken();
            const { data } = await axios.post("/api/coupon/manage", {
                code: code.trim(),
                discountType,
                discountValue: Number(discountValue),
                minCartAmount: Number(minCartAmount) || 0,
                expiryDate
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (data.success) {
                toast.success("Coupon code created successfully!");
                setCode("");
                setDiscountValue("");
                setMinCartAmount("");
                setExpiryDate("");
                fetchCoupons();
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to create coupon");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDeleteCoupon = (couponId) => setDeleteId(couponId);

    const confirmDeleteCoupon = async () => {
        if (!deleteId) return;
        setDeleting(true);
        try {
            const token = await getToken();
            const { data } = await axios.delete(`/api/coupon/manage?id=${deleteId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (data.success) {
                toast.success("Coupon deleted successfully!");
                fetchCoupons();
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to delete coupon");
        } finally {
            setDeleting(false);
            setDeleteId(null);
        }
    };

    return (
        <div className="flex-1 min-h-screen flex flex-col justify-between bg-[#fbf9f4] text-stone-900">
            {loading ? (
                <Loading />
            ) : (
                <div className="w-full md:p-10 p-4 max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-3">
                        <h2 className="text-2xl font-bold tracking-tight text-stone-950">Promotional Coupons</h2>
                        <p className="text-xs text-stone-500 font-medium mt-1">Create and manage marketing promo codes for your buyers.</p>
                    </div>

                    {/* Create Coupon Form */}
                    <div className="bg-white p-6 rounded-2xl border border-[#e6e4dc] shadow-2xs h-fit">
                        <h3 className="text-sm font-bold text-stone-950 mb-4 pb-2 border-b border-stone-100 uppercase tracking-wider">
                            Launch Coupon
                        </h3>
                        
                        <form onSubmit={handleCreateCouponSubmit} className="space-y-4 text-xs font-semibold text-stone-500">
                            <div>
                                <label className="block text-stone-400 mb-1.5 uppercase tracking-wider text-[10px]">Coupon Code</label>
                                <input 
                                    type="text" 
                                    placeholder="E.g., SAVE20, FREESHIP"
                                    value={code}
                                    onChange={(e) => setCode(e.target.value)}
                                    className="w-full px-3.5 py-2.5 border border-[#e6e4dc] rounded-xl outline-none focus:border-amber-500 bg-white font-medium text-stone-800 uppercase text-xs"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-stone-400 mb-1.5 uppercase tracking-wider text-[10px]">Discount Type</label>
                                <select 
                                    value={discountType} 
                                    onChange={(e) => setDiscountType(e.target.value)}
                                    className="w-full px-3.5 py-2.5 border border-[#e6e4dc] rounded-xl outline-none focus:border-amber-500 bg-white font-medium text-stone-800 cursor-pointer text-xs"
                                >
                                    <option value="percentage">Percentage Discount (%)</option>
                                    <option value="flat">Flat Dollar Discount ($)</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-stone-400 mb-1.5 uppercase tracking-wider text-[10px]">Discount Value</label>
                                <input 
                                    type="number" 
                                    placeholder={discountType === "percentage" ? "Value (e.g. 20 for 20%)" : "Value (e.g. 15 for $15)"}
                                    value={discountValue}
                                    onChange={(e) => setDiscountValue(e.target.value)}
                                    className="w-full px-3.5 py-2.5 border border-[#e6e4dc] rounded-xl outline-none focus:border-amber-500 bg-white font-medium text-stone-800 text-xs"
                                    min="1"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-stone-400 mb-1.5 uppercase tracking-wider text-[10px]">Min Purchase Threshold ({currency})</label>
                                <input 
                                    type="number" 
                                    placeholder="E.g., 50 (0 for no limit)"
                                    value={minCartAmount}
                                    onChange={(e) => setMinCartAmount(e.target.value)}
                                    className="w-full px-3.5 py-2.5 border border-[#e6e4dc] rounded-xl outline-none focus:border-amber-500 bg-white font-medium text-stone-800 text-xs"
                                    min="0"
                                />
                            </div>

                            <div>
                                <label className="block text-stone-400 mb-1.5 uppercase tracking-wider text-[10px]">Expiration Date</label>
                                <input 
                                    type="date"
                                    value={expiryDate}
                                    onChange={(e) => setExpiryDate(e.target.value)}
                                    className="w-full px-3.5 py-2.5 border border-[#e6e4dc] rounded-xl outline-none focus:border-amber-500 bg-white font-medium text-stone-800 cursor-pointer text-xs"
                                    required
                                />
                            </div>

                            <button 
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full py-3 bg-[#f5c344] hover:bg-[#e6b02e] text-stone-900 rounded-xl text-xs font-bold transition shadow-2xs cursor-pointer disabled:opacity-50 mt-2"
                            >
                                {isSubmitting ? "Creating..." : "Create Coupon"}
                            </button>
                        </form>
                    </div>

                    {/* Existing Coupon List Table */}
                    <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-[#e6e4dc] shadow-2xs h-fit">
                        <h3 className="text-sm font-bold text-stone-950 mb-4 pb-2 border-b border-stone-100 uppercase tracking-wider">
                            Active Coupons
                        </h3>

                        <div className="w-full overflow-hidden rounded-xl border border-stone-100">
                            <table className="table-fixed w-full text-xs text-left">
                                <thead className="bg-[#fcfbf7] border-b border-stone-100 text-stone-800">
                                    <tr>
                                        <th className="px-4 py-3 font-bold uppercase tracking-wider text-stone-400 w-24">Code</th>
                                        <th className="px-4 py-3 font-bold uppercase tracking-wider text-stone-400">Value</th>
                                        <th className="px-4 py-3 font-bold uppercase tracking-wider text-stone-400">Min Spend</th>
                                        <th className="px-4 py-3 font-bold uppercase tracking-wider text-stone-400 max-sm:hidden">Expires</th>
                                        <th className="px-4 py-3 font-bold uppercase tracking-wider text-stone-400 w-20 text-center">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="text-stone-600 divide-y divide-stone-100">
                                    {coupons.length === 0 ? (
                                        <tr>
                                            <td colSpan="5" className="text-center py-8 italic text-stone-400">No promo coupons available yet.</td>
                                        </tr>
                                    ) : (
                                        coupons.map((coupon) => (
                                            <tr key={coupon._id} className="hover:bg-stone-50/60 transition">
                                                <td className="px-4 py-3 font-bold text-amber-800 uppercase">{coupon.code}</td>
                                                <td className="px-4 py-3 font-medium">
                                                    {coupon.discountType === "percentage" 
                                                        ? `${coupon.discountValue}% Off` 
                                                        : `${currency}${coupon.discountValue} Flat`}
                                                </td>
                                                <td className="px-4 py-3 font-medium">{currency}{coupon.minCartAmount}</td>
                                                <td className="px-4 py-3 font-medium max-sm:hidden">{new Date(coupon.expiryDate).toLocaleDateString()}</td>
                                                <td className="px-4 py-3 text-center">
                                                    <button 
                                                        onClick={() => handleDeleteCoupon(coupon._id)}
                                                        className="px-2.5 py-1.5 bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-700 rounded-lg text-[10px] font-bold cursor-pointer transition"
                                                    >
                                                        Delete
                                                    </button>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            )}
            <Footer />
            <ConfirmDialog
                open={Boolean(deleteId)}
                title="Delete coupon?"
                description="Are you sure you want to delete this coupon? Buyers will no longer be able to apply it."
                confirmLabel="Delete Coupon"
                loading={deleting}
                onConfirm={confirmDeleteCoupon}
                onCancel={() => setDeleteId(null)}
            />
        </div>
    );
};

export default ManageCoupons;
