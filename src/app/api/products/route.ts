import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Product from "@/models/Product";
import { uploadToCloudinary, CloudinaryUploadResult } from "@/lib/cloudinary";
import Category from "@/models/Category";
import SubCategory from "@/models/SubCategory";

interface ProductImage {
  publicId: string;
  url: string;
  rank: number;
}

// Function to generate slug from product name
function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "") // Remove special characters
    .replace(/[\s_-]+/g, "-") // Replace spaces and underscores with hyphens
    .replace(/^-+|-+$/g, ""); // Remove leading/trailing hyphens
}

// Function to generate unique slug by checking existing products
async function generateUniqueSlug(name: string): Promise<string> {
  const baseSlug = generateSlug(name);
  let slug = baseSlug;
  let counter = 1;

  // Check if slug already exists
  while (true) {
    const existingProduct = await Product.findOne({ slug });
    if (!existingProduct) {
      break;
    }
    // If slug exists, append counter and increment
    slug = `${baseSlug}-${counter}`;
    counter++;
  }

  return slug;
}

export async function POST(req: Request) {
  try {
    await connectDB();

    const body = await req.json();

    const {
      name,
      shortDescription,
      detailedDescription,
      price,
      originalPrice,
      discount,
      tax,
      quality,
      category,
      subCategory,
      subSubCategory, // Add this
      size,
      colors,
      tags,
      inStock,
      images,
      imageRanks = []
    } = body;

    // Validate required fields (subSubCategory is optional)
    if (
      !name ||
      !shortDescription ||
      !detailedDescription ||
      !price ||
      !originalPrice ||
      !quality ||
      !category ||
      !subCategory ||
      !size ||
      !colors
    ) {
      return NextResponse.json(
        { success: false, message: "All required fields must be filled" },
        { status: 400 }
      );
    }

    // Generate unique slug from product name
    const slug = await generateUniqueSlug(name);

    // Upload images to Cloudinary with ranks
    const uploadedImages: ProductImage[] = [];
    if (images && images.length > 0) {
      for (let i = 0; i < images.length; i++) {
        try {
          const imageData = images[i];
          const rank = imageRanks[i] !== undefined ? imageRanks[i] : i;

          const uploadResult: CloudinaryUploadResult = await uploadToCloudinary(
            imageData
          );
          uploadedImages.push({
            publicId: uploadResult.public_id,
            url: uploadResult.secure_url,
            rank: rank
          });
        } catch (uploadError) {
          console.error("Cloudinary upload error:", uploadError);
          return NextResponse.json(
            {
              success: false,
              message: `Failed to upload image: ${
                uploadError instanceof Error
                  ? uploadError.message
                  : "Unknown error"
              }`
            },
            { status: 500 }
          );
        }
      }
    }

    // Sort images by rank before saving
    uploadedImages.sort((a, b) => a.rank - b.rank);

    // Process tags - ensure it's an array and remove empty strings
    const processedTags = Array.isArray(tags)
      ? tags.filter((tag) => tag.trim() !== "").map((tag) => tag.trim())
      : [];

    // Create product with optional subSubCategory
    const productData: any = {
      name,
      slug,
      shortDescription,
      detailedDescription,
      price,
      originalPrice,
      discount,
      tax,
      quality,
      category,
      subCategory,
      size,
      colors,
      tags: processedTags,
      inStock,
      images: uploadedImages
    };

    // Only add subSubCategory if provided
    if (subSubCategory && subSubCategory.trim() !== "") {
      productData.subSubCategory = subSubCategory;
    }

    const product = await Product.create(productData);

    const productId = product._id;

    // Update Category
    if (category) {
      await Category.findByIdAndUpdate(category, {
        $addToSet: { products: productId }
      });
    }

    // Update SubCategory
    if (subCategory) {
      await SubCategory.findByIdAndUpdate(subCategory, {
        $addToSet: { products: productId }
      });
    }

    // Update SubSubCategory if provided
    if (subSubCategory) {
      await SubCategory.findByIdAndUpdate(subSubCategory, {
        $addToSet: { products: productId }
      });
    }

    const populatedProduct = await Product.findById(product._id)
      .populate("category", "name _id")
      .populate("subCategory", "name _id")
      .populate("subSubCategory", "name _id") // Add this
      .populate("size", "name _id")
      .populate("colors", "name _id")
      .populate("quality", "name _id");

    const plainProduct = populatedProduct.toObject({ getters: true });
    plainProduct._id = populatedProduct._id.toString();

    return NextResponse.json(
      {
        success: true,
        message:
          "Product created successfully and linked to category/subcategory",
        product: plainProduct,
        debug: {
          receivedSubcategory: subCategory,
          receivedSubSubcategory: subSubCategory || "Not provided",
          storedSubcategory: product.subCategory,
          storedSubSubcategory: product.subSubCategory || "Not stored",
          productId: product._id.toString()
        }
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Product creation error:", error);
    return NextResponse.json(
      {
        success: false,
        message: error instanceof Error ? error.message : "Server error"
      },
      { status: 500 }
    );
  }
}
