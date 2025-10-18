import React from "react";
import { Card, CardContent, CardFooter } from "./card";
import Image from "next/image";

type Props = {
  category: string;
  title: string;
  price: number;
  image: string;
};

export default function FeaturedProductCard({ category, title, price, image }: Props) {
  return (
    <Card className="w-[20rem] h-[35rem] min-w-[20rem] p-0 pb-2 overflow-hidden rounded-none shadow-none border-none">
      <CardContent className="bg-gray-100 h-[25rem] flex justify-center items-center">
        <Image
          src={image}
          alt={title}
          width={200}
          height={200}
          priority
          className="object-contain"
        />
      </CardContent>
      <CardFooter className="flex flex-col justify-center items-center">
        <p className="text-sm text-gray-500">{category}</p>
        <p className="text-xl font-semibold text-black">{title}</p>
        <p className="text-lg font-semibold text-black">₹ {price}</p>
      </CardFooter>
    </Card>
  );
}
