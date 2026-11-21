"use client";
import search_icon from "@/assets/search_icon.svg";
import cart_icon from "@/assets/cart_icon.svg";
import menu_icon from "@/assets/menu_icon.svg";
import { BagIcon, CartIcon } from "@/assets/navigation-icons";

import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";
import { usePathname } from "next/navigation";
import { useClerk, UserButton } from "@clerk/nextjs";
import { useAppContext } from "@/context/AppContext";
import LayoutContainer from "./LayoutContainer";
import MobileMenu from "./MobileMenu";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/all-products", label: "Shop" },
  { href: "/my-orders", label: "Orders" },
  { href: "/cart", label: "Cart" },
  { href: "/#about", label: "About" },
  { href: "/#contact", label: "Contact" },
];

const Navbar = () => {
  const pathname = usePathname();
  const { isSeller, isAdmin, router, user, getCartCount } = useAppContext();
  const { openSignIn, signOut } = useClerk();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const goHome = () => {
    if (window.location.hash) {
      window.history.replaceState(null, "", window.location.pathname);
      window.scrollTo(0, 0);
    }
    router.push("/", { scroll: true });
  };

  const submitSearch = (event) => {
    event.preventDefault();
    if (!searchQuery.trim()) return;
    router.push(`/all-products?search=${encodeURIComponent(searchQuery.trim())}`);
  };

  const cartCount = getCartCount ? getCartCount() : 0;

  return (
    <header className="sticky top-0 z-50 w-full border-b border-[#e6e4dc] bg-[#fbf9f4]/95 backdrop-blur-md">
      <LayoutContainer size="wide">
        <nav aria-label="Main navigation" className="flex h-16 items-center justify-between gap-4 py-2">
          {/* QuickCart Brand Header Lockup */}
          <div className="flex items-center gap-3 cursor-pointer select-none" onClick={goHome}>
            <div className="flex size-9 items-center justify-center rounded-xl bg-stone-900 text-white shadow-2xs font-bold text-sm">
              <span className="text-[#f5c344]">Q</span>C
            </div>
            <div className="flex flex-col">
              <span className="text-base font-bold tracking-tight text-stone-900 leading-tight">
                QuickCart
              </span>
              <span className="text-[10px] font-bold tracking-[0.2em] text-stone-500 uppercase">
                PREMIUM TECH STORE
              </span>
            </div>
          </div>

          {/* Tab Navigation with Gold Active Bar */}
          <div className="hidden items-center gap-7 lg:flex">
            {navLinks.map(({ href, label }) => {
              const isActive = href === "/" ? pathname === "/" : pathname?.startsWith(href);
              return (
                <Link
                  key={href}
                  href={href}
                  className={`relative py-5 text-sm font-medium transition ${
                    isActive ? "text-stone-900 font-semibold" : "text-stone-600 hover:text-stone-900"
                  }`}
                >
                  {label}
                  {isActive && (
                    <span className="absolute bottom-0 left-0 h-[2.5px] w-full rounded-full bg-[#f5c344]" />
                  )}
                </Link>
              );
            })}
          </div>

          {/* Search Bar with Shortcut [/] */}
          <form
            onSubmit={submitSearch}
            className="hidden flex-1 max-w-xs items-center gap-2 rounded-xl border border-[#e6e4dc] bg-white px-3.5 py-1.5 focus-within:border-stone-400 focus-within:ring-1 focus-within:ring-stone-400 md:flex"
          >
            <Image alt="Search" className="size-4 opacity-50" src={search_icon} />
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search products by name, code or category"
              className="w-full bg-transparent text-xs text-stone-900 outline-none placeholder:text-stone-400"
            />
            <kbd className="hidden sm:inline-block rounded border border-stone-200 bg-stone-100 px-1.5 py-0.5 text-[10px] font-mono text-stone-500">
              /
            </kbd>
          </form>

          {/* Right Action Controls: Cart, Theme, Sign in/out */}
          <div className="flex shrink-0 items-center gap-3">
            {/* Cart Button with Gold Pill Counter */}
            <button
              onClick={() => router.push("/cart")}
              className="relative flex items-center gap-1.5 rounded-xl border border-[#e6e4dc] bg-white px-3 py-1.5 text-xs font-medium text-stone-700 hover:bg-stone-50 transition"
              aria-label="View Cart"
            >
              <Image alt="Cart" className="size-4" src={cart_icon} />
              <span className="hidden sm:inline">Cart</span>
              {cartCount > 0 && (
                <span className="flex size-4 items-center justify-center rounded-full bg-[#f5c344] text-[10px] font-bold text-stone-900">
                  {cartCount}
                </span>
              )}
            </button>

            {isSeller && (
              <button
                onClick={() => router.push("/seller")}
                className="hidden rounded-xl border border-stone-300 bg-white px-3 py-1.5 text-xs font-semibold text-stone-800 hover:bg-stone-50 xl:block"
              >
                Seller
              </button>
            )}

            {isAdmin && (
              <button
                onClick={() => router.push("/admin")}
                className="hidden rounded-xl bg-stone-900 px-3 py-1.5 text-xs font-semibold text-white hover:bg-stone-800 xl:block"
              >
                Admin
              </button>
            )}

            {/* Moon Icon for Theme Style */}
            <button
              aria-label="Theme mode"
              className="hidden sm:flex size-9 items-center justify-center rounded-xl border border-[#e6e4dc] bg-white text-stone-600 hover:text-stone-900 hover:bg-stone-50"
            >
              <svg className="size-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" />
              </svg>
            </button>

            {/* User Profile or Sign in / Sign out */}
            {user ? (
              <div className="flex items-center gap-2">
                <UserButton>
                  <UserButton.MenuItems>
                    <UserButton.Action label="Cart" labelIcon={<CartIcon />} onClick={() => router.push("/cart")} />
                  </UserButton.MenuItems>
                  <UserButton.MenuItems>
                    <UserButton.Action label="My Orders" labelIcon={<BagIcon />} onClick={() => router.push("/my-orders")} />
                  </UserButton.MenuItems>
                </UserButton>
                <button
                  onClick={() => signOut()}
                  className="hidden md:flex items-center gap-1.5 text-xs font-medium text-stone-600 hover:text-stone-900 ml-1"
                >
                  <svg className="size-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  <span>Sign out</span>
                </button>
              </div>
            ) : (
              <button
                onClick={openSignIn}
                className="flex items-center gap-1.5 rounded-xl bg-[#f5c344] hover:bg-[#e6b02e] px-4 py-2 text-xs font-bold text-stone-900 transition shadow-2xs"
              >
                <svg className="size-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                <span>Sign in</span>
              </button>
            )}

            {/* Mobile menu button */}
            <button
              aria-label="Open menu"
              className="rounded-xl border border-[#e6e4dc] bg-white p-2 text-stone-700 hover:bg-stone-50 lg:hidden"
              onClick={() => setIsMobileMenuOpen(true)}
            >
              <Image alt="" className="size-5" src={menu_icon} />
            </button>
          </div>
        </nav>
      </LayoutContainer>
      <MobileMenu isOpen={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)} />
    </header>
  );
};

export default Navbar;
