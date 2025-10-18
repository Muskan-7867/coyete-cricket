"use client";
import { AnimatePresence, motion } from "framer-motion";
import React, { useState } from "react";

interface FilterSidebarProps {
  isMobileFilterOpen: boolean;
  setIsMobileFilterOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

function FilterSidebar({ isMobileFilterOpen, setIsMobileFilterOpen }: FilterSidebarProps) {
  const [selectedFilters, setSelectedFilters] = useState({
    productType: [] as string[],
    size: [] as string[],
    color: [] as string[],
    qualityName: [] as string[],
  });

  const filterOptions = {
    productType: ["Option 1", "Option 2", "Option 3"],
    size: ["S", "M", "L", "XL"],
    color: ["Red", "orange", "Green", "Black"],
    qualityName: ["Premium", "Standard", "Economy"],
  };

  const toggleFilter = (
    category: keyof typeof selectedFilters,
    value: string
  ) => {
    setSelectedFilters((prev) => {
      const currentFilters = prev[category];
      if (currentFilters.includes(value)) {
        return { ...prev, [category]: currentFilters.filter((i) => i !== value) };
      } else {
        return { ...prev, [category]: [...currentFilters, value] };
      }
    });
  };

  const clearFilter = (category?: keyof typeof selectedFilters) => {
    if (category) {
      setSelectedFilters((prev) => ({ ...prev, [category]: [] }));
    } else {
      setSelectedFilters({
        productType: [],
        size: [],
        color: [],
        qualityName: [],
      });
    }
  };

  return (
    <>

      <AnimatePresence>
        {isMobileFilterOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              key="backdrop"
              className="fixed inset-0 bg-black bg-opacity-50 z-40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              onClick={() => setIsMobileFilterOpen(false)}
            />

            {/* Sidebar */}
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
                <div className="flex justify-between items-center mb-2  border-b">
                  <h2 className="text-lg font-semibold">Filters</h2>
                  <button
                    onClick={() => setIsMobileFilterOpen(false)}
                    className="p-2 hover:bg-gray-100 rounded-full"
                  >
                    ✕
                  </button>
                </div>

                {/* Clear All */}
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-lg font-semibold">Filter by</h2>
                  <button
                    onClick={() => clearFilter()}
                    className="text-sm text-orange-600 hover:text-orange-800 font-medium"
                  >
                    Clear All
                  </button>
                </div>

                {/* Filters */}
                {Object.keys(filterOptions).map((category) => (
                  <div key={category} className="mb-6">
                    <div className="flex justify-between items-center mb-3">
                      <h3 className="font-medium text-gray-900">{category}</h3>
                      <button
                        onClick={() =>
                          clearFilter(category as keyof typeof selectedFilters)
                        }
                        className="text-xs text-gray-500 hover:text-gray-700"
                      >
                        Clear
                      </button>
                    </div>
                    <div className="space-y-2">
                      {filterOptions[category as keyof typeof filterOptions].map(
                        (option) => (
                          <label key={option} className="flex items-center">
                            <input
                              type="checkbox"
                              checked={selectedFilters[
                                category as keyof typeof selectedFilters
                              ].includes(option)}
                              onChange={() =>
                                toggleFilter(
                                  category as keyof typeof selectedFilters,
                                  option
                                )
                              }
                              className="rounded border-gray-300 text-orange-600 focus:ring-orange-500"
                            />
                            <span className="ml-2 text-sm text-gray-700">{option}</span>
                          </label>
                        )
                      )}
                    </div>
                  </div>
                ))}

                {/* Apply Button */}
                <div className="mt-auto">
                  <button
                    onClick={() => setIsMobileFilterOpen(false)}
                    className="w-full bg-orange-500 text-white py-3 px-4 rounded-lg font-medium hover:bg-orange-700 transition-colors"
                  >
                    Apply Filters
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Desktop Filter Sidebar */}
      <div className="hidden lg:block lg:w-1/4">
        <div className="bg-white rounded-lg shadow-sm p-6 sticky top-4">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-semibold text-gray-900">Filter by</h2>
            <button
              onClick={() => clearFilter()}
              className="text-sm text-orange-600 hover:text-orange-800 font-medium"
            >
              Clear All
            </button>
          </div>

          {Object.keys(filterOptions).map((category) => (
            <div key={category} className="mb-6">
              <div className="flex justify-between items-center mb-3">
                <h3 className="font-medium text-gray-900">{category}</h3>
                <button
                  onClick={() =>
                    clearFilter(category as keyof typeof selectedFilters)
                  }
                  className="text-xs text-gray-500 hover:text-gray-700"
                >
                  Clear
                </button>
              </div>
              <div className="space-y-2">
                {filterOptions[category as keyof typeof filterOptions].map(
                  (option) => (
                    <label key={option} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={selectedFilters[
                          category as keyof typeof selectedFilters
                        ].includes(option)}
                        onChange={() =>
                          toggleFilter(
                            category as keyof typeof selectedFilters,
                            option
                          )
                        }
                        className="rounded border-gray-300 text-orange-600 focus:ring-orange-500"
                      />
                      <span className="ml-2 text-sm text-gray-700">{option}</span>
                    </label>
                  )
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

export default FilterSidebar;
