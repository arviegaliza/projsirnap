const express = require('express');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
const pool = require('./db'); // your db.js using DATABASE_URL

const app = express();
const PORT = process.env.PORT || 4000;

// Create HTTP server for socket.io
const server = http.createServer(app);

// Setup Socket.IO
const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL || '*', // allow your frontend URL
    methods: ['GET', 'POST'],
  },
});

io.on('connection', (socket) => {
  console.log('A user connected');

  // Listen for booking updates from clients
  socket.on('bookingUpdated', (data) => {
    console.log('Booking updated:', data);
    // Broadcast to all connected clients
    io.emit('bookingUpdated', data);
  });

  socket.on('disconnect', () => {
    console.log('A user disconnected');
  });
});

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || '*',
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
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
