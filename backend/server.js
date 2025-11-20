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

// CORS: Allow only your deployed frontend
const allowedOrigins = [
  process.env.FRONTEND_URL || 'https://projsirnap.vercel.app', // your Vercel frontend
  'http://localhost:3000' // for local dev
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
app.use('/api/bookings', bookingsRouter);

// Root test route
app.get('/', (req, res) => res.send('API running'));

// Test DB connection
pool.query('SELECT NOW()', (err, res) => {
  if (err) console.error('DB Connection Error:', err);
  else console.log('Connected to DB at', res.rows[0].now);
});

// Create HTTP server
const server = http.createServer(app);

// Initialize Socket.IO
const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    methods: ['GET', 'POST'],
    credentials: true,
  },
});

// Socket.IO events
io.on('connection', socket => {
  console.log('Client connected:', socket.id);

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
