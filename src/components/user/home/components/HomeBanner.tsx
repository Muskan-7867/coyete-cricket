"use client";
import React from "react";

import { useRouter } from "next/navigation";
import Banner from "@/components/common/Banner";
import { banner1, banner2, mobileban1, mobileban2 } from "@/constants/imagePath";


export default function HomeBanner() {
  const router = useRouter();
  const desktopImages = [
    { src: banner1, alt: "Desktop Banner 1" },
    { src: banner2, alt: "Desktop Banner 2" },
  ];

  const mobileImages = [
    { src: mobileban1, alt: "Mobile Banner 1" },
    { src: mobileban2, alt: "Mobile Banner 2" },
  ];

  return (
    <div>
      <Banner desktopImages={desktopImages} mobileImages={mobileImages} onButtonClick={() => router.push("/products")} />
    </div>
  );
}
