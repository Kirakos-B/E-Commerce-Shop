import { Router } from "express";
import { uploadSingle, uploadMultiple } from "../controllers/uploadController";
import { protect } from "../middleware/auth";
import upload from "../middleware/upload";

const router = Router();

router.post("/single", protect, upload.single("image"), uploadSingle);

router.post(
  "/multiple",
  protect,
  upload.array("images", 10), // max 10 images
  uploadMultiple,
);

export default router;
