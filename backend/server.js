// server.js
const express = require('express');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
const pool = require('./db');
const usersRouter = require('./routes/users'); // <-- add this

const app = express();
const PORT = process.env.PORT || 4000;

// Middleware
app.use(cors({ origin: process.env.FRONTEND_URL || '*' }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API routes
app.use('/api/users', usersRouter);  // <-- mount the router
app.use('/api/restaurants', require('./routes/restaurants'));
app.use('/api/bookings', require('./routes/bookings'));

// Test DB
pool.query('SELECT NOW()', (err, res) => {
  if (err) console.error('DB Connection Error:', err);
  else console.log('Connected to DB at', res.rows[0].now);
});

// Root
app.get('/', (req, res) => res.send('API running'));

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
