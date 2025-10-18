import { Schema, model, models } from "mongoose";

const ColorSchema = new Schema(
  {
    name: { type: String, required: true, unique: true, trim: true },
  },
  { timestamps: true }
);

const Color = models.Color || model("Color", ColorSchema);
export default Color;
