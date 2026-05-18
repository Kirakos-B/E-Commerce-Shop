import { Request, Response, NextFunction } from "express";
import Order from "../models/Order";
import { AppError } from "../utils/errorHandler";
import { AuthRequest } from "../types";
import chapa from "../config/chapa";
import crypto from "crypto";

// @desc     Initialize Chapa payment for an order
// @route    POST /api/payment/initialize/:orderId
// @access   Public
export const initializePayment = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const order = await Order.findById(req.params.orderId).populate(
      "user",
      "name email",
    );

    if (!order) {
      return next(new AppError("Order not found", 404));
    }

    // Get customer info (user or guest)
    const customerName =
      (order as unknown as { user?: { name: string } }).user?.name ||
      order.guestInfo?.name ||
      "Guest";

    const customerEmail =
      (order as unknown as { user?: { email: string } }).user?.email ||
      order.guestInfo?.email ||
      "guest@emushop.com";

    const nameParts = customerName.split(" ");
    const firstName = nameParts[0] || "Guest";
    const lastName = nameParts.slice(1).join(" ") || "User";

    // Generate unique transaction reference
    const txRef = `emu-shop-${order._id}-${Date.now()}`;

    const response = await chapa.initialize({
      first_name: firstName,
      last_name: lastName,
      email: customerEmail,
      amount: String(order.totalPrice),
      currency: "ETB",
      tx_ref: txRef,
      callback_url: `${process.env.CLIENT_URL}/payment/verify?orderId=${order._id}`,
      return_url: `${process.env.CLIENT_URL}/payment/success?orderId=${order._id}`,
      customization: {
        title: "Emu Shop Payment",
        description: `Payment for order #${String(order._id).slice(-8).toUpperCase()}`,
      },
    });

    // FIX 1: Safety check to ensure response and response.data exist
    if (!response || !response.data || !response.data.checkout_url) {
      return next(new AppError("Failed to initialize payment gateway", 500));
    }

    res.status(200).json({
      success: true,
      checkoutUrl: response.data.checkout_url,
      txRef,
    });
  } catch (error) {
    next(error);
  }
};

// @desc     Verify Chapa payment
// @route    GET /api/payment/verify/:txRef
// @access   Public
export const verifyPayment = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    // FIX 2 & 3: Force txRef to be processed strictly as a string
    const txRef = req.params.txRef as string;

    if (!txRef) {
      return next(new AppError("Transaction reference is required", 400));
    }

    const response = await chapa.verify({ tx_ref: txRef });

    // FIX 1 (extended): Extra protection for verify response structure
    if (response?.data?.status === "success") {
      // txRef format: emu-shop-{orderId}-{timestamp}
      // orderId is everything between 'emu-shop-' and the last '-{timestamp}'
      const withoutPrefix = txRef.replace("emu-shop-", "");
      const lastDashIndex = withoutPrefix.lastIndexOf("-");
      const orderId = withoutPrefix.substring(0, lastDashIndex);

      await Order.findByIdAndUpdate(orderId, {
        paymentStatus: "paid",
        orderStatus: "confirmed",
      });

      res.status(200).json({
        success: true,
        message: "Payment verified successfully",
        orderId,
      });
    } else {
      res.status(400).json({
        success: false,
        message: "Payment verification failed",
      });
    }
  } catch (error) {
    next(error);
  }
};

// @desc     Chapa webhook handler
// @route    POST /api/payment/webhook
// @access   Public (Chapa server)
export const chapaWebhook = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    // Verify webhook signature
    const rawSignature = req.headers["x-chapa-signature"];
    const signature = Array.isArray(rawSignature)
      ? rawSignature[0]
      : rawSignature;

    const hash = crypto
      .createHmac("sha256", process.env.CHAPA_WEBHOOK_SECRET as string)
      .update(JSON.stringify(req.body))
      .digest("hex");

    if (hash !== signature) {
      res.status(401).json({ message: "Invalid signature" });
      return;
    }

    const { tx_ref, status } = req.body;

    if (status === "success") {
      const withoutPrefix = (tx_ref as string).replace("emu-shop-", "");
      const lastDashIndex = withoutPrefix.lastIndexOf("-");
      const orderId = withoutPrefix.substring(0, lastDashIndex);

      await Order.findByIdAndUpdate(orderId, {
        paymentStatus: "paid",
        orderStatus: "confirmed",
      });
    }

    res.status(200).json({ message: "Webhook received" });
  } catch (error) {
    next(error);
  }
};
