"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  CategoryT,
  ColorT,
  ProductFormData,
  QualityT,
  SizesResponse,
  SizeT,
  SubCategoryT
} from "@/types";

import { ArrowDown, ArrowUp, Save, Upload, X } from "lucide-react";
import Image from "next/image";
import {
  useCategories,
  useColors,
  useQuality,
  useSizes,
  useSubcategories
} from "@/lib/queries/query";

export default function AddProductPage() {
  const router = useRouter();

  // 🟢 Form State
  const [formData, setFormData] = useState<ProductFormData>({
    name: "",
    shortDescription: "",
    detailedDescription: "",
    price: 0,
    originalPrice: 0,
    discount: 0,
    tax: 0,
    quality: "",
    category: "",
    subcategory: "",
    size: "",
    colors: "",
    inStock: true,
    images: []
  });

  const [filteredSubcategories, setFilteredSubcategories] = useState<
    SubCategoryT[]
  >([]);
  const [filteredSizes, setFilteredSizes] = useState<SizeT[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imageRanks, setImageRanks] = useState<number[]>([]);

  // 🟢 Fetch data with proper typing
  const { data: fetchedCategories } = useCategories();
  const { data: fetchedSubCategories } = useSubcategories();
  const { data: fetchedSizes } = useSizes() as {
    data: SizesResponse | SizeT[] | undefined;
  };
  const { data: fetchedColors } = useColors();
  const { data: fetchedQualities } = useQuality();

  // 🟢 Reset dependent fields when category changes
  useEffect(() => {
    if (formData.category) {
      setFormData((prev) => ({
        ...prev,
        subcategory: "",
        size: ""
      }));
    }
  }, [formData.category]);

  // 🟢 FIXED: Filter subcategories hierarchically based on parent category or parent subcategory
  useEffect(() => {
    if (!formData.category || !fetchedSubCategories) {
      setFilteredSubcategories([]);
      return;
    }

    const getSubCategoriesData = (): SubCategoryT[] => {
      if (!fetchedSubCategories) return [];

      // Handle API response structure
      if (
        typeof fetchedSubCategories === "object" &&
        fetchedSubCategories !== null &&
        "success" in fetchedSubCategories &&
        fetchedSubCategories.success &&
        "subcategories" in fetchedSubCategories &&
        Array.isArray(fetchedSubCategories.subcategories)
      ) {
        return fetchedSubCategories.subcategories as SubCategoryT[];
      }

      // Fallback: if it's already an array
      return Array.isArray(fetchedSubCategories)
        ? (fetchedSubCategories as SubCategoryT[])
        : [];
    };

    // Extract subcategories from API response
    const subCategoriesData = getSubCategoriesData();

    if (subCategoriesData.length > 0) {
      // First, get direct subcategories of the selected category
      const directSubcategories = subCategoriesData.filter(
        (sub: SubCategoryT) => {
          // Handle different possible structures of parentCategory
          const parentCategoryId =
            typeof sub.parentCategory === "string"
              ? sub.parentCategory
              : (sub.parentCategory as CategoryT)?._id;

          return parentCategoryId === formData.category;
        }
      );

      // Then, get child subcategories of the direct subcategories
      const childSubcategories = subCategoriesData.filter(
        (sub: SubCategoryT) => {
          // Check if this subcategory has a parent subcategory
          const parentSubcategoryId =
            typeof sub.parentSubcategory === "string"
              ? sub.parentSubcategory
              : (sub.parentSubcategory as SubCategoryT)?._id;

          // If it has a parent subcategory, check if that parent is in our direct subcategories
          if (parentSubcategoryId) {
            const parentSub = subCategoriesData.find(
              (s) => s._id === parentSubcategoryId
            );
            if (parentSub) {
              const parentSubParentId =
                typeof parentSub.parentCategory === "string"
                  ? parentSub.parentCategory
                  : (parentSub.parentCategory as CategoryT)?._id;

              return parentSubParentId === formData.category;
            }
          }
          return false;
        }
      );

      // Combine both direct and child subcategories
      const allFilteredSubcategories = [
        ...directSubcategories,
        ...childSubcategories
      ];

      setFilteredSubcategories(allFilteredSubcategories);
    } else {
      setFilteredSubcategories([]);
    }
  }, [formData.category, fetchedSubCategories]);

  // 🟢 Alternative approach: If you want to show hierarchical structure in the dropdown
  const getSubcategoryDisplayName = (
    subcategory: SubCategoryT,
    allSubcategories: SubCategoryT[]
  ): string => {
    let displayName = subcategory.name;

    // Check if this is a child subcategory
    const parentSubcategoryId =
      typeof subcategory.parentSubcategory === "string"
        ? subcategory.parentSubcategory
        : (subcategory.parentSubcategory as SubCategoryT)?._id;

    if (parentSubcategoryId) {
      const parentSub = allSubcategories.find(
        (s) => s._id === parentSubcategoryId
      );
      if (parentSub) {
        displayName = `${parentSub.name} → ${subcategory.name}`;
      }
    }

    return displayName;
  };

  // 🟢 Filter sizes on category change
  useEffect(() => {
    if (!formData.category) {
      setFilteredSizes([]);
      return;
    }

    if (!fetchedSizes) {
      console.log("Sizes data not loaded yet");
      return;
    }

    let sizesArray: SizeT[] = [];

    if (Array.isArray(fetchedSizes)) {
      sizesArray = fetchedSizes as SizeT[];
    } else {
      const response = fetchedSizes as SizesResponse;
      if (response.sizes && Array.isArray(response.sizes)) {
        sizesArray = response.sizes;
      } else if (response.data && Array.isArray(response.data)) {
        sizesArray = response.data;
      }
    }

    const sizesForCategory = sizesArray.filter((size: SizeT) => {
      const categoryId = size.categoryId || (size.category as CategoryT)?._id;
      return categoryId === formData.category;
    });

    setFilteredSizes(sizesForCategory);
  }, [formData.category, fetchedSizes]);

  // 🟢 Handle input changes
  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value, type } = e.target;
    const checked =
      type === "checkbox" ? (e.target as HTMLInputElement).checked : undefined;

    setFormData((prev) => ({
      ...prev,
      [name]:
        type === "checkbox"
          ? checked
          : ["price", "originalPrice", "discount", "tax"].includes(name)
          ? parseFloat(value) || 0
          : value
    }));
  };

  useEffect(() => {
    if (formData.images.length > 0) {
      const newRanks = formData.images.map((_, index) => index);
      setImageRanks(newRanks);
    } else {
      setImageRanks([]);
    }
  }, [formData.images]);

  // 🟢 Move image up in ranking
  const moveImageUp = (index: number) => {
    if (index === 0) return;

    const newRanks = [...imageRanks];
    [newRanks[index], newRanks[index - 1]] = [
      newRanks[index - 1],
      newRanks[index]
    ];
    setImageRanks(newRanks);
  };

  // 🟢 Move image down in ranking
  const moveImageDown = (index: number) => {
    if (index === imageRanks.length - 1) return;

    const newRanks = [...imageRanks];
    [newRanks[index], newRanks[index + 1]] = [
      newRanks[index + 1],
      newRanks[index]
    ];
    setImageRanks(newRanks);
  };

  const getSortedImagePreviews = () => {
    if (imagePreviews.length === 0) return [];

    const indices = imagePreviews.map((_, index) => index);
    const sortedIndices = indices.sort((a, b) => imageRanks[a] - imageRanks[b]);

    return sortedIndices.map((index) => ({
      preview: imagePreviews[index],
      originalIndex: index
    }));
  };

  // 🟢 Image upload
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length + formData.images.length > 5) {
      alert("Maximum 5 images allowed");
      return;
    }

    setFormData((prev) => ({ ...prev, images: [...prev.images, ...files] }));

    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (ev) =>
        setImagePreviews((prev) => [...prev, ev.target?.result as string]);
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
    setImagePreviews((prev) => prev.filter((_, i) => i !== index));
  };

  // 🟢 Handle submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const imageBase64 = await Promise.all(
        formData.images.map(
          (file) =>
            new Promise<string>((resolve, reject) => {
              const reader = new FileReader();
              reader.onload = () => resolve(reader.result as string);
              reader.onerror = () => reject(new Error("Failed to read file"));
              reader.readAsDataURL(file);
            })
        )
      );

      const res = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, images: imageBase64 })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to create product");

      alert("✅ Product created successfully!");
      setFormData({
        name: "",
        shortDescription: "",
        detailedDescription: "",
        price: 0,
        originalPrice: 0,
        discount: 0,
        tax: 0,
        quality: "",
        category: "",
        subcategory: "",
        size: "",
        colors: "",
        inStock: true,
        images: []
      });
      setImagePreviews([]);
      router.push("/products");
    } catch (err: unknown) {
      console.error(err);
      alert("❌ Failed to create product");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Helper to get data based on response structure
  const getCategoriesData = (): CategoryT[] => {
    if (!fetchedCategories) return [];
    return Array.isArray(fetchedCategories)
      ? fetchedCategories
      : fetchedCategories?.data || fetchedCategories;
  };

  const getColorsData = (): ColorT[] => {
    if (!fetchedColors) return [];
    return Array.isArray(fetchedColors)
      ? fetchedColors
      : fetchedColors?.data || fetchedColors;
  };

  const getQualitiesData = (): QualityT[] => {
    if (!fetchedQualities) return [];
    return Array.isArray(fetchedQualities)
      ? fetchedQualities
      : fetchedQualities?.data || fetchedQualities;
  };

  const getSubCategoriesData = (): SubCategoryT[] => {
    if (!fetchedSubCategories) return [];

    if (
      typeof fetchedSubCategories === "object" &&
      fetchedSubCategories !== null &&
      "success" in fetchedSubCategories &&
      fetchedSubCategories.success &&
      "subcategories" in fetchedSubCategories &&
      Array.isArray(fetchedSubCategories.subcategories)
    ) {
      return fetchedSubCategories.subcategories as SubCategoryT[];
    }

    return Array.isArray(fetchedSubCategories)
      ? (fetchedSubCategories as SubCategoryT[])
      : [];
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Add New Product</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Product Name */}
        <div>
          <label className="block text-sm font-medium mb-2">
            Product Name *
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            placeholder="Enter product name"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        {/* Category + Subcategory */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium mb-2">Category *</label>
            <select
              name="category"
              value={formData.category}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg"
              required
            >
              <option value="">Select Category</option>
              {getCategoriesData().map((cat: CategoryT) => (
                <option key={cat._id} value={cat._id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Subcategory *
            </label>
            <select
              name="subcategory"
              value={formData.subcategory}
              onChange={handleInputChange}
              disabled={!formData.category}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg"
              required
            >
              <option value="">Select Subcategory</option>
              {filteredSubcategories.map((sub: SubCategoryT) => (
                <option key={sub._id} value={sub._id}>
                  {getSubcategoryDisplayName(sub, getSubCategoriesData())}
                </option>
              ))}
            </select>

            {formData.category && filteredSubcategories.length === 0 && (
              <p className="text-sm text-gray-500 mt-1">
                {fetchedSubCategories
                  ? "No subcategories available for this category"
                  : "Loading subcategories..."}
              </p>
            )}
          </div>
        </div>

        {/* Size / Quality / Color */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium mb-2">Size *</label>
            <select
              name="size"
              value={formData.size}
              onChange={handleInputChange}
              disabled={!formData.category || filteredSizes.length === 0}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg"
              required
            >
              <option value="">Select Size</option>
              {filteredSizes.map((sz: SizeT) => (
                <option key={sz._id} value={sz._id}>
                  {sz.name}
                </option>
              ))}
            </select>
            {formData.category && filteredSizes.length === 0 && (
              <p className="text-sm text-gray-500 mt-1">
                No sizes available for this category
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Quality *</label>
            <select
              name="quality"
              value={formData.quality}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg"
              required
            >
              <option value="">Select Quality</option>
              {getQualitiesData().map((q: QualityT) => (
                <option key={q._id} value={q._id}>
                  {q.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Color *</label>
            <select
              name="colors"
              value={formData.colors}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg"
              required
            >
              <option value="">Select Color</option>
              {getColorsData().map((c: ColorT) => (
                <option key={c._id} value={c._id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Pricing */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { label: "Price * ($)", name: "price" },
            { label: "Original Price * ($)", name: "originalPrice" },
            { label: "Discount (%)", name: "discount" },
            { label: "Tax (%)", name: "tax" }
          ].map(({ label, name }) => (
            <div key={name}>
              <label className="block text-sm font-medium mb-2">{label}</label>
              <input
                type="number"
                name={name}
                value={formData[name as keyof ProductFormData] as number}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg"
                required={name === "price" || name === "originalPrice"}
              />
            </div>
          ))}
        </div>

        {/* Descriptions */}
        <div>
          <label className="block text-sm font-medium mb-2">
            Short Description *
          </label>
          <textarea
            name="shortDescription"
            value={formData.shortDescription}
            onChange={handleInputChange}
            rows={2}
            placeholder="Short Description....."
            className="w-full px-4 py-3 border border-gray-300 rounded-lg"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            Detailed Description *
          </label>
          <textarea
            name="detailedDescription"
            value={formData.detailedDescription}
            onChange={handleInputChange}
            rows={6}
            placeholder="Long Description....."
            className="w-full px-4 py-3 border border-gray-300 rounded-lg"
            required
          />
        </div>

        {/* Images */}
        <div>
          <label className="block text-sm font-medium mb-2">
            Product Images (Max 5) - Drag to reorder or use arrows
          </label>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
              id="image-upload"
            />
            <label
              htmlFor="image-upload"
              className="cursor-pointer flex flex-col items-center"
            >
              <Upload className="h-12 w-12 text-gray-400 mb-2" />
              <span className="text-sm text-gray-600">
                Click to upload images
              </span>
            </label>
          </div>

          {imagePreviews.length > 0 && (
            <div className="mt-4">
              <p className="text-sm text-gray-600 mb-3">
                Image order:{" "}
                <span className="font-semibold">
                  First image will be displayed as primary
                </span>
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {getSortedImagePreviews().map(
                  ({ preview, originalIndex }, displayIndex) => (
                    <div
                      key={originalIndex}
                      className="relative group border rounded-lg p-2 bg-gray-50"
                    >
                      {/* Rank Badge */}
                      <div className="absolute -top-2 -left-2 bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold z-10">
                        {displayIndex + 1}
                      </div>

                      <Image
                        src={preview}
                        alt={`Preview ${displayIndex + 1}`}
                        width={200}
                        height={200}
                        className="w-full h-32 object-cover rounded-lg"
                      />

                      {/* Ranking Controls */}
                      <div className="flex justify-center gap-2 mt-2">
                        <button
                          type="button"
                          onClick={() => moveImageUp(originalIndex)}
                          disabled={imageRanks[originalIndex] === 0}
                          className="p-1 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
                          title="Move up"
                        >
                          <ArrowUp size={16} />
                        </button>

                        <button
                          type="button"
                          onClick={() => moveImageDown(originalIndex)}
                          disabled={
                            imageRanks[originalIndex] === imageRanks.length - 1
                          }
                          className="p-1 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
                          title="Move down"
                        >
                          <ArrowDown size={16} />
                        </button>

                        <button
                          type="button"
                          onClick={() => removeImage(originalIndex)}
                          className="p-1 bg-red-500 text-white rounded hover:bg-red-600"
                          title="Remove image"
                        >
                          <X size={16} />
                        </button>
                      </div>
                    </div>
                  )
                )}
              </div>
            </div>
          )}
        </div>

        {/* Submit */}
        <div className="flex justify-end gap-4">
          <button
            type="button"
            className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
            onClick={() => router.back()}
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-6 py-3 bg-main text-white rounded-lg hover:bg-blue-700 flex items-center gap-2 disabled:bg-gray-400"
          >
            <Save size={20} />
            {isSubmitting ? "Creating..." : "Create Product"}
          </button>
        </div>
      </form>
    </div>
  );
}
