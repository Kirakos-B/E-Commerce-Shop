import mongoose, { Schema, Model } from "mongoose";
import { IFeedback } from "../types";

interface IFeedbackModel extends Model<IFeedback> {}

const FeedbackSchema = new Schema<IFeedback, IFeedbackModel>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    product: {
      type: Schema.Types.ObjectId,
      ref: "Product",
      required: false,
    },
    order: {
      type: Schema.Types.ObjectId,
      ref: "Order",
      required: false,
    },
    rating: {
      type: Number,
      required: [true, "Rating is required"],
      min: [1, "Rating must be at least 1"],
      max: [5, "Rating cannot exceed 5"],
    },
    comment: {
      type: String,
      required: [true, "Comment is required"],
      trim: true,
    },
  },
  { timestamps: true },
);

// A user can only leave one feedback per product
FeedbackSchema.index({ user: 1, product: 1 }, { unique: true, sparse: true });

const Feedback = mongoose.model<IFeedback, IFeedbackModel>(
  "Feedback",
  FeedbackSchema,
);

export default Feedback;
