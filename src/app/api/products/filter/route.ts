import { NextRequest, NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import connectDB from "@/lib/db"; // Should return the db instance

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const categoryId = searchParams.get("categoryId");
    const subcategories = searchParams.get("subcategories");
    const sizes = searchParams.get("sizes");
    const colors = searchParams.get("colors");
    const qualities = searchParams.get("qualities");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");

    if (!categoryId) {
      return NextResponse.json(
        { message: "categoryId is required" },
        { status: 400 }
      );
    }

    const db = await connectDB(); // Make sure connectDB returns `db`, not void

    const filter: Record<string, any> = {
      categoryId: new ObjectId(categoryId)
    };

    if (subcategories?.length) {
      const arr = subcategories.split(",").filter(Boolean);
      if (arr.length) filter.subcategory = { $in: arr };
    }

    if (sizes?.length) {
      const arr = sizes.split(",").filter(Boolean);
      if (arr.length) filter.size = { $in: arr };
    }

    if (colors?.length) {
      const arr = colors.split(",").filter(Boolean);
      if (arr.length) filter.color = { $in: arr };
    }

    if (qualities?.length) {
      const arr = qualities.split(",").filter(Boolean);
      if (arr.length) filter.quality = { $in: arr };
    }

    const skip = (page - 1) * limit;

    const [products, totalCount] = await Promise.all([
      db.collection("products").find(filter).skip(skip).limit(limit).toArray(),
      db.collection("products").countDocuments(filter)
    ]);

    return NextResponse.json({ products, totalCount });
  } catch (error) {
    console.error("Filter API Error:", error);
    return NextResponse.json(
      { message: "Server Error", error },
      { status: 500 }
    );
  }
}
