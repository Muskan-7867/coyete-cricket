"use client";
import { useState, useEffect } from "react"; // Add useEffect
import Link from "next/link";
import Image from "next/image";
import { MenuIcon, User, X } from "lucide-react";
import TopHeader from "./TopHeader";
import CartCount from "./components/CartCount";
import { useRouter } from "next/navigation";
import { useCategories } from "@/lib/queries/query";
import { CategoryMenu } from "./components/Menu";
import useCartStore from "@/lib/store/Cart/Cart.store";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const router = useRouter();
  const { data: menus } = useCategories();
  const { setCartCount } = useCartStore(); // Get setter from store

  // ✅ Initialize wishlist count on component mount
  useEffect(() => {
    const wishlistItems = JSON.parse(localStorage.getItem("wishlist") || "[]");
    setCartCount(wishlistItems.length);
  }, [setCartCount]);

  return (
    <>
      <TopHeader />

      {/* Navbar */}
      <div className="w-full fixed top-[38px] sm:top-[42px] left-0 right-0 z-50 bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-full mx-auto flex items-center justify-between px-4 py-3 md:py-4">
          {/* Left - Logo */}
          <Link href="/" className="flex items-center">
            <Image
              src="/assets/coyotelogo.png"
              alt="Company Logo"
              width={55}
              height={55}
              priority
              className="object-contain"
            />
          </Link>

          {/* Center - Desktop Menu */}
          <div className="hidden md:flex items-center gap-6 text-[13px] font-medium tracking-wide text-gray-800">
            <CategoryMenu menus={menus} />
          </div>

          {/* Right - Icons + Mobile Toggle */}
          <div className="flex items-center gap-4">
            <CartCount  /> {/* Pass actual cart count if needed */}
            <User
              className="w-6 h-6 text-gray-800 cursor-pointer"
              onClick={() => router.push("/register")}
            />
            <button
              className="md:hidden text-gray-800"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Toggle Menu"
            >
              {menuOpen ? <X size={24} /> : <MenuIcon size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="md:hidden bg-white border-t border-gray-200 shadow-md flex flex-col gap-3 py-4 px-6 text-sm font-medium text-gray-800 animate-slideDown">
            <CategoryMenu menus={menus} isMobile={true} />
          </div>
        )}
      </div>
    </>
  );
}
