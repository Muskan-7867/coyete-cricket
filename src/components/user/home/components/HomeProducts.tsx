"use client";
import FeaturedProductCard from "@/components/ui/FeaturedProductCard";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useRef } from "react";

export default function ProductPage() {
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -300, behavior: "smooth" });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 300, behavior: "smooth" });
    }
  };

  // Dummy product data with images
const products = [
  { category: "Bats", title: "Pro Cricket Bat", price: 1200, image: "/assets/tshirt.png" },
  { category: "Balls", title: "Leather Cricket Ball", price: 300, image: "/assets/tshirt1.png" },
  { category: "Gloves", title: "Wicket Keeping Gloves", price: 800, image: "/assets/tshirt.png" },
  { category: "Pads", title: "Batting Pads", price: 1000, image: "/assets/tshirt1.png" },
  { category: "Bags", title: "Cricket Kit Bag", price: 1500, image: "/assets/tshirt.png" },
  { category: "Match Wear", title: "Team Jersey", price: 700, image: "/assets/tshirt1.png" },
  { category: "Helmets", title: "Safety Cricket Helmet", price: 2000, image: "/assets/tshirt.png" },
  { category: "Accessories", title: "Bat Grip Set", price: 250, image: "/assets/tshirt1.png" },
  { category: "Bats", title: "Junior Cricket Bat", price: 600, image: "/assets/tshirt.png" },
  { category: "Balls", title: "Practice Ball Pack", price: 400, image: "/assets/tshirt1.png" },
  { category: "Gloves", title: "Batting Gloves", price: 750, image: "/assets/tshirt.png" },
  { category: "Pads", title: "Junior Batting Pads", price: 500, image: "/assets/tshirt1.png" },
  { category: "Bags", title: "Small Kit Bag", price: 900, image: "/assets/tshirt.png" },
  { category: "Match Wear", title: "Practice Jersey", price: 450, image: "/assets/tshirt1.png" },
  { category: "Helmets", title: "Junior Helmet", price: 1200, image: "/assets/tshirt.png" },
  { category: "Accessories", title: "Wrist Bands", price: 150, image: "/assets/tshirt1.png" },
];


  return (
    <div className="max-w-7xl mx-auto my-8">
      <div
        ref={scrollContainerRef}
        className="flex gap-4 items-center overflow-x-scroll scrollbar-hide"
      >
        {products.map((product, i) => (
          <FeaturedProductCard
            key={i}
            category={product.category}
            title={product.title}
            price={product.price}
            image={product.image}
          />
        ))}
      </div>

      <div className="flex justify-end gap-2 mt-4">
        <button
          onClick={scrollLeft}
          className="p-2 rounded-full bg-primary hover:bg-primary/80"
        >
          <ChevronLeft className="h-5 w-5 text-white" />
        </button>
        <button
          onClick={scrollRight}
          className="p-2 rounded-full bg-primary hover:bg-primary/80"
        >
          <ChevronRight className="h-5 w-5 text-white" />
        </button>
      </div>
    </div>
  );
}
