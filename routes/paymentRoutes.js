import express from "express";
import Razorpay from "razorpay";
import crypto from "crypto";
import Order from "../models/Order.js";
import dotenv from "dotenv";
dotenv.config();

const router = express.Router();

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

const toPaise = (amount) => Math.round(Number(amount) * 100);

// Create Razorpay Order
router.post("/create-order", async (req, res) => {
  try {
    const { amount } = req.body;
    if (!amount || amount <= 0) return res.status(400).json({ success: false, message: "Invalid amount" });

    const order = await razorpay.orders.create({
      amount: toPaise(amount),
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
      payment_capture: 1,
    });

    res.json({ success: true, order });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Verify Razorpay Payment
router.post("/verify", async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, customer, cartItems } = req.body;

    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest("hex");

    if (expectedSignature !== razorpay_signature)
      return res.status(400).json({ success: false, message: "Invalid signature" });

    const newOrder = new Order({
      name: customer.name,
      email: customer.email,
      mobile: customer.mobile,
      address: customer.address,
      cartItems,
      amount: cartItems.reduce((acc, item) => acc + item.total, 0),
      paymentMethod: "razorpay",
      paymentStatus: "paid",
      razorpayOrderId: razorpay_order_id,
      razorpayPaymentId: razorpay_payment_id,
      razorpaySignature: razorpay_signature,
    });

    await newOrder.save();
    res.json({ success: true, message: "Payment verified & order placed", order: newOrder });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Cash on Delivery
router.post("/cod", async (req, res) => {
  try {
    const { customer, cartItems } = req.body;
    if (!customer || !cartItems || cartItems.length === 0)
      return res.status(400).json({ success: false, message: "Invalid order data" });

    const newOrder = new Order({
      name: customer.name,
      email: customer.email,
      mobile: customer.mobile,
      address: customer.address,
      cartItems,
      amount: cartItems.reduce((acc, item) => acc + item.total, 0),
      paymentMethod: "cod",
      paymentStatus: "pending",
    });

    await newOrder.save();
    res.json({ success: true, message: "COD order placed successfully", order: newOrder });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

export default router;

