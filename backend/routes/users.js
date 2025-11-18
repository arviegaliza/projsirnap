// routes/users.js
const express = require('express');
const router = express.Router();
const pool = require('../db'); // your db.js connection

// REGISTER USER (plain text password)
router.post('/register', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ message: 'Email and password required' });

  try {
    // Check if user exists
    const existing = await pool.query('SELECT * FROM users WHERE email=$1', [email]);
    if (existing.rows.length) return res.status(400).json({ message: 'Email already registered' });

    const result = await pool.query(
      'INSERT INTO users (email, password) VALUES ($1, $2) RETURNING id, email',
      [email, password]
    );

    res.status(201).json({ message: 'User registered', user: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// LOGIN USER (plain text password)
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ message: 'Email and password required' });

  try {
    const result = await pool.query('SELECT * FROM users WHERE email=$1', [email]);
    if (!result.rows.length) return res.status(401).json({ message: 'Invalid credentials' });

    const user = result.rows[0];
    if (user.password !== password) return res.status(401).json({ message: 'Invalid credentials' });

    res.json({ message: 'Login successful', user: { id: user.id, email: user.email } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
