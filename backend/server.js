// server.js
const express = require('express');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
const pool = require('./db');
const bcrypt = require('bcryptjs');

const usersRouter = require('./routes/users');
const restaurantsRouter = require('./routes/restaurants');
const bookingsRouterFactory = require('./routes/bookings');

const app = express();
const PORT = process.env.PORT || 4000;

// CORS: Allow local dev + deployed frontend
const allowedOrigins = [
  process.env.FRONTEND_URL || 'https://projsirnap.vercel.app',
  'http://localhost:3000'
];

app.use(cors({
  origin: allowedOrigins,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  credentials: true,
}));

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API routes
app.use('/api/users', usersRouter);
app.use('/api/restaurants', restaurantsRouter);

// Root route
app.get('/', (req, res) => res.send('API running'));

// Test DB connection
pool.query('SELECT NOW()', (err, result) => {
  if (err) console.error('DB Connection Error:', err);
  else console.log('Connected to DB at', result.rows[0].now);
});

// Create HTTP server and attach Socket.IO
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    methods: ['GET', 'POST'],
    credentials: true,
  },
});

// Mount bookings router with io
app.use('/api/bookings', bookingsRouterFactory(io));

// Global Socket.IO events
io.on('connection', socket => {
  console.log('Client connected:', socket.id);

  socket.on('updateBooking', data => {
    console.log('Booking updated (from socket):', data);
    io.emit('bookingUpdated', data);
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

// Start server
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
