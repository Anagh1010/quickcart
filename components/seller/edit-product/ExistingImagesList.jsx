'use client'
import React from 'react'
import Image from 'next/image'

export default function ExistingImagesList({ existingImages, onRemoveImage }) {
    return (
        <div>
            <p className="text-xs font-bold uppercase tracking-wider text-stone-500 mb-2">Current Images</p>
            {existingImages.length === 0 ? (
                <p className="text-xs text-stone-400 italic mb-3">No images saved</p>
            ) : (
                <div className="flex flex-wrap gap-3 mb-4">
                    {existingImages.map((img, idx) => (
                        <div key={idx} className="relative rounded-xl border border-[#e6e4dc] p-1 bg-stone-50 size-20 group">
                            <Image
                                src={img}
                                alt="product"
                                className="w-full h-full object-contain rounded-lg"
                                width={60}
                                height={60}
                            />
                            <button
                                type="button"
                                onClick={() => onRemoveImage(img)}
                                className="absolute -top-1.5 -right-1.5 bg-rose-500 hover:bg-rose-600 text-white rounded-full size-4 flex items-center justify-center text-[9px] font-bold shadow-md cursor-pointer transition"
                                title="Delete Image"
                            >
                                ✕
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}
