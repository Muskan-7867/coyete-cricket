"use client";
import { AnimatePresence, motion } from "framer-motion";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import React, { useState, useEffect, useCallback } from "react";

import { CategoryT, ColorT, QualityT, SizeT, SubCategoryT } from "@/types";
import {
  useCategories,
  useColors,
  useQuality,
  useSizesByCategory,
  useSubcategories
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
  currentCategoryId?: string;
  subcategories?: string[];
  initialFilters?: FilterState;
}

function FilterSidebar({
  isMobileFilterOpen,
  setIsMobileFilterOpen,
  currentCategoryId,
  subcategories = [],
  initialFilters = { subcategories: [], size: [], color: [], qualityName: [] }
}: FilterSidebarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  
  // Fetch data using React Query
  const { data: categoriesData } = useCategories();
  const { data: sizesData } = useSizesByCategory(currentCategoryId);
  const { data: colorsData } = useColors();
  const { data: qualitiesData } = useQuality();
  const { data: subcategoriesData } = useSubcategories(currentCategoryId || "");

  // Initialize local state from URL params or initialFilters
  const [localFilters, setLocalFilters] = useState<FilterState>(initialFilters);

  // Function to update URL with current filters
  const updateURLFilters = useCallback((filters: FilterState) => {
    const params = new URLSearchParams();
    
    // Add filters to params only if they have values
    if (filters.subcategories.length > 0) {
      params.set('subcategories', filters.subcategories.join(','));
    }
    if (filters.size.length > 0) {
      params.set('sizes', filters.size.join(','));
    }
    if (filters.color.length > 0) {
      params.set('colors', filters.color.join(','));
    }
    if (filters.qualityName.length > 0) {
      params.set('qualities', filters.qualityName.join(','));
    }
    
    // Update URL without page reload (shallow routing)
    const newUrl = params.toString() ? `${pathname}?${params.toString()}` : pathname;
    router.push(newUrl, { scroll: false });
  }, [router, pathname]);

  // Update local filters only when URL params change (not on initial render)
  useEffect(() => {
    const newFilters: FilterState = {
      subcategories: [],
      size: [],
      color: [],
      qualityName: []
    };
    
    // Get filters from URL
    const subcategoriesParam = searchParams.get('subcategories');
    const sizesParam = searchParams.get('sizes');
    const colorsParam = searchParams.get('colors');
    const qualitiesParam = searchParams.get('qualities');
    
    if (subcategoriesParam) {
      newFilters.subcategories = subcategoriesParam.split(',');
    }
    if (sizesParam) {
      newFilters.size = sizesParam.split(',');
    }
    if (colorsParam) {
      newFilters.color = colorsParam.split(',');
    }
    if (qualitiesParam) {
      newFilters.qualityName = qualitiesParam.split(',');
    }
    
    // Only update if filters actually changed to prevent infinite loop
    setLocalFilters(prev => {
      const isSame = 
        JSON.stringify(prev.subcategories) === JSON.stringify(newFilters.subcategories) &&
        JSON.stringify(prev.size) === JSON.stringify(newFilters.size) &&
        JSON.stringify(prev.color) === JSON.stringify(newFilters.color) &&
        JSON.stringify(prev.qualityName) === JSON.stringify(newFilters.qualityName);
      
      return isSame ? prev : newFilters;
    });
  }, [searchParams]); // Only depend on searchParams

  // Toggle checkbox handler
  const toggleFilter = useCallback((category: keyof FilterState, value: string) => {
    setLocalFilters(prev => {
      const newFilters = {
        ...prev,
        [category]: prev[category].includes(value)
          ? prev[category].filter((i) => i !== value)
          : [...prev[category], value]
      };
      
      // Update URL after state update
      setTimeout(() => updateURLFilters(newFilters), 0);
      return newFilters;
    });
  }, [updateURLFilters]);

  // Clear filters
  const clearFilter = useCallback((category?: keyof FilterState) => {
    setLocalFilters(prev => {
      let newFilters: FilterState;
      
      if (category) {
        newFilters = { ...prev, [category]: [] };
      } else {
        newFilters = { subcategories: [], size: [], color: [], qualityName: [] };
      }
      
      // Update URL after state update
      setTimeout(() => updateURLFilters(newFilters), 0);
      return newFilters;
    });
  }, [updateURLFilters]);

  // Rest of your component code...
  const [openDropdowns, setOpenDropdowns] = useState({
    subcategories: false,
    size: false,
    color: false,
    qualityName: false
  });
  
  const toggleDropdown = useCallback((category: keyof typeof openDropdowns) => {
    setOpenDropdowns(prev => ({
      ...prev,
      [category]: !prev[category]
    }));
  }, []);

  // Dynamic filter options
  const filterOptions = {
    subcategories:
      subcategories.length > 0
        ? subcategories
        : Array.isArray(subcategoriesData)
        ? subcategoriesData.map((sub: SubCategoryT) => sub.name)
        : Array.isArray(categoriesData)
        ? categoriesData.map((c: CategoryT) => c.name)
        : [],
    size: Array.isArray(sizesData) ? sizesData.map((s: SizeT) => s.name) : [],
    color: Array.isArray(colorsData?.data)
      ? colorsData.data.map((c: ColorT) => c.name)
      : [],
    qualityName: Array.isArray(qualitiesData?.data)
      ? qualitiesData.data.map((q: QualityT) => q.name)
      : []
  };

  const hasActiveFilters = Object.values(localFilters).some(
    (filterArray) => filterArray.length > 0
  );

  const getSizeFilterMessage = () => {
    if (!currentCategoryId) return "Select a category to see sizes";
    if (filterOptions.size.length === 0) return "No sizes available for this category";
    return "";
  };

  const renderDropdownSection = (
    category: keyof typeof filterOptions,
    title: string
  ) => (
    <div key={category} className="mb-4 border-b border-gray-200 pb-4">
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
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

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
                  {category === "size" ? getSizeFilterMessage() : "No options available"}
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
                      <span className="ml-3 text-sm text-gray-700">{option}</span>
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
      {/* Mobile Sidebar */}
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

                <div className="flex-1 overflow-y-auto scrollbar-hide">
                  {renderDropdownSection("subcategories", "Subcategories")}
                  {renderDropdownSection("size", "Size")}
                  {renderDropdownSection("color", "Color")}
                  {renderDropdownSection("qualityName", "Quality")}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Desktop Sidebar */}
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

          <div className="flex-1 overflow-y-auto scrollbar-hide">
            {renderDropdownSection("subcategories", "Subcategories")}
            {renderDropdownSection("size", "Size")}
            {renderDropdownSection("color", "Color")}
            {renderDropdownSection("qualityName", "Quality")}
          </div>
        </div>
      </div>
    </>
  );
}

export default FilterSidebar;