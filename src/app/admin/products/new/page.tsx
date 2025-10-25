"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  ColorT,
  ProductFormData,
  QualityT,
  SizeT,
  CategoryT,
  SubCategoryT
} from "@/types";
import { ArrowDown, ArrowUp, Save, Upload, X, Plus } from "lucide-react";
import Image from "next/image";
import {
  useColors,
  useQuality,
  useCategories,
  useSubcategories
} from "@/lib/queries/query";
import { getSubSubcategories } from "@/lib/actions/subCategoryActions";
import { getSizesByCategory } from "@/lib/actions/sizeAction";
import toast from "react-hot-toast";

export default function AddProductPage() {
  const router = useRouter();

  // ---------------- Form State ----------------
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
    subCategory: "",
    subSubCategory: "",
    size: "",
    colors: "",
    tags: [],
    inStock: true,
    images: []
  });

  const [filteredSizes, setFilteredSizes] = useState<SizeT[] | undefined>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imageRanks, setImageRanks] = useState<number[]>([]);
  const [tagInput, setTagInput] = useState("");
  const [fetchedSubSubcategories, setFetchedSubSubcategories] = useState<
    SubCategoryT[]
  >([]);

  const { data: fetchedColors } = useColors();
  const { data: fetchedQualities } = useQuality();
  const { data: fetchedCategories } = useCategories();

  const { data: fetchedSubcategories } = useSubcategories(formData.category);

  // ---------------- Normalize Sizes ----------------
  useEffect(() => {
    if (!formData.category) {
      setFilteredSizes([]);
      return;
    }

    (async () => {
      try {
        const res = await getSizesByCategory(formData.category);
        if (res.success) setFilteredSizes(res.sizes);
        else setFilteredSizes([]);
      } catch (err) {
        console.error("Failed to fetch sizes:", err);
        setFilteredSizes([]);
      }
    })();
  }, [formData.category]);

  useEffect(() => {
    if (!formData.subCategory) {
      setFetchedSubSubcategories([]);
      return;
    }

    (async () => {
      const res = await getSubSubcategories(formData.subCategory);
      setFetchedSubSubcategories(res.success ? res.subcategories : []);
    })();
  }, [formData.subCategory]);

  // ---------------- Input Handler ----------------
  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value, type } = e.target;
    const checked =
      type === "checkbox" ? (e.target as HTMLInputElement).checked : undefined;

    // Reset dependent fields
    if (name === "category")
      setFormData((prev) => ({ ...prev, subCategory: "", subSubCategory: "" }));
    if (name === "subCategory")
      setFormData((prev) => ({ ...prev, subSubCategory: "" }));

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

  // ---------------- Tags ----------------
  const handleTagInputChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setTagInput(e.target.value);

  const addTag = () => {
    const trimmed = tagInput.trim();
    if (trimmed && !formData.tags.includes(trimmed)) {
      setFormData((prev) => ({ ...prev, tags: [...prev.tags, trimmed] }));
      setTagInput("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((tag) => tag !== tagToRemove)
    }));
  };

  const handleTagKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addTag();
    }
  };

  // ---------------- Image Logic ----------------
  useEffect(() => {
    setImageRanks(formData.images.map((_, i) => i));
  }, [formData.images]);

  const moveImageUp = (index: number) => {
    if (index === 0) return;
    const newRanks = [...imageRanks];
    [newRanks[index - 1], newRanks[index]] = [
      newRanks[index],
      newRanks[index - 1]
    ];
    setImageRanks(newRanks);
  };

  const moveImageDown = (index: number) => {
    if (index === imageRanks.length - 1) return;
    const newRanks = [...imageRanks];
    [newRanks[index + 1], newRanks[index]] = [
      newRanks[index],
      newRanks[index + 1]
    ];
    setImageRanks(newRanks);
  };

  const getSortedImagePreviews = () => {
    const sortedIndices = [...imagePreviews.keys()].sort(
      (a, b) => imageRanks[a] - imageRanks[b]
    );
    return sortedIndices.map((i) => ({
      preview: imagePreviews[i],
      originalIndex: i
    }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []).filter((f) =>
      f.type.startsWith("image/")
    );
    if (files.length + formData.images.length > 5) {
      alert("Maximum 5 images allowed");
      return;
    }

    setFormData((prev) => ({ ...prev, images: [...prev.images, ...files] }));

    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (ev) => {
        if (ev.target?.result)
          setImagePreviews((prev) => [...prev, ev.target?.result as string]);
      };
      reader.readAsDataURL(file);
    });

    e.target.value = "";
  };

  const removeImage = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
    setImagePreviews((prev) => prev.filter((_, i) => i !== index));
  };

  // ---------------- Submit ----------------
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const validFiles = formData.images.filter(
        (img): img is File => img instanceof File
      );
      const imageBase64 = await Promise.all(
        validFiles.map(
          (file) =>
            new Promise<string>((resolve, reject) => {
              const reader = new FileReader();
              reader.onload = () => resolve(reader.result as string);
              reader.onerror = (err) => reject(err);
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

      toast.success("✅ Product created successfully!");
      router.push("/admin/products");
    } catch (err) {
      console.error(err);
      toast.error("❌ Failed to create product");
    } finally {
      setIsSubmitting(false);
    }
  };

  // ---------------- Normalized Lists ----------------
  const getColors = (): ColorT[] =>
    Array.isArray(fetchedColors) ? fetchedColors : fetchedColors?.data || [];
  const getQualities = (): QualityT[] =>
    Array.isArray(fetchedQualities)
      ? fetchedQualities
      : fetchedQualities?.data || [];
  const getCategoriesData = (): CategoryT[] =>
    Array.isArray(fetchedCategories)
      ? fetchedCategories
      : fetchedCategories?.data || [];
  const getSubcategoriesData = (): SubCategoryT[] =>
    Array.isArray(fetchedSubcategories)
      ? fetchedSubcategories
      : fetchedSubcategories?.data || [];

  // ---------------- JSX ----------------
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
            className="w-full px-4 py-3 border border-gray-300 rounded-lg"
            required
          />
        </div>

        {/* Category / Subcategory / Sub-subcategory */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
              {getCategoriesData().map((c) => (
                <option key={c._id} value={c._id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Subcategory *
            </label>
            <select
              name="subCategory"
              value={formData.subCategory}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg"
              disabled={!formData.category}
              required
            >
              <option value="">Select Subcategory</option>
              {getSubcategoriesData().map((s) => (
                <option key={s._id} value={s._id}>
                  {s.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Sub-subcategory (Optional)
            </label>
            <select
              name="subSubCategory"
              value={formData.subSubCategory}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg"
              disabled={!formData.subCategory}
            >
              <option value="">Select Sub-subcategory</option>
              {fetchedSubSubcategories.map((s) => (
                <option key={s._id} value={s._id}>
                  {s.name}
                </option>
              ))}
            </select>
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
              className="w-full px-4 py-3 border border-gray-300 rounded-lg"
              required
            >
              <option value="">Select Size</option>
              {filteredSizes?.map((sz) => (
                <option key={sz._id} value={sz.name}>
                  {sz.name}
                </option>
              ))}
            </select>
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
              {getQualities().map((q) => (
                <option key={q._id} value={q.name}>
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
              {getColors().map((c) => (
                <option key={c._id} value={c.name}>
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

        {/* Tags */}
        <div>
          <label className="block text-sm font-medium mb-2">Tags</label>
          <div className="space-y-3">
            <div className="flex gap-2">
              <input
                type="text"
                value={tagInput}
                onChange={handleTagInputChange}
                onKeyDown={handleTagKeyDown}
                placeholder="Enter a tag and press Enter or click Add"
                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg"
              />
              <button
                type="button"
                onClick={addTag}
                className="px-4 py-3 bg-gray-200 rounded-lg hover:bg-gray-300 flex items-center gap-2"
              >
                <Plus size={16} /> Add
              </button>
            </div>

            {formData.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {formData.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={() => removeTag(tag)}
                      className="text-blue-600 hover:text-blue-800 ml-1"
                    >
                      <X size={14} />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>
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
            placeholder="Short Description..."
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
            placeholder="Detailed Description..."
            className="w-full px-4 py-3 border border-gray-300 rounded-lg"
            required
          />
        </div>

        {/* Images */}
        <div>
          <label className="block text-sm font-medium mb-2">
            Product Images (Max 5)
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
            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {getSortedImagePreviews().map(
                ({ preview, originalIndex }, displayIndex) => (
                  <div
                    key={originalIndex}
                    className="relative group border rounded-lg p-2 bg-gray-50"
                  >
                    <div className="absolute -top-2 -left-2 bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">
                      {displayIndex + 1}
                    </div>

                    <Image
                      src={preview}
                      alt={`Preview ${displayIndex + 1}`}
                      width={200}
                      height={200}
                      className="w-full h-32 object-cover rounded-lg"
                    />

                    <div className="flex justify-center gap-2 mt-2">
                      <button
                        type="button"
                        onClick={() => moveImageUp(originalIndex)}
                        disabled={imageRanks[originalIndex] === 0}
                        className="p-1 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
                      >
                        <ArrowUp size={16} />
                      </button>

                      <button
                        type="button"
                        onClick={() => moveImageDown(originalIndex)}
                        disabled={
                          imageRanks[originalIndex] === imageRanks.length - 1
                        }
                        className="p-1 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
                      >
                        <ArrowDown size={16} />
                      </button>

                      <button
                        type="button"
                        onClick={() => removeImage(originalIndex)}
                        className="p-1 bg-red-500 text-white rounded hover:bg-red-600"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  </div>
                )
              )}
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
