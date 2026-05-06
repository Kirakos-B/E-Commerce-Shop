import { Request, Response, NextFunction } from "express";
import Order from "../models/Order";
import Product from "../models/Product";
import { AppError } from "../utils/errorHandler";
import { AuthRequest } from "../types";

// @desc    Create new order (user or guest)
// @route   POST /api/orders
// @access  Public
export const createOrder = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { items, shippingAddress, paymentMethod, notes, guestInfo } =
      req.body;

    if (!items || items.length === 0) {
      return next(new AppError("No order items provided", 400));
    }

    if (!shippingAddress || !paymentMethod) {
      return next(
        new AppError("Shipping address and payment method are required", 400),
      );
    }

    // If no logged in user, guestInfo is required
    if (!req.user && !guestInfo) {
      return next(
        new AppError("Guest info is required for guest checkout", 400),
      );
    }

    // Calculate total & validate products
    let totalPrice = 0;
    const orderItems = [];

    for (const item of items) {
      const product = await Product.findById(item.product);
      if (!product) {
        return next(new AppError(`Product not found: ${item.product}`, 404));
      }
      if (product.stock < item.quantity) {
        return next(
          new AppError(`Insufficient stock for: ${product.name}`, 400),
        );
      }
      totalPrice += product.price * item.quantity;
      orderItems.push({
        product: product._id,
        name: product.name,
        image: product.images[0] || "",
        price: product.price,
        quantity: item.quantity,
      });

      // Deduct stock
      product.stock -= item.quantity;
      await product.save();
    }

    const order = await Order.create({
      user: req.user?._id || undefined,
      guestInfo: req.user ? undefined : guestInfo,
      items: orderItems,
      shippingAddress,
      paymentMethod,
      totalPrice,
      notes,
    });

    res.status(201).json({ success: true, order });
  } catch (error) {
    next(error);
  }
};

// @desc    Get logged in user's orders
// @route   GET /api/orders/my
// @access  Private
export const getMyOrders = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const orders = await Order.find({ user: req.user?._id }).sort({
      createdAt: -1,
    });
    res.status(200).json({ success: true, orders });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single order
// @route   GET /api/orders/:id
// @access  Private
export const getOrder = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const order = await Order.findById(req.params.id).populate(
      "user",
      "name email",
    );

    if (!order) {
      return next(new AppError("Order not found", 404));
    }

    // Only owner or admin can view
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

// @desc    Get all orders (admin)
// @route   GET /api/orders
// @access  Admin
export const getAllOrders = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const orders = await Order.find()
      .populate("user", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, total: orders.length, orders });
  } catch (error) {
    next(error);
  }
};

// @desc    Update order status (admin)
// @route   PUT /api/orders/:id/status
// @access  Admin
export const updateOrderStatus = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { orderStatus, paymentStatus } = req.body;

    const order = await Order.findById(req.params.id);
    if (!order) {
      return next(new AppError("Order not found", 404));
    }

    if (orderStatus) order.orderStatus = orderStatus;
    if (paymentStatus) order.paymentStatus = paymentStatus;

    await order.save();

    res.status(200).json({ success: true, order });
  } catch (error) {
    next(error);
  }
};

// @desc    Cancel order
// @route   PUT /api/orders/:id/cancel
// @access  Private
export const cancelOrder = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return next(new AppError("Order not found", 404));
    }

    const isOwner = order.user?.toString() === req.user?._id.toString();
    const isAdmin = req.user?.role === "admin";

    if (!isOwner && !isAdmin) {
      return next(new AppError("Not authorized to cancel this order", 403));
    }

    if (["delivered", "cancelled"].includes(order.orderStatus)) {
      return next(new AppError(`Order cannot be cancelled at this stage`, 400));
    }

    order.orderStatus = "cancelled";
    await order.save();

    res.status(200).json({ success: true, message: "Order cancelled", order });
  } catch (error) {
    next(error);
  }
};
