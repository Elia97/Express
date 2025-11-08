import { Request, Response } from "express";
import myEnv from "@/config/env";

export interface AppError extends Error {
  statusCode?: number;
  status?: string;
  isOperational?: boolean;
}

export const errorHandler = (
  err: AppError,
  _req: Request,
  res: Response,
): void => {
  // Log dell'errore
  console.error("Error:", err);

  res.status(err.statusCode || 500).json({
    success: false,
    error: err.message || "Errore del server",
    ...(myEnv.NODE_ENV === "development" && { stack: err.stack }),
  });
};
