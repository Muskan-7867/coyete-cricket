import mongoose, { Schema, models } from "mongoose";

const QualitySchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
  },
  { timestamps: true }
);

const Quality = models.Quality || mongoose.model("Quality", QualitySchema);
export default Quality;
