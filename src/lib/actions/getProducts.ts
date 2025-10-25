"use server";
import Category from "@/models/Category";
import connectDB from "../db";
import SubCategory from "@/models/SubCategory";
import SubSubCategory from "@/models/SubSubCategory";
import Product from "@/models/Product";

// Update the Props interface
interface Props {
  categoryPath?: string;
  filters?: {
    subcategories?: string[];
    sizes?: string[];
    colors?: string[];
    qualities?: string[];
    price_min?: string;
    price_max?: string;
  };
}

// Updated server action with filters
export async function fetchProductsByCategory({
  categoryPath,
  filters
}: Props) {
  await connectDB();

  try {
    if (!categoryPath) return [];

    // Split the path into segments (your existing code)
    const categorySegments = categoryPath.split("/").map((seg) => seg.trim());
    const mainCategoryName = categorySegments[0];
    const subCategoryName = categorySegments[1];
    const subSubCategoryName = categorySegments[2];

    console.log("Searching for:", {
      mainCategoryName,
      subCategoryName,
      subSubCategoryName
    });

    // 1️⃣ Find main category
    const mainCategory = await Category.findOne({
      name: mainCategoryName
    }).lean();

    console.log("Main category found:", mainCategory?._id);
    if (!mainCategory) return [];

    const query: any = { category: mainCategory._id };

    // 2️⃣ Find subcategory if exists
    if (subCategoryName) {
      const subCategory = await SubCategory.findOne({
        name: subCategoryName,
        parentCategory: mainCategory._id
      }).lean();

      console.log("Subcategory found:", subCategory?._id);
      if (!subCategory) return [];
      query.subCategory = subCategory._id;

      // 3️⃣ Find sub-subcategory if exists
      if (subSubCategoryName) {
        const subSubCategory = await SubSubCategory.findOne({
          name: subSubCategoryName,
          parentSubCategory: subCategory._id
        }).lean();

        console.log("Sub-subcategory found:", subSubCategory?._id);
        if (!subSubCategory) return [];
        query.subSubCategory = subSubCategory._id;
      }
    }

    // 🔥 ADD FILTER LOGIC HERE
    if (filters) {
      // Subcategory filter
      if (filters.subcategories && filters.subcategories.length > 0) {
        const subCategoryDocs = await SubCategory.find({
          name: { $in: filters.subcategories }
        }).lean();

        if (subCategoryDocs.length > 0) {
          query.subCategory = { $in: subCategoryDocs.map((sc) => sc._id) };
        }
      }

      // Size filter
      if (filters.sizes && filters.sizes.length > 0) {
        query.size = { $in: filters.sizes };
      }

      // Color filter
      if (filters.colors && filters.colors.length > 0) {
        query.color = { $in: filters.colors };
      }

      // Quality filter
      if (filters.qualities && filters.qualities.length > 0) {
        query.qualityName = { $in: filters.qualities };
      }

      // Price range filter
      if (filters.price_min || filters.price_max) {
        query.price = {};
        if (filters.price_min) query.price.$gte = parseFloat(filters.price_min);
        if (filters.price_max) query.price.$lte = parseFloat(filters.price_max);
      }
    }

    console.log("Final query with filters:", query);

    // 4️⃣ Fetch products
    const products = await Product.find(query)
      .populate("category", "name")
      .populate("subCategory", "name")
      .populate("subSubCategory", "name")
      .lean();

    console.log("Products found after filtering:", products.length);

    // 5️⃣ Serialize MongoDB objects
    return products.map((p: any) => ({
      ...p,
      _id: p._id.toString(),
      category: p.category
        ? { ...p.category, _id: p.category._id.toString() }
        : null,
      subCategory: p.subCategory
        ? { ...p.subCategory, _id: p.subCategory._id.toString() }
        : null,
      subSubCategory: p.subSubCategory
        ? { ...p.subSubCategory, _id: p.subSubCategory._id.toString() }
        : null,
      createdAt: p.createdAt?.toISOString(),
      updatedAt: p.updatedAt?.toISOString()
    }));
  } catch (error) {
    console.error("❌ Error fetching products:", error);
    return [];
  }
}

// import connectDB from "../db";
// import Product from "@/models/Product";
// import Category from "@/models/Category";
// import SubCategory from "@/models/SubCategory";
// import SubSubCategory from "@/models/SubSubCategory";

// interface Props {
//   categoryPath?: string;
// }

// // Updated server action to handle both ID-based and name-based lookup
// export async function fetchProductsByCategory({ categoryPath }: Props) {
//   await connectDB();

//   try {
//     if (!categoryPath) return [];

//     // Split the path into segments
//     const categorySegments = categoryPath.split("/").map((seg) => seg.trim());
//     const mainCategoryName = categorySegments[0];
//     const subCategoryName = categorySegments[1];
//     const subSubCategoryName = categorySegments[2];

//     console.log("Searching for:", {
//       mainCategoryName,
//       subCategoryName,
//       subSubCategoryName
//     });

//     // 1️⃣ Find main category
//     const mainCategory = await Category.findOne({
//       name: mainCategoryName
//     }).lean();

//     console.log("Main category found:", mainCategory?._id);
//     if (!mainCategory) return [];

//     const query: any = { category: mainCategory._id };

//     // 2️⃣ Find subcategory if exists
//     if (subCategoryName) {
//       const subCategory = await SubCategory.findOne({
//         name: subCategoryName,
//         parentCategory: mainCategory._id
//       }).lean();

//       console.log("Subcategory found:", subCategory?._id);
//       if (!subCategory) return [];
//       query.subCategory = subCategory._id;

//       // 3️⃣ Find sub-subcategory if exists - FIXED THIS PART
//       if (subSubCategoryName) {
//         const subSubCategory = await SubSubCategory.findOne({
//           name: subSubCategoryName,
//           parentSubCategory: subCategory._id // ✅ CORRECT FIELD NAME
//         }).lean();

//         console.log("Sub-subcategory found:", subSubCategory?._id);
//         if (!subSubCategory) return [];
//         query.subSubCategory = subSubCategory._id;
//       }
//     }

//     console.log("Final query:", query);

//     // 4️⃣ Fetch products
//     const products = await Product.find(query)
//       .populate("category", "name")
//       .populate("subCategory", "name")
//       .populate("subSubCategory", "name")
//       .lean();

//     console.log("Products found:", products.length);

//     // 5️⃣ Serialize MongoDB objects
//     return products.map((p: any) => ({
//       ...p,
//       _id: p._id.toString(),
//       category: p.category
//         ? { ...p.category, _id: p.category._id.toString() }
//         : null,
//       subCategory: p.subCategory
//         ? { ...p.subCategory, _id: p.subCategory._id.toString() }
//         : null,
//       subSubCategory: p.subSubCategory
//         ? { ...p.subSubCategory, _id: p.subSubCategory._id.toString() }
//         : null,
//       createdAt: p.createdAt?.toISOString(),
//       updatedAt: p.updatedAt?.toISOString()
//     }));
//   } catch (error) {
//     console.error("❌ Error fetching products:", error);
//     return [];
//   }
// }
