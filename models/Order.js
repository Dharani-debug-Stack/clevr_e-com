// import mongoose from "mongoose";

// const orderSchema = new mongoose.Schema(
//   {
//     name: { type: String, required: true },
//     email: { type: String, required: true },
//     mobile: { type: String, required: true },
//     address: { type: String, required: true },
//     paymentMethod: { type: String, enum: ["cod", "razorpay"], required: true },
//     paymentStatus: { type: String, enum: ["pending", "paid"], default: "pending" },
//     razorpayOrderId: { type: String },
//     razorpayPaymentId: { type: String },
//     razorpaySignature: { type: String },
 
//    // Add this: store products in the order
//    cartItems: [
//   {
//     name: { type: String, required: true },
//     image: { type: String, required: true },
//     price: { type: Number, required: true },
//     quantity: { type: Number, required: true },
//     total: { type: Number, required: true },
//   },
// ],
//   },
//   { timestamps: true }
// );

// export default mongoose.model("Order", orderSchema);


import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    mobile: { type: String, required: true },
    address: { type: String, required: true },
    paymentMethod: { type: String, enum: ["cod", "razorpay"], required: true },
    paymentStatus: { type: String, enum: ["pending", "paid"], default: "pending" },
    razorpayOrderId: { type: String },
    razorpayPaymentId: { type: String },
    razorpaySignature: { type: String },
    cartItems: [
      {
        name: { type: String, required: true },
        image: { type: String, required: true },
        price: { type: Number, required: true },
        quantity: { type: Number, required: true },
        total: { type: Number, required: true },
      },
    ],
    amount: { type: Number },
  },
  { timestamps: true }
);

export default mongoose.model("Order", orderSchema);
