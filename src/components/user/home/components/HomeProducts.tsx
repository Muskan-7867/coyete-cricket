"use client";
import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import FeaturedProductCard from "@/components/ui/FeaturedProductCard";
import { NavigationTabs } from "./NavigationTabs";

interface Product {
  _id: string;
  name: string;
  price: number;
  images?: { url: string }[];
  category?: string;
  tags?: string[];
}

export default function ProductPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [activeTab, setActiveTab] = useState("best-sellers");
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);
  const [loading, setLoading] = useState(false);

  // 🧠 Map tab values to product tags
  const tagMap: Record<string, string> = {
    "best-sellers": "Best sellers",
    "our-favourites": "Our favourites",
    "just-in": "Just In",
    sale: "Sale"
  };

  // 🎯 Fetch products by tag
  const fetchProductsByTag = async (tag: string) => {
    try {
      setLoading(true);
      const res = await fetch(
        `/api/products/tag?tags=${encodeURIComponent(tag)}`
      );
      const data = await res.json();
      setProducts(data.products || []);
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

  // 🚀 Fetch default (best sellers) on mount
  useEffect(() => {
    fetchProductsByTag(tagMap[activeTab]);
  }, [activeTab]);

  const scrollLeft = () => {
    scrollContainerRef.current?.scrollBy({ left: -300, behavior: "smooth" });
  };

  const scrollRight = () => {
    scrollContainerRef.current?.scrollBy({ left: 300, behavior: "smooth" });
  };

  return (
    <div className="max-w-7xl mx-auto my-8 space-y-6">
      {/* 🟧 Navigation Tabs */}
      <NavigationTabs
        defaultValue={activeTab}
        onValueChange={(value) => setActiveTab(value)}
      />

      {/* 🟦 Product List */}
      {loading ? (
        <p className="text-center text-gray-500 py-8">Loading products...</p>
      ) : products.length > 0 ? (
        <>
          <div
            ref={scrollContainerRef}
            className="flex gap-4 items-center overflow-x-scroll scrollbar-hide"
          >
            {products.map((product) => (
              <FeaturedProductCard
                key={product._id}
                category={product.category || ""}
                title={product.name}
                price={product.price}
                image={product.images?.[0]?.url}
                 hoverImage={product.images?.[1]?.url}
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
        </>
      ) : (
        <p className="text-center text-gray-500 py-8">No products found.</p>
      )}
    </div>
  );
}
