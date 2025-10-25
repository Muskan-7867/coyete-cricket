"use client";
import React, { useState } from "react";
import FilterSidebar from "./FilterSidebar";
import SingleProductCard from "./SingleProductCard";

interface Product {
  _id: string;
  name: string;
  price: number;
  originalPrice: number;
  images: { url: string }[];
  slug: string;
}

interface CategoryPageProps {
  categoryId: string;
  categoryName: string;
  products: Product[];
}

export default function CategoryPage({
  categoryId,
  categoryName,
  products
}: CategoryPageProps) {
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  return (
    <div className="min-h-screen mt-26 lg:mt-32">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">
            {categoryName.toUpperCase()}
          </h1>
          <div className="hidden sm:flex text-sm text-gray-600">
            VIEWING:{" "}
            <span className="font-semibold">
              {products.length > 0
                ? `1 - ${products.length} of ${products.length}`
                : "0 Products"}
            </span>
          </div>
          <div className="flex sm:hidden">
            <button
              onClick={() => setIsMobileFilterOpen(true)}
              className="p-2 bg-orange-500 text-white rounded-md"
            >
              {/* Mobile Filter Icon */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2a1 1 0 01-.293.707L15 12.414V19a1 1 0 01-1 1h-4a1 1 0 01-1-1v-6.586L3.293 6.707A1 1 0 013 6V4z"
                />
              </svg>
            </button>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          <FilterSidebar
            isMobileFilterOpen={isMobileFilterOpen}
            setIsMobileFilterOpen={setIsMobileFilterOpen}
            currentCategoryId={categoryId}
          />

          <div className="lg:w-3/4">
            {products.length > 0 ? (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {products.map((product) => (
                    <SingleProductCard
                      key={product._id}
                      id={product._id}
                      name={product.name}
                      price={product.price}
                      images={product.images?.[0]?.url}
                      originalPrice={product.originalPrice}
                      slug={product.slug}
                      hoverImage={product.images?.[1]?.url}
                    />
                  ))}
                </div>
                <div className="flex justify-center mt-8">
                  <button className="bg-white border border-gray-300 text-gray-700 px-6 py-2 rounded-md hover:bg-gray-50 transition-colors">
                    Load More
                  </button>
                </div>
              </>
            ) : (
              <div className="text-center py-20 text-gray-500 text-lg">
                No products found in this category.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
