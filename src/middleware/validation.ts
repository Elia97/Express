import { Request, Response, NextFunction } from "express";
import { isValidEmail, isEmpty, sanitizeString } from "@/utils/helpers.js";

export const validateCreateUser = (
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  const name = sanitizeString(req.body.name ?? "");
  const email = sanitizeString(req.body.email ?? "");

  // Validazione campi obbligatori
  if (isEmpty(name)) {
    res.status(400).json({
      success: false,
      error: "Il nome è obbligatorio",
    });
    return;
  }

  if (isEmpty(email)) {
    res.status(400).json({
      success: false,
      error: "L'email è obbligatoria",
    });
    return;
  }

  // Validazione formato email
  if (!isValidEmail(email)) {
    res.status(400).json({
      success: false,
      error: "Formato email non valido",
    });
    return;
  }

  // Validazione età se presente
  if (req.body.age !== undefined) {
    const age = Number(req.body.age);
    if (isNaN(age) || age < 0 || age > 150) {
      res.status(400).json({
        success: false,
        error: "L'età deve essere un numero valido tra 0 e 150",
      });
      return;
    }
  }

  req.body.name = name;
  req.body.email = email;

  next();
};

export const validateUpdateUser = (
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  // Almeno un campo deve essere presente
  if (Object.keys(req.body).length === 0) {
    res.status(400).json({
      success: false,
      error: "Almeno un campo deve essere fornito per l'aggiornamento",
    });
    return;
  }

  const name = sanitizeString(req.body.name ?? "");
  const email = sanitizeString(req.body.email ?? "");

  // Validazione nome se presente
  if (name !== undefined && isEmpty(name)) {
    res.status(400).json({
      success: false,
      error: "Il nome non può essere vuoto",
    });
    return;
  }

  // Validazione email se presente
  if (email !== undefined) {
    if (isEmpty(email)) {
      res.status(400).json({
        success: false,
        error: "L'email non può essere vuota",
      });
      return;
    }

    if (!isValidEmail(email)) {
      res.status(400).json({
        success: false,
        error: "Formato email non valido",
      });
      return;
    }
  }

  // Validazione età se presente
  if (req.body.age !== undefined) {
    const ageNumber = Number(req.body.age);
    if (isNaN(ageNumber) || ageNumber < 0 || ageNumber > 150) {
      res.status(400).json({
        success: false,
        error: "L'età deve essere un numero valido tra 0 e 150",
      });
      return;
    }
  }

  // Aggiorna solo i campi presenti
  if (req.body.name !== undefined) {
    req.body.name = name;
  }
  if (req.body.email !== undefined) {
    req.body.email = email;
  }

  next();
};
