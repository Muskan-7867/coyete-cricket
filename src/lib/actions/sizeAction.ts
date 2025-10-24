"use server";

import connectDB from "@/lib/db";
import Size from "@/models/Size";
import Category from "@/models/Category";
import { revalidatePath } from "next/cache";

/* ------------------- 🟢 CREATE ------------------- */
export async function addSizeAction(formData: FormData) {
  try {
    await connectDB();

    const name = formData.get("name") as string;
    const categoryId = formData.get("categoryId") as string;

    if (!name || !categoryId) {
      return { success: false, message: "Name and category are required" };
    }

    const category = await Category.findById(categoryId);
    if (!category) {
      return { success: false, message: "Category not found" };
    }

    const newSize = await Size.create({ name, category: categoryId });
    revalidatePath("/admin/sizes");

    return { success: true, data: JSON.parse(JSON.stringify(newSize)) };
  } catch (error) {
    console.error("addSizeAction error:", error);
    return { success: false, message: "Failed to add size" };
  }
}

/* ------------------- 🔵 READ ------------------- */
export async function getSizesAction() {
  try {
    await connectDB();
    const sizes = await Size.find().populate("category").lean();
    return { success: true, data: JSON.parse(JSON.stringify(sizes)) };
  } catch (error) {
    console.error("getSizesAction error:", error);
    return { success: false, message: "Failed to fetch sizes" };
  }
}

/* ------------------- 🟠 UPDATE ------------------- */
export async function updateSizeAction(formData: FormData) {
  try {
    await connectDB();

    const id = formData.get("id") as string;
    const name = formData.get("name") as string;
    const categoryId = formData.get("categoryId") as string;

    if (!id || !name || !categoryId) {
      return { success: false, message: "ID, name and category are required" };
    }

    const category = await Category.findById(categoryId);
    if (!category) {
      return { success: false, message: "Category not found" };
    }

    const updated = await Size.findByIdAndUpdate(
      id,
      { name, category: categoryId },
      { new: true }
    ).populate("category");

    revalidatePath("/admin/sizes");

    return { success: true, data: JSON.parse(JSON.stringify(updated)) };
  } catch (error) {
    console.error("updateSizeAction error:", error);
    return { success: false, message: "Failed to update size" };
  }
}

/* ------------------- 🔴 DELETE ------------------- */
export async function deleteSizeAction(formData: FormData) {
  try {
    await connectDB();

    const id = formData.get("id") as string;
    if (!id) return { success: false, message: "Size ID is required" };

    await Size.findByIdAndDelete(id);
    revalidatePath("/admin/sizes");

    return { success: true, message: "Size deleted successfully" };
  } catch (error) {
    console.error("deleteSizeAction error:", error);
    return { success: false, message: "Failed to delete size" };
  }
}


// export async function getSizeById(id: string) {
//   try {
//     await connectDB();

//     const size = await Size.findById(id).populate("category").lean(); // ✅ use lean() and populate

//     if (!size) {
//       return { success: false, message: "Size not found" };
//     }

//     // ✅ ensure safe serialization
//     return { success: true, size: JSON.parse(JSON.stringify(size)) }; 
//   } catch (error) {
//     console.error("Error fetching size:", error);
//     return { success: false, message: "Server error" };
//   }
// }

export async function getSizesByCategory(categoryId: string) {
  try {
    await connectDB();

    const sizes = await Size.find({ category: categoryId }).lean();

    return { success: true, sizes: JSON.parse(JSON.stringify(sizes)) };
  } catch (error) {
    console.error("Error fetching sizes by category:", error);
    return { success: false, sizes: [] };
  }
}