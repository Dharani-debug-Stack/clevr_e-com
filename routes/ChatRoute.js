import express from "express";
import dotenv from "dotenv";
import axios from "axios";

dotenv.config();
const router = express.Router();

const OPENROUTER_KEY = process.env.OPENROUTER_API_KEY;

router.post("/", async (req, res) => {
  try {
    const { messages } = req.body;
    console.log("🔑 OpenRouter key:", OPENROUTER_KEY ? "Loaded" : "Missing");

    const response = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        model: "gpt-4o-mini",
        messages,
      },
      {
        headers: {
          "Authorization": `Bearer ${OPENROUTER_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    res.json(response.data);
  } catch (error) {
    console.error("❌ Chat route error:", error.response?.data || error.message);
    res.status(500).json({
      error: "Server Error",
      details: error.response?.data || error.message,
    });
  }
});

export default router;

