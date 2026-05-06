import { Request, Response, NextFunction } from "express";
import Feedback from "../models/Feedback";
import Product from "../models/Product";
import { AppError } from "../utils/errorHandler";
import { AuthRequest } from "../types";

// @desc    Create feedback
// @route   POST /api/feedback
// @access  Private
export const createFeedback = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { product, order, rating, comment } = req.body;

    if (!rating || !comment) {
      return next(new AppError("Rating and comment are required", 400));
    }

    if (!product && !order) {
      return next(
        new AppError("Please provide a product or order reference", 400),
      );
    }

    const feedback = await Feedback.create({
      user: req.user?._id,
      product: product || undefined,
      order: order || undefined,
      rating,
      comment,
    });

    // Update product average rating if feedback is for a product
    if (product) {
      const allFeedback = await Feedback.find({ product });
      const average =
        allFeedback.reduce((acc, f) => acc + f.rating, 0) / allFeedback.length;

      await Product.findByIdAndUpdate(product, {
        "ratings.average": Math.round(average * 10) / 10,
        "ratings.count": allFeedback.length,
      });
    }

    res.status(201).json({ success: true, feedback });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all feedback for a product
// @route   GET /api/feedback/product/:productId
// @access  Public
export const getProductFeedback = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const feedback = await Feedback.find({ product: req.params.productId })
      .populate("user", "name avatar")
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, total: feedback.length, feedback });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all feedback (admin)
// @route   GET /api/feedback
// @access  Admin
export const getAllFeedback = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const feedback = await Feedback.find()
      .populate("user", "name email")
      .populate("product", "name")
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, total: feedback.length, feedback });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete feedback
// @route   DELETE /api/feedback/:id
// @access  Private (owner or admin)
export const deleteFeedback = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const feedback = await Feedback.findById(req.params.id);

    if (!feedback) {
      return next(new AppError("Feedback not found", 404));
    }

    const isOwner = feedback.user.toString() === req.user?._id.toString();
    const isAdmin = req.user?.role === "admin";

    if (!isOwner && !isAdmin) {
      return next(new AppError("Not authorized to delete this feedback", 403));
    }

    await feedback.deleteOne();

    res.status(200).json({ success: true, message: "Feedback deleted" });
  } catch (error) {
    next(error);
  }
};
