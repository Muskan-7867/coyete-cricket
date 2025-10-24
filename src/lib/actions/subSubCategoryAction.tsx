"use server";

import { revalidatePath } from "next/cache";
import SubSubCategory from "@/models/SubSubCategory";
import connectDB from "../db";
import SubCategory from "@/models/SubCategory";

// lib/actions/subSubCategoryAction.ts
export async function createSubSubCategory({
  name,
  rank,
  parentSubcategoryId
}: any) {
  try {
    await connectDB();

    // 1️⃣ Create new SubSubCategory
    const newSubSubCategory = await SubSubCategory.create({
      name,
      rank,
      parentSubcategory: parentSubcategoryId
    });

    // 2️⃣ Push into parent SubCategory
    await SubCategory.findByIdAndUpdate(parentSubcategoryId, {
      $push: { subsubcategories: newSubSubCategory._id }
    });

    revalidatePath("/admin/categories"); // optional if you’re using ISR
    return { success: true, subsubcategory: newSubSubCategory };
  } catch (error) {
    console.error("Error creating sub-subcategory:", error);
    return { success: false, error: "Failed to create sub-subcategory" };
  }
}

export async function updateSubSubCategory(
  id: string,
  formData: {
    name: string;
    rank: number;
  }
) {
  try {
    await connectDB();

    const { name, rank } = formData;

    const subSubCategory = await SubSubCategory.findByIdAndUpdate(
      id,
      {
        name,
        rank: rank || 0
      },
      { new: true }
    );

    if (!subSubCategory) {
      return {
        success: false,
        error: "Sub-subcategory not found"
      };
    }

    revalidatePath("/admin/categories");
    return {
      success: true,
      message: "Sub-subcategory updated successfully",
      subSubCategory
    };
  } catch (error) {
    console.error("Error updating sub-subcategory:", error);
    return {
      success: false,
      error: "Failed to update sub-subcategory"
    };
  }
}

export async function deleteSubSubCategory(id: string) {
  try {
    await connectDB();

    const subSubCategory = await SubSubCategory.findById(id);
    if (!subSubCategory) {
      return {
        success: false,
        error: "Sub-subcategory not found"
      };
    }

    // Check if there are products under this sub-subcategory
    if (subSubCategory.products.length > 0) {
      return {
        success: false,
        error: "Cannot delete sub-subcategory with existing products"
      };
    }

    await SubSubCategory.findByIdAndDelete(id);

    revalidatePath("/admin/categories");
    return {
      success: true,
      message: "Sub-subcategory deleted successfully"
    };
  } catch (error) {
    console.error("Error deleting sub-subcategory:", error);
    return {
      success: false,
      error: "Failed to delete sub-subcategory"
    };
  }
}
