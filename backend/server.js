// server.js
const express = require('express');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
const pool = require('./db');

const usersRouter = require('./routes/users');
const restaurantsRouter = require('./routes/restaurants');
const bookingsRouter = require('./routes/bookings');

const app = express();
const PORT = process.env.PORT || 4000;

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || '*', // e.g., 'https://coffeenivincent.onrender.com'
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API routes
app.use('/api/users', usersRouter);
app.use('/api/restaurants', restaurantsRouter);
app.use('/api/bookings', bookingsRouter);

// Test DB
pool.query('SELECT NOW()', (err, res) => {
  if (err) console.error('DB Connection Error:', err);
  else console.log('Connected to DB at', res.rows[0].now);
});

// Root
app.get('/', (req, res) => res.send('API running'));

// Start server (without Socket.IO if not needed)
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
