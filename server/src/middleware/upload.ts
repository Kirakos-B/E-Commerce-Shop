import multer from "multer";
import { Request } from "express";
import { AppError } from "../utils/errorHandler";

// Use memory storage — we'll stream directly to Cloudinary
const storage = multer.memoryStorage();

const fileFilter = (
  req: Request,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback,
): void => {
  const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new AppError("Only JPEG, PNG and WebP images are allowed", 400));
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB max per file
  },
});

export default upload;
