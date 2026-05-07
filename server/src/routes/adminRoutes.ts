import { Router } from "express";
import {
  getDashboard,
  getAllUsers,
  getUser,
  updateUserRole,
  deleteUser,
  getSalesStats,
  getOrderStats,
} from "../controllers/adminController";
import { protect, adminOnly } from "../middleware/auth";

const router = Router();

// All admin routes are protected
router.use(protect, adminOnly);

router.get("/dashboard", getDashboard);

// User management
router.get("/users", getAllUsers);
router.get("/users/:id", getUser);
router.put("/users/:id/role", updateUserRole);
router.delete("/users/:id", deleteUser);

// Stats
router.get("/stats/sales", getSalesStats);
router.get("/stats/orders", getOrderStats);

export default router;
