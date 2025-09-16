// db.js
require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  max: 10,                // connection pool size
  idleTimeoutMillis: 10_000
});

async function test() {
  const { rows } = await pool.query('SELECT 1 AS ok');
  console.log('DB OK:', rows[0]);
}
test().catch(console.error);

module.exports = pool;
