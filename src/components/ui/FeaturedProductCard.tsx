import React, { useState } from "react";
import { Card, CardContent, CardFooter } from "./card";
import Image from "next/image";

type Props = {
  category: string;
  title: string;
  price: number;
  image?: string;
  hoverImage?: string; // 👈 add hover image
};

export default function FeaturedProductCard({
  title,
  price,
  image,
  hoverImage
}: Props) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Card
      className="w-[20rem] h-[35rem] min-w-[20rem] p-0 pb-2 overflow-hidden rounded-none shadow-none border-none"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <CardContent className="bg-gray-100 h-[25rem] flex justify-center items-center relative">
        {image && (
          <Image
            src={isHovered && hoverImage ? hoverImage : image}
            alt={title}
            width={200}
            height={200}
            priority
            className="object-contain transition-all duration-300 ease-in-out"
          />
        )}
      </CardContent>

      <CardFooter className="flex flex-col justify-center items-center">
        <p className="text-xl font-semibold text-black text-center">{title}</p>
        <p className="text-lg font-semibold text-black">₹ {price} /-</p>
      </CardFooter>
    </Card>
  );
}
