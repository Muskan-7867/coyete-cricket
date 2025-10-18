"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";

interface SingleProductCardProps {
  id: string;
  name: string;
  price: number;
  originalPrice: number;
  image: string;
}

function SingleProductCard({
  id,
  name,
  price,
  originalPrice,
  image,
}: SingleProductCardProps) {
  return (
    <Link href={`/products/${id}`}>
      <div className="bg-white rounded-lg shadow-sm hover:shadow-md transition-all cursor-pointer overflow-hidden">
        <div className="relative w-full aspect-square">
          <Image
            src={image}
            alt={name}
            fill
            className="object-contain"
          />
        </div>

        <div className="p-4">
          <h3 className="text-gray-900 font-semibold truncate">{name}</h3>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-lg font-bold text-amber-600">₹{price}</span>
            <span className="text-sm text-gray-500 line-through">
              ₹{originalPrice}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}

export default SingleProductCard;
