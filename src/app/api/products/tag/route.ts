import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Product from "@/models/Product";


export async function GET(req: Request) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const tagsParam = searchParams.get("tags");

    if (!tagsParam) {
      return NextResponse.json(
        { success: false, message: "No tags provided" },
        { status: 400 }
      );
    }

    // 🧠 Split comma-separated tags and trim spaces
    const tags = tagsParam.split(",").map(tag => tag.trim()).filter(Boolean);

    // 🎯 Fetch products that have ANY of the given tags
    const products = await Product.find({ tags: { $in: tags } })
      .lean()
      .sort({ createdAt: -1 }); // newest first

    return NextResponse.json({
      success: true,
      count: products.length,
      products,
    });
  } catch (error) {
    console.error("Error fetching tag-based products:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch products by tags" },
      { status: 500 }
    );
  }
}
