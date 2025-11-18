// server.js
const express = require('express');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
const pool = require('./db'); // your db.js connection to PostgreSQL

const app = express();
const PORT = process.env.PORT || 4000;

// Create HTTP server (needed for Socket.IO)
const server = http.createServer(app);

// Setup Socket.IO for real-time updates
const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL || '*', // allow your frontend URL
    methods: ['GET', 'POST'],
  },
});

io.on('connection', (socket) => {
  console.log('A user connected');

  // Optional: listen for custom events from clients
  socket.on('disconnect', () => {
    console.log('A user disconnected');
  });
});

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || '*',
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/restaurants', require('./routes/restaurants'));
app.use('/api/bookings', require('./routes/bookings')(io)); // pass io to bookings route

// Test DB connection
pool.query('SELECT NOW()', (err, res) => {
  if (err) console.error('DB Connection Error:', err);
  else console.log('Connected to DB at', res.rows[0].now);
});

// Root route
app.get('/', (req, res) => res.send('Restaurant Booking API running'));

// Start server
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
