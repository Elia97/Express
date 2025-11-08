import { db } from "@/config/database.js";
import type { User, CreateUserData, UpdateUserData } from "@/models/User.js";

export class UserRepository {
  async findAll(): Promise<User[]> {
    const result = await db.query(
      "SELECT id, name, email, age, created_at, updated_at FROM users ORDER BY created_at DESC",
    );

    return result.rows.map((row) => ({
      id: row.id,
      name: row.name,
      email: row.email,
      age: row.age,
      createdAt: new Date(row.created_at),
      updatedAt: new Date(row.updated_at),
    }));
  }

  async findById(id: string): Promise<User | null> {
    const result = await db.query(
      "SELECT id, name, email, age, created_at, updated_at FROM users WHERE id = $1",
      [id],
    );

    if (result.rows.length === 0) {
      return null;
    }

    const row = result.rows[0];
    return {
      id: row.id,
      name: row.name,
      email: row.email,
      age: row.age,
      createdAt: new Date(row.created_at),
      updatedAt: new Date(row.updated_at),
    };
  }

  async findByEmail(email: string): Promise<User | null> {
    const result = await db.query(
      "SELECT id, name, email, age, created_at, updated_at FROM users WHERE email = $1",
      [email],
    );

    if (result.rows.length === 0) {
      return null;
    }

    const row = result.rows[0];
    return {
      id: row.id,
      name: row.name,
      email: row.email,
      age: row.age,
      createdAt: new Date(row.created_at),
      updatedAt: new Date(row.updated_at),
    };
  }

  async create(userData: CreateUserData): Promise<User> {
    const query = `
      INSERT INTO users (name, email, age) 
      VALUES ($1, $2, $3) 
      RETURNING id, name, email, age, created_at, updated_at
    `;

    const values = [userData.name, userData.email, userData.age || null];
    const result = await db.query(query, values);

    const row = result.rows[0];
    return {
      id: row.id,
      name: row.name,
      email: row.email,
      age: row.age,
      createdAt: new Date(row.created_at),
      updatedAt: new Date(row.updated_at),
    };
  }

  async update(id: string, updateData: UpdateUserData): Promise<User | null> {
    const fields: string[] = [];
    const values: unknown[] = [];
    let paramCount = 1;

    if (updateData.name !== undefined) {
      fields.push(`name = $${paramCount}`);
      values.push(updateData.name);
      paramCount++;
    }

    if (updateData.email !== undefined) {
      fields.push(`email = $${paramCount}`);
      values.push(updateData.email);
      paramCount++;
    }

    if (updateData.age !== undefined) {
      fields.push(`age = $${paramCount}`);
      values.push(updateData.age);
      paramCount++;
    }

    if (fields.length === 0) {
      return null;
    }

    values.push(id); // ID sempre come ultimo parametro

    const query = `
      UPDATE users 
      SET ${fields.join(", ")}, updated_at = CURRENT_TIMESTAMP
      WHERE id = $${paramCount}
      RETURNING id, name, email, age, created_at, updated_at
    `;

    const result = await db.query(query, values);

    if (result.rows.length === 0) {
      return null;
    }

    const row = result.rows[0];
    return {
      id: row.id,
      name: row.name,
      email: row.email,
      age: row.age,
      createdAt: new Date(row.created_at),
      updatedAt: new Date(row.updated_at),
    };
  }

  async delete(id: string): Promise<boolean> {
    const result = await db.query("DELETE FROM users WHERE id = $1", [id]);
    return (result.rowCount || 0) > 0;
  }

  async count(): Promise<number> {
    const result = await db.query("SELECT COUNT(*) as count FROM users");
    return parseInt(result.rows[0].count);
  }
}
