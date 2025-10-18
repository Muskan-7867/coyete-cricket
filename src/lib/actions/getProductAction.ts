"use server";
import Product from "@/models/Product";
import connectDB from "../db";
import Category from "@/models/Category";
import SubCategory from "@/models/SubCategory";

export async function getProductsByCategory(categoryId: string) {
  try {
    await connectDB();

    if (!categoryId) {
      throw new Error("Category ID is required");
    }

    const products = await Product.find({ category: categoryId })
      .sort({ createdAt: -1 })
      .lean();

    // ✅ Convert to plain serializable objects
    const plainProducts = JSON.parse(JSON.stringify(products));

    return { success: true, products: plainProducts };
  } catch (error) {
    console.error("Error fetching products by category:", error);
    return {
      success: false,
      message: error instanceof Error ? error.message : "Server error",
      products: []
    };
  }
}

export async function getProductsByCategoryName(categoryName: string) {
  try {
    await connectDB();

    if (!categoryName) {
      throw new Error("Category name is required");
    }

    console.log("Searching for category with name/slug:", categoryName);

    // Decode URL-encoded characters and handle spaces/dashes
    const decodedName = decodeURIComponent(categoryName);

    // First, find the category by name or slug (case insensitive)
    const category = await Category.findOne({
      $or: [
        { name: { $regex: new RegExp(`^${decodedName}$`, "i") } },
        { slug: { $regex: new RegExp(`^${decodedName}$`, "i") } }
      ]
    });

    console.log("Found category:", category);

    if (!category) {
      // Let's see what categories actually exist in the database
      const allCategories = await Category.find({}).select("name slug").lean();
      console.log("Available categories in DB:", allCategories);
      throw new Error(
        `Category "${decodedName}" not found. Available categories: ${allCategories
          .map((c) => c.name)
          .join(", ")}`
      );
    }

    // Then find products by category ID
    const products = await Product.find({ category: category._id })
      .sort({ createdAt: -1 })
      .lean();

    console.log(
      `Found ${products.length} products for category ${category.name}`
    );

    // ✅ Convert to plain serializable objects
    const plainProducts = JSON.parse(JSON.stringify(products));

    return {
      success: true,
      products: plainProducts,
      categoryName: category.name
    };
  } catch (error) {
    console.error("Error fetching products by category name:", error);
    return {
      success: false,
      message: error instanceof Error ? error.message : "Server error",
      products: []
    };
  }
}

export async function getSingleProduct(id: string) {
  await connectDB();
  try {
    const product = await Product.findById(id).lean();
    if (!product) return { success: false, message: "Product not found" };
    const plainProduct = JSON.parse(JSON.stringify(product));
    return { success: true, product: plainProduct }; // Fixed: changed plainProduct to product
  } catch (error) {
    console.error("Error fetching product:", error);
    return { success: false, message: "Server error" };
  }
}

export async function getProductBySlug(slug: string) {
  try {
    await connectDB();

    if (!slug) {
      return { success: false, message: "Slug is required" };
    }

    const product = await Product.findOne({ slug }).lean();

    if (!product) {
      return { success: false, message: "Product not found" };
    }

    const plainProduct = JSON.parse(JSON.stringify(product));
    return { success: true, product: plainProduct };
  } catch (error) {
    console.error("Error fetching product by slug:", error);
    return {
      success: false,
      message: error instanceof Error ? error.message : "Server error"
    };
  }
}


