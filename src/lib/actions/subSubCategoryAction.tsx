"use server";

import { revalidatePath } from "next/cache";
import SubSubCategory from "@/models/SubSubCategory"; // Your SubSubCategory model
import connectDB from "../db";

export async function createSubSubcategory(payload: {
  name: string;
  parentCategory: string;
  parentSubCategory: string;
  rank: number;
}) {
  try {
    await connectDB();

    const newSubSubcategory = new SubSubCategory({
      name: payload.name,
      parentCategory: payload.parentCategory,
      parentSubCategory: payload.parentSubCategory,
      rank: payload.rank
    });

    await newSubSubcategory.save();
    revalidatePath("/admin/categories");

    return {
      success: true,
      message: "Sub-subcategory created successfully",
      subSubcategory: newSubSubcategory
    };
  } catch (error) {
    console.error("Error creating sub-subcategory:", error);
    return {
      success: false,
      error: "Failed to create sub-subcategory"
    };
  }
}

export async function updateSubSubcategory(
  id: string,
  payload: {
    name: string;
    parentCategory: string;
    parentSubCategory: string;
    rank: number;
  }
) {
  try {
    await connectDB();

    const updatedSubSubcategory = await SubSubCategory.findByIdAndUpdate(
      id,
      {
        name: payload.name,
        rank: payload.rank
      },
      { new: true }
    );

    if (!updatedSubSubcategory) {
      return {
        success: false,
        error: "Sub-subcategory not found"
      };
    }

    revalidatePath("/admin/categories");

    return {
      success: true,
      message: "Sub-subcategory updated successfully",
      subSubcategory: updatedSubSubcategory
    };
  } catch (error) {
    console.error("Error updating sub-subcategory:", error);
    return {
      success: false,
      error: "Failed to update sub-subcategory"
    };
  }
}

export async function deleteSubSubcategory(id: string) {
  try {
    await connectDB();

    const deletedSubSubcategory = await SubSubCategory.findByIdAndDelete(id);

    if (!deletedSubSubcategory) {
      return {
        success: false,
        error: "Sub-subcategory not found"
      };
    }

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
