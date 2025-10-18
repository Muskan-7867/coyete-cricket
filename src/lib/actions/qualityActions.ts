"use server";

import connectDB from "@/lib/db";
import Quality from "@/models/Quality";

import { revalidatePath } from "next/cache";

//get quality
export async function getQualitiesAction() {
  try {
    await connectDB();

    const qualities = await Quality.find().sort({ createdAt: -1 }).lean();
    return { success: true, data: JSON.parse(JSON.stringify(qualities)) };
  } catch (error) {
    console.error("Get Qualities Error:", error);
    return {
      success: false,
      message: "Failed to fetch qualities.",
      data: [],
    };
  }
}

// ADD QUALITY
export async function addQualityAction(formData: FormData) {
  try {
    await connectDB();

    const name = formData.get("name") as string;

    if (!name || !name.trim()) {
      return { success: false, message: "Name is required." };
    }

    await Quality.create({ name: name.trim() });
    revalidatePath("/admin/attributes"); // adjust path as needed

    return { success: true, message: "Quality added successfully!" };
  } catch (error) {
    console.error("Add Quality Error:", error);
    return {
      success: false,
      message:  "Failed to add quality."
    };
  }
}

// UPDATE QUALITY
export async function updateQualityAction(id: string, name: string) {
  try {
    await connectDB();

    if (!id || !name.trim()) {
      return { success: false, message: "Invalid data." };
    }

    await Quality.findByIdAndUpdate(id, { name: name.trim() });
    revalidatePath("/admin/attributes");

    return { success: true, message: "Quality updated successfully!" };
  } catch (error) {
    console.error("Update Quality Error:", error);
    return {
      success: false,
      message:  "Failed to update quality."
    };
  }
}

// DELETE QUALITY
export async function deleteQualityAction(id: string) {
  try {
    await connectDB();

    if (!id) {
      return { success: false, message: "Quality ID is required." };
    }

    await Quality.findByIdAndDelete(id);
    revalidatePath("/admin/attributes");

    return { success: true, message: "Quality deleted successfully!" };
  } catch (error) {
    console.error("Delete Quality Error:", error);
    return {
      success: false,
      message:  "Failed to delete quality."
    };
  }
}


export async function getQualityById(id: string) {
  try {
    await connectDB();
    const quality = await Quality.findById(id);
    if (!quality) return { success: false, message: "Quality not found" };
    return { success: true, quality: JSON.parse(JSON.stringify(quality)) };
  } catch (error) {
    console.error("Error fetching quality:", error);
    return { success: false, message: "Server error" };
  }
}

