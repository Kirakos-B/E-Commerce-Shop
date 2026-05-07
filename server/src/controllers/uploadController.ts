import { Response, NextFunction } from "express";
import { uploadToCloudinary } from "../utils/uploadToCloudinary";
import { AppError } from "../utils/errorHandler";
import { AuthRequest } from "../types";

// @desc    Upload single image
// @route   POST /api/upload/single
// @access  Private
export const uploadSingle = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    if (!req.file) {
      return next(new AppError("No file uploaded", 400));
    }

    const folder = (req.query.folder as string) || "general";
    const result = await uploadToCloudinary(req.file.buffer, folder);

    res.status(200).json({
      success: true,
      url: result.secure_url,
      publicId: result.public_id,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Upload multiple images
// @route   POST /api/upload/multiple
// @access  Private
export const uploadMultiple = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const files = req.files as Express.Multer.File[];

    if (!files || files.length === 0) {
      return next(new AppError("No files uploaded", 400));
    }

    const folder = (req.query.folder as string) || "general";

    const uploadPromises = files.map((file) =>
      uploadToCloudinary(file.buffer, folder),
    );

    const results = await Promise.all(uploadPromises);

    const urls = results.map((r) => ({
      url: r.secure_url,
      publicId: r.public_id,
    }));

    res.status(200).json({
      success: true,
      count: urls.length,
      urls,
    });
  } catch (error) {
    next(error);
  }
};
