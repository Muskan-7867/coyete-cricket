import mongoose, { Schema, Document } from "mongoose";

export interface ISize extends Document {
  name: string;
  category: mongoose.Schema.Types.ObjectId;
}

const SizeSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.models.Size || mongoose.model<ISize>("Size", SizeSchema);
