'use client'
import React, { useEffect, useState } from "react";
import { useAppContext } from "@/context/AppContext";
import { useParams } from "next/navigation";
import Loading from "@/components/Loading";
import Footer from "@/components/seller/Footer";
import axios from "axios";
import toast from "react-hot-toast";
import ExistingImagesList from "@/components/seller/edit-product/ExistingImagesList";
import NewImageUploader from "@/components/seller/edit-product/NewImageUploader";
import ProductDetailsForm from "@/components/seller/edit-product/ProductDetailsForm";

const EditProduct = () => {
    const { id } = useParams();
    const { getToken, router, products, user } = useAppContext();

    const [loading, setLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Fields state
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [category, setCategory] = useState("Earphone");
    const [price, setPrice] = useState("");
    const [offerPrice, setOfferPrice] = useState("");
    const [stock, setStock] = useState("0");

    // Images state
    const [existingImages, setExistingImages] = useState([]);
    const [newFiles, setNewFiles] = useState([]);

    const fetchProductData = async () => {
        try {
            const res = await fetch(`/api/product/list`);
            const data = await res.json();

            let product = null;
            if (data.success) {
                product = data.products.find(p => p._id === id);
            }

            if (!product) {
                product = products.find(p => p._id === id);
            }

            if (product) {
                setName(product.name);
                setDescription(product.description);
                setCategory(product.category || "Earphone");
                setPrice(product.price);
                setOfferPrice(product.offerPrice);
                setStock(product.stock !== undefined ? product.stock.toString() : "0");
                setExistingImages(product.image || []);
            } else {
                toast.error("Product not found");
                router.push("/seller/product-list");
            }
        } catch (error) {
            console.error('[seller/edit-product] Failed to fetch:', error);
            toast.error("Failed to retrieve product details");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (id && user) {
            fetchProductData();
        }
    }, [id, user, products.length]);

    const handleRemoveExistingImage = (imgUrl) => {
        setExistingImages(prev => prev.filter(url => url !== imgUrl));
    };

    const handleNewFileChange = (index, file) => {
        const updated = [...newFiles];
        updated[index] = file;
        setNewFiles(updated);
    };

    const handleRemoveNewFile = (index) => {
        const updated = [...newFiles];
        updated[index] = null;
        setNewFiles(updated);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (existingImages.length === 0 && newFiles.filter(Boolean).length === 0) {
            toast.error("At least one product image is required.");
            return;
        }

        setIsSubmitting(true);
        const formData = new FormData();

        formData.append("productId", id);
        formData.append("name", name);
        formData.append("description", description);
        formData.append("category", category);
        formData.append("price", price);
        formData.append("offerPrice", offerPrice);
        formData.append("stock", stock);

        existingImages.forEach(img => formData.append("existingImages", img));
        newFiles.forEach(file => {
            if (file) formData.append("images", file);
        });

        try {
            const token = await getToken();
            const { data } = await axios.post("/api/product/edit", formData, {
                headers: { 
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "multipart/form-data"
                }
            });

            if (data.success) {
                toast.success("Listing updated successfully!");
                router.push("/seller/product-list");
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to update product details");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (loading) return <Loading />;

    return (
        <div className="flex-1 min-h-screen flex flex-col justify-between bg-canvas text-stone-900">
            <div className="w-full md:p-10 p-4 max-w-lg mx-auto">
                <div className="mb-6">
                    <h2 className="text-2xl font-bold tracking-tight text-stone-950">Edit Listing</h2>
                    <p className="text-xs text-stone-500 font-medium">Update details, restock count, or manage product imagery.</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5 bg-white p-6 rounded-2xl border border-border-subtle shadow-2xs text-sm">
                    <ExistingImagesList existingImages={existingImages} onRemoveImage={handleRemoveExistingImage} />
                    <NewImageUploader newFiles={newFiles} onFileChange={handleNewFileChange} onRemoveFile={handleRemoveNewFile} />
                    <ProductDetailsForm
                        name={name} setName={setName}
                        description={description} setDescription={setDescription}
                        category={category} setCategory={setCategory}
                        price={price} setPrice={setPrice}
                        offerPrice={offerPrice} setOfferPrice={setOfferPrice}
                        stock={stock} setStock={setStock}
                        isSubmitting={isSubmitting}
                        onCancel={() => router.push("/seller/product-list")}
                    />
                </form>
            </div>
            <Footer />
        </div>
    );
};

export default EditProduct;
