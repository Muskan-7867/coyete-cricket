"use server";
import Category from "@/models/Category";
import SubCategory from "@/models/SubCategory";
import Product from "@/models/Product";
import connectDB from "../db";

interface ProductsResponse {
  success: boolean;
  message?: string;
  products: any[];
  categoryInfo?: {
    type: "category" | "subcategory" | "sub-subcategory";
    name: string;
    parent?: string;
    hierarchy?: string[];
  };
}

export async function getProductsByAnyCategoryLevel(
  name: string
): Promise<ProductsResponse> {
  try {
    await connectDB();

    if (!name) {
      throw new Error("Category path is required");
    }

    const decodedName = decodeURIComponent(name).trim();
    console.log("Processing category path:", decodedName);

    // Split the path by slashes and clean up
    const pathSegments = decodedName
      .split("/")
      .map((segment) => segment.trim())
      .filter((segment) => segment !== "");

    if (pathSegments.length === 0) {
      throw new Error("Invalid category path");
    }

    console.log("Path segments:", pathSegments);

    let products = [];
    let categoryInfo = null;

    /* ------------------- Handle Hierarchical Path ------------------- */
    if (pathSegments.length >= 2) {
      const categoryName = pathSegments[0];
      const subCategoryName = pathSegments[1];
      const subSubCategoryName = pathSegments[2];

      console.log(
        `Looking for category: "${categoryName}", subcategory: "${subCategoryName}"${
          subSubCategoryName ? `, sub-subcategory: "${subSubCategoryName}"` : ""
        }`
      );

      // Find main category
      const category = await Category.findOne({
        $or: [
          { name: { $regex: new RegExp(`^${categoryName}$`, "i") } },
          { slug: { $regex: new RegExp(`^${categoryName}$`, "i") } }
        ]
      }).lean();

      if (!category) {
        throw new Error(`Main category not found: ${categoryName}`);
      }

      console.log("Found main category:", category.name);

      // Find subcategory
      const subCategory = await SubCategory.findOne({
        $or: [
          { name: { $regex: new RegExp(`^${subCategoryName}$`, "i") } },
          { slug: { $regex: new RegExp(`^${subCategoryName}$`, "i") } }
        ],
        parentCategory: category._id
      }).lean();

      if (!subCategory) {
        throw new Error(
          `Subcategory "${subCategoryName}" not found under category "${categoryName}"`
        );
      }

      console.log("Found subcategory:", subCategory.name);

      // Handle sub-subcategory if exists
      if (pathSegments.length >= 3 && subSubCategoryName) {
        const subSubCategory = await SubCategory.findOne({
          $or: [
            { name: { $regex: new RegExp(`^${subSubCategoryName}$`, "i") } },
            { slug: { $regex: new RegExp(`^${subSubCategoryName}$`, "i") } }
          ],
          parentCategory: category._id,
          parentSubCategory: subCategory._id
        }).lean();

        if (subSubCategory) {
          console.log("Found sub-subcategory:", subSubCategory.name);

          // Get products WITHOUT populate to avoid errors
          products = await Product.find({ subSubCategory: subSubCategory._id })
            .sort({ createdAt: -1 })
            .lean();

          categoryInfo = {
            type: "sub-subcategory",
            name: subSubCategory.name,
            parent: subCategory.name,
            hierarchy: [category.name, subCategory.name, subSubCategory.name]
          };
        } else {
          throw new Error(
            `Sub-subcategory "${subSubCategoryName}" not found under subcategory "${subCategoryName}"`
          );
        }
      } else {
        // Get products for subcategory WITHOUT populate
        products = await Product.find({ subCategory: subCategory._id })
          .sort({ createdAt: -1 })
          .lean();

        categoryInfo = {
          type: "subcategory",
          name: subCategory.name,
          parent: category.name,
          hierarchy: [category.name, subCategory.name]
        };
      }
    } else if (pathSegments.length === 1) {
    /* ------------------- Handle Single Segment (Category only) ------------------- */
      const categoryName = pathSegments[0];

      console.log(`Looking for main category: "${categoryName}"`);

      // Try to find as main category
      const category = await Category.findOne({
        $or: [
          { name: { $regex: new RegExp(`^${categoryName}$`, "i") } },
          { slug: { $regex: new RegExp(`^${categoryName}$`, "i") } }
        ]
      }).lean();

      if (category) {
        console.log("Found main category:", category.name);

        // Get ALL products under this category WITHOUT populate
        const subCategoryIds = await SubCategory.find({
          parentCategory: category._id
        }).distinct("_id");
        const subSubCategoryIds = await SubCategory.find({
          parentCategory: category._id,
          parentSubCategory: { $exists: true, $ne: null }
        }).distinct("_id");

        products = await Product.find({
          $or: [
            { category: category._id },
            { subCategory: { $in: subCategoryIds } },
            { subSubCategory: { $in: subSubCategoryIds } }
          ]
        })
          .sort({ createdAt: -1 })
          .lean();

        console.log(
          `Found ${products.length} products in category ${category.name}`
        );

        categoryInfo = {
          type: "category",
          name: category.name,
          hierarchy: [category.name]
        };
      } else {
        // Try to find as standalone subcategory
        const subCategory = await SubCategory.findOne({
          $or: [
            { name: { $regex: new RegExp(`^${categoryName}$`, "i") } },
            { slug: { $regex: new RegExp(`^${categoryName}$`, "i") } }
          ]
        }).lean();

        if (subCategory) {
          console.log("Found standalone subcategory:", subCategory.name);

          // Get parent category name
          const parentCategory = await Category.findById(
            subCategory.parentCategory
          )
            .select("name")
            .lean();
          const parentSubCategoryIds = await SubCategory.find({
            parentSubCategory: subCategory._id
          }).distinct("_id");

          // Get products WITHOUT populate
          products = await Product.find({
            $or: [
              { subCategory: subCategory._id },
              { subSubCategory: { $in: parentSubCategoryIds } }
            ]
          })
            .sort({ createdAt: -1 })
            .lean();

          categoryInfo = {
            type: "subcategory",
            name: subCategory.name,
            parent: parentCategory?.name || "Unknown",
            hierarchy: [parentCategory?.name || "Unknown", subCategory.name]
          };
        }
      }
    }

    /* ------------------- Not Found ------------------- */
    if (!categoryInfo) {
      const allCategories = await Category.find({}).select("name slug").lean();
      const allSubCategories = await SubCategory.find({})
        .populate("parentCategory", "name")
        .select("name slug parentCategory")
        .lean();

      console.log(
        "Available categories:",
        allCategories.map((c) => c.name)
      );

      throw new Error(
        `No category or subcategory found for path "${decodedName}".\n` +
          `Available categories: ${allCategories.map((c) => c.name).join(", ")}`
      );
    }

    console.log(`Found ${products.length} products for`, categoryInfo);

    return {
      success: true,
      products: JSON.parse(JSON.stringify(products)),
      categoryInfo
    };
  } catch (error) {
    console.error("❌ Error fetching products:", error);
    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Server error while fetching products",
      products: []
    };
  }
}

// Debug function to check product fields
export async function debugProductFields() {
  try {
    await connectDB();

    const sampleProducts = await Product.find().limit(5).lean();

    console.log("=== PRODUCT FIELD ANALYSIS ===");
    const fieldAnalysis = sampleProducts.map((product, index) => {
      const fields = Object.keys(product);
      return {
        productIndex: index + 1,
        name: product.name,
        hasSubcategory: fields.includes("subcategory"),
        hasSubCategory: fields.includes("subCategory"),
        hasSubSubCategory: fields.includes("subSubCategory"),
        subcategoryValue: product.subcategory,
        subCategoryValue: product.subCategory,
        subSubCategoryValue: product.subSubCategory
      };
    });

    console.log("Field Analysis:", fieldAnalysis);

    return {
      fieldAnalysis,
      sampleProducts: JSON.parse(JSON.stringify(sampleProducts))
    };
  } catch (error) {
    console.error("Debug error:", error);
    return { error: error instanceof Error ? error.message : "Unknown error" };
  }
}
