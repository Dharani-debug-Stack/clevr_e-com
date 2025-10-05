import mongoose from "mongoose";

const testimonialSchema = new mongoose.Schema({
  feedback: { type: String, required: true },
  author: { type: String, required: true }, // customer name
  rating: { type: Number, required: true }, // 1 to 5
}, { timestamps: true });

export default mongoose.model("Testimonial", testimonialSchema);


