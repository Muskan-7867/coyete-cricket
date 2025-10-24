import mongoose, { Schema, Document, Types } from "mongoose";

export interface IProduct extends Document {
  name: string;
  description?: string;
  price: number;
  originalPrice?: number;
  slug: string;
  image: string;
  images?: { url: string }[];
  badge?: string;
  category: Types.ObjectId;
  subCategory?: Types.ObjectId;
  subSubCategory?: Types.ObjectId;
  tags: string[]; // Add tags field
  createdAt: Date;
  updatedAt: Date;
}

const ProductSchema: Schema = new Schema(
  {
    name: { 
      type: String, 
      required: [true, 'Product name is required'] 
    },
    slug: { type: String, required: true, unique: true },
    shortDescription: { 
      type: String, 
      required: [true, 'Short description is required'] 
    },
    detailedDescription: { 
      type: String, 
      required: [true, 'Detailed description is required'] 
    },
    price: { 
      type: Number, 
      required: [true, 'Price is required'],
      min: [0, 'Price cannot be negative']
    },
    originalPrice: { 
      type: Number, 
      required: [true, 'Original price is required'],
      min: [0, 'Original price cannot be negative']
    },
    discount: { 
      type: Number, 
      default: 0,
      min: [0, 'Discount cannot be negative'],
      max: [100, 'Discount cannot exceed 100%']
    },
    tax: { 
      type: Number, 
      default: 0,
      min: [0, 'Tax cannot be negative']
    },
    quality: { 
      type: String, 
      required: [true, 'Quality is required'] 
    },
    category: {
      type: Schema.Types.ObjectId,
      ref: "Category",
      required: true
    },
    subCategory: {
      type: Schema.Types.ObjectId,
      ref: "SubCategory",
      required: true
    },
      subSubCategory: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'SubCategory', // Reference the same SubCategory model
    required: false // Make it optional
  },
    size: { 
      type: String, 
      required: [true, 'Size is required'] 
    },
    colors: { 
      type: String, 
      required: [true, 'Color is required'] 
    },
    tags: { // Add tags field
      type: [String],
      default: []
    },
    inStock: { 
      type: Boolean, 
      default: true 
    },
    images: [
      {
        publicId: { type: String, required: true },
        url: { type: String, required: true },
        rank: { type: Number, default: 0, min: 0 }
      }
    ],
  },
  {
    timestamps: true
  }
);

const Product = mongoose.models?.Product || mongoose.model('Product', ProductSchema);

export default Product;