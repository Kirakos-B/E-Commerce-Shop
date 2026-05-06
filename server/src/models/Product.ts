import mongoose, { Schema, Model } from "mongoose";
import { IProduct } from "../types";

interface IProductModel extends Model<IProduct> {}

const ProductSchema = new Schema<IProduct, IProductModel>(
  {
    name: {
      type: String,
      required: [true, "Product name is required"],
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Product description is required"],
    },
    price: {
      type: Number,
      required: [true, "Product price is required"],
      min: [0, "Price cannot be negative"],
    },
    category: {
      type: String,
      required: [true, "Product category is required"],
      enum: [
        "suits",
        "shirts",
        "trousers",
        "dresses",
        "jackets",
        "traditional",
        "accessories",
        "other",
      ],
    },
    images: {
      type: [String],
      default: [],
    },
    stock: {
      type: Number,
      required: [true, "Stock is required"],
      min: [0, "Stock cannot be negative"],
      default: 0,
    },
    ratings: {
      average: { type: Number, default: 0 },
      count: { type: Number, default: 0 },
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
    isAvailable: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true },
);

// Index for search
ProductSchema.index({ name: "text", description: "text" });

const Product = mongoose.model<IProduct, IProductModel>(
  "Product",
  ProductSchema,
);

export default Product;
