require("dotenv").config();
const { Pool } = require("pg");

const isProduction = process.env.NODE_ENV === "production";

function criarPool() {
  if (!isProduction) {
    return new Pool({
      host: process.env.PGHOST,
      user: process.env.PGUSER,
      password: process.env.PGPASSWORD,
      database: process.env.PGDATABASE,
      port: process.env.PGPORT
    });
  }

  // 🔥 Parse manual da DATABASE_URL
  const url = new URL(process.env.DATABASE_URL);

  return new Pool({
    host: url.hostname,        // 👈 força DNS IPv4
    user: url.username,
    password: url.password,
    database: url.pathname.replace("/", ""),
    port: Number(url.port),
    ssl: { rejectUnauthorized: false }
  });
}

const pool = criarPool();
module.exports = pool;
