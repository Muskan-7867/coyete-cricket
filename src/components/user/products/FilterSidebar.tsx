"use client";
import { AnimatePresence, motion } from "framer-motion";
import React, { useState, useTransition, useEffect, useCallback } from "react";

import { CategoryT, ColorT, QualityT, SizeT } from "@/types";
import {
  useCategories,
  useColors,
  useQuality,
  useSizes
} from "@/lib/queries/query";

// Define the filter state type
interface FilterState {
  subcategories: string[];
  size: string[];
  color: string[];
  qualityName: string[];
}

interface FilterSidebarProps {
  isMobileFilterOpen: boolean;
  setIsMobileFilterOpen: React.Dispatch<React.SetStateAction<boolean>>;
  onProductsUpdate?: (products: any[]) => void;
  onLoadingStateChange?: (isLoading: boolean) => void;
  onFiltersChange?: (filters: FilterState) => void;
  currentCategory?: string;
  allProductsCount?: number;
  filteredProductsCount?: number;
  subcategories?: string[];
  selectedFilters?: FilterState;
}

function FilterSidebar({
  isMobileFilterOpen,
  setIsMobileFilterOpen,
  onProductsUpdate,
  onLoadingStateChange,
  onFiltersChange,
  currentCategory,
  allProductsCount = 0,
  filteredProductsCount = 0,
  subcategories = [],
  selectedFilters = {
    subcategories: [],
    size: [],
    color: [],
    qualityName: []
  }
}: FilterSidebarProps) {
  // ✅ Fetch data using React Query
  const { data: categoriesData, isLoading: categoriesLoading } =
    useCategories();
  const { data: sizesData, isLoading: sizesLoading } = useSizes();
  const { data: colorsData, isLoading: colorsLoading } = useColors();
  const { data: qualitiesData, isLoading: qualitiesLoading } = useQuality();

  const [isPending, startTransition] = useTransition();

  // ✅ Use the same filter state structure as parent
  const [localFilters, setLocalFilters] =
    useState<FilterState>(selectedFilters);

  // ✅ Notify parent when filters change
  const updateFilters = useCallback(
    (newFilters: FilterState) => {
      setLocalFilters(newFilters);
      onFiltersChange?.(newFilters);
    },
    [onFiltersChange]
  );

  // ✅ Toggle dropdown
  const toggleDropdown = (category: keyof typeof openDropdowns) => {
    setOpenDropdowns((prev) => ({
      ...prev,
      [category]: !prev[category]
    }));
  };

  // ✅ Toggle checkbox handler
  const toggleFilter = (category: keyof FilterState, value: string) => {
    const newFilters = {
      ...localFilters,
      [category]: localFilters[category].includes(value)
        ? localFilters[category].filter((i) => i !== value)
        : [...localFilters[category], value]
    };

    updateFilters(newFilters);
  };

  // ✅ Clear filters
  const clearFilter = (category?: keyof FilterState) => {
    if (category) {
      const newFilters = {
        ...localFilters,
        [category]: []
      };
      updateFilters(newFilters);
    } else {
      const newFilters = {
        subcategories: [],
        size: [],
        color: [],
        qualityName: []
      };
      updateFilters(newFilters);
    }
  };

  // ✅ Fetch filtered products
  const fetchFilteredProducts = useCallback(async () => {
    const hasActiveFilters = Object.values(localFilters).some(
      (filterArray) => filterArray.length > 0
    );

    if (!hasActiveFilters) {
      console.log("No active filters, showing all products");
      onProductsUpdate?.([]);
      return;
    }

    const filters = {
      subcategories: localFilters.subcategories,
      sizes: localFilters.size,
      colors: localFilters.color,
      qualities: localFilters.qualityName
    };

    console.log("Selected filters:", localFilters);
    console.log("Current category:", currentCategory);
    console.log("Sending filters to API:", filters);

    startTransition(async () => {
      try {
        const res = await fetch("/api/products/filter", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ filters, currentCategory })
        }).then((r) => r.json());

        console.log("Filter API response:", res);

        if (res.success) {
          console.log(`Received ${res.products.length} filtered products`);
          onProductsUpdate?.(res.products || []);
        } else {
          console.error("Failed to fetch products:", res.error);
          onProductsUpdate?.([]);
        }
      } catch (error) {
        console.error("Error fetching products:", error);
        onProductsUpdate?.([]);
      }
    });
  }, [localFilters, currentCategory, onProductsUpdate]);

  // ✅ Apply filters and close mobile sidebar
  const applyFiltersAndClose = () => {
    fetchFilteredProducts();
    setIsMobileFilterOpen(false);
  };

  // ✅ Auto-apply filters when they change (with debounce)
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      fetchFilteredProducts();
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [localFilters, fetchFilteredProducts]);

  // ✅ Notify parent component about loading state
  useEffect(() => {
    onLoadingStateChange?.(isPending);
  }, [isPending, onLoadingStateChange]);

  // ✅ Dynamic filter options
  const filterOptions = {
    subcategories:
      subcategories.length > 0
        ? subcategories
        : Array.isArray(categoriesData)
        ? categoriesData.map((c: CategoryT) => c.name)
        : [],
    size: Array.isArray(sizesData?.data)
      ? sizesData.data.map((s: SizeT) => s.name)
      : [],
    color: Array.isArray(colorsData?.data)
      ? colorsData.data.map((c: ColorT) => c.name)
      : [],
    qualityName: Array.isArray(qualitiesData?.data)
      ? qualitiesData.data.map((q: QualityT) => q.name)
      : []
  };

  // ✅ State for dropdown open/close
  const [openDropdowns, setOpenDropdowns] = useState({
    subcategories: false,
    size: false,
    color: false,
    qualityName: false
  });

  // ✅ Check if any filters are active
  const hasActiveFilters = Object.values(localFilters).some(
    (filterArray) => filterArray.length > 0
  );

  // ✅ Render dropdown section
  const renderDropdownSection = (
    category: keyof typeof filterOptions,
    title: string
  ) => (
    <div key={category} className="mb-4 border-b border-gray-200 pb-4">
      {/* Dropdown Header */}
      <button
        onClick={() => toggleDropdown(category)}
        className="flex justify-between items-center w-full py-2 text-left focus:outline-none"
      >
        <h3 className="font-medium text-gray-900 capitalize">{title}</h3>
        <svg
          className={`w-5 h-5 transform transition-transform ${
            openDropdowns[category] ? "rotate-180" : ""
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {/* Dropdown Content */}
      <AnimatePresence>
        {openDropdowns[category] && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="pt-3">
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs text-gray-500">
                  {localFilters[category].length} selected
                </span>
                {localFilters[category].length > 0 && (
                  <button
                    onClick={() => clearFilter(category)}
                    className="text-xs text-orange-600 hover:text-orange-800 font-medium"
                  >
                    Clear
                  </button>
                )}
              </div>

              {filterOptions[category].length === 0 ? (
                <p className="text-sm text-gray-400 py-2">
                  {categoriesLoading ||
                  sizesLoading ||
                  colorsLoading ||
                  qualitiesLoading
                    ? "Loading..."
                    : "No options available"}
                </p>
              ) : (
                <div className="space-y-2 max-h-60 overflow-y-auto scrollbar-hide">
                  {filterOptions[category].map((option: string) => (
                    <label key={option} className="flex items-center py-1">
                      <input
                        type="checkbox"
                        checked={localFilters[category].includes(option)}
                        onChange={() => toggleFilter(category, option)}
                        className="rounded border-gray-300 text-orange-600 focus:ring-orange-500"
                      />
                      <span className="ml-3 text-sm text-gray-700">
                        {option}
                      </span>
                    </label>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );

  return (
    <>
      {/* ✅ Mobile Sidebar */}
      <AnimatePresence>
        {isMobileFilterOpen && (
          <>
            <motion.div
              key="backdrop"
              className="fixed inset-0 bg-black bg-opacity-50 z-40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              onClick={() => setIsMobileFilterOpen(false)}
            />

            <motion.div
              key="sidebar"
              className="fixed top-0 left-0 h-full w-80 bg-white z-50 overflow-y-auto"
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "tween", duration: 0.3 }}
            >
              <div className="px-6 pt-2 flex flex-col h-full">
                {/* Header */}
                <div className="flex justify-between items-center mb-2 border-b py-4">
                  <h2 className="text-lg font-semibold">Filters</h2>
                  <button
                    onClick={() => setIsMobileFilterOpen(false)}
                    className="p-2 hover:bg-gray-100 rounded-full"
                  >
                    ✕
                  </button>
                </div>

                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-lg font-semibold">Filter by</h2>
                  {hasActiveFilters && (
                    <button
                      onClick={() => clearFilter()}
                      className="text-sm text-orange-600 hover:text-orange-800 font-medium"
                    >
                      Clear All
                    </button>
                  )}
                </div>

                {/* Filter result summary */}
                {hasActiveFilters && (
                  <div className="mb-4 p-3 bg-blue-50 rounded-lg">
                    <p className="text-sm text-blue-800">
                      Showing {filteredProductsCount} of {allProductsCount}{" "}
                      products
                    </p>
                  </div>
                )}

                {/* Filter Sections with Dropdowns */}
                <div className="flex-1 overflow-y-auto scrollbar-hide">
                  {renderDropdownSection("subcategories", "Subcategories")}
                  {renderDropdownSection("size", "Size")}
                  {renderDropdownSection("color", "Color")}
                  {renderDropdownSection("qualityName", "Quality")}
                </div>

                <div className="mt-auto py-4 border-t">
                  <button
                    onClick={applyFiltersAndClose}
                    disabled={isPending}
                    className="w-full bg-orange-500 text-white py-3 px-4 rounded-lg font-medium hover:bg-orange-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isPending ? "Applying..." : "Apply Filters"}
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* ✅ Desktop Sidebar */}
      <div className="hidden lg:block lg:w-1/4">
        <div className="bg-white rounded-lg p-6 sticky top-4 flex flex-col h-[90vh]">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-semibold text-gray-900">Filter by</h2>
            {hasActiveFilters && (
              <button
                onClick={() => clearFilter()}
                className="text-sm text-orange-600 hover:text-orange-800 font-medium"
              >
                Clear All
              </button>
            )}
          </div>

          {/* Filter result summary */}
          {hasActiveFilters && (
            <div className="mb-4 p-3 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-800">
                Showing {filteredProductsCount} of {allProductsCount} products
              </p>
            </div>
          )}

          {/* Filter Sections with Dropdowns */}
          <div className="flex-1 overflow-y-auto scrollbar-hide">
            {renderDropdownSection("subcategories", "Subcategories")}
            {renderDropdownSection("size", "Size")}
            {renderDropdownSection("color", "Color")}
            {renderDropdownSection("qualityName", "Quality")}
          </div>

          {/* ✅ Filter Status */}
          <div className="mt-4 p-3 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600">
              {hasActiveFilters
                ? `${Object.values(localFilters).flat().length} filters active`
                : "No filters applied"}
            </p>
          </div>
        </div>
      </div>
    </>
  );
}

export default FilterSidebar;
