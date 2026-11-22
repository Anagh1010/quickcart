'use client'
import redirect_icon from "@/assets/redirect_icon.svg";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useAppContext } from "@/context/AppContext";
import Footer from "@/components/seller/Footer";
import Loading from "@/components/Loading";
import axios from "axios";
import toast from "react-hot-toast";

const ProductList = () => {
  const { router, getToken, user, currency } = useAppContext()

  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchSellerProduct = async () => {
    try {
      const token = await getToken()
      const { data } = await axios.get('/api/product/seller-list', { 
        headers: { Authorization: `Bearer ${token}` } 
      })

      if (data.success) {
        setProducts(data.products)
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      console.error('[seller/product-list] Failed to fetch:', error);
      toast.error(error.message)
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteProduct = async (productId) => {
    if (!confirm("Are you sure you want to permanently delete this listing? This will also remove all its reviews.")) return;

    try {
      const token = await getToken();
      const { data } = await axios.delete(`/api/product/delete?id=${productId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (data.success) {
        toast.success(data.message || "Product deleted successfully!");
        fetchSellerProduct();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete product");
    }
  };

  useEffect(() => {
    if (user) {
      fetchSellerProduct();
    }
  }, [user])

  return (
    <div className="flex-1 min-h-screen flex flex-col justify-between bg-[#fbf9f4] text-stone-900">
      {loading ? (
        <Loading />
      ) : (
        <div className="w-full md:p-10 p-4 max-w-5xl mx-auto">
          <div className="mb-6">
            <h2 className="text-2xl font-bold tracking-tight text-stone-950">Listed Products</h2>
            <p className="text-xs text-stone-500 font-medium mt-1">View, edit details, or remove your store product listings.</p>
          </div>

          <div className="flex flex-col items-center w-full overflow-hidden rounded-2xl bg-white border border-[#e6e4dc] shadow-2xs">
            <table className="table-fixed w-full overflow-hidden text-sm">
              <thead className="text-stone-900 text-left bg-[#fcfbf7] border-b border-stone-100">
                <tr>
                  <th className="w-2/5 px-6 py-4 font-bold text-xs uppercase tracking-wider text-stone-400">Product</th>
                  <th className="px-6 py-4 font-bold text-xs uppercase tracking-wider text-stone-400 max-sm:hidden">Category</th>
                  <th className="px-6 py-4 font-bold text-xs uppercase tracking-wider text-stone-400">Price</th>
                  <th className="px-6 py-4 font-bold text-xs uppercase tracking-wider text-stone-400 w-72 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="text-stone-600 divide-y divide-stone-100">
                {products.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="text-center py-12 text-stone-400 italic">No products listed in your store yet.</td>
                  </tr>
                ) : (
                  products.map((product) => (
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
                      <td className="px-6 py-4 font-bold text-amber-800 text-xs">{currency}{product.offerPrice}</td>
                      <td className="px-6 py-4 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <button 
                            onClick={() => router.push(`/product/${product._id}`)} 
                            className="p-2 bg-stone-50 hover:bg-stone-100 border border-[#e6e4dc] rounded-xl text-xs font-semibold text-stone-700 transition cursor-pointer flex items-center gap-1"
                            title="Visit Page"
                          >
                            <span>Visit</span>
                            <Image className="size-3 opacity-60" src={redirect_icon} alt="redirect" />
                          </button>
                          
                          <button 
                            onClick={() => router.push(`/seller/edit-product/${product._id}`)} 
                            className="px-3.5 py-2 bg-[#f5c344] hover:bg-[#e6b02e] text-stone-900 rounded-xl text-xs font-bold transition cursor-pointer shadow-2xs"
                            title="Edit Details"
                          >
                            Edit
                          </button>
                          
                          <button 
                            onClick={() => handleDeleteProduct(product._id)} 
                            className="px-3.5 py-2 bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-700 rounded-xl text-xs font-bold transition cursor-pointer"
                            title="Remove Product"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
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

export default ProductList;
