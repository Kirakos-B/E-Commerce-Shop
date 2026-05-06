import { Request, Response, NextFunction } from "express";
import Post from "../models/Post";
import { AppError } from "../utils/errorHandler";
import { AuthRequest } from "../types";

// @desc    Create post
// @route   POST /api/posts
// @access  Private
export const createPost = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { caption, images } = req.body;

    if (!caption) {
      return next(new AppError("Caption is required", 400));
    }

    const post = await Post.create({
      user: req.user?._id,
      caption,
      images: images || [],
    });

    res.status(201).json({ success: true, post });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all approved posts
// @route   GET /api/posts
// @access  Public
export const getPosts = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const posts = await Post.find({ isApproved: true })
      .populate("user", "name avatar")
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, total: posts.length, posts });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all posts (admin — including unapproved)
// @route   GET /api/posts/all
// @access  Admin
export const getAllPosts = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const posts = await Post.find()
      .populate("user", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, total: posts.length, posts });
  } catch (error) {
    next(error);
  }
};

// @desc    Like / Unlike a post
// @route   PUT /api/posts/:id/like
// @access  Private
export const likePost = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return next(new AppError("Post not found", 404));
    }

    const userId = req.user?._id;
    const alreadyLiked = post.likes.some(
      (id) => id.toString() === userId?.toString(),
    );

    if (alreadyLiked) {
      // Unlike
      post.likes = post.likes.filter(
        (id) => id.toString() !== userId?.toString(),
      );
    } else {
      // Like
      post.likes.push(userId!);
    }

    await post.save();

    res.status(200).json({
      success: true,
      liked: !alreadyLiked,
      likesCount: post.likes.length,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Approve post (admin)
// @route   PUT /api/posts/:id/approve
// @access  Admin
export const approvePost = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const post = await Post.findByIdAndUpdate(
      req.params.id,
      { isApproved: true },
      { new: true },
    );

    if (!post) {
      return next(new AppError("Post not found", 404));
    }

    res.status(200).json({ success: true, post });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete post (owner or admin)
// @route   DELETE /api/posts/:id
// @access  Private
export const deletePost = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return next(new AppError("Post not found", 404));
    }

    const isOwner = post.user.toString() === req.user?._id.toString();
    const isAdmin = req.user?.role === "admin";

    if (!isOwner && !isAdmin) {
      return next(new AppError("Not authorized to delete this post", 403));
    }

    await post.deleteOne();

    res.status(200).json({ success: true, message: "Post deleted" });
  } catch (error) {
    next(error);
  }
};
