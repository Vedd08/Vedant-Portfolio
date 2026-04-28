import express from "express";
import {
  getCertificates,
  addCertificate,
  deleteCertificate
} from "../controllers/certificateController.js";
import upload from "../middleware/upload.js";

const router = express.Router();

router.get("/", getCertificates);
router.post("/", upload.single("image"), addCertificate);
router.delete("/:id", deleteCertificate);

export default router;
