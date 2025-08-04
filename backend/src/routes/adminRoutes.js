import express from "express";
import {
  getAllUsers,
  getAdminStats,
  getUserDetails,
  updateUserRole,
  deleteUser,
  deleteUserUpload,
  deleteSavedChart,
  deleteUserChart,
  getUserActivity
} from "../controllers/adminControllers.js";
import { adminAuth } from "../middleware/adminMiddleware.js";

const router = express.Router();

// middleware
router.use(adminAuth);

//get all users
router.get("/users", getAllUsers);

// get specific user details
router.get("/users/:userId", getUserDetails);

// update user role
router.put("/users/:userId", updateUserRole);

//delete user
router.delete("/users/:userId", deleteUser);

// get all states
router.get("/stats", getAdminStats);

// ////////////////////////////////////////////
// USer Specific management
router.delete("/users/:userId/uploads/:uploadId", deleteUserUpload);
router.delete("/users/:userId/charts/:chartId", deleteUserChart);
router.get("/users/:userId/activity", getUserActivity); // User activity tracking

export default router;
