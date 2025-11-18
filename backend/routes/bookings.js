const express = require('express');
const router = express.Router();
const pool = require('../db');

// Create a new booking
router.post('/', async (req, res) => {
  const { restaurant_id, name, time, tables } = req.body;

  try {
    const result = await pool.query(
      'INSERT INTO bookings (restaurant_id, name, time, tables) VALUES ($1, $2, $3, $4) RETURNING *',
      [restaurant_id, name, time, tables]
    );

    // Emit socket event for real-time updates
    req.io.emit('bookingUpdated', { restaurant_id });

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create booking' });
  }
});

module.exports = router;
