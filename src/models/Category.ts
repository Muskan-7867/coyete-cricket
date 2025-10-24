import mongoose, { Schema, Document } from "mongoose";

export interface ICategory extends Document {
  name: string;
  slug: string; // Add slug here
  description?: string;
  rank: number;
  subcategories: mongoose.Types.ObjectId[];
  products: mongoose.Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

const CategorySchema: Schema = new Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true
    },
    description: {
      type: String,
      default: ""
    },
    rank: {
      type: Number,
      default: 0
    },
    subcategories: [
      {
        type: Schema.Types.ObjectId,
        ref: "SubCategory"
      }
    ],
    products: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product"
      }
    ]
  },
  {
    timestamps: true
  }
);



export default mongoose.models?.Category ||
  mongoose.model<ICategory>("Category", CategorySchema);
