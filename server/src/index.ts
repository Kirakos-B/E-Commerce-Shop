import dotenv from "dotenv";
import connectCloudinary from "./config/cloudinary";

import path from "path";

dotenv.config({ path: path.resolve(__dirname, "../.env") });
connectCloudinary();

import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import connectDB from "./config/db";
import authRoutes from "./routes/authRoutes";
import productRoutes from "./routes/productRoutes";
import orderRoutes from "./routes/orderRoutes";
import customOrderRoutes from "./routes/customOrderRoutes";
import feedbackRoutes from "./routes/feedbackRoutes";
import postRoutes from "./routes/postRoutes";
import adminRoutes from "./routes/adminRoutes";
import errorMiddleware from "./middleware/errorMiddleware";
import uploadRoutes from "./routes/uploadRoutes";
import paymentRoutes from "./routes/paymentRoutes";

connectDB();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use("/api/upload", uploadRoutes);

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/custom-orders", customOrderRoutes);
app.use("/api/feedback", feedbackRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/payment", paymentRoutes);

// Health check
app.get("/", (req, res) => {
  res.json({ message: "🦅 Emu Shop API is running!" });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

// Global error handler (must be last)
app.use(errorMiddleware);

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
