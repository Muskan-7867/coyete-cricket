"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";

interface CartItem {
  id: number;
  name: string;
  price: number;
  image: string;
  quantity: number;
}

export default function Cart() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  // Example: Load from localStorage or use static data
  useEffect(() => {
    const stored = localStorage.getItem("cart");
    if (stored) {
      setCartItems(JSON.parse(stored));
    } else {
      // fallback static data
      setCartItems([
        {
          id: 1,
          name: "Pro Reserve Edition",
          price: 75000,
          image: "/assets/tshirt.png",
          quantity: 1
        },
        {
          id: 2,
          name: "Player Edition",
          price: 64000,
          image: "/assets/tshirt.png",
          quantity: 2
        }
      ]);
    }
  }, []);

  if (cartItems.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-[70vh] text-center">
        <p className="text-lg font-semibold text-gray-600">
          Your cart is empty 🛒
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto p-6 mt-34">
      <h2 className="text-2xl font-bold mb-6">Shopping Cart</h2>

      <div className="space-y-4">
        {cartItems.map((item) => (
          <div
            key={item.id}
            className="flex items-center justify-between bg-white shadow-md p-4 rounded-xl"
          >
            <div className="flex items-center gap-4">
              <Image
                src={item.image}
                alt={item.name}
                width={80}
                height={80}
                className="rounded-lg p-4"
              />
              <div>
                <h3 className="font-semibold text-gray-800">{item.name}</h3>
                <p className="text-gray-600">₹{item.price.toLocaleString()}</p>
                <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
              </div>
            </div>

            <div className="text-right">
              <p className="font-semibold text-gray-800">
                ₹{(item.price * item.quantity).toLocaleString()}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Cart Summary */}
      <div className="mt-6 border-t pt-4 flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-800">Total:</h3>
        <p className="text-xl font-bold text-gray-900">
          ₹
          {cartItems
            .reduce((total, item) => total + item.price * item.quantity, 0)
            .toLocaleString()}
        </p>
      </div>
    </div>
  );
}
