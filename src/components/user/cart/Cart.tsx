"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import useCartStore from "@/lib/store/Cart/Cart.store"; // ✅ Import store

interface WishlistItem {
  id: string;
  name: string;
  price: number;
  originalPrice: number;
  images: string;
  slug: string;
}

export default function Cart() {
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([]);
  const { setCartCount } = useCartStore(); // ✅ Access Zustand store

  // 🧠 Load wishlist items from localStorage
  useEffect(() => {
    const stored = localStorage.getItem("wishlist");
    if (stored) {
      const parsed = JSON.parse(stored);
      setWishlistItems(parsed);
      console.log("from cart", parsed);
      setCartCount(parsed.length); // ✅ Sync count on mount
    } else {
      setCartCount(0);
    }
  }, [setCartCount]);

  // 🧾 Handle remove item from wishlist
  const handleRemove = (id: string) => {
    const updated = wishlistItems.filter((item) => item.id !== id);
    setWishlistItems(updated);
    localStorage.setItem("wishlist", JSON.stringify(updated));

    // ✅ Update global wishlist count (Navbar)
    setCartCount(updated.length);
  };

  if (wishlistItems.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-[70vh] text-center">
        <p className="text-lg font-semibold text-gray-600">
          Your wishlist is empty ❤️
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto p-6 mt-28 lg:mt-32">
      <h2 className="text-2xl font-bold mb-6">My Wishlist</h2>

      <div className="space-y-4">
        {wishlistItems.map((item) => (
          <div
            key={item.id}
            className="flex items-center justify-between bg-white shadow-md p-4 rounded-xl"
          >
            <div className="flex items-center gap-4">
              <Image
                src={item.images}
                alt={item.name}
                width={50}
                height={50}
                className="rounded-lg object-contain"
              />

              <div>
                <h3 className="font-semibold text-gray-800">{item.name}</h3>
                <p className="text-gray-600">₹{item.price.toLocaleString()}</p>
                {item.originalPrice && (
                  <p className="text-sm text-gray-400 line-through">
                    ₹{item.originalPrice.toLocaleString()}
                  </p>
                )}
              </div>
            </div>

            <div className="flex items-center gap-4">
              <button
                onClick={() => handleRemove(item.id)}
                className="text-red-500 hover:text-red-700 transition-colors"
              >
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
