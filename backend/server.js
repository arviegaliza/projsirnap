const express = require('express');
const cors = require('cors');
const pool = require('./db'); // your db.js using DATABASE_URL

const app = express();
const PORT = process.env.PORT || 4000;

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || '*' // set your frontend URL in env
}));
app.use(express.json());

// Routes
app.use('/api/restaurants', require('./routes/restaurants'));
app.use('/api/bookings', require('./routes/bookings'));

// Test DB connection on startup
pool.query('SELECT NOW()', (err, res) => {
  if (err) console.error('DB Connection Error:', err);
  else console.log('Connected to DB at', res.rows[0].now);
});

// Root route
app.get('/', (req, res) => res.send('Restaurant Booking API running'));

// Start server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
