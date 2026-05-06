import { Router } from "express";
import {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
} from "../controllers/productController";
import { protect, adminOnly } from "../middleware/auth";

const router = Router();

// Public routes
router.get("/", getProducts);
router.get("/:id", getProduct);

// Admin only routes
router.post("/", protect, adminOnly, createProduct);
router.put("/:id", protect, adminOnly, updateProduct);
router.delete("/:id", protect, adminOnly, deleteProduct);

export default router;
