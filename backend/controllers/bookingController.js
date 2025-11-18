// controllers/bookingController.js
const pool = require('../db'); // make sure db.js exists and exports a Pool

// Create a new booking
exports.createBooking = async (req, res) => {
  try {
    const { customer_name, phone, date, time, guests, restaurant_id } = req.body;

    if (!customer_name || !date || !time || !guests || !restaurant_id) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const result = await pool.query(
      `INSERT INTO bookings (customer_name, phone, date, time, guests, restaurant_id)
       VALUES ($1,$2,$3,$4,$5,$6) RETURNING *`,
      [customer_name, phone, date, time, guests, restaurant_id]
    );

    res.json({ success: true, booking: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

// Get all bookings
exports.getBookings = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM bookings ORDER BY date, time');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};
