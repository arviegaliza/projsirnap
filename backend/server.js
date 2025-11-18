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
  origin: process.env.FRONTEND_URL || '*', // your frontend URL
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

// Create HTTP server
const server = http.createServer(app);

// Initialize Socket.IO
const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL || '*',
    methods: ['GET', 'POST'],
    credentials: true
  }
});

// Socket.IO events
io.on('connection', socket => {
  console.log('Client connected:', socket.id);

  // Example: broadcast updated booking to all clients
  socket.on('updateBooking', data => {
    console.log('Booking updated:', data);
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
