

// import express from "express";
// import Razorpay from "razorpay";
// import crypto from "crypto";
// import Order from "../models/Order.js";
// import dotenv from "dotenv";
// dotenv.config();

// const router = express.Router();



// const razorpay = new Razorpay({
//   key_id: process.env.RAZORPAY_KEY_ID,
//   key_secret: process.env.RAZORPAY_KEY_SECRET,
// });

// const toPaise = (amount) => Math.round(Number(amount) * 100);

// // ----------------------------
// // Create Razorpay Order
// // ----------------------------
// router.post("/create-order", async (req, res) => {
//   try {
//     console.log("Received /create-order request body:", req.body);
//     const { amount } = req.body;

//     if (!amount || amount <= 0) {
//       console.log("Invalid amount:", amount);
//       return res.status(400).json({ success: false, message: "Invalid amount" });
//     }

//     const options = {
//       amount: toPaise(amount),
//       currency: "INR",
//       receipt: `receipt_${Date.now()}`,
//       payment_capture: 1,
//     };

//     console.log("Creating Razorpay order with options:", options);
//     const order = await razorpay.orders.create(options);
//     console.log("Razorpay order created:", order);

//     res.json({ success: true, order });
//   } catch (error) {
//     console.error("Error creating Razorpay order:", error);
//     res.status(500).json({ success: false, message: "Error creating Razorpay order", error: error.message });
//   }
// });

// // ----------------------------
// // Verify Razorpay Payment
// // ----------------------------
// router.post("/verify", async (req, res) => {
//   try {
//     console.log("Received /verify request body:", req.body);

//     const { razorpay_order_id, razorpay_payment_id, razorpay_signature, customer, cartItems } = req.body;

//     if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
//       console.log("Missing Razorpay fields:", { razorpay_order_id, razorpay_payment_id, razorpay_signature });
//       return res.status(400).json({ success: false, message: "Missing Razorpay fields" });
//     }

//     // Signature verification
//     const body = razorpay_order_id + "|" + razorpay_payment_id;
//     const expectedSignature = crypto
//       .createHmac("sha256", RAZORPAY_KEY_SECRET)
//       .update(body.toString())
//       .digest("hex");

//     console.log("Expected signature:", expectedSignature);
//     console.log("Received signature:", razorpay_signature);

//     if (expectedSignature !== razorpay_signature) {
//       console.log("Invalid signature");
//       return res.status(400).json({ success: false, message: "Invalid signature" });
//     }

//     console.log("Fetching Razorpay order:", razorpay_order_id);
//     const razorpayOrder = await razorpay.orders.fetch(razorpay_order_id);
//     console.log("Fetched Razorpay order:", razorpayOrder);

//     const newOrder = new Order({
//       name: customer.name,
//       email: customer.email,
//       mobile: customer.mobile,
//       address: customer.address,
//       cartItems,
//       amount: razorpayOrder.amount / 100,
//       paymentMethod: "razorpay",
//       paymentStatus: "paid",
//       razorpayOrderId: razorpay_order_id,
//       razorpayPaymentId: razorpay_payment_id,
//       razorpaySignature: razorpay_signature,
//     });

//     console.log("Saving order to DB:", newOrder);
//     await newOrder.save();

//     res.json({ success: true, message: "Payment verified & order placed", order: newOrder });
//   } catch (error) {
//     console.error("Payment verification failed:", error);
//     res.status(500).json({ success: false, message: "Payment verification failed", error: error.message });
//   }
// });

// // ----------------------------
// // Cash on Delivery
// // ----------------------------
// router.post("/cod", async (req, res) => {
//   try {
//     console.log("Received /cod request body:", req.body);
//     const { customer, cartItems } = req.body;

//     if (!customer || !cartItems || cartItems.length === 0) {
//       console.log("Invalid COD order data");
//       return res.status(400).json({ success: false, message: "Invalid order data" });
//     }

//     const totalAmount = cartItems.reduce((acc, item) => acc + (item.total || item.price * item.quantity), 0);
//     console.log("COD totalAmount:", totalAmount);

//     const newOrder = new Order({
//       name: customer.name,
//       email: customer.email,
//       mobile: customer.mobile,
//       address: customer.address,
//       cartItems,
//       amount: totalAmount,
//       paymentMethod: "cod",
//       paymentStatus: "pending",
//     });

//     console.log("Saving COD order:", newOrder);
//     await newOrder.save();

//     res.json({ success: true, message: "COD order placed successfully", order: newOrder });
//   } catch (error) {
//     console.error("COD order failed:", error);
//     res.status(500).json({ success: false, message: "COD order failed", error: error.message });
//   }
// });

// export default router;

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

