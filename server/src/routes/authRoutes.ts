import {
  register,
  login,
  logout,
  getMe,
  updateProfile,
  updatePassword,
} from "../controllers/authController";
import { protect } from "../middleware/auth";
import { Router } from "express";

const router = Router();

router.post("/register", register);
router.post("/login", login);
router.post("/logout", protect, logout);
router.get("/me", protect, getMe);
router.put("/me", protect, updateProfile);
router.put("/password", protect, updatePassword);

export default router;
