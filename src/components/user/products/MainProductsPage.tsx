"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import FeaturedProductCard from "@/components/ui/FeaturedProductCard";

interface Product {
  _id: string;
  name: string;
  description?: string;
  price: number;
  originalPrice?: number;
  stock: number;
  images?: { url: string }[];
  hoverImages?: { url: string }[];
  category?: { name: string };
  colors?: { _id: string; name: string }[];
  slug: string;
}

export default function MainProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data } = await axios.get("/api/products");
        if (data.success) {
          setProducts(data.products);
        } else {
          console.error("Failed to fetch products:", data.message);
        }
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) return <p className="text-center py-8">Loading products...</p>;

  

  return (
    <div className="container mx-auto px-4 py-8 mt-32">
      <h1 className="text-3xl font-bold mb-8">All Products</h1>

      {products.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((product) => (
            <FeaturedProductCard
              key={product._id}
              title={product.name}
              price={product.price}
              image={product.images && product.images[0]?.url}
              hoverImage={product.images && product.images[1]?.url}
              category={product.category?.name || "uncategorized"} // Pass category
              slug={product.slug} // Pass slug
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="text-gray-400 text-6xl mb-4">📦</div>
          <p className="text-xl text-gray-500 mb-2">No products found</p>
          <p className="text-gray-400">Check back later for new products</p>
        </div>
      )}
    </div>
  );
}
