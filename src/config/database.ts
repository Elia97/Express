import { Pool, PoolConfig, QueryResult, PoolClient } from "pg";
import myEnv from "./env";

class Database {
  public config: PoolConfig;
  private pool: Pool;

  constructor() {
    const config: PoolConfig = {
      user: myEnv.DB_USER,
      host: myEnv.DB_HOST,
      database: myEnv.DB_NAME,
      password: myEnv.DB_PASSWORD,
      port: parseInt(myEnv.DB_PORT || "5432"),
      ssl: myEnv.DB_SSL === "true" ? { rejectUnauthorized: false } : false,
      max: 20, // numero massimo di connessioni nel pool
      idleTimeoutMillis: 30000, // chiude le connessioni inattive dopo 30 secondi
      connectionTimeoutMillis: 2000, // timeout per la connessione di 2 secondi
    };

    this.config = config;
    this.pool = new Pool(config);

    // Test della connessione
    this.testConnection();
  }

  private async testConnection(): Promise<void> {
    try {
      const client = await this.pool.connect();
      console.log("✅ Connessione al database PostgreSQL riuscita");
      client.release();
    } catch (error) {
      console.error("❌ Errore di connessione al database:", error);
    }
  }

  async query(text: string, params?: unknown[]): Promise<QueryResult> {
    try {
      return await this.pool.query(text, params);
    } catch (error) {
      console.error("❌ Errore nella query:", error);
      throw error;
    }
  }

  async getClient(): Promise<PoolClient> {
    return this.pool.connect();
  }

  async close(): Promise<void> {
    await this.pool.end();
    console.log("🔐 Connessione al database chiusa");
  }
}

export const db = new Database();
