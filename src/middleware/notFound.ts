import { Request, Response } from "express";

export const notFound = (req: Request, res: Response): void => {
  res.status(404).json({
    success: false,
    error: `Rotta non trovata - ${req.originalUrl}`,
    path: req.originalUrl,
    method: req.method,
  });
};
