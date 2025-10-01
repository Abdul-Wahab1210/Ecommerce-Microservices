import express from "express";
import {
  register,
  login,
  getProfile,
  logout,
  updateProfile,
} from "../controllers/userController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/profile", protect, getProfile);
router.post("/logout", protect, logout);
router.put("/updateprofile", protect, updateProfile);

export default router;
