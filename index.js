// index.js
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import productRoutes from './routes/AdminRoutes.js'
import cartRoutes from './routes/CartRoutes.js'
import favoriteRoutes from './routes/Favorite.js'
import paymentRoutes from'./routes/paymentRoutes.js'
import testimonialRoutes from './routes/Testimonials.js';
import orderRoutes from "./routes/orderRoutes.js";
import adminOrderRoutes from "./routes/AdminOrderRoutes.js";
import dotenv from "dotenv";
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Connect MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log("MongoDB connected"))
.catch(err => console.log(err));

// Routes

app.use("/api/products", productRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/favorites', favoriteRoutes);
app.use("/api/payment", paymentRoutes);
app.use("/api/testimonials", testimonialRoutes);
app.use("/api/payment/orders", orderRoutes);
app.use("/api/admin/orders", adminOrderRoutes);


app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
