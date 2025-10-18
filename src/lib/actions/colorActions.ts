"use server";

import connectDB from "@/lib/db";
import Color from "@/models/Color";

import { revalidatePath } from "next/cache";

/* ------------------- 🟢 CREATE ------------------- */
export async function addColorAction(formData: FormData) {
  try {
    await connectDB();

    const name = formData.get("name") as string;
    if (!name || !name.trim()) {
      return { success: false, message: "Color name is required" };
    }

    // Check for duplicate
    const existing = await Color.findOne({ name: name.trim() });
    if (existing) {
      return { success: false, message: "Color already exists" };
    }

    const newColor = await Color.create({ name: name.trim() });
    revalidatePath("/admin/colors");

    return { success: true, data: JSON.parse(JSON.stringify(newColor)) };
  } catch (error) {
    console.error("addColorAction error:", error);
    return { success: false, message: "Failed to add color" };
  }
}

/* ------------------- 🔵 READ ------------------- */
export async function getColorsAction() {
  try {
    await connectDB();
    const colors = await Color.find().sort({ name: 1 }).lean();
    return { success: true, data: JSON.parse(JSON.stringify(colors)) };
  } catch (error) {
    console.error("getColorsAction error:", error);
    return { success: false, message: "Failed to fetch colors" };
  }
}

/* ------------------- 🟠 UPDATE ------------------- */
export async function updateColorAction(formData: FormData) {
  try {
    await connectDB();

    const id = formData.get("id") as string;
    const name = formData.get("name") as string;

    if (!id || !name || !name.trim()) {
      return { success: false, message: "ID and name are required" };
    }

    const updated = await Color.findByIdAndUpdate(
      id,
      { name: name.trim() },
      { new: true }
    );

    revalidatePath("/admin/colors");

    return { success: true, data: JSON.parse(JSON.stringify(updated)) };
  } catch (error) {
    console.error("updateColorAction error:", error);
    return { success: false, message: "Failed to update color" };
  }
}

/* ------------------- 🔴 DELETE ------------------- */
export async function deleteColorAction(formData: FormData) {
  try {
    await connectDB();

    const id = formData.get("id") as string;
    if (!id) return { success: false, message: "Color ID is required" };

    await Color.findByIdAndDelete(id);
    revalidatePath("/admin/colors");

    return { success: true, message: "Color deleted successfully" };
  } catch (error) {
    console.error("deleteColorAction error:", error);
    return { success: false, message: "Failed to delete color" };
  }
}


export async function getColorById(id: string) {
  try {
    await connectDB();
    const color = await Color.findById(id);
    if (!color) return { success: false, message: "Color not found" };
    return { success: true, color: JSON.parse(JSON.stringify(color)) };
  } catch (error) {
    console.error("Error fetching color:", error);
    return { success: false, message: "Server error" };
  }
}

export async function getColorsByIds(ids: string[]) {
  try {
    await connectDB();
    const colors = await Color.find({ _id: { $in: ids } });
       return { success: true, colors: JSON.parse(JSON.stringify(colors)) };
  } catch (error) {
    console.error("Error fetching colors:", error);
    return { success: false, message: "Server error", colors: [] };
  }
}