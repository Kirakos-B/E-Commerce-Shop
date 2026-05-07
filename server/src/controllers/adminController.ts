import { Request, Response, NextFunction } from "express";
import User from "../models/User";
import Product from "../models/Product";
import Order from "../models/Order";
import CustomOrder from "../models/CustomOrder";
import Feedback from "../models/Feedback";
import Post from "../models/Post";
import { AppError } from "../utils/errorHandler";

// @desc    Get dashboard summary
// @route   GET /api/admin/dashboard
// @access  Admin
export const getDashboard = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    // Run all counts in parallel
    const [
      totalUsers,
      totalProducts,
      totalOrders,
      totalCustomOrders,
      totalFeedback,
      totalPosts,
      recentOrders,
      ordersByStatus,
      salesData,
    ] = await Promise.all([
      User.countDocuments({ role: "user" }),
      Product.countDocuments(),
      Order.countDocuments(),
      CustomOrder.countDocuments(),
      Feedback.countDocuments(),
      Post.countDocuments(),

      // Recent 5 orders
      Order.find()
        .populate("user", "name email")
        .sort({ createdAt: -1 })
        .limit(5),

      // Orders grouped by status
      Order.aggregate([
        { $group: { _id: "$orderStatus", count: { $sum: 1 } } },
      ]),

      // Revenue grouped by month (last 6 months)
      Order.aggregate([
        {
          $match: {
            paymentStatus: "paid",
            createdAt: {
              $gte: new Date(new Date().setMonth(new Date().getMonth() - 6)),
            },
          },
        },
        {
          $group: {
            _id: {
              year: { $year: "$createdAt" },
              month: { $month: "$createdAt" },
            },
            revenue: { $sum: "$totalPrice" },
            orders: { $sum: 1 },
          },
        },
        { $sort: { "_id.year": 1, "_id.month": 1 } },
      ]),
    ]);

    // Total revenue
    const revenueResult = await Order.aggregate([
      { $match: { paymentStatus: "paid" } },
      { $group: { _id: null, total: { $sum: "$totalPrice" } } },
    ]);
    const totalRevenue = revenueResult[0]?.total || 0;

    // Pending custom orders
    const pendingCustomOrders = await CustomOrder.countDocuments({
      status: "pending",
    });

    // Low stock products (stock <= 5)
    const lowStockProducts = await Product.find({ stock: { $lte: 5 } })
      .select("name stock")
      .limit(5);

    res.status(200).json({
      success: true,
      dashboard: {
        counts: {
          totalUsers,
          totalProducts,
          totalOrders,
          totalCustomOrders,
          totalFeedback,
          totalPosts,
          pendingCustomOrders,
        },
        totalRevenue,
        recentOrders,
        ordersByStatus,
        salesData,
        lowStockProducts,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all users
// @route   GET /api/admin/users
// @access  Admin
export const getAllUsers = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const users = await User.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, total: users.length, users });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single user
// @route   GET /api/admin/users/:id
// @access  Admin
export const getUser = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return next(new AppError("User not found", 404));
    }
    res.status(200).json({ success: true, user });
  } catch (error) {
    next(error);
  }
};

// @desc    Update user role
// @route   PUT /api/admin/users/:id/role
// @access  Admin
export const updateUserRole = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { role } = req.body;

    if (!["user", "admin"].includes(role)) {
      return next(new AppError("Invalid role", 400));
    }

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { role },
      { new: true },
    );

    if (!user) {
      return next(new AppError("User not found", 404));
    }

    res.status(200).json({ success: true, user });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete user
// @route   DELETE /api/admin/users/:id
// @access  Admin
export const deleteUser = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);

    if (!user) {
      return next(new AppError("User not found", 404));
    }

    res
      .status(200)
      .json({ success: true, message: "User deleted successfully" });
  } catch (error) {
    next(error);
  }
};

// @desc    Get sales stats (by date range)
// @route   GET /api/admin/stats/sales
// @access  Admin
export const getSalesStats = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { from, to } = req.query;

    const matchStage: Record<string, unknown> = { paymentStatus: "paid" };

    if (from || to) {
      matchStage.createdAt = {};
      if (from)
        (matchStage.createdAt as Record<string, unknown>).$gte = new Date(
          from as string,
        );
      if (to)
        (matchStage.createdAt as Record<string, unknown>).$lte = new Date(
          to as string,
        );
    }

    const stats = await Order.aggregate([
      { $match: matchStage },
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" },
            day: { $dayOfMonth: "$createdAt" },
          },
          revenue: { $sum: "$totalPrice" },
          orders: { $sum: 1 },
        },
      },
      { $sort: { "_id.year": 1, "_id.month": 1, "_id.day": 1 } },
    ]);

    res.status(200).json({ success: true, stats });
  } catch (error) {
    next(error);
  }
};

// @desc    Get order stats by status
// @route   GET /api/admin/stats/orders
// @access  Admin
export const getOrderStats = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const byStatus = await Order.aggregate([
      { $group: { _id: "$orderStatus", count: { $sum: 1 } } },
    ]);

    const byPayment = await Order.aggregate([
      { $group: { _id: "$paymentStatus", count: { $sum: 1 } } },
    ]);

    const topProducts = await Order.aggregate([
      { $unwind: "$items" },
      {
        $group: {
          _id: "$items.product",
          name: { $first: "$items.name" },
          totalSold: { $sum: "$items.quantity" },
          totalRevenue: {
            $sum: { $multiply: ["$items.price", "$items.quantity"] },
          },
        },
      },
      { $sort: { totalSold: -1 } },
      { $limit: 5 },
    ]);

    res.status(200).json({
      success: true,
      stats: {
        byStatus,
        byPayment,
        topProducts,
      },
    });
  } catch (error) {
    next(error);
  }
};
