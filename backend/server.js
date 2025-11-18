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

// POST /api/signup
app.post('/api/signup', async (req, res) => {
  const { email, password } = req.body;
  const hash = await bcrypt.hash(password, 10);
  const result = await pool.query(
    'INSERT INTO users(email, password_hash) VALUES($1,$2) RETURNING id,email',
    [email, hash]
  );
  res.json({ user: result.rows[0] });
});

// POST /api/login
app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;
  const user = await pool.query('SELECT * FROM users WHERE email=$1', [email]);
  if (!user.rows.length) return res.status(401).json({ error: 'Invalid credentials' });
  const valid = await bcrypt.compare(password, user.rows[0].password_hash);
  if (!valid) return res.status(401).json({ error: 'Invalid credentials' });
  // Return JWT token or session cookie
  res.json({ token: 'JWT_TOKEN_HERE', user: { id: user.rows[0].id, email: user.rows[0].email } });
});


// Root route
app.get('/', (req, res) => res.send('Restaurant Booking API running'));

// Start server
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
