// test-booking.js
const io = require('socket.io-client');
const fetch = require('node-fetch');

const API = process.env.API || 'http://127.0.0.1:4000'; // use 127.0.0.1 to avoid localhost hiccups

async function main() {
  const socket = io(API, { transports: ['websocket', 'polling'] });

  socket.on('connect', () => {
    console.log('Socket connected', socket.id);
  });

  socket.on('bookingUpdated', payload => {
    console.log('Received bookingUpdated:', payload);
  });

  socket.on('disconnect', () => {
    console.log('Socket disconnected');
  });

  // Wait a bit for socket to connect
  await new Promise(r => setTimeout(r, 800));

  const body = {
    customer_name: 'Socket Test',
    phone: '+63 9000000000',
    email: 'socket@test.local',
    date: '2025-11-25',
    time: '20:00',
    guests: 2,
    restaurant_id: 1
  };

  try {
    const res = await fetch(`${API}/api/bookings`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    const data = await res.json();
    console.log('POST response:', data);
  } catch (err) {
    console.error('POST failed:', err);
  }

  // Keep alive a few seconds to receive the socket event
  await new Promise(r => setTimeout(r, 3000));
  socket.disconnect();
}

main().catch(err => console.error(err));
