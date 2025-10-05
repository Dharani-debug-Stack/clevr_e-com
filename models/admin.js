import mongoose from "mongoose";

const productSchema = mongoose.Schema({
  name: { type: String, required: true },
  desc: { type: String },
  genre: { type: String },
  author: { type: String },
  year: { type: String },
  price: { type: Number },
  oldprice: { type: Number },
  imageUrl: { type: String },
}, { timestamps: true });

export default mongoose.model("Product", productSchema);
