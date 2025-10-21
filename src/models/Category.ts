
import mongoose, { Schema, Document } from "mongoose";

export interface ICategory extends Document {
  name: string;
  description?: string;
  rank: number; // Add rank field
  subcategories: mongoose.Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

const CategorySchema: Schema = new Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    description: {
      type: String,
      default: "",
    },
    rank: {
      type: Number,
      default: 0, // Default rank is 0
    },
    subcategories: [
      {
        type: Schema.Types.ObjectId,
        ref: "SubCategory",
      },
    ],
      products: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product'
  }]
  },
  {
    timestamps: true,
  }
);

export default mongoose.models?.Category || mongoose.model<ICategory>("Category", CategorySchema);