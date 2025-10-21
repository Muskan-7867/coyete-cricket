"use client";
import { BsCartPlus } from "react-icons/bs";
import { useRouter } from "next/navigation";

export default function CartButton({ cartCount }: { cartCount: number }) {
  const router = useRouter();

  return (
    <div className="flex items-center gap-4">
      {/* Wishlist Button */}
      <button
        className="hover:text-gray-600 transition-opacity relative flex items-center cursor-pointer"
        onClick={() => router.push("/wishlist")} // Navigate to wishlist page
      >
      
      </button>

      {/* Cart Button */}
      <button
        className="hover:text-gray-600 transition-opacity relative flex items-center cursor-pointer"
        onClick={() => router.push("/cart")}
      >
        <div className="relative">
          <p className="bg-red-600 w-5 h-5 rounded-full flex justify-center items-center text-xs text-white absolute -top-2 -right-2">
            {cartCount}
          </p>
          <BsCartPlus className="w-6 h-6" />
        </div>
      </button>
    </div>
  );
}