const { Pool } = require("pg");
require("dotenv").config();

const conn =
  process.env.NODE_ENV === "test"
    ? process.env.DATABASE_URL_TEST || process.env.DATABASE_URL
    : process.env.DATABASE_URL;

const pool = new Pool({ connectionString: conn });
pool.on("error", (err) => console.error("PG Pool error:", err));

module.exports = { pool };
