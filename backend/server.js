const express = require('express');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
const pool = require('./db'); // PostgreSQL connection

const app = express();
const PORT = process.env.PORT || 4000;

// HTTP + Socket.IO
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: '*', methods: ['GET','POST'] },
});

io.on('connection', (socket) => {
  console.log('Socket connected');
  socket.on('disconnect', () => console.log('Socket disconnected'));
});

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/users', require('./routes/users'));
app.use('/api/restaurants', require('./routes/restaurants'));
app.use('/api/bookings', require('./routes/bookings')(io)); // pass io for real-time updates

// Start server
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
