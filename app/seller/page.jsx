'use client'
import React, { useState } from "react";
import Image from "next/image";
import { useAppContext } from "@/context/AppContext";
import Footer from "@/components/seller/Footer";
import axios from "axios";
import toast from "react-hot-toast";

const AddProduct = () => {
  const { getToken } = useAppContext()

  const [files, setFiles] = useState([]);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Earphone');
  const [price, setPrice] = useState('');
  const [offerPrice, setOfferPrice] = useState('');
  const [stock, setStock] = useState('0');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (files.filter(Boolean).length === 0) {
      toast.error("Please upload at least one product image.");
      return;
    }

    setIsSubmitting(true);
    const formData = new FormData()

    formData.append('name', name)
    formData.append('description', description)
    formData.append('category', category)
    formData.append('price', price)
    formData.append('offerPrice', offerPrice)
    formData.append('stock', stock)

    for (let i = 0; i < files.length; i++) {
      if (files[i]) formData.append('images', files[i])
    }

    try {
      const token = await getToken()
      const { data } = await axios.post('/api/product/add', formData, {
        headers: { Authorization: `Bearer ${token}` }
      })

      if (data.success) {
        toast.success(data.message)
        setFiles([]);
        setName('');
        setDescription('');
        setCategory('Earphone');
        setPrice('');
        setOfferPrice('');
        setStock('0');
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error('[seller/add-product] Upload failed:', error);
      toast.error(error.response?.data?.message || error.message)
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex-1 min-h-screen flex flex-col justify-between bg-[#fbf9f4] text-stone-900">
      <div className="w-full md:p-10 p-4 max-w-lg mx-auto">
        <div className="mb-6">
          <h2 className="text-2xl font-bold tracking-tight text-stone-950">Add Product</h2>
          <p className="text-xs text-stone-500 font-medium mt-1">Create a new listing for your tech store catalog.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5 bg-white p-6 rounded-2xl border border-[#e6e4dc] shadow-2xs text-sm">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-stone-500 mb-2">Product Images</p>
            <div className="flex flex-wrap items-center gap-3">
              {[...Array(4)].map((_, index) => (
                <label key={index} htmlFor={`image${index}`} className="relative cursor-pointer">
                  <input
                    onChange={(e) => {
                      const updatedFiles = [...files];
                      updatedFiles[index] = e.target.files[0];
                      setFiles(updatedFiles);
                    }}
                    type="file"
                    id={`image${index}`}
                    hidden
                    accept="image/*"
                  />
                  <Image
                    className="size-16 rounded-xl border border-[#e6e4dc] p-1 object-contain hover:border-amber-400 transition bg-stone-50"
                    src={files[index] ? URL.createObjectURL(files[index]) : "/assets/upload_area.png"}
                    alt="upload"
                    width={64}
                    height={64}
                  />
                  {files[index] && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        const updated = [...files];
                        updated[index] = null;
                        setFiles(updated);
                      }}
                      className="absolute -top-1 -right-1 bg-stone-900 text-white rounded-full size-4 flex items-center justify-center text-[8px] font-bold shadow-md cursor-pointer hover:bg-stone-800 transition"
                    >
                      ✕
                    </button>
                  )}
                </label>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-stone-500 uppercase tracking-wider" htmlFor="product-name">
              Product Name
            </label>
            <input
              id="product-name"
              type="text"
              placeholder="e.g. Wireless Noise-Cancelling Headphones"
              className="outline-none py-2.5 px-3.5 rounded-xl border border-[#e6e4dc] bg-white font-medium text-stone-800 focus:border-amber-500 text-xs"
              onChange={(e) => setName(e.target.value)}
              value={name}
              required
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-stone-500 uppercase tracking-wider" htmlFor="product-description">
              Product Description
            </label>
            <textarea
              id="product-description"
              rows={3}
              className="outline-none py-2.5 px-3.5 rounded-xl border border-[#e6e4dc] bg-white font-medium text-stone-800 focus:border-amber-500 resize-none leading-relaxed text-xs"
              placeholder="Highlight specifications, warranty, and features..."
              onChange={(e) => setDescription(e.target.value)}
              value={description}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-stone-500 uppercase tracking-wider" htmlFor="category">
                Category
              </label>
              <select
                id="category"
                className="outline-none py-2.5 px-3.5 rounded-xl border border-[#e6e4dc] bg-white font-medium text-stone-800 focus:border-amber-500 text-xs cursor-pointer"
                onChange={(e) => setCategory(e.target.value)}
                defaultValue={category}
              >
                <option value="Earphone">Earphone</option>
                <option value="Headphone">Headphone</option>
                <option value="Watch">Watch</option>
                <option value="Mobile">Mobile</option>
                <option value="Laptop">Laptop</option>
                <option value="Camera">Camera</option>
                <option value="Console">Console</option>
              </select>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-stone-500 uppercase tracking-wider" htmlFor="product-stock">
                Product Stock
              </label>
              <input
                id="product-stock"
                type="number"
                placeholder="0"
                className="outline-none py-2.5 px-3.5 rounded-xl border border-[#e6e4dc] bg-white font-medium text-stone-800 focus:border-amber-500 text-xs"
                onChange={(e) => setStock(e.target.value)}
                value={stock}
                min="0"
                required
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-stone-500 uppercase tracking-wider" htmlFor="product-price">
                Base Price ($)
              </label>
              <input
                id="product-price"
                type="number"
                placeholder="0"
                className="outline-none py-2.5 px-3.5 rounded-xl border border-[#e6e4dc] bg-white font-medium text-stone-800 focus:border-amber-500 text-xs"
                onChange={(e) => setPrice(e.target.value)}
                value={price}
                min="1"
                required
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-stone-500 uppercase tracking-wider" htmlFor="offer-price">
                Offer Price ($)
              </label>
              <input
                id="offer-price"
                type="number"
                placeholder="0"
                className="outline-none py-2.5 px-3.5 rounded-xl border border-[#e6e4dc] bg-white font-medium text-stone-800 focus:border-amber-500 text-xs"
                onChange={(e) => setOfferPrice(e.target.value)}
                value={offerPrice}
                min="1"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 bg-[#f5c344] hover:bg-[#e6b02e] text-stone-900 rounded-xl font-bold transition shadow-2xs cursor-pointer disabled:opacity-50 text-xs mt-2"
          >
            {isSubmitting ? "Uploading..." : "Publish Listing"}
          </button>
        </form>
      </div>
      <Footer />
    </div>
  );
};

export default AddProduct;
