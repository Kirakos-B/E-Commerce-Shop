import mongoose, { Schema, Model } from "mongoose";
import { ICustomOrder } from "../types";

interface ICustomOrderModel extends Model<ICustomOrder> {}

const CustomOrderSchema = new Schema<ICustomOrder, ICustomOrderModel>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: false,
    },
    guestInfo: {
      name: String,
      email: String,
      phone: String,
    },
    designDescription: {
      type: String,
      required: [true, "Design description is required"],
    },
    fabric: {
      type: String,
      enum: ["cotton", "silk", "wool", "linen", "polyester", "blend", "other"],
      required: [true, "Fabric type is required"],
    },
    color: {
      type: String,
      required: [true, "Color is required"],
    },
    measurements: {
      chest: Number,
      waist: Number,
      hips: Number,
      shoulder: Number,
      inseam: Number,
      height: Number,
      weight: Number,
      notes: String,
    },
    referenceImages: {
      type: [String],
      default: [],
    },
    estimatedPrice: { type: Number },
    finalPrice: { type: Number },
    status: {
      type: String,
      enum: [
        "pending",
        "reviewing",
        "approved",
        "in_progress",
        "ready",
        "delivered",
        "cancelled",
      ],
      default: "pending",
    },
    adminNotes: { type: String },
    deliveryDate: { type: Date },
  },
  { timestamps: true },
);

const CustomOrder = mongoose.model<ICustomOrder, ICustomOrderModel>(
  "CustomOrder",
  CustomOrderSchema,
);

export default CustomOrder;
