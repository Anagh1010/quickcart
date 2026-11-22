'use client'
import React, { useEffect, useState } from "react";
import { useAppContext } from "@/context/AppContext";
import Footer from "@/components/seller/Footer";
import Loading from "@/components/Loading";
import Image from "next/image";
import axios from "axios";
import toast from "react-hot-toast";

const ManageStock = () => {
    const { getToken, user } = useAppContext();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [updatingId, setUpdatingId] = useState(null);

    // Track input stock values per product
    const [stockInputs, setStockInputs] = useState({});

    const fetchSellerProducts = async () => {
        try {
            const token = await getToken();
            const { data } = await axios.get('/api/product/seller-list', {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (data.success) {
                setProducts(data.products);
                const inputs = {};
                data.products.forEach(p => {
                    inputs[p._id] = p.stock || 0;
                });
                setStockInputs(inputs);
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            console.error('[seller/inventory] Failed to fetch:', error);
            toast.error(error.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (user) {
            fetchSellerProducts();
        }
    }, [user]);

    const handleInputChange = (productId, val) => {
        setStockInputs(prev => ({
            ...prev,
            [productId]: val
        }));
    };

    const handleStockUpdateSubmit = async (productId) => {
        const stockVal = stockInputs[productId];
        if (stockVal === undefined || isNaN(Number(stockVal)) || Number(stockVal) < 0) {
            toast.error("Please enter a valid stock count");
            return;
        }

        setUpdatingId(productId);
        try {
            const token = await getToken();
            const { data } = await axios.post("/api/product/update-stock", {
                productId,
                stock: Number(stockVal)
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (data.success) {
                toast.success("Stock level updated successfully!");
                setProducts(prev => prev.map(p => p._id === productId ? { ...p, stock: Number(stockVal) } : p));
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to update stock");
        } finally {
            setUpdatingId(null);
        }
    };

    const handleQuickIncrement = (productId, amount) => {
        const currentInputVal = Number(stockInputs[productId]) || 0;
        const nextVal = Math.max(0, currentInputVal + amount);
        handleInputChange(productId, nextVal);
    };

    return (
        <div className="flex-1 min-h-screen flex flex-col justify-between bg-[#fbf9f4] text-stone-900">
            {loading ? (
                <Loading />
            ) : (
                <div className="w-full md:p-10 p-4 max-w-5xl mx-auto">
                    <div className="mb-6 flex items-center justify-between">
                        <div>
                            <h2 className="text-2xl font-bold tracking-tight text-stone-950">Inventory Control</h2>
                            <p className="text-xs text-stone-500 font-medium mt-1">Live customer reserve tracking and direct stock replenishment.</p>
                        </div>
                    </div>

                    <div className="flex flex-col items-center w-full overflow-hidden rounded-2xl bg-white border border-[#e6e4dc] shadow-2xs">
                        <table className="table-fixed w-full overflow-hidden text-sm">
                            <thead className="text-stone-900 text-left bg-[#fcfbf7] border-b border-stone-100">
                                <tr>
                                    <th className="w-2/5 px-6 py-4 font-bold text-xs uppercase tracking-wider text-stone-400">Product</th>
                                    <th className="px-6 py-4 font-bold text-xs uppercase tracking-wider text-stone-400 max-sm:hidden">Category</th>
                                    <th className="px-6 py-4 font-bold text-xs uppercase tracking-wider text-stone-400">Status</th>
                                    <th className="px-6 py-4 font-bold text-xs uppercase tracking-wider text-stone-400 w-72">Restock / Adjust</th>
                                </tr>
                            </thead>
                            <tbody className="text-stone-600 divide-y divide-stone-100">
                                {products.length === 0 ? (
                                    <tr>
                                        <td colSpan="4" className="text-center py-12 text-stone-400 italic">No products listed yet.</td>
                                    </tr>
                                ) : (
                                    products.map((product) => {
                                        const currentStock = product.stock || 0;
                                        return (
                                            <tr key={product._id} className="hover:bg-stone-50/60 transition">
                                                <td className="px-6 py-4 flex items-center space-x-3 truncate">
                                                    <div className="bg-stone-50 rounded-xl p-1.5 shrink-0 border border-stone-200">
                                                        <Image
                                                            src={product.image[0]}
                                                            alt={product.name}
                                                            className="size-12 object-contain"
                                                            width={48}
                                                            height={48}
                                                        />
                                                    </div>
                                                    <span className="font-semibold text-stone-950 truncate text-xs">{product.name}</span>
                                                </td>

                                                <td className="px-6 py-4 max-sm:hidden font-medium text-stone-500 text-xs">{product.category}</td>

                                                <td className="px-6 py-4">
                                                    {currentStock === 0 ? (
                                                        <span className="inline-flex items-center text-[10px] text-rose-700 bg-rose-50 border border-rose-200 font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">
                                                            Out Of Stock
                                                        </span>
                                                    ) : currentStock < 5 ? (
                                                        <span className="inline-flex items-center text-[10px] text-amber-800 bg-amber-50 border border-amber-200 font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">
                                                            Low Stock ({currentStock})
                                                        </span>
                                                    ) : (
                                                        <span className="inline-flex items-center text-[10px] text-emerald-800 bg-emerald-50 border border-emerald-200 font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">
                                                            In Stock ({currentStock})
                                                        </span>
                                                    )}
                                                </td>

                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-2">
                                                        <div className="flex items-center border border-[#e6e4dc] rounded-xl overflow-hidden bg-stone-50">
                                                            <button 
                                                                onClick={() => handleQuickIncrement(product._id, -5)}
                                                                className="px-2.5 py-1.5 text-xs font-bold text-stone-600 hover:bg-stone-200 transition cursor-pointer"
                                                                title="Reduce by 5"
                                                            >
                                                                -5
                                                            </button>
                                                            <input 
                                                                type="number"
                                                                min="0"
                                                                value={stockInputs[product._id] !== undefined ? stockInputs[product._id] : 0}
                                                                onChange={(e) => handleInputChange(product._id, e.target.value)}
                                                                className="w-12 text-center text-xs font-bold text-stone-900 outline-none border-none bg-transparent"
                                                            />
                                                            <button 
                                                                onClick={() => handleQuickIncrement(product._id, 10)}
                                                                className="px-2.5 py-1.5 text-xs font-bold text-stone-600 hover:bg-stone-200 transition cursor-pointer"
                                                                title="Add 10"
                                                            >
                                                                +10
                                                            </button>
                                                        </div>
                                                        
                                                        <button 
                                                            disabled={updatingId === product._id}
                                                            onClick={() => handleStockUpdateSubmit(product._id)}
                                                            className="px-4 py-2 bg-[#f5c344] hover:bg-[#e6b02e] text-stone-900 rounded-xl text-xs font-bold transition shadow-2xs cursor-pointer disabled:opacity-50"
                                                        >
                                                            {updatingId === product._id ? "Saving..." : "Save"}
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        )
                                    })
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
            <Footer />
        </div>
    );
};

export default ManageStock;
