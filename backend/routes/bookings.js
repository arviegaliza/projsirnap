// routes/bookings.js
const express = require('express');

module.exports = (io) => {
  const router = express.Router();
  const pool = require('../db');

  // Create a booking
  router.post('/', async (req, res) => {
    const {
      customer_name,
      phone,
      email = null,
      date,
      time,
      guests = 1,
      restaurant_id,
    } = req.body;

    if (!customer_name || !phone || !date || !time || !restaurant_id) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    // Use a DB transaction to ensure consistency
    const client = await pool.connect();
    try {
      await client.query('BEGIN');

      // Lock the restaurant row FOR UPDATE so concurrent bookings don't race
      const r = await client.query(
        'SELECT id, tables_available, promo FROM restaurants WHERE id = $1 FOR UPDATE',
        [restaurant_id]
      );

      if (!r.rows.length) {
        await client.query('ROLLBACK');
        return res.status(404).json({ message: 'Restaurant not found' });
      }

      const restaurant = r.rows[0];

      // Decide how to decrement tables_available:
      // Option A (default here): 1 table per booking
      let newTables = (restaurant.tables_available ?? 0) - 1;

      // Option B (alternatively, subtract by number of guests/seats)
      // uncomment the next line and comment out the Option A line above if you want seats behavior:
      // let newTables = (restaurant.tables_available ?? 0) - Number(guests);

      if (newTables < 0) newTables = 0;

      // Insert booking
      const insert = await client.query(
        `INSERT INTO bookings
          (customer_name, phone, email, date, time, guests, restaurant_id)
         VALUES ($1,$2,$3,$4,$5,$6,$7)
         RETURNING id, customer_name, phone, email, date, time, guests, restaurant_id, created_at`,
        [customer_name, phone, email, date, time, guests, restaurant_id]
      );

      // Update restaurant availability
      await client.query(
        'UPDATE restaurants SET tables_available = $1 WHERE id = $2',
        [newTables, restaurant_id]
      );

      // Commit transaction
      await client.query('COMMIT');

      const booking = insert.rows[0];

      // Build a consistent payload for sockets
      const payload = {
        restaurantId: Number(restaurant_id),
        tables_available: newTables,
        promo: restaurant.promo ?? null,
        booking: booking, // include created booking if clients want it
      };

      // Emit to all connected clients
      if (io && typeof io.emit === 'function') {
        io.emit('bookingUpdated', payload);
      }

      return res.json({ message: 'Booking created', booking });
    } catch (err) {
      await client.query('ROLLBACK').catch(() => {});
      console.error('Booking error:', err);
      return res.status(500).json({ message: 'Server error' });
    } finally {
      client.release();
    }
  });

  return router;
};
