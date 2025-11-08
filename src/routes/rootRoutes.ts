import { Router } from "express";
import { dbSummary } from "@/controllers/homeController.js";

const router = Router();

router.get("/", dbSummary);

export default router;
