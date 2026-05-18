import { Router } from "express";
import {
  initializePayment,
  verifyPayment,
  chapaWebhook,
} from "../controllers/paymentController";
import { optionalProtect } from "../middleware/auth";

const router = Router();

router.post("/initialize/:orderId", optionalProtect, initializePayment);
router.get("/verify/:txRef", verifyPayment);
router.post("/webhook", chapaWebhook);

export default router;
