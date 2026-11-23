"use client";

import { useAppContext } from "@/context/AppContext";
import axios from "axios";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import AddressSelector from "./order/AddressSelector";
import PromoCodeBox from "./order/PromoCodeBox";

const OrderSummary = () => {
  const { currency, router, getCartCount, getCartAmount, getToken, user, cartItems, setCartItems } = useAppContext();

  const [selectedAddress, setSelectedAddress] = useState(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [userAddresses, setUserAddresses] = useState([]);
  const [paymentMethod, setPaymentMethod] = useState("COD");
  const [isProcessing, setIsProcessing] = useState(false);

  const [promoCode, setPromoCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [isApplying, setIsApplying] = useState(false);

  const fetchUserAddresses = async () => {
    try {
      const token = await getToken();
      const { data } = await axios.get("/api/user/get-address", {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (data.success) {
        setUserAddresses(data.addresses);
        if (data.addresses.length > 0) {
          setSelectedAddress(data.addresses[0]);
        }
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleApplyCoupon = async () => {
    if (!promoCode.trim()) {
      toast.error("Please enter a coupon code");
      return;
    }
    setIsApplying(true);
    try {
      const token = await getToken();
      const { data } = await axios.post("/api/coupon/validate", {
        code: promoCode.trim(),
        cartAmount: getCartAmount()
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (data.success) {
        setAppliedCoupon(data.coupon);
        toast.success(data.message || "Coupon applied successfully!");
      } else {
        setAppliedCoupon(null);
        toast.error(data.message || "Invalid coupon code");
      }
    } catch (error) {
      setAppliedCoupon(null);
      toast.error(error.response?.data?.message || "Failed to validate coupon");
    } finally {
      setIsApplying(false);
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setPromoCode("");
    toast.success("Coupon removed");
  };

  const subtotal = getCartAmount();
  let discount = 0;
  if (appliedCoupon) {
    if (appliedCoupon.discountType === "percentage") {
      discount = Math.floor(subtotal * (appliedCoupon.discountValue / 100));
    } else if (appliedCoupon.discountType === "flat") {
      discount = appliedCoupon.discountValue;
    }
    discount = Math.min(discount, subtotal);
  }

  const discountedSubtotal = Math.max(0, subtotal - discount);
  const tax = Math.floor(discountedSubtotal * 0.02);
  const totalAmount = discountedSubtotal + tax;

  const initializeRazorpay = (orderData, orderDetails) => {
    const options = {
      key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
      amount: orderData.amount,
      currency: orderData.currency,
      name: "QuickCart",
      description: "Order Payment",
      order_id: orderData.id,
      handler: async (response) => {
        try {
          const freshToken = await getToken();
          const { data } = await axios.post("/api/order/verify", {
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
            address: orderDetails.address,
            items: orderDetails.items,
            couponCode: orderDetails.couponCode
          }, {
            headers: { Authorization: `Bearer ${freshToken}` }
          });

          if (data.success) {
            toast.success("Payment verified and order placed!");
            setCartItems({});
            router.push("/order-placed");
          } else {
            toast.error(data.message || "Verification failed");
          }
        } catch (error) {
          toast.error("Payment verification failed. Please contact support.");
        }
        setIsProcessing(false);
      },
      prefill: {
        name: user?.fullName || "",
        email: user?.primaryEmailAddress?.emailAddress || "",
        contact: selectedAddress?.phoneNumber || user?.primaryPhoneNumber?.phoneNumber || "",
      },
      theme: { color: "#f5c344" },
      modal: {
        ondismiss: () => {
          setIsProcessing(false);
          toast("Payment cancelled.", { icon: "ℹ️" });
        }
      }
    };

    const rzp = new window.Razorpay(options);
    rzp.on("payment.failed", (res) => {
      setIsProcessing(false);
      toast.error("Payment failed: " + res.error.description);
    });
    rzp.open();
  };

  const createOrder = async () => {
    try {
      if (!user) return toast("Please sign in to place order", { icon: "⚠️" });
      if (!selectedAddress) return toast.error("Please select a delivery address");
      if (getCartCount() === 0) return toast.error("Your cart is empty");

      setIsProcessing(true);
      const token = await getToken();

      const items = Object.entries(cartItems)
        .filter(([, qty]) => qty > 0)
        .map(([id, qty]) => ({ product: id, quantity: qty }));

      const { data } = await axios.post("/api/order/create", {
        address: selectedAddress._id,
        items,
        paymentMethod,
        couponCode: appliedCoupon?.code || null
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (data.success) {
        if (paymentMethod === "COD") {
          toast.success(data.message);
          setCartItems({});
          router.push("/order-placed");
          setIsProcessing(false);
        } else {
          // Open Razorpay without writing anything to DB yet
          initializeRazorpay(data.order, {
            address: selectedAddress._id,
            items,
            couponCode: appliedCoupon?.code || null
          });
        }
      } else {
        toast.error(data.message);
        setIsProcessing(false);
      }
    } catch (error) {
      toast.error(error.message);
      setIsProcessing(false);
    }
  };

  useEffect(() => {
    if (user) fetchUserAddresses();
  }, [user]);

  return (
    <div className="w-full md:w-96 rounded-2xl border border-border-subtle bg-white p-5 sm:p-6 shadow-2xs">
      <div className="pb-4 border-b border-[#eceae3]">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-stone-900">Order Summary</h2>
          <span className="rounded bg-[#fef08a] px-2 py-0.5 font-mono text-[10px] font-bold text-[#854d0e]">
            CHECKOUT
          </span>
        </div>
        <p className="text-xs text-stone-500 mt-0.5">Secure payment & express shipping</p>
      </div>

      <div className="space-y-5 pt-4">
        <AddressSelector
          userAddresses={userAddresses}
          selectedAddress={selectedAddress}
          onSelectAddress={(addr) => { setSelectedAddress(addr); setIsDropdownOpen(false); }}
          isDropdownOpen={isDropdownOpen}
          setIsDropdownOpen={setIsDropdownOpen}
        />

        {/* Payment Method */}
        <div>
          <label className="text-xs font-bold uppercase tracking-wider text-stone-600 block mb-2">
            Payment Method
          </label>
          <div className="flex flex-col gap-2">
            <label className={`flex items-center gap-2.5 p-3 rounded-xl border text-xs font-medium cursor-pointer transition ${paymentMethod === 'COD' ? 'border-[#f5c344] bg-[#fef08a]/20' : 'border-border-subtle hover:bg-stone-50'}`}>
              <input type="radio" name="payment" value="COD" checked={paymentMethod === 'COD'} onChange={(e) => setPaymentMethod(e.target.value)} className="accent-[#f5c344] size-3.5" />
              <span className="font-bold text-stone-900">Cash on Delivery (COD)</span>
            </label>
            <label className={`flex items-center gap-2.5 p-3 rounded-xl border text-xs font-medium cursor-pointer transition ${paymentMethod === 'Online' ? 'border-[#f5c344] bg-[#fef08a]/20' : 'border-border-subtle hover:bg-stone-50'}`}>
              <input type="radio" name="payment" value="Online" checked={paymentMethod === 'Online'} onChange={(e) => setPaymentMethod(e.target.value)} className="accent-[#f5c344] size-3.5" />
              <span className="font-bold text-stone-900">Online Gateway (Cards / UPI / NetBanking)</span>
            </label>
          </div>
        </div>

        <PromoCodeBox
          promoCode={promoCode}
          setPromoCode={setPromoCode}
          appliedCoupon={appliedCoupon}
          handleApplyCoupon={handleApplyCoupon}
          handleRemoveCoupon={handleRemoveCoupon}
          isApplying={isApplying}
          currency={currency}
        />

        {/* Breakdown */}
        <div className="pt-3 border-t border-[#eceae3] space-y-2 text-xs">
          <div className="flex justify-between text-stone-600 font-medium">
            <span>Items ({getCartCount()})</span>
            <span className="font-bold text-stone-900">{currency}{subtotal}</span>
          </div>
          {discount > 0 && (
            <div className="flex justify-between text-emerald-800 font-bold bg-emerald-50 px-2 py-1 rounded-md">
              <span>Coupon Discount</span>
              <span>- {currency}{discount}</span>
            </div>
          )}
          <div className="flex justify-between text-stone-600 font-medium">
            <span>Shipping</span>
            <span className="font-bold text-emerald-700">FREE</span>
          </div>
          <div className="flex justify-between text-stone-600 font-medium">
            <span>Tax (2%)</span>
            <span className="font-bold text-stone-900">{currency}{tax}</span>
          </div>
          <div className="flex justify-between text-base font-bold text-stone-900 pt-3 border-t border-[#eceae3]">
            <span>Total Amount</span>
            <span>{currency}{totalAmount}</span>
          </div>
        </div>
      </div>

      <button
        onClick={createOrder}
        disabled={isProcessing}
        className="w-full bg-[#f5c344] hover:bg-[#e6b02e] text-stone-950 font-bold py-3 rounded-xl mt-5 transition shadow-sm text-xs uppercase tracking-wider disabled:opacity-50"
      >
        {isProcessing ? "Processing..." : paymentMethod === "Online" ? "Proceed to Payment →" : "Place Order (COD) →"}
      </button>
    </div>
  );
};

export default OrderSummary;
