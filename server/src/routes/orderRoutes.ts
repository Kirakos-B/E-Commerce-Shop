import { Router } from "express";
import {
  createOrder,
  getMyOrders,
  getOrder,
  getAllOrders,
  updateOrderStatus,
  cancelOrder,
} from "../controllers/orderController";
import { protect, adminOnly, optionalProtect } from "../middleware/auth";

const router = Router();

// Public (guest + user) — optionalProtect attaches user if token exists
router.post("/", optionalProtect, createOrder);

// Private (logged in user)
router.get("/my", protect, getMyOrders);
router.get("/:id", protect, getOrder);
router.put("/:id/cancel", protect, cancelOrder);

// Admin only
router.get("/", protect, adminOnly, getAllOrders);
router.put("/:id/status", protect, adminOnly, updateOrderStatus);

export default router;
