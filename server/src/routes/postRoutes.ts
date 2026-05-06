import { Router } from "express";
import {
  createPost,
  getPosts,
  getAllPosts,
  likePost,
  approvePost,
  deletePost,
} from "../controllers/postController";
import { protect, adminOnly } from "../middleware/auth";

const router = Router();

router.get("/", getPosts);
router.post("/", protect, createPost);
router.get("/all", protect, adminOnly, getAllPosts);
router.put("/:id/like", protect, likePost);
router.put("/:id/approve", protect, adminOnly, approvePost);
router.delete("/:id", protect, deletePost);

export default router;
