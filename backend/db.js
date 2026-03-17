import pg from "pg";

const { Pool } = pg;

const pool = new Pool(
  process.env.DATABASE_URL
    ? { connectionString: process.env.DATABASE_URL }
    : {
        host: process.env.PGHOST ?? "localhost",
        port: parseInt(process.env.PGPORT ?? "5432", 10),
        user: process.env.PGUSER ?? "postgres",
        password: process.env.PGPASSWORD ?? "",
        database: process.env.PGDATABASE ?? "aiddb",
      }
);

export async function query(text, params) {
  const client = await pool.connect();
  try {
    return await client.query(text, params);
  } finally {
    client.release();
  }
}

export async function getClient() {
  return pool.connect();
}

export default pool;
