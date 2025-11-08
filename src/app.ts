import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import userRoutes from "@/routes/userRoutes.js";
import healthRoutes from "@/routes/healthRoutes.js";
import rootRoutes from "@/routes/rootRoutes.js";
import myEnv from "./config/env";
import { errorHandler } from "@/middleware/errorHandler.js";
import { notFound } from "@/middleware/notFound.js";

const app = express();

// Middleware di sicurezza
app.use(helmet());

// CORS configuration
app.use(
  cors({
    origin: myEnv.CORS_ORIGINS?.split(",") || ["http://localhost:3000"],
    credentials: true,
  }),
);

// Middleware di logging
app.use(morgan("combined"));

// Middleware per parsing JSON
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/", rootRoutes);
app.use("/api/health", healthRoutes);
app.use("/api/users", userRoutes);

// Middleware per gestire rotte non trovate
app.use(notFound);

// Middleware per gestire gli errori
app.use(errorHandler);

export default app;
