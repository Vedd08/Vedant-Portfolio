import express from "express";
import { trackView, getStats, addTestView, clearViews } from "../controllers/viewController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/track", trackView);
router.get("/stats", protect, getStats);
router.post("/test", protect, addTestView);     // For testing
router.delete("/clear", protect, clearViews);   // Clear all views

export default router;