"use client";
import Image, { StaticImageData } from "next/image";
import React, { useState, useEffect } from "react";

interface BannerProps {
  desktopImages: { src: string | StaticImageData; alt: string }[];
  mobileImages?: { src: string | StaticImageData; alt: string }[];
  autoPlay?: boolean;
  interval?: number;
  priority?: boolean;
  title?: string;
  subtitle?: string;
  buttonText?: string;
  onButtonClick?: () => void;
}

export default function Banner({
  desktopImages,
  mobileImages,
  autoPlay = true,
  interval = 3000,
  priority = false,
  title = "Discover Our Collection",
  subtitle = "Explore the latest trends and exclusive items",
  buttonText = "Explore Now",
  onButtonClick
}: BannerProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  const goToNext = () => {
    const images =
      isMobile && mobileImages?.length ? mobileImages : desktopImages;
    const isLast = currentIndex === images.length - 1;
    setCurrentIndex(isLast ? 0 : currentIndex + 1);
  };

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (!autoPlay) return;
    const timer = setInterval(goToNext, interval);
    return () => clearInterval(timer);
  });

  const images =
    isMobile && mobileImages?.length ? mobileImages : desktopImages;

  if (images.length === 0) return null;

  return (
    <div className="w-full relative overflow-hidden h-[70vh] sm:h-[44rem] md:aspect-[16/6] lg:mt-32 mt-32">
      {/* Banner image */}
      <div className="relative w-full h-full">
        <Image
          src={images[currentIndex].src}
          alt={images[currentIndex].alt}
          fill
          priority={priority}
          className="object-cover object-center"
          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 90vw, 1400px"
        />
        
        {/* Overlay for better text readability */}
        <div className="absolute inset-0 bg-black/20"></div>
        
        {/* Centered content with button */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-white px-4">
          {title && (
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold mb-4 drop-shadow-lg">
              {title}
            </h1>
          )}
          
          {subtitle && (
            <p className="text-lg md:text-xl lg:text-2xl mb-8 max-w-2xl drop-shadow-md">
              {subtitle}
            </p>
          )}
          
          <button
            onClick={onButtonClick}
            className="bg-white text-black px-8 py-4 rounded-lg font-semibold text-lg md:text-xl hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 shadow-2xl"
          >
            {buttonText}
          </button>
        </div>
      </div>

      {/* Indicator dots */}
      {images.length > 1 && (
        <div className="absolute bottom-3 sm:bottom-5 left-1/2 -translate-x-1/2 flex gap-2">
          {images.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full transition-all ${
                index === currentIndex ? "bg-white" : "bg-white/50"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}