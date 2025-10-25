import React, { useState } from "react";
import { Card, CardContent } from "./card";
import Image from "next/image";
import Link from "next/link";

type Props = {
  category?: string;
  title: string;
  price: number;
  image?: string;
  hoverImage?: string;
  slug?: string;
};

export default function FeaturedProductCard({
  title,
  price,
  image,
  hoverImage,
  category,
  slug
}: Props) {
  const [isHovered, setIsHovered] = useState(false);
const productSlug = slug 
    ? encodeURIComponent(slug)
    : encodeURIComponent(title.toLowerCase().replace(/\s+/g, "-"));
  return (
    <Card
      className="w-[20rem] h-[32rem] min-w-[20rem] p-0 pb-2 overflow-hidden rounded-none shadow-none border-none bg-transparent"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <CardContent className="bg-gray-100 h-[25rem] flex justify-center items-center relative">
        {image && (
          <Link href={`/product/${productSlug}`}>
            <Image
              src={isHovered && hoverImage ? hoverImage : image}
              alt={title}
              width={200}
              height={200}
              priority
              className="object-contain transition-all duration-300 ease-in-out cursor-pointer"
            />
          </Link>
        )}
      </CardContent>

      <div className="flex flex-col justify-center items-center">
        <p className="text-xl font-semibold text-black text-center">{title}</p>
        <p className="text-lg font-semibold text-black">₹ {price} /-</p>
      </div>
    </Card>
  );
}
