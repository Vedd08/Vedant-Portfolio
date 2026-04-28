import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import projectRoutes from "./routes/projectRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import viewRoutes from "./routes/viewRoutes.js";
import contactRoutes from "./routes/contactRoutes.js";
import certificateRoutes from "./routes/certificateRoutes.js";
import serviceRoutes from "./routes/serviceRoutes.js";
import experienceRoutes from "./routes/experienceRoutes.js";

dotenv.config();
connectDB();

const app = express();

app.use(cors({
  origin: [
    process.env.CLIENT_URL || 'http://localhost:5173',
    process.env.ADMIN_URL || 'http://localhost:5174'
  ],
  credentials: true
}));
app.use(express.json());

// Routes
app.use("/api/projects", projectRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/views", viewRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/certificates", certificateRoutes);
app.use("/api/services", serviceRoutes);
app.use("/api/experiences", experienceRoutes);
app.use("/uploads", express.static("public/uploads"));
app.use("/resume", express.static("public"));

app.get("/", (req, res) => {
  res.send("API Running...");
});

app.listen(5000, () => console.log("Server running on port 5000"));