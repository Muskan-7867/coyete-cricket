"use client";
import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useRouter } from "next/navigation";
import FilterSidebar from "./FilterSidebar";
import SingleProductCard from "./SingleProductCard";
import { getProductsByAnyCategoryLevel } from "@/lib/actions/getProductByCategory";

interface Product {
  _id: string;
  name: string;
  price: number;
  originalPrice: number;
  slug: string;
  image: string;
  badge?: string;
  images?: { url: string }[];
}

interface CategoryPageProps {
  categoryName: string;
}

function CategoryPage({ categoryName }: CategoryPageProps) {
  const router = useRouter();
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [categoryInfo, setCategoryInfo] = useState<{
    type: string;
    name: string;
    parent?: string;
    hierarchy?: string[];
  } | null>(null);

  /* ------------------------- Properly Decode Category Name ------------------------- */
  const decodedCategoryName = useMemo(() => {
    if (!categoryName) return "";

    // Decode URL-encoded characters (%20 for spaces, etc.)
    const decoded = decodeURIComponent(categoryName);
    console.log("Original categoryName:", categoryName);
    console.log("Decoded categoryName:", decoded);

    return decoded;
  }, [categoryName]);

  /* ------------------------- Fetch Products ------------------------- */
  useEffect(() => {
    async function fetchProducts() {
      setLoading(true);
      console.log("Fetching products for decoded name:", decodedCategoryName);

      try {
        const res = await getProductsByAnyCategoryLevel(decodedCategoryName);
        console.log("API Response:", res);

        if (res.success) {
          setProducts(res.products);
          setCategoryInfo(res.categoryInfo || null);
          setError(null);
        } else {
          setError(res.message || "Failed to fetch products");
        }
      } catch (err) {
        console.error("Fetch error:", err);
        setError(err instanceof Error ? err.message : "Unknown error");
      } finally {
        setLoading(false);
      }
    }

    if (decodedCategoryName) {
      fetchProducts();
    } else {
      setError("No category name provided");
      setLoading(false);
    }
  }, [decodedCategoryName]);

  /* ------------------------- Display Title ------------------------- */
  const displayCategoryName = useMemo(() => {
    if (categoryInfo?.hierarchy) {
      return categoryInfo.hierarchy
        .map((segment) =>
          segment
            .split(" ")
            .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
            .join(" ")
        )
        .join(" / ");
    }

    if (!decodedCategoryName || typeof decodedCategoryName !== "string")
      return "Products";

    return decodedCategoryName
      .split("/")
      .map((word) =>
        word
          .split("-")
          .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
          .join(" ")
      )
      .join(" / ");
  }, [decodedCategoryName, categoryInfo]);

    /* ------------------------- Navigation ------------------------- */
  const handleProductClick = useCallback(
    (productSlug: string) => {
      router.push(`/product/${productSlug}`);
    },
    [router]
  );

  /* ------------------------- Products Grid ------------------------- */
  const productsGrid = useMemo(() => {
    if (loading) return <p className="text-center py-8">Loading products...</p>;
    if (error) return <p className="text-center py-8 text-red-500">{error}</p>;

    return (
      <div className="lg:w-3/4">
        {/* Category Info */}
        {categoryInfo && (
          <div className="mb-4 p-4 bg-gray-50 rounded-lg">
            
            {categoryInfo.parent && (
              <p className="text-sm text-gray-600">
                Parent:{" "}
                <span className="font-semibold">{categoryInfo.parent}</span>
              </p>
            )}
            {categoryInfo.hierarchy && (
              <p className="text-sm text-gray-600">
                Category:{" "}
                <span className="font-semibold">
                  {categoryInfo.hierarchy.join(" → ")}
                </span>
              </p>
            )}
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <div
              key={product._id}
              onClick={() => handleProductClick(product.slug)}
              className="cursor-pointer"
            >
              <SingleProductCard
                id={product._id}
                name={product.name}
                price={product.price}
                originalPrice={product.originalPrice}
                image={product.images?.[0]?.url || product.image || ""}
              />
            </div>
          ))}
        </div>

        

        {products.length === 0 && !loading && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">
              No products found in the {displayCategoryName} category.
            </p>
          </div>
        )}

        {products.length > 0 && (
          <div className="flex justify-center mt-8">
            <button className="bg-white border border-gray-300 text-gray-700 px-6 py-2 rounded-md hover:bg-gray-50 transition-colors">
              Load More
            </button>
          </div>
        )}
      </div>
    );
  }, [
    products,
    loading,
    error,
    categoryName,
    handleProductClick,
    displayCategoryName,
    categoryInfo
  ]);





  /* ------------------------- Render ------------------------- */
  return (
    <div className="min-h-screen mt-26 lg:mt-38">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">
            {displayCategoryName}
          </h1>
          <div className="hidden sm:flex text-sm text-gray-600">
            VIEWING:{" "}
            <span className="font-semibold">{`1 - ${products.length} of ${products.length}`}</span>
          </div>
          <div className="flex sm:hidden">
            <button
              onClick={() => setIsMobileFilterOpen(true)}
              className="p-2 bg-orange-500 text-white rounded-md"
            >
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
          {/* Filters Sidebar */}
          <FilterSidebar
            isMobileFilterOpen={isMobileFilterOpen}
            setIsMobileFilterOpen={setIsMobileFilterOpen}
          />

          {/* Products Grid */}
          {productsGrid}
        </div>
      </div>
    </div>
  );
}

export default CategoryPage;
