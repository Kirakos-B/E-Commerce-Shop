import { Router } from "express";
import {
  createFeedback,
  getProductFeedback,
  getAllFeedback,
  deleteFeedback,
} from "../controllers/feedbackController";
import { protect, adminOnly } from "../middleware/auth";

const router = Router();

router.post("/", protect, createFeedback);
router.get("/product/:productId", getProductFeedback);
router.get("/", protect, adminOnly, getAllFeedback);
router.delete("/:id", protect, deleteFeedback);

export default router;
