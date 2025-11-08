import crypto from "crypto";

/**
 * Genera un ID univoco
 */
export const generateId = (): string => {
  return crypto.randomUUID();
};

/**
 * Valida un indirizzo email
 */
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Sanitizza una stringa rimuovendo caratteri pericolosi
 */
export const sanitizeString = (input: string): string => {
  return input.trim().replace(/[<>]/g, "");
};

/**
 * Verifica se una stringa è vuota o contiene solo spazi
 */
export const isEmpty = (str: string | undefined | null): boolean => {
  return !str || str.trim().length === 0;
};
