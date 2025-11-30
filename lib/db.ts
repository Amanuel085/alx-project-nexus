import mysql from "mysql2/promise";

const url = process.env.DATABASE_URL || (process.env.NODE_ENV !== "production" ? "mysql://root:@localhost:3306/pollify" : undefined);

let pool: mysql.Pool | null = null;

export function getDB() {
  if (pool) return pool;
  if (!url) {
    throw new Error("DATABASE_URL is not set");
  }
  pool = mysql.createPool({
    uri: url,
    connectionLimit: 10,
    waitForConnections: true,
  });
  return pool;
}

export async function query<T>(
  sql: string,
  params: Array<string | number | Date | null> = []
) {
  const conn = getDB();
  const [rows] = await conn.query(sql, params);
  return rows as T;
}