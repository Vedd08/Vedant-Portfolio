import express from "express";
import {
  getServices,
  addService,
  deleteService
} from "../controllers/serviceController.js";
import upload from "../middleware/upload.js";

const router = express.Router();

router.get("/", getServices);
router.post("/", upload.single("image"), addService);
router.delete("/:id", deleteService);

export default router;
