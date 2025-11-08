import type { User, CreateUserData, UpdateUserData } from "@/models/User.js";
import { UserRepository } from "@/repositories/userRepository.js";

type ServiceResult<T> = {
  error: boolean;
  data?: T;
  message?: string;
  code?: string | null;
};

class ServiceError extends Error {
  code: string;
  constructor(message: string, code: string) {
    super(message);
    this.code = code;
    Object.setPrototypeOf(this, ServiceError.prototype);
  }
}

export class UserService {
  private userRepository: UserRepository;

  constructor() {
    this.userRepository = new UserRepository();
  }

  private async handleErrors<T>(
    fn: () => Promise<T>,
  ): Promise<ServiceResult<T>> {
    try {
      const data = await fn();
      return { error: false, data };
    } catch (error) {
      return {
        error: true,
        message: error instanceof Error ? error.message : "Errore sconosciuto",
        code: error instanceof ServiceError ? error.code : null,
      };
    }
  }

  async getAllUsers(): Promise<ServiceResult<User[]>> {
    return this.handleErrors(async () => this.userRepository.findAll());
  }

  async getUserById(id: string): Promise<ServiceResult<User | null>> {
    return this.handleErrors(async () => this.userRepository.findById(id));
  }

  async createUser(userData: CreateUserData): Promise<ServiceResult<User>> {
    return this.handleErrors(async () => {
      // Validazione email duplicata
      const existingUser = await this.userRepository.findByEmail(
        userData.email,
      );

      if (existingUser)
        throw new ServiceError("Email già esistente", "EMAIL_ALREADY_EXISTS");

      return this.userRepository.create(userData);
    });
  }

  async updateUser(
    id: string,
    updateData: UpdateUserData,
  ): Promise<ServiceResult<User | null>> {
    return this.handleErrors(async () => {
      // Verifica che l'utente esista
      const existingUser = await this.userRepository.findById(id);
      if (!existingUser)
        throw new ServiceError("Utente non trovato", "USER_NOT_FOUND");

      // Validazione email duplicata (se viene cambiata)
      if (updateData.email && updateData.email !== existingUser.email) {
        const emailExists = await this.userRepository.findByEmail(
          updateData.email,
        );
        if (emailExists)
          throw new ServiceError("Email già esistente", "EMAIL_ALREADY_EXISTS");
      }
      return this.userRepository.update(id, updateData);
    });
  }

  async deleteUser(id: string): Promise<ServiceResult<boolean>> {
    return this.handleErrors(async () => {
      const deleted = await this.userRepository.delete(id);
      if (!deleted)
        throw new ServiceError("Utente non trovato", "USER_NOT_FOUND");
      return deleted;
    });
  }

  async getUsersCount(): Promise<number> {
    return this.userRepository.count();
  }
}
