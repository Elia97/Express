import { Request, Response, NextFunction } from "express";
import { UserService } from "@/services/userService.js";

const userService = new UserService();

export const getUsers = async (
  _req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const [result, count] = await Promise.all([
      userService.getAllUsers(),
      userService.getUsersCount(),
    ]);

    if (result.error) {
      res.status(500).json({
        success: false,
        error: result.message || "Errore nel recupero degli utenti",
      });
      return;
    }

    res.status(200).json({
      success: true,
      count,
      data: result.data || [],
    });
  } catch (error) {
    next(error);
  }
};

export const getUserById = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { id } = req.params;
    const result = await userService.getUserById(id);

    if (result.error) {
      res.status(500).json({
        success: false,
        error: result.message || "Errore nel recupero dell'utente",
      });
      return;
    }

    if (result.data === null) {
      res.status(404).json({
        success: false,
        error: "Utente non trovato",
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: result.data,
    });
  } catch (error) {
    next(error);
  }
};

export const createUser = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const userData = req.body;
    const result = await userService.createUser(userData);

    if (!result.error) {
      res.status(201).json({
        success: true,
        data: result.data,
        message: "Utente creato con successo",
      });
      return;
    }

    if (result.code && result.code === "EMAIL_ALREADY_EXISTS") {
      res.status(400).json({
        success: false,
        error: result.message || "Email già esistente",
      });
      return;
    }

    res.status(500).json({
      success: false,
      error: result.message || "Errore nella creazione dell'utente",
    });
  } catch (error) {
    next(error);
  }
};

export const updateUser = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    const result = await userService.updateUser(id, updateData);

    if (!result.error) {
      res.status(200).json({
        success: true,
        data: result.data,
        message: "Utente aggiornato con successo",
      });
      return;
    }

    if (result.code) {
      switch (result.code) {
        case "USER_NOT_FOUND":
          res.status(404).json({
            success: false,
            error: result.message || "Utente non trovato",
          });
          return;
        case "EMAIL_ALREADY_EXISTS":
          res.status(400).json({
            success: false,
            error: result.message || "Email già esistente",
          });
          return;
      }
    }

    res.status(500).json({
      success: false,
      error: result.message || "Errore nell'aggiornamento dell'utente",
    });
  } catch (error) {
    next(error);
  }
};

export const deleteUser = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { id } = req.params;
    const result = await userService.deleteUser(id);

    if (result.error && result.code === "USER_NOT_FOUND") {
      res.status(404).json({ success: false, error: result.message });
      return;
    }

    res.status(200).json({
      success: true,
      message: "Utente eliminato con successo",
    });
  } catch (error) {
    next(error);
  }
};
