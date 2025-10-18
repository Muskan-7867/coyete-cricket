import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Product from "@/models/Product";
import { uploadToCloudinary, CloudinaryUploadResult } from "@/lib/cloudinary";

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
      subcategory,
      size,
      colors,
      inStock,
      images,
      imageRanks = [] // Add image ranks from frontend
    }: {
      name: string;
      shortDescription: string;
      detailedDescription: string;
      price: number;
      originalPrice: number;
      discount: number;
      tax: number;
      quality: string;
      category: string;
      subcategory: string;
      size: string;
      colors: string;
      inStock: boolean;
      images: string[];
      imageRanks?: number[];
    } = body;

    // Validate required fields
    if (
      !name ||
      !shortDescription ||
      !detailedDescription ||
      !price ||
      !originalPrice ||
      !quality ||
      !category ||
      !subcategory ||
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
          const rank = imageRanks[i] !== undefined ? imageRanks[i] : i; // Use provided rank or default to index

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

    // Create product with Cloudinary image data and auto-generated slug
    const product = await Product.create({
      name,
      slug, // Add the auto-generated slug
      shortDescription,
      detailedDescription,
      price,
      originalPrice,
      discount,
      tax,
      quality,
      category,
      subcategory,
      size,
      colors,
      inStock,
      images: uploadedImages
    });
    const plainProduct = product.toObject({ getters: true });
    plainProduct._id = product._id.toString(); // ensure it's a string
    return NextResponse.json(
      {
        success: true,
        message: "Product created successfully",
        product: plainProduct
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
