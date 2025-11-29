import mysql from "mysql2/promise";

const url = process.env.DATABASE_URL;

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

export async function query<T = any>(sql: string, params: any[] = []) {
  const conn = getDB();
  const [rows] = await conn.query(sql, params);
  return rows as T;
}