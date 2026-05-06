import { Request, Response, NextFunction } from "express";
import CustomOrder from "../models/CustomOrder";
import { AppError } from "../utils/errorHandler";
import { AuthRequest } from "../types";

// @desc    Create custom order
// @route   POST /api/custom-orders
// @access  Public
export const createCustomOrder = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const {
      designDescription,
      fabric,
      color,
      measurements,
      referenceImages,
      guestInfo,
    } = req.body;

    if (!designDescription || !fabric || !color) {
      return next(
        new AppError("Design description, fabric and color are required", 400),
      );
    }

    if (!req.user && !guestInfo) {
      return next(new AppError("Guest info is required for guest orders", 400));
    }

    const customOrder = await CustomOrder.create({
      user: req.user?._id || undefined,
      guestInfo: req.user ? undefined : guestInfo,
      designDescription,
      fabric,
      color,
      measurements: measurements || {},
      referenceImages: referenceImages || [],
    });

    res.status(201).json({ success: true, customOrder });
  } catch (error) {
    next(error);
  }
};

// @desc    Get my custom orders
// @route   GET /api/custom-orders/my
// @access  Private
export const getMyCustomOrders = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const orders = await CustomOrder.find({ user: req.user?._id }).sort({
      createdAt: -1,
    });
    res.status(200).json({ success: true, orders });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all custom orders (admin)
// @route   GET /api/custom-orders
// @access  Admin
export const getAllCustomOrders = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const orders = await CustomOrder.find()
      .populate("user", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, total: orders.length, orders });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single custom order
// @route   GET /api/custom-orders/:id
// @access  Private
export const getCustomOrder = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const order = await CustomOrder.findById(req.params.id).populate(
      "user",
      "name email",
    );

    if (!order) {
      return next(new AppError("Custom order not found", 404));
    }

    const isOwner = order.user?.toString() === req.user?._id.toString();
    const isAdmin = req.user?.role === "admin";

    if (!isOwner && !isAdmin) {
      return next(new AppError("Not authorized to view this order", 403));
    }

    res.status(200).json({ success: true, order });
  } catch (error) {
    next(error);
  }
};

// @desc    Update custom order status + pricing (admin)
// @route   PUT /api/custom-orders/:id
// @access  Admin
export const updateCustomOrder = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { status, estimatedPrice, finalPrice, adminNotes, deliveryDate } =
      req.body;

    const order = await CustomOrder.findById(req.params.id);
    if (!order) {
      return next(new AppError("Custom order not found", 404));
    }

    if (status) order.status = status;
    if (estimatedPrice) order.estimatedPrice = estimatedPrice;
    if (finalPrice) order.finalPrice = finalPrice;
    if (adminNotes) order.adminNotes = adminNotes;
    if (deliveryDate) order.deliveryDate = new Date(deliveryDate);

    await order.save();

    res.status(200).json({ success: true, order });
  } catch (error) {
    next(error);
  }
};
