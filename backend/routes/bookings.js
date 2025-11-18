// routes/bookings.js
const express = require('express');

module.exports = (io) => {
  const router = express.Router();
  const pool = require('../db');

  // Create a booking
  router.post('/', async (req, res) => {
    const { customer_name, phone, email, date, time, guests, restaurant_id } = req.body;
    try {
      // Insert booking
      const result = await pool.query(
        `INSERT INTO bookings (customer_name, phone, email, date, time, guests, restaurant_id)
         VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING *`,
        [customer_name, phone, email, date, time, guests, restaurant_id]
      );

      // Update available tables
      const restaurant = await pool.query(
        'SELECT tables_available FROM restaurants WHERE id = $1',
        [restaurant_id]
      );

      let tables_available = restaurant.rows[0].tables_available - guests;
      if (tables_available < 0) tables_available = 0;

      await pool.query(
        'UPDATE restaurants SET tables_available = $1 WHERE id = $2',
        [tables_available, restaurant_id]
      );

      // Emit real-time update
      io.emit('bookingUpdated', { restaurantId: restaurant_id, tables_available });

      res.json({ message: 'Booking created', booking: result.rows[0] });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Server error' });
    }
  });

  return router;
};
