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

const startServer = async () => {
  try {
    // Connect to MongoDB before starting the server
    await connectDB();

    const app = express();

    // Allowed origins: specific production URLs + all *.vercel.app preview URLs + localhost
    const allowedOrigins = [
      process.env.CLIENT_URL,
      process.env.ADMIN_URL,
      'http://localhost:5173',
      'http://localhost:5174',
      'http://localhost:5175',
    ].filter(Boolean);

    // Regex to allow ANY Vercel preview/production subdomain
    const vercelRegex = /^https:\/\/.*\.vercel\.app$/;

    app.use(cors({
      origin: function (origin, callback) {
        // Allow requests with no origin (curl, Postman, mobile apps)
        if (!origin) return callback(null, true);
        // Allow any *.vercel.app URL (covers preview deployments)
        if (vercelRegex.test(origin)) return callback(null, true);
        // Allow explicitly listed origins
        if (allowedOrigins.includes(origin)) return callback(null, true);
        // Block everything else
        console.warn(`CORS blocked: ${origin}`);
        return callback(new Error(`CORS policy: origin ${origin} not allowed`));
      },
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

    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

    // Graceful shutdown
    process.on('SIGINT', async () => {
      console.log('Server shutting down...');
      process.exit(0);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
};

startServer();