"use client";

import React from "react";
import { useRouter } from "next/navigation";

const AddressSelector = ({
  userAddresses,
  selectedAddress,
  onSelectAddress,
  isDropdownOpen,
  setIsDropdownOpen,
}) => {
  const router = useRouter();

  return (
    <div>
      <label className="text-xs font-bold uppercase tracking-wider text-stone-600 block mb-2">
        Delivery Address
      </label>
      <div className="relative inline-block w-full text-xs">
        <button
          type="button"
          className="w-full text-left px-3.5 py-2.5 bg-white border border-[#e6e4dc] rounded-xl text-stone-800 flex items-center justify-between shadow-2xs hover:border-stone-400 transition"
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        >
          <span className="truncate pr-2">
            {selectedAddress
              ? `${selectedAddress.fullName}, ${selectedAddress.area}, ${selectedAddress.city}`
              : "Select Delivery Address"}
          </span>
          <svg
            className={`size-4 text-stone-400 shrink-0 transition-transform ${isDropdownOpen ? "rotate-180" : ""}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {isDropdownOpen && (
          <ul className="absolute w-full bg-white border border-[#e6e4dc] shadow-md mt-1.5 z-20 py-1 rounded-xl max-h-48 overflow-y-auto">
            {userAddresses.map((address, index) => (
              <li
                key={index}
                className="px-3.5 py-2 hover:bg-stone-50 cursor-pointer text-stone-700 font-medium"
                onClick={() => onSelectAddress(address)}
              >
                <p className="font-bold text-stone-900">{address.fullName}</p>
                <p className="text-[11px] text-stone-500 truncate">{address.area}, {address.city}, {address.state}</p>
              </li>
            ))}
            <li
              onClick={() => router.push("/add-address")}
              className="px-3.5 py-2 hover:bg-stone-50 cursor-pointer text-center text-[#854d0e] font-bold border-t border-[#f0eee6] mt-1"
            >
              + Add New Delivery Address
            </li>
          </ul>
        )}
      </div>
    </div>
  );
};

export default AddressSelector;
