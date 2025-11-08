import { Router } from "express";
import myEnv from "@/config/env";

const router = Router();

// Route per controllare la salute dell'API
router.get("/", (_req, res) => {
  res.status(200).json({
    success: true,
    message: "API funzionante correttamente",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: myEnv.NODE_ENV || "development",
  });
});

// Route per controlli più dettagliati
router.get("/detailed", (_req, res) => {
  res.status(200).json({
    success: true,
    message: "Check dettagliato dell'API",
    data: {
      status: "healthy",
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: myEnv.NODE_ENV || "development",
      version: "1.0.0",
      node_version: process.version,
      memory: process.memoryUsage(),
    },
  });
});

export default router;
