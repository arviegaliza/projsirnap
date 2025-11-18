// src/pages/RestaurantPage.js
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { io } from 'socket.io-client';

const API = process.env.REACT_APP_API_BASE || 'http://localhost:4000';
const socket = io(API);

export default function RestaurantPage() {
  const { id } = useParams();
  const [restaurant, setRestaurant] = useState(null);
  const [loading, setLoading] = useState(true);

  // Booking form state
  const [customerName, setCustomerName] = useState('');
  const [phone, setPhone] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [guests, setGuests] = useState(1);

  useEffect(() => {
    const fetchRestaurant = async () => {
      try {
        const res = await fetch(`${API}/api/restaurants/${id}`);
        const data = await res.json();
        setRestaurant(data);
      } catch (err) {
        console.error('Failed to fetch restaurant:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchRestaurant();

    // Real-time table updates
    socket.on('bookingUpdated', (updatedData) => {
      if (updatedData.restaurantId === Number(id)) {
        setRestaurant(prev => ({
          ...prev,
          tables_available: updatedData.tables_available,
          promo: updatedData.promo
        }));
      }
    });

    return () => {
      socket.off('bookingUpdated');
    };
  }, [id]);

  const handleBooking = async (e) => {
    e.preventDefault();
    if (!customerName || !date || !time) return alert('Please fill all required fields');

    try {
      const res = await fetch(`${API}/api/bookings`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customer_name: customerName,
          phone,
          date,
          time,
          guests,
          restaurant_id: id
        })
      });
      const data = await res.json();
      if (res.ok) {
        alert('Booking successful!');
        socket.emit('bookingUpdated', {
          restaurantId: Number(id),
          tables_available: data.tables_available,
          promo: data.promo
        });
      } else {
        alert(data.message || 'Booking failed');
      }
    } catch (err) {
      console.error(err);
      alert('Error creating booking');
    }
  };

  if (loading) return <div className="text-center py-8">Loading restaurant details...</div>;
  if (!restaurant) return <div className="text-center py-8 text-red-600">Restaurant not found.</div>;

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 flex flex-col lg:flex-row gap-8">
      {/* Left: Restaurant info */}
      <div className="flex-1">
        <img src={restaurant.image} alt={restaurant.name} className="w-full h-64 rounded-lg object-cover mb-4" />
        <h2 className="text-2xl font-bold text-emerald-700">{restaurant.name} ({restaurant.type})</h2>
        <p className="text-sm text-gray-600">{restaurant.address} • {restaurant.city}</p>
        <p className="mt-2 text-sm text-gray-500">{restaurant.cuisine} • {restaurant.price_range ?? '-'} • {restaurant.rating ?? '-'}★</p>
        {restaurant.promo && (
          <span className="inline-block mt-2 px-2 py-1 text-xs bg-yellow-100 text-yellow-800 rounded">{restaurant.promo}</span>
        )}

        <h3 className="font-semibold mt-4">Menu</h3>
        <ul className="list-disc pl-5 mt-2">
          {restaurant.menu?.map(item => (
            <li key={item.id}>
              {item.name} - {item.price} {item.promo && <span className="text-yellow-700">{item.promo}</span>}
            </li>
          ))}
        </ul>
      </div>

      {/* Right: Booking form */}
      <div className="w-full lg:w-96 border rounded p-4 bg-white shadow-md">
        <div className="text-sm text-gray-600 mb-2">
          Available tables: <strong>{restaurant.tables_available ?? '-'}</strong>
        </div>
        <form onSubmit={handleBooking} className="flex flex-col gap-2">
          <input
            type="text"
            placeholder="Your Name"
            value={customerName}
            onChange={e => setCustomerName(e.target.value)}
            required
            className="border px-3 py-2 rounded focus:border-emerald-500 focus:ring focus:ring-emerald-200"
          />
          <input
            type="tel"
            placeholder="Phone (optional)"
            value={phone}
            onChange={e => setPhone(e.target.value)}
            className="border px-3 py-2 rounded focus:border-emerald-500 focus:ring focus:ring-emerald-200"
          />
          <input
            type="date"
            value={date}
            onChange={e => setDate(e.target.value)}
            required
            className="border px-3 py-2 rounded focus:border-emerald-500 focus:ring focus:ring-emerald-200"
          />
          <input
            type="time"
            value={time}
            onChange={e => setTime(e.target.value)}
            required
            className="border px-3 py-2 rounded focus:border-emerald-500 focus:ring focus:ring-emerald-200"
          />
          <input
            type="number"
            min="1"
            placeholder="Guests"
            value={guests}
            onChange={e => setGuests(Number(e.target.value))}
            className="border px-3 py-2 rounded focus:border-emerald-500 focus:ring focus:ring-emerald-200"
          />
          <button type="submit" className="mt-2 bg-emerald-600 text-white px-3 py-2 rounded hover:bg-emerald-700 transition">
            Book Now
          </button>
        </form>
      </div>
    </div>
  );
}
