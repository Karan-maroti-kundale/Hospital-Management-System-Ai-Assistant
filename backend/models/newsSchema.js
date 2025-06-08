import mongoose from "mongoose";

const newsSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    date: {
      type: Date,
      required: true,
      default: Date.now,
    },
    link: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("News", newsSchema);