"use client";
import { useState, useEffect } from "react";
import {
  Edit,
  Trash2,
  ChevronDown,
  ChevronRight,
  Folder,
  FolderOpen,
  ArrowLeft,
  ArrowUp,
  ArrowDown
} from "lucide-react";
import Link from "next/link";
import {
  getAllCategories,
  createCategory,
  updateCategory,
  deleteCategory
} from "@/lib/actions/categoryActions";
import {
  createSubcategory,
  deleteSubcategory,
  updateSubcategory
} from "@/lib/actions/subCategoryActions";
import { setLazyProp } from "next/dist/server/api-utils";
import toast from "react-hot-toast";

type SubCategoryT = {
  _id: string;
  name: string;
  rank: number;
  parentCategory: string;
  parentSubCategory?: string;
  subcategories?: SubCategoryT[];
};

type CategoryT = {
  _id: string;
  name: string;
  description?: string;
  rank: number;
  subcategories: SubCategoryT[];
};

export default function CategoryManagement({
  initialCategories
}: {
  initialCategories?: CategoryT[];
}) {
  const [categories, setCategories] = useState<CategoryT[]>(
    initialCategories || []
  );
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());
  const [categoryName, setCategoryName] = useState("");
  const [categoryDescription, setCategoryDescription] = useState("");
  const [subcategoryName, setSubcategoryName] = useState("");
  const [selectedParentCategory, setSelectedParentCategory] = useState("");
  const [editingCategory, setEditingCategory] = useState<CategoryT | null>(
    null
  );
  const [editingSubcategory, setEditingSubcategory] =
    useState<SubCategoryT | null>(null);
  const [selectedParentSubcategory, setSelectedParentSubcategory] =
    useState("");
  const [selectedParentSubcategoryName, setSelectedParentSubcategoryName] =
    useState("");
  const [selectedParentCategoryName, setSelectedParentCategoryName] =
    useState("");
  const [categoryRank, setCategoryRank] = useState<number>(0);
  const [subcategoryRank, setSubcategoryRank] = useState<number>(0);
  const [loading, setLoading] = useState(false);

  // Fetch categories function
  const fetchCategories = async () => {
    try {
      setLoading(true);
      const result = await getAllCategories();
      if (result.success) {
        setCategories(result.categories || []);
      } else {
        console.error("Failed to fetch categories:", result.error);
      }
    } catch (err) {
      console.error("Error fetching categories:", err);
    } finally {
      setLoading(false);
    }
  };

  // Load categories on initial render
  useEffect(() => {
    if (!initialCategories || initialCategories.length === 0) {
      fetchCategories();
    }
  }, [initialCategories]);

  const toggleItem = (id: string) => {
    const newExpanded = new Set(expandedItems);
    if (newExpanded.has(id)) newExpanded.delete(id);
    else newExpanded.add(id);
    setExpandedItems(newExpanded);
  };

  const startEditCategory = (cat: CategoryT) => {
    setEditingCategory(cat);
    setCategoryName(cat.name);
    setCategoryDescription(cat.description || "");
    setCategoryRank(cat.rank || 0);
    // Reset subcategory editing
    setEditingSubcategory(null);
    setSubcategoryName("");
    setSubcategoryRank(0);
  };

  const startEditSubcategory = (sub: SubCategoryT) => {
    setEditingSubcategory(sub);
    setSubcategoryName(sub.name);
    setSelectedParentCategory(sub.parentCategory);
    setSubcategoryRank(sub.rank || 0);
    // Reset category editing
    setEditingCategory(null);
    setCategoryName("");
    setCategoryDescription("");
    setCategoryRank(0);
  };

  const cancelEdit = () => {
    setEditingCategory(null);
    setEditingSubcategory(null);
    setCategoryName("");
    setCategoryDescription("");
    setCategoryRank(0);
    setSubcategoryName("");
    setSubcategoryRank(0);
    setSelectedParentCategory("");
    setSelectedParentSubcategory("");
    setSelectedParentSubcategoryName("");
    setSelectedParentCategoryName("");
  };

  const handleCreateCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("name", categoryName);
      formData.append("description", categoryDescription);
      formData.append("rank", categoryRank.toString());

      const result = await createCategory(formData);

      if (result.success) {
        setCategories((prev) => [
          ...prev,
          {
            _id: result.category._id,
            name: categoryName,
            description: categoryDescription,
            rank: categoryRank,
            subcategories: []
          }
        ]);
        setCategoryName("");
        setCategoryDescription("");
        setCategoryRank(0);
        await fetchCategories(); // Refresh the list
       toast.success("Category created successfully!");
      } else {
          toast.error(result.error || "Failed to create category");
      }
    } catch (err) {
      console.error(err);
      alert("Error creating category");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCategory) return;
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("id", editingCategory._id);
      formData.append("name", categoryName);
      formData.append("description", categoryDescription);
      formData.append("rank", categoryRank.toString());

      const result = await updateCategory(formData);

      if (result.success) {
        cancelEdit();
        await fetchCategories(); // Refresh the list
        toast.success("Category updated successfully!");
      } else {
        toast.error(result.error || "Failed to update category");
      }
    } catch (err) {
      console.error(err);
      toast.error("Error updating category");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCategory = async (categoryId: string) => {
    if (!confirm("Are you sure you want to delete this category?")) return;
      setCategories((prev) => prev.filter((cat) => cat._id !== categoryId));
    setLoading(true);

    try {
      const result = await deleteCategory(categoryId);

      if (result.success) {
      
        toast.success("Category deleted successfully!");
      } else {
        toast.error(result.error || "Failed to delete category");
        await fetchCategories();
      }
    } catch (err) {
      console.error(err);
      toast.error("Error deleting category");
    } finally {
      setLoading(false);
    }
  };

const handleCreateSubcategory = async (e: React.FormEvent) => {
  e.preventDefault();

  // Validation
  if (!selectedParentCategory && !selectedParentSubcategory) {
    alert("Please select a parent category");
    return;
  }

  setLoading(true);

  try {
    const payload = {
      name: subcategoryName,
      parentCategory: selectedParentCategory,
      rank: subcategoryRank,
      parentSubCategory: selectedParentSubcategory || undefined
    };

    const result = await createSubcategory(payload);

    if (result.success) {
      // Reset form
      setSubcategoryName("");
      setSubcategoryRank(0);
      setSelectedParentCategory("");
      setSelectedParentSubcategory("");
      setSelectedParentCategoryName("");
      setSelectedParentSubcategoryName("");
      
      // Refresh the categories list
      await fetchCategories();
      
      alert(result.message || "Subcategory created successfully!");
    } else {
      alert(result.error || "Failed to create subcategory");
    }
  } catch (err) {
    console.error(err);
    alert("Error creating subcategory");
  } finally {
    setLoading(false);
  }
};

  const handleUpdateSubcategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingSubcategory) return;
    setLoading(true);

    try {
      const payload = {
        name: subcategoryName,
        parentCategory: selectedParentCategory,
        rank: subcategoryRank,
        parentSubCategory: editingSubcategory.parentSubCategory // Preserve existing parent subcategory
      };

      const result = await updateSubcategory(editingSubcategory._id, payload);

      if (result.success) {
        cancelEdit();
        await fetchCategories(); // Refresh the list
        alert(result.message || "Subcategory updated successfully!");
      } else {
        alert(result.error || "Failed to update subcategory");
      }
    } catch (err) {
      console.error(err);
      alert("Error updating subcategory");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteSubcategory = async (subcategoryId: string) => {
    if (!confirm("Are you sure you want to delete this subcategory?")) return;
    setLoading(true);
    setCategories((prevCategories) => {
    const removeSubcategory = (subs: SubCategoryT[]): SubCategoryT[] =>
      subs.filter((sub) => {
        if (sub._id === subcategoryId) return false;
        if (sub.subcategories) sub.subcategories = removeSubcategory(sub.subcategories);
        return true;
      });

    return prevCategories.map((cat) => ({
      ...cat,
      subcategories: removeSubcategory(cat.subcategories)
    }));
  });


    try {
      const result = await deleteSubcategory(subcategoryId);

      if (result.success) {
        toast.success("Subcategory deleted successfully!");
      } else {
        toast.error(result.error || "Failed to delete subcategory");
        await fetchCategories();

      }
    } catch (err) {
      console.error(err);
      toast.error("Error deleting subcategory");
    } finally {
      setLoading(false);
    }
  };

  const updateCategoryRank = async (categoryId: string, newRank: number) => {
    try {
      const currentCategory = categories.find((cat) => cat._id === categoryId);
      if (!currentCategory) return;

      const formData = new FormData();
      formData.append("id", categoryId);
      formData.append("name", currentCategory.name);
      formData.append("description", currentCategory.description || "");
      formData.append("rank", newRank.toString());

      const result = await updateCategory(formData);

      if (result.success) {
        await fetchCategories();
      } else {
        toast.error(result.error || "Failed to update category rank");
      }
    } catch (err) {
      console.error(err);
      toast.error("Error updating category rank");
    }
  };

  const updateSubcategoryRank = async (
    subcategoryId: string,
    newRank: number
  ) => {
    try {
      const currentSub = findSubcategoryById(subcategoryId, categories);
      if (!currentSub) return alert("Subcategory not found");

      const payload = {
        name: currentSub.name,
        parentCategory: currentSub.parentCategory,
        rank: newRank,
        parentSubCategory: currentSub.parentSubCategory || undefined
      };

      const result = await updateSubcategory(subcategoryId, payload);

      if (result.success) {
        await fetchCategories();
      } else {
        toast.error(result.error || "Failed to update subcategory rank");
      }
    } catch (err) {
      console.error(err);
      toast.error("Error updating subcategory rank");
    }
  };

  const moveCategoryUp = (category: CategoryT) => {
    const currentRank = category.rank || 0;
    const newRank = Math.max(0, currentRank - 1); // Ensure rank doesn't go below 0
    updateCategoryRank(category._id, newRank);
  };

  const moveCategoryDown = (category: CategoryT) => {
    const currentRank = category.rank || 0;
    const newRank = currentRank + 1;
    updateCategoryRank(category._id, newRank);
  };

  // Helper function to find subcategory by ID
  const findSubcategoryById = (
    subcategoryId: string,
    categories: CategoryT[]
  ): SubCategoryT | null => {
    for (const category of categories) {
      // Check top-level subcategories
      const topLevelSub = category.subcategories?.find(
        (sub) => sub._id === subcategoryId
      );
      if (topLevelSub) return topLevelSub;

      // Check nested subcategories recursively
      const nestedSub = findNestedSubcategoryById(
        subcategoryId,
        category.subcategories || []
      );
      if (nestedSub) return nestedSub;
    }
    return null;
  };

  // Recursive helper to find nested subcategory by ID
  const findNestedSubcategoryById = (
    subcategoryId: string,
    subcategories: SubCategoryT[]
  ): SubCategoryT | null => {
    for (const subcategory of subcategories) {
      if (subcategory._id === subcategoryId) return subcategory;
      if (subcategory.subcategories && subcategory.subcategories.length > 0) {
        const result = findNestedSubcategoryById(
          subcategoryId,
          subcategory.subcategories
        );
        if (result) return result;
      }
    }
    return null;
  };

  // Helper function to find subcategory siblings for movement
  const findSubcategorySiblings = (
    subcategoryId: string,
    categories: CategoryT[]
  ): { siblings: SubCategoryT[]; parentId: string; level: string } | null => {
    for (const category of categories) {
      // Check top-level subcategories
      const topLevelIndex = category.subcategories?.findIndex(
        (sub) => sub._id === subcategoryId
      );
      if (topLevelIndex !== -1 && topLevelIndex !== undefined) {
        return {
          siblings: category.subcategories || [],
          parentId: category._id,
          level: "category"
        };
      }

      // Check nested subcategories recursively
      if (category.subcategories) {
        const result = findNestedSubcategorySiblings(
          subcategoryId,
          category.subcategories
        );
        if (result) {
          return result;
        }
      }
    }
    return null;
  };

  // Recursive helper to find nested subcategory siblings
  const findNestedSubcategorySiblings = (
    subcategoryId: string,
    subcategories: SubCategoryT[]
  ): { siblings: SubCategoryT[]; parentId: string; level: string } | null => {
    for (const subcategory of subcategories) {
      if (subcategory.subcategories && subcategory.subcategories.length > 0) {
        const nestedIndex = subcategory.subcategories.findIndex(
          (sub) => sub._id === subcategoryId
        );
        if (nestedIndex !== -1) {
          return {
            siblings: subcategory.subcategories,
            parentId: subcategory._id,
            level: "subcategory"
          };
        }

        const result = findNestedSubcategorySiblings(
          subcategoryId,
          subcategory.subcategories
        );
        if (result) {
          return result;
        }
      }
    }
    return null;
  };

  const moveSubcategoryUp = (subcategory: SubCategoryT) => {
    const result = findSubcategorySiblings(subcategory._id, categories);
    if (!result) return;

    const { siblings } = result;
    const currentIndex = siblings.findIndex(
      (sub) => sub._id === subcategory._id
    );

    if (currentIndex > 0) {
      const currentRank = subcategory.rank || 0;
      const targetSubcategory = siblings[currentIndex - 1];
      const targetRank = targetSubcategory.rank || 0;

      // Swap ranks
      updateSubcategoryRank(subcategory._id, targetRank);
      updateSubcategoryRank(targetSubcategory._id, currentRank);
    }
  };

  const moveSubcategoryDown = (subcategory: SubCategoryT) => {
    const result = findSubcategorySiblings(subcategory._id, categories);
    if (!result) return;

    const { siblings } = result;
    const currentIndex = siblings.findIndex(
      (sub) => sub._id === subcategory._id
    );

    if (currentIndex < siblings.length - 1) {
      const currentRank = subcategory.rank || 0;
      const targetSubcategory = siblings[currentIndex + 1];
      const targetRank = targetSubcategory.rank || 0;

      // Swap ranks
      updateSubcategoryRank(subcategory._id, targetRank);
      updateSubcategoryRank(targetSubcategory._id, currentRank);
    }
  };

  // Helper function to find category name by ID
  const getCategoryNameById = (categoryId: string): string => {
    const category = categories.find((cat) => cat._id === categoryId);
    return category ? category.name : "Unknown Category";
  };

  // Helper function to check if subcategory can move up/down
  const canSubcategoryMove = (
    subcategory: SubCategoryT,
    direction: "up" | "down"
  ): boolean => {
    const result = findSubcategorySiblings(subcategory._id, categories);
    if (!result) return false;

    const { siblings } = result;
    const currentIndex = siblings.findIndex(
      (sub) => sub._id === subcategory._id
    );

    if (direction === "up") {
      return currentIndex > 0;
    } else {
      return currentIndex < siblings.length - 1;
    }
  };

  // Recursive component to render subcategories
  const renderSubcategories = (
    subcategories: SubCategoryT[],
    level: number = 1
  ) => {
    const sortedSubcategories = [...subcategories].sort(
      (a, b) => (a.rank || 0) - (b.rank || 0)
    );

    return sortedSubcategories.map((sub) => (
      <div key={sub._id}>
        {/* Subcategory Item */}
        <div
          className="flex items-center justify-between border-b border-gray-100"
          style={{ paddingLeft: `${level * 24}px` }}
        >
          <div className="flex items-center space-x-2 flex-1 py-3">
            {sub.subcategories && sub.subcategories.length > 0 ? (
              <button
                onClick={() => toggleItem(sub._id)}
                className="p-1 hover:bg-gray-100 rounded"
              >
                {expandedItems.has(sub._id) ? (
                  <ChevronDown size={12} />
                ) : (
                  <ChevronRight size={12} />
                )}
              </button>
            ) : (
              <div className="w-3" /> // Spacer for alignment when no children
            )}

            {expandedItems.has(sub._id) ? (
              <FolderOpen size={14} className="text-main" />
            ) : (
              <Folder size={14} className="text-main" />
            )}

            <span
              className={
                sub.subcategories && sub.subcategories.length > 0
                  ? "font-medium"
                  : ""
              }
            >
              {sub.name}
            </span>

            {sub.subcategories && sub.subcategories.length > 0 && (
              <span className="text-xs text-gray-500">
                ({sub.subcategories.length})
              </span>
            )}
            <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
              Rank: {sub.rank || 0}
            </span>
          </div>

          <div className="flex space-x-2">
            <div className="flex items-center space-x-1">
              <button
                onClick={() => moveSubcategoryUp(sub)}
                disabled={!canSubcategoryMove(sub, "up")}
                className={`p-1 rounded ${
                  !canSubcategoryMove(sub, "up")
                    ? "text-gray-300 cursor-not-allowed"
                    : "hover:bg-gray-200 text-gray-600"
                }`}
              >
                <ArrowUp size={12} />
              </button>
              <button
                onClick={() => moveSubcategoryDown(sub)}
                disabled={!canSubcategoryMove(sub, "down")}
                className={`p-1 rounded ${
                  !canSubcategoryMove(sub, "down")
                    ? "text-gray-300 cursor-not-allowed"
                    : "hover:bg-gray-200 text-gray-600"
                }`}
              >
                <ArrowDown size={12} />
              </button>
            </div>
            <button
              onClick={() => startEditSubcategory(sub)}
              className="p-1 hover:bg-gray-100 rounded"
            >
              <Edit size={12} />
            </button>
            <button
              onClick={() => handleDeleteSubcategory(sub._id)}
              className="p-1 hover:bg-gray-100 rounded text-red-600"
            >
              <Trash2 size={12} />
            </button>
            <button
              onClick={() => {
                setSelectedParentCategory(sub.parentCategory);
                setSelectedParentSubcategory(sub._id);
                setSelectedParentSubcategoryName(sub.name);
                setSelectedParentCategoryName(
                  getCategoryNameById(sub.parentCategory)
                );
                setSubcategoryName("");
                // Reset editing states
                setEditingCategory(null);
                setEditingSubcategory(null);
              }}
              className="text-xs bg-gray-200 hover:bg-gray-300 px-2 py-1 rounded mx-4"
            >
              Add Child
            </button>
          </div>
        </div>

        {/* Recursive render child subcategories */}
        {expandedItems.has(sub._id) &&
          sub.subcategories &&
          sub.subcategories.length > 0 && (
            <div>{renderSubcategories(sub.subcategories, level + 1)}</div>
          )}
      </div>
    ));
  };

  // Add this useEffect to debug state changes
  useEffect(() => {
    console.log("Categories updated:", categories);
  }, [categories]);

  // Sort categories by rank
  const sortedCategories = [...categories].sort(
    (a, b) => (a.rank || 0) - (b.rank || 0)
  );

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <Link
        href="/admin/products"
        className="inline-flex items-center text-main hover:text-main/80 font-medium mb-4"
      >
        <ArrowLeft className="mr-2" size={16} />
        Back to Products
      </Link>

      <h1 className="text-3xl font-bold mb-2">Category Management</h1>
      <p className="text-gray-600 mb-8">
        Manage your product categories and subcategories
      </p>

      {loading && (
        <div className="fixed inset-0  bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-4 rounded-lg">
            <p>Loading...</p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Category list */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold">
              Categories & Subcategories
            </h2>
          </div>
          <div className="p-6 space-y-2">
            {sortedCategories.map((cat) => (
              <div key={cat._id} className="border border-gray-200 rounded-lg">
                <div className="flex items-center justify-between p-4 bg-gray-50">
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => toggleItem(cat._id)}
                      className="p-1 hover:bg-gray-200 rounded"
                    >
                      {expandedItems.has(cat._id) ? (
                        <ChevronDown size={16} />
                      ) : (
                        <ChevronRight size={16} />
                      )}
                    </button>
                    {expandedItems.has(cat._id) ? (
                      <FolderOpen size={16} className="text-main" />
                    ) : (
                      <Folder size={16} className="text-main" />
                    )}
                    <span className="font-medium">{cat.name}</span>
                    <span className="text-sm text-gray-500">
                      ({cat.subcategories?.length || 0})
                    </span>
                    <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                      Rank: {cat.rank || 0}
                    </span>
                  </div>
                  <div className="flex space-x-2">
                    <div className="flex items-center space-x-1">
                      <button
                        onClick={() => moveCategoryUp(cat)}
                        disabled={cat.rank === 0}
                        className={`p-1 rounded ${
                          cat.rank === 0
                            ? "text-gray-300 cursor-not-allowed"
                            : "hover:bg-gray-200 text-gray-600"
                        }`}
                      >
                        <ArrowUp size={14} />
                      </button>
                      <button
                        onClick={() => moveCategoryDown(cat)}
                        className="p-1 rounded hover:bg-gray-200 text-gray-600"
                      >
                        <ArrowDown size={14} />
                      </button>
                    </div>
                    <button
                      onClick={() => startEditCategory(cat)}
                      className="p-1 hover:bg-gray-200 rounded"
                    >
                      <Edit size={14} />
                    </button>
                    <button
                      onClick={() => handleDeleteCategory(cat._id)}
                      className="p-1 hover:bg-gray-200 rounded text-red-600"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>

                {/* Expanded category content */}
                {expandedItems.has(cat._id) && (
                  <div className="border-t border-gray-200">
                    {!cat.subcategories || cat.subcategories.length === 0 ? (
                      <div className="p-4 text-center text-gray-500">
                        No subcategories
                      </div>
                    ) : (
                      renderSubcategories(cat.subcategories, 1)
                    )}
                  </div>
                )}
              </div>
            ))}

            {categories.length === 0 && !loading && (
              <div className="text-center py-8 text-gray-500">
                No categories found. Create your first category!
              </div>
            )}
          </div>
        </div>

        {/* Forms */}
        <div className="space-y-6">
          {/* Category Form */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold mb-4">
              {editingCategory ? "Update Category" : "Add New Category"}
            </h2>
            <form
              onSubmit={
                editingCategory ? handleUpdateCategory : handleCreateCategory
              }
            >
              <input
                type="text"
                value={categoryName}
                onChange={(e) => setCategoryName(e.target.value)}
                placeholder="Category Name"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-main focus:border-transparent"
                required
                disabled={loading}
              />
              <textarea
                value={categoryDescription}
                onChange={(e) => setCategoryDescription(e.target.value)}
                placeholder="Category Description (Optional)"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-main focus:border-transparent"
                rows={3}
                disabled={loading}
              />
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Rank (Lower numbers show first)
                </label>
                <input
                  type="number"
                  value={categoryRank}
                  onChange={(e) =>
                    setCategoryRank(parseInt(e.target.value) || 0)
                  }
                  placeholder="0"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-main focus:border-transparent"
                  min="0"
                  disabled={loading}
                />
              </div>
              <div className="flex space-x-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-main text-white py-3 rounded-lg hover:bg-main/90 transition-colors disabled:opacity-50"
                >
                  {loading
                    ? "Processing..."
                    : editingCategory
                    ? "Update"
                    : "Add"}{" "}
                  Category
                </button>
                {editingCategory && (
                  <button
                    type="button"
                    onClick={cancelEdit}
                    disabled={loading}
                    className="px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </form>
          </div>

          {/* Subcategory Form */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold mb-4">
              {editingSubcategory
                ? "Update Subcategory"
                : "Add New Subcategory"}
            </h2>

            <form
              onSubmit={
                editingSubcategory
                  ? handleUpdateSubcategory
                  : handleCreateSubcategory
              }
            >
              {/* Show parent info when adding to a subcategory */}
              {selectedParentSubcategoryName && (
                <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-sm text-blue-800">
                    <strong>Adding to:</strong> {selectedParentSubcategoryName}
                  </p>
                  <p className="text-sm text-blue-800 mt-1">
                    <strong>Parent Category:</strong>{" "}
                    {selectedParentCategoryName}
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedParentSubcategory("");
                      setSelectedParentSubcategoryName("");
                      setSelectedParentCategoryName("");
                    }}
                    className="text-xs text-blue-600 hover:text-blue-800 mt-2"
                    disabled={loading}
                  >
                    Change parent
                  </button>
                </div>
              )}

              {/* Only show category dropdown when not adding to a specific subcategory and not editing */}
              {!selectedParentSubcategoryName && !editingSubcategory && (
                <select
                  value={selectedParentCategory}
                  onChange={(e) => {
                    setSelectedParentCategory(e.target.value);
                    setSelectedParentSubcategory("");
                    setSelectedParentSubcategoryName("");
                  }}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-main focus:border-transparent"
                  required
                  disabled={loading}
                >
                  <option value="">Select Parent Category</option>
                  {categories.map((cat) => (
                    <option key={cat._id} value={cat._id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              )}

              {/* Show parent category info when editing */}
              {editingSubcategory && (
                <div className="mb-4 p-3 bg-gray-50 border border-gray-200 rounded-lg">
                  <p className="text-sm text-gray-800">
                    <strong>Parent Category:</strong>{" "}
                    {getCategoryNameById(editingSubcategory.parentCategory)}
                  </p>
                  <p className="text-xs text-gray-600 mt-1">
                    Parent category cannot be changed when editing
                  </p>
                </div>
              )}

              <input
                type="text"
                value={subcategoryName}
                onChange={(e) => setSubcategoryName(e.target.value)}
                placeholder={
                  selectedParentSubcategoryName
                    ? `Enter subcategory name for ${selectedParentSubcategoryName}`
                    : "Subcategory Name"
                }
                className="w-full px-4 py-3 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-main focus:border-transparent"
                required
                disabled={loading}
              />

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Rank (Lower numbers show first)
                </label>
                <input
                  type="number"
                  value={subcategoryRank}
                  onChange={(e) =>
                    setSubcategoryRank(parseInt(e.target.value) || 0)
                  }
                  placeholder="0"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-main focus:border-transparent"
                  min="0"
                  disabled={loading}
                />
              </div>

              <div className="flex space-x-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-main text-white py-3 rounded-lg hover:bg-main/90 transition-colors disabled:opacity-50"
                >
                  {loading
                    ? "Processing..."
                    : editingSubcategory
                    ? "Update"
                    : selectedParentSubcategoryName
                    ? "Add Nested Subcategory"
                    : "Add Subcategory"}
                </button>
                {(editingSubcategory || selectedParentSubcategoryName) && (
                  <button
                    type="button"
                    onClick={() => {
                      cancelEdit();
                    }}
                    disabled={loading}
                    className="px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
