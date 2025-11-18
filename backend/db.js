const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL, // your full Neon connection string
  ssl: {
    rejectUnauthorized: false, // required for Neon
  },
});

pool.on('connect', () => {
  console.log('✅ Connected to PostgreSQL');
});

pool.on('error', (err) => {
  console.error('❌ Unexpected DB error', err);
});

module.exports = pool;
