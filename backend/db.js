// db.js
const { Pool } = require('pg');
require('dotenv').config();

// Create a PostgreSQL connection pool
const pool = new Pool({
  connectionString: process.env.DATABASE_URL, // full Neon/PostgreSQL URL from .env
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
});

// Log successful connection
pool.on('connect', () => {
  console.log('✅ Connected to PostgreSQL database');
});

// Handle unexpected errors
pool.on('error', (err) => {
  console.error('❌ Unexpected database error:', err);
  process.exit(-1); // optional: exit if critical DB error occurs
});

module.exports = pool;
