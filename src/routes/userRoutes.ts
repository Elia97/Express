import { Router } from "express";
import {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
} from "@/controllers/userController.js";
import {
  validateCreateUser,
  validateUpdateUser,
} from "@/middleware/validation.js";

const router = Router();

// GET /api/users - Ottieni tutti gli utenti
router.get("/", getUsers);

// GET /api/users/:id - Ottieni un utente per ID
router.get("/:id", getUserById);

// POST /api/users - Crea un nuovo utente
router.post("/", validateCreateUser, createUser);

// PUT /api/users/:id - Aggiorna un utente
router.put("/:id", validateUpdateUser, updateUser);

// DELETE /api/users/:id - Elimina un utente
router.delete("/:id", deleteUser);

export default router;
