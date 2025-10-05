import express from "express";
import Testimonial from "../models/Testimonial.js";

const router = express.Router();

// GET all testimonials
router.get("/", async (req, res) => {
  console.log("GET /api/testimonials called");
  try {
    const testimonials = await Testimonial.find().sort({ createdAt: -1 });
    console.log(`Fetched ${testimonials.length} testimonials`);
    res.json(testimonials);
  } catch (err) {
    console.error("Error fetching testimonials:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// POST new testimonial
router.post("/", async (req, res) => {
  console.log("POST /api/testimonials called with body:", req.body);
  try {
    const { feedback, author, rating } = req.body;
    if (!feedback || !author || !rating) 
      return res.status(400).json({ error: "Feedback, author, and rating required" });

    const newTestimonial = new Testimonial({ feedback, author, rating });
    const saved = await newTestimonial.save();
    console.log("✅ New testimonial saved:", saved);
    res.status(201).json(saved);
  } catch (err) {
    console.error("Error saving testimonial:", err);
    res.status(500).json({ error: "Server error" });
  }
});

export default router;

