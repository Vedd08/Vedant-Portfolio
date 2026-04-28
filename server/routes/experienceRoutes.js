import express from "express";
import {
  getExperiences,
  addExperience,
  deleteExperience
} from "../controllers/experienceController.js";
const router = express.Router();

router.get("/", getExperiences);
router.post("/", addExperience);
router.delete("/:id", deleteExperience);

export default router;
