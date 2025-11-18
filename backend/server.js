// server.js
const express = require('express');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
const pool = require('./db'); // PostgreSQL connection

const app = express();
const PORT = process.env.PORT || 4000;

// HTTP server for Socket.IO
const server = http.createServer(app);

// Socket.IO setup
const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL || '*',
    methods: ['GET', 'POST'],
  },
});

io.on('connection', (socket) => {
  console.log('A user connected');

  socket.on('disconnect', () => {
    console.log('A user disconnected');
  });
});

// Middleware
app.use(cors({ origin: process.env.FRONTEND_URL || '*' }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/restaurants', require('./routes/restaurants'));
app.use('/api/bookings', require('./routes/bookings')(io)); // pass io

// Test DB connection
pool.query('SELECT NOW()', (err, res) => {
  if (err) console.error('DB Connection Error:', err);
  else console.log('Connected to DB at', res.rows[0].now);
});

// ------------------------
// Signup route (plain text for now)
// ------------------------
app.post('/api/users/signup', async (req, res) => { ... });
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: 'Email and password required' });

    const result = await pool.query(
      'INSERT INTO users(email, password) VALUES($1, $2) RETURNING id, email',
      [email, password]
    );

    res.json({ user: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Signup failed' });
  }
});

// ------------------------
// Login route (plain text for now)
// ------------------------
app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: 'Email and password required' });

    const user = await pool.query('SELECT * FROM users WHERE email=$1 AND password=$2', [email, password]);

    if (!user.rows.length) return res.status(401).json({ error: 'Invalid credentials' });

    // Send simple token (just user ID for now)
    res.json({ token: `user-${user.rows[0].id}`, user: { id: user.rows[0].id, email: user.rows[0].email } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Login failed' });
  }
});

// Root
app.get('/', (req, res) => res.send('Restaurant Booking API running'));

// Start server
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
