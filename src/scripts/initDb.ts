import { readFileSync } from "fs";
import { join } from "path";
import { db } from "@/config/database.js";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function initializeDatabase(): Promise<void> {
  try {
    console.log("🚀 Inizializzazione del database...");

    // Legge e esegue lo schema SQL
    const schemaPath = join(__dirname, "../../database/schema.sql");
    const schema = readFileSync(schemaPath, "utf-8");
    await db.query(schema);

    console.log("✅ Database inizializzato con successo!");

    // Test: conta gli utenti
    const result = await db.query("SELECT COUNT(*) as count FROM users");
    console.log(`📊 Utenti nel database: ${result.rows[0].count}`);
  } catch (error) {
    console.error("❌ Errore durante l'inizializzazione:", error);
  } finally {
    await db.close();
    process.exit(0);
  }
}

// Esegui solo se chiamato direttamente
if (import.meta.url === `file://${process.argv[1]}`) {
  initializeDatabase();
}
