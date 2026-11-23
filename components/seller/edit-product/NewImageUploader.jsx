'use client'
import React from 'react'
import Image from 'next/image'

export default function NewImageUploader({ newFiles, onFileChange, onRemoveFile }) {
    return (
        <div>
            <p className="text-xs font-bold uppercase tracking-wider text-stone-500 mb-2">Upload More Images</p>
            <div className="flex flex-wrap items-center gap-3">
                {[...Array(4)].map((_, index) => {
                    const fileObj = newFiles[index];
                    return (
                        <label key={index} htmlFor={`edit-image-${index}`} className="relative cursor-pointer">
                            <input
                                onChange={(e) => onFileChange(index, e.target.files[0])}
                                type="file"
                                id={`edit-image-${index}`}
                                hidden
                                accept="image/*"
                            />
                            <Image
                                className="size-16 rounded-xl border border-border-subtle p-1 object-contain hover:border-amber-400 transition bg-stone-50"
                                src={fileObj ? URL.createObjectURL(fileObj) : "/assets/upload_area.png"}
                                alt="upload"
                                width={64}
                                height={64}
                            />
                            {fileObj && (
                                <button
                                    type="button"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        onRemoveFile(index);
                                    }}
                                    className="absolute -top-1 -right-1 bg-stone-900 text-white rounded-full size-4 flex items-center justify-center text-[8px] font-bold shadow-md cursor-pointer hover:bg-stone-800 transition"
                                >
                                    ✕
                                </button>
                            )}
                        </label>
                    );
                })}
            </div>
        </div>
    )
}
