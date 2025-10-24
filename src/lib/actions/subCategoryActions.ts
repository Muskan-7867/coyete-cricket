"use server";

import { revalidatePath } from "next/cache";
import connectDB from "@/lib/db";
import Category from "@/models/Category";
import SubCategory from "@/models/SubCategory";

// ✅ GET - Fetch all subcategories with parent info
export async function getAllSubcategories() {
  try {
    await connectDB();

    const subcategories = await SubCategory.find()
      .populate("parentCategory")
      .populate("parentSubCategory")
      .sort({ createdAt: -1 })
      .lean();

    return { success: true, subcategories };
  } catch (error) {
    console.error("Error fetching subcategories:", error);
    return { success: false, error: "Failed to fetch subcategories" };
  }
}

// ✅ POST - Create new (regular or nested) subcategory
export async function createSubcategory(data: {
  name: string;
  parentCategory: string;
  parentSubCategory?: string | null;
  rank?: number;
}) {
  try {
    await connectDB();
    const { name, parentCategory, parentSubCategory, rank } = data;

    if (!name?.trim())
      return { success: false, error: "Subcategory name is required" };
    if (!parentCategory)
      return { success: false, error: "Parent category is required" };

    const parentCat = await Category.findById(parentCategory);
    if (!parentCat)
      return { success: false, error: "Parent category not found" };

    let parentSubCat = null;
    if (parentSubCategory) {
      parentSubCat = await SubCategory.findById(parentSubCategory);
      if (!parentSubCat)
        return { success: false, error: "Parent subcategory not found" };
    }

    const subcategory = new SubCategory({
      name: name.trim(),
      parentCategory,
      rank: rank || 0,
      parentSubCategory: parentSubCategory || null,
      subcategories: []
    });

    await subcategory.save();

    if (parentSubCategory) {
      await SubCategory.findByIdAndUpdate(parentSubCategory, {
        $push: { subcategories: subcategory._id }
      });
    } else {
      await Category.findByIdAndUpdate(parentCategory, {
        $push: { subcategories: subcategory._id }
      });
    }

    await subcategory.populate("parentCategory");
    await subcategory.populate("parentSubCategory");

    revalidatePath("/admin/subcategories");

    return {
      success: true,
      message: parentSubCategory
        ? "Nested subcategory created successfully"
        : "Subcategory created successfully",
      subcategory
    };
  } catch {
    console.error("Error creating subcategory:");

    return { success: false, error: "Failed to create subcategory" };
  }
}

// ✅ PUT - Update subcategory
export async function updateSubcategory(
  id: string,
  data: {
    name: string;
    parentCategory: string;
    rank?: number;
  }
) {
  try {
    await connectDB();

    const { name, parentCategory, rank } = data;

    if (!name?.trim())
      return { success: false, error: "Subcategory name is required" };
    if (!parentCategory)
      return { success: false, error: "Parent category is required" };

    const existingSubcategory = await SubCategory.findById(id);
    if (!existingSubcategory)
      return { success: false, error: "Subcategory not found" };

    const newParentCategory = await Category.findById(parentCategory);
    if (!newParentCategory)
      return { success: false, error: "Parent category not found" };

    const subcategory = await SubCategory.findByIdAndUpdate(
      id,
      {
        name: name.trim(),
        rank: rank || 0,
        parentCategory
      },
      { new: true, runValidators: true }
    ).populate("parentCategory");

    if (!subcategory) return { success: false, error: "Subcategory not found" };

    if (existingSubcategory.parentCategory.toString() !== parentCategory) {
      await Category.findByIdAndUpdate(existingSubcategory.parentCategory, {
        $pull: { subcategories: id }
      });
      await Category.findByIdAndUpdate(parentCategory, {
        $addToSet: { subcategories: id }
      });
    }

    revalidatePath("/admin/subcategories");
    const plainSubcategory = JSON.parse(JSON.stringify(subcategory));

    return {
      success: true,
      message: "Subcategory updated successfully",
      subcategory: plainSubcategory
    };
  } catch {
    console.error("Error updating subcategory:");

    return { success: false, error: "Failed to update subcategory" };
  }
}

