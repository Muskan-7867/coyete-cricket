"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Heart } from "lucide-react"; // Changed from ShoppingCart to Heart
import useCartStore from "@/lib/store/Cart/Cart.store";

interface SingleProductCardProps {
  id: string;
  name: string;
  price: number;
  originalPrice: number;
  images?: { url: string }[];
  slug?: string;
  hoverImage: string;
}

function SingleProductCard({
  id,
  name,
  price,
  originalPrice,
  slug,
  images,
  hoverImage
}: SingleProductCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const [isAdded, setIsAdded] = useState(false);

  // ✅ Get store actions
  const { increaseCartCount, decreaseCartCount, setCartCount } = useCartStore();

  const placeholderImage = "/images/placeholder.png";

  // ✅ Check if product is already in wishlist and update count
  useEffect(() => {
    const existingItems = JSON.parse(localStorage.getItem("wishlist") || "[]");
    const alreadyAdded = existingItems.some(
      (item: { id: string }) => item.id === id
    );
    setIsAdded(alreadyAdded);

    // ✅ Initialize cart count from localStorage
    const wishlistItems = JSON.parse(localStorage.getItem("wishlist") || "[]");
    setCartCount(wishlistItems.length);
  }, [id, setCartCount]);

  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();

    let existingItems = JSON.parse(localStorage.getItem("wishlist") || "[]");
    const isAlreadyAdded = existingItems.some(
      (item: { id: string }) => item.id === id
    );

    if (isAlreadyAdded) {
      // 🗑️ Remove from wishlist
      existingItems = existingItems.filter(
        (item: { id: string }) => item.id !== id
      );
      localStorage.setItem("wishlist", JSON.stringify(existingItems));
      setIsAdded(false);
      decreaseCartCount(); // ✅ Decrease count in store
      console.log("❌ Removed from wishlist:", name);
    } else {
      // ✅ Add to wishlist
      const newProduct = { id, name, price, originalPrice, images, slug };
      const updatedItems = [...existingItems, newProduct];
      localStorage.setItem("wishlist", JSON.stringify(updatedItems));
      setIsAdded(true);
      increaseCartCount(); // ✅ Increase count in store
      console.log("✅ Added to wishlist:", name);
    }
  };

  return (
    <div
      className="bg-white rounded-lg shadow-sm hover:shadow-md transition-all cursor-pointer overflow-hidden"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* 🖼️ Product Image (clickable) */}
      <Link href={`/product/${slug}`}>
        <div className="relative w-full aspect-square">
          {!isImageLoaded && (
            <Image
              src={placeholderImage}
              alt="Placeholder"
              fill
              className="object-contain animate-pulse"
              priority
            />
          )}

          <Image
            src={isHovered ? hoverImage || images : images || placeholderImage}
            alt={name}
            fill
            className={`object-contain transition-all duration-300 ${
              isImageLoaded ? "opacity-100" : "opacity-0"
            }`}
            onLoadingComplete={() => setIsImageLoaded(true)}
          />
        </div>
      </Link>

      {/* 🛍️ Product Info Section */}
      <div className="p-4">
        <div className="flex items-center justify-between">
          <h3 className="text-gray-900 font-semibold truncate">{name}</h3>

          {/* ❤️ Wishlist Toggle Button (Changed from ShoppingCart to Heart) */}
          <button
            onClick={handleToggleWishlist}
            className={`p-2 rounded-full transition-all ${
              isAdded
                ? "text-red-500 scale-105 bg-red-50"
                : "text-gray-400 hover:text-red-400"
            }`}
            title={isAdded ? "Remove from wishlist" : "Add to wishlist"}
          >
            <Heart size={22} fill={isAdded ? "currentColor" : "none"} />
          </button>
        </div>

        <div className="flex items-center justify-between gap-2 mt-1">
          <span className="text-lg font-bold text-amber-600">₹{price}/-</span>
          <span className="text-sm text-gray-500 line-through">
            ₹{originalPrice}/-
          </span>
        </div>
      </div>
    </div>
  );
}

export default SingleProductCard;
