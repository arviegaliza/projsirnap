// src/pages/RestaurantPage.js
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import BookingForm from '../components/BookingForm';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { io } from 'socket.io-client';

const API = process.env.REACT_APP_API_BASE || 'http://localhost:4000';

export default function RestaurantPage() {
  const { id } = useParams();
  const [restaurant, setRestaurant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [bookings, setBookings] = useState([]); // all bookings for this restaurant
  const [selectedDate, setSelectedDate] = useState(new Date());

  useEffect(() => {
    const socket = io(API);

    const fetchRestaurant = async () => {
      try {
        const res = await fetch(`${API}/api/restaurants/${id}`);
        if (!res.ok) throw new Error('Failed to fetch restaurant');
        const data = await res.json();
        setRestaurant(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    const fetchBookings = async () => {
      try {
        const res = await fetch(`${API}/api/bookings?restaurantId=${id}`);
        if (!res.ok) throw new Error('Failed to fetch bookings');
        const data = await res.json();
        setBookings(data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchRestaurant();
    fetchBookings();

    // Real-time booking updates
    socket.on('bookingUpdated', (updatedData) => {
      if (updatedData.restaurantId === id) {
        fetchRestaurant();
        fetchBookings();
      }
    });

    return () => {
      socket.disconnect();
    };
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-8 text-center text-gray-600">
        Loading restaurant details...
      </div>
    );
  }

  if (!restaurant) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-8 text-center text-red-600">
        Restaurant not found.
      </div>
    );
  }

  // Filter bookings for the selected date
  const bookingsForDate = bookings.filter(
    (b) => new Date(b.date).toDateString() === selectedDate.toDateString()
  );

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 flex flex-col lg:flex-row gap-8">
      {/* Restaurant Info */}
      <div className="flex-1 space-y-4">
        <h2 className="text-2xl font-bold text-emerald-700">{restaurant.name}</h2>
        <p className="text-sm text-gray-600">
          {restaurant.address} • {restaurant.city}
        </p>
        <p className="text-sm text-gray-500">
          {restaurant.cuisine} • {restaurant.price_range ?? '-'} • {restaurant.rating ?? '-'}★
        </p>
        {restaurant.promo && (
          <span className="inline-block mt-2 px-2 py-1 text-xs bg-yellow-100 text-yellow-800 rounded">
            {restaurant.promo}
          </span>
        )}

        {/* Calendar */}
        <div className="mt-6">
          <h3 className="font-semibold mb-2 text-gray-700">Bookings Calendar</h3>
          <Calendar
            value={selectedDate}
            onChange={setSelectedDate}
            tileContent={({ date }) => {
              const dailyBookings = bookings.filter(
                (b) => new Date(b.date).toDateString() === date.toDateString()
              );
              return dailyBookings.length > 0 ? (
                <div className="text-xs text-white bg-emerald-600 rounded-full w-5 h-5 text-center mt-1">
                  {dailyBookings.length}
                </div>
              ) : null;
            }}
          />
        </div>

        {/* Bookings list for selected date */}
        <div className="mt-4">
          <h4 className="font-semibold text-gray-700">Bookings for {selectedDate.toDateString()}</h4>
          {bookingsForDate.length > 0 ? (
            <ul className="mt-2 space-y-1 text-sm text-gray-600">
              {bookingsForDate.map((b) => (
                <li key={b.id}>
                  {b.time} - {b.customer_name} ({b.guests} guests)
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500 mt-1">No bookings for this date.</p>
          )}
        </div>
      </div>

      {/* Booking Form */}
      <div className="w-full lg:w-96 border rounded p-4 bg-white shadow-md">
        <div className="text-sm text-gray-600 mb-2">
          Available tables: <strong>{restaurant.tables_available ?? '-'}</strong>
        </div>
        <BookingForm restaurant={restaurant} />
      </div>
    </div>
  );
}