// ✅ DELETE - Delete subcategory
export async function deleteSubcategory(id: string) {
  try {
    await connectDB();

    const subcategory = await SubCategory.findById(id);
    if (!subcategory) return { success: false, error: "Subcategory not found" };

    await Category.findByIdAndUpdate(subcategory.parentCategory, {
      $pull: { subcategories: id }
    });

    await SubCategory.findByIdAndDelete(id);

    revalidatePath("/admin/subcategories");

    return { success: true, message: "Subcategory deleted successfully" };
  } catch (error) {
    console.error("Error deleting subcategory:", error);
    return { success: false, error: "Failed to delete subcategory" };
  }
}

// export async function getSubcategoryById(id: string) {
//   try {
//     await connectDB();
//     const subcategory = await SubCategory.findById(id)
//       .populate("parentCategory")
//       .populate("parentSubCategory");

//     if (!subcategory)
//       return { success: false, message: "Subcategory not found" };

//     // ✅ convert to plain object
//     const plainSubcategory = JSON.parse(JSON.stringify(subcategory));

//     return { success: true, subcategory: plainSubcategory };
//   } catch (error) {
//     console.error("Error fetching subcategory:", error);
//     return { success: false, message: "Server error" };
//   }
// }

export async function getSubcategoriesByCategory(categoryId: string) {
  try {
    await connectDB();

    const subcategories = await SubCategory.find({ parentCategory: categoryId })
      .populate("parentCategory")
      .populate("parentSubCategory")
      .sort({ createdAt: -1 })
      .lean();

    return { success: true, subcategories };
  } catch (error) {
    console.error("Error fetching subcategories:", error);
    return { success: false, error: "Failed to fetch subcategories" };
  }
}

export async function getSubcategoryByName(name: string) {
  try {
    await connectDB();

    if (!name) {
      return { success: false, message: "Subcategory name is required" };
    }

    // Decode URL-encoded characters and handle spaces/dashes
    const decodedName = decodeURIComponent(name);

    // Find subcategory by name or slug (case insensitive)
    const subcategory = await SubCategory.findOne({
      $or: [
        { name: { $regex: new RegExp(`^${decodedName}$`, "i") } },
        { slug: { $regex: new RegExp(`^${decodedName}$`, "i") } }
      ]
    })
      .populate("parentCategory")
      .populate("parentSubCategory");

    if (!subcategory) {
      // Debug: log available subcategories
      const allSubcategories = await SubCategory.find({})
        .select("name slug")
        .lean();
      console.log("Available subcategories in DB:", allSubcategories);
      return {
        success: false,
        message: `Subcategory "${decodedName}" not found`
      };
    }

    // ✅ convert to plain object
    const plainSubcategory = JSON.parse(JSON.stringify(subcategory));

    return { success: true, subcategory: plainSubcategory };
  } catch (error) {
    console.error("Error fetching subcategory by name:", error);
    return { success: false, message: "Server error" };
  }
}

export async function getSubSubcategories(subCategoryId: string) {
  try {
    if (!subCategoryId) {
      return { success: false, error: "Subcategory ID is required" };
    }

    await connectDB();

    // Fetch the parent subcategory and populate its subcategories
    const parentSubCategory = await SubCategory.findById(subCategoryId)
      .populate("subcategories") // Assuming `subcategories` is an array of ObjectId
      .lean();

    if (!parentSubCategory) {
      return { success: false, error: "Parent subcategory not found" };
    }

    // Return the array of sub-subcategories
    const subSubcategories = parentSubCategory.subcategories || [];

    return { success: true, subcategories: subSubcategories };
  } catch (error) {
    console.error("Error fetching sub-subcategories:", error);
    return { success: false, error: "Failed to fetch sub-subcategories" };
  }
}
