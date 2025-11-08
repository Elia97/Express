import { Request, Response, NextFunction } from "express";
import { db } from "@/config/database.js";

export async function dbSummary(
  _req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const { user, host, database, port } = db.config || {};
    const versionResult = await db.query("SELECT version();");
    const version = versionResult.rows[0]?.version || null;

    // Recupera tutte le tabelle
    const tablesResult = await db.query(
      "SELECT table_name FROM information_schema.tables WHERE table_schema = 'public';",
    );
    const tables = tablesResult.rows.map((r) => r.table_name);

    // Recupera colonne e numero di record per ogni tabella
    const tableDetails = [];
    for (const table of tables) {
      const columnsResult = await db.query(
        `SELECT column_name, data_type FROM information_schema.columns WHERE table_name = $1;`,
        [table],
      );
      const columns = columnsResult.rows;

      const countResult = await db.query(`SELECT COUNT(*) FROM ${table};`);
      const rowCount = parseInt(countResult.rows[0].count, 10);

      const sizeResult = await db.query(
        `SELECT pg_total_relation_size($1) AS size;`,
        [table],
      );
      const size = sizeResult.rows[0].size;

      tableDetails.push({
        table,
        columns,
        rowCount,
        size,
      });
    }

    // Recupera indici
    const indexesResult = await db.query(`
      SELECT tablename, indexname, indexdef
      FROM pg_indexes
      WHERE schemaname = 'public';
    `);

    res.json({
      dbUser: user,
      dbHost: host,
      dbName: database,
      dbPort: port,
      dbVersion: version,
      tables: tableDetails,
      indexes: indexesResult.rows,
    });
  } catch (err) {
    next(err);
  }
}
