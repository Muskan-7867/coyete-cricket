
import mongoose, { Schema, Document } from "mongoose";

export interface ISubCategory extends Document {
  name: string;
  rank: number; // Add rank field
  parentCategory: string;
  parentSubCategory?: string;
  subcategories: mongoose.Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

const SubCategorySchema: Schema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    rank: {
      type: Number,
      default: 0, // Default rank is 0
    },
    parentCategory: {
      type: Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    parentSubCategory: {
      type: Schema.Types.ObjectId,
      ref: "SubCategory",
    },
    subcategories: [
      {
        type: Schema.Types.ObjectId,
        ref: "SubCategory",
      },
    ],
  },
  {
    timestamps: true,
  }
);

export default mongoose.models?.SubCategory ||
  mongoose.model<ISubCategory>("SubCategory", SubCategorySchema);