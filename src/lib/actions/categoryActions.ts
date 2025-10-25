"use server";

import { revalidatePath } from "next/cache";
import connectDB from "@/lib/db";
import Category from "@/models/Category";
import SubCategory from "@/models/SubCategory";
import { SubCategoryT } from "@/types";

// Fixed populateSubcategories function
export async function populateSubcategories(
  subcategories: SubCategoryT[],
  depth = 3 // Reduced from 5 to 3 to prevent excessive recursion
) {
  if (depth <= 0) return subcategories;

  try {
    const populated = await SubCategory.populate(subcategories, {
      path: "subcategories"
    });

    // Sort at each level
    populated.sort((a: any, b: any) => (a.rank || 0) - (b.rank || 0));

    // Recursively populate nested subcategories
    for (const subcat of populated) {
      if (subcat.subcategories && subcat.subcategories.length > 0) {
        subcat.subcategories = await populateSubcategories(
          subcat.subcategories as SubCategoryT[],
          depth - 1
        );
      }
    }

    return populated;
  } catch (error) {
    console.error("Error populating subcategories:", error);
    return subcategories; // Return original if population fails
  }
}

// Fixed getAllCategories function
export async function getAllCategories() {
  try {
    await connectDB();

    const categories = await Category.find()
      .populate({
        path: "subcategories",
        options: { sort: { rank: 1, createdAt: -1 } }
      })
      .sort({ rank: 1, createdAt: -1 })
      .lean(); // Use lean() for better performance

    // Populate nested subcategories for each category
    const populatedCategories = [];
    for (const category of categories) {
      const populatedCategory = { ...category };

      if (category.subcategories?.length > 0) {
        populatedCategory.subcategories = await populateSubcategories(
          category.subcategories as SubCategoryT[]
        );
      }

      populatedCategories.push(populatedCategory);
    }

    return JSON.parse(JSON.stringify(populatedCategories));
  } catch (error) {
    console.error("Error fetching categories:", error);
    throw new Error("Failed to fetch categories");
  }
}

// Alternative simplified version if you're still having issues:
export async function getAllCategoriesSimplified() {
  try {
    await connectDB();

    // Get categories with only first level subcategories
    const categories = await Category.find()
      .populate({
        path: "subcategories",
        options: { sort: { rank: 1 } }
      })
      .sort({ rank: 1 })
      .lean();

    return JSON.parse(JSON.stringify(categories));
  } catch (error) {
    console.error("Error fetching categories:", error);
    throw new Error("Failed to fetch categories");
  }
}

// ---------------------------------------------------------
// ✅ POST: Create a new category
// ---------------------------------------------------------
export async function createCategory(formData: FormData) {
  try {
    await connectDB();

    const name = formData.get("name") as string;
    const description = (formData.get("description") as string) || "";
    const rank = Number(formData.get("rank")) || 0;

    if (!name || name.trim() === "") {
      return { success: false, error: "Category name is required" };
    }

    const existing = await Category.findOne({ name: name.trim() });
    if (existing) {
      return {
        success: false,
        error: "Category with this name already exists"
      };
    }

    const category = new Category({
      name: name.trim(),
      description: description.trim(),
      rank,
      subcategories: []
    });

    await category.save();
    revalidatePath("/admin/categories");

    return {
      success: true,
      message: "Category created successfully",
      category: JSON.parse(JSON.stringify(category))
    };
  } catch (error) {
    console.error("Error creating category:", error);
    return { success: false, error: "Failed to create category" };
  }
}

// ---------------------------------------------------------
// ✅ PUT: Update an existing category
// ---------------------------------------------------------
export async function updateCategory(formData: FormData) {
  try {
    await connectDB();

    const id = formData.get("id") as string;
    const name = formData.get("name") as string;
    const description = (formData.get("description") as string) || "";
    const rank = Number(formData.get("rank")) || 0;

    if (!id) return { success: false, error: "Category ID is required" };
    if (!name || name.trim() === "")
      return { success: false, error: "Category name is required" };

    const category = await Category.findByIdAndUpdate(
      id,
      {
        name: name.trim(),
        description: description.trim(),
        rank
      },
      { new: true, runValidators: true }
    );

    if (!category) {
      return { success: false, error: "Category not found" };
    }

    revalidatePath("/admin/categories");

    return {
      success: true,
      message: "Category updated successfully",
      category: JSON.parse(JSON.stringify(category))
    };
  } catch (error) {
    console.error("Error updating category:", error);
    return { success: false, error: "Failed to update category" };
  }
}

// ---------------------------------------------------------
// ✅ DELETE: Delete category by ID
// ---------------------------------------------------------
export async function deleteCategory(id: string) {
  try {
    await connectDB();

    const category = await Category.findByIdAndDelete(id);

    if (!category) {
      return { success: false, error: "Category not found" };
    }

    revalidatePath("/admin/categories");

    return { success: true, message: "Category deleted successfully" };
  } catch (error) {
    console.error("Error deleting category:", error);
    return { success: false, error: "Failed to delete category" };
  }
}

export async function getCategoryById(id: string) {
  try {
    await connectDB();

    const category = await Category.findById(id).lean();

    if (!category) {
      return { success: false, message: "Category not found" };
    }

    const plainCategory = JSON.parse(JSON.stringify(category));

    return { success: true, category: plainCategory };
  } catch (error) {
    console.error("Error fetching category:", error);
    return {
      success: false,
      message: error instanceof Error ? error.message : "Server error"
    };
  }
}

// lib/actions/getCategories.ts
export async function getCategoryIdByName(categoryName: string) {
  try {
    await connectDB();

    const category = await Category.findOne({
      name: { $regex: new RegExp(`^${categoryName}$`, "i") }
    })
      .select("_id")
      .lean();

    return category?._id?.toString() || "";
  } catch (error) {
    console.error("Error fetching category ID:", error);
    return "";
  }
}
