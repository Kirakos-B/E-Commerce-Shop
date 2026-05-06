import { Router } from "express";
import {
  createCustomOrder,
  getMyCustomOrders,
  getAllCustomOrders,
  getCustomOrder,
  updateCustomOrder,
} from "../controllers/customOrderController";
import { protect, adminOnly, optionalProtect } from "../middleware/auth";

const router = Router();

// Public (guest + user)
router.post("/", optionalProtect, createCustomOrder);

// Private
router.get("/my", protect, getMyCustomOrders);
router.get("/:id", protect, getCustomOrder);

// Admin only
router.get("/", protect, adminOnly, getAllCustomOrders);
router.put("/:id", protect, adminOnly, updateCustomOrder);

export default router;
