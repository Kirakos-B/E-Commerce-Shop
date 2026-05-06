import mongoose, { Schema, Model } from "mongoose";
import { IPost } from "../types";

interface IPostModel extends Model<IPost> {}

const PostSchema = new Schema<IPost, IPostModel>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    caption: {
      type: String,
      required: [true, "Caption is required"],
      trim: true,
    },
    images: {
      type: [String],
      default: [],
    },
    likes: {
      type: [Schema.Types.ObjectId],
      ref: "User",
      default: [],
    },
    isApproved: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);

const Post = mongoose.model<IPost, IPostModel>("Post", PostSchema);

export default Post;
