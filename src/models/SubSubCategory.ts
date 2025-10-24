import mongoose, { Schema, Document } from "mongoose";

export interface ISubSubCategory extends Document {
  name: string;
  rank: number;
  parentSubcategory: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const SubSubCategorySchema = new Schema<ISubSubCategory>(
  {
    name: { type: String, required: true },
    rank: { type: Number, required: true },
    parentSubcategory: { type: mongoose.Schema.Types.ObjectId, ref: "SubCategory" },
  },
  { timestamps: true }
);

export default mongoose.models.SubSubCategory ||
  mongoose.model<ISubSubCategory>("SubSubCategory", SubSubCategorySchema);
