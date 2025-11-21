// src/components/RestaurantPage.js
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import socket from '../socket';

const API = process.env.REACT_APP_API_BASE || 'http://localhost:4000';

export default function RestaurantPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [restaurant, setRestaurant] = useState(null);
  const [loading, setLoading] = useState(true);

  const [customerName, setCustomerName] = useState('');
  const [phone, setPhone] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [guests, setGuests] = useState(1);

  const [expandedCategory, setExpandedCategory] = useState(null); // tracks which main drink is expanded
  const [orderItems, setOrderItems] = useState({}); // track selected sub-drinks

  // Get logged-in user from localStorage
  const user = JSON.parse(localStorage.getItem('user'));

  const drinksMenu = [
    {
      key: 'icedCoffee',
      name: 'Iced Coffee',
      img: 'https://placehold.co/80x80?text=Iced+Coffee',
      subOptions: [
        { key: 'macchiato', name: 'Macchiato', img: 'https://placehold.co/80x80?text=Macchiato' },
        { key: 'cappuccino', name: 'Cappuccino', img: 'https://placehold.co/80x80?text=Cappuccino' },
        { key: 'spanish', name: 'Spanish', img: 'https://placehold.co/80x80?text=Spanish' },
      ]
    },
    {
      key: 'nonCoffee',
      name: 'Non-Coffee',
      img: 'https://placehold.co/80x80?text=Non-Coffee',
      subOptions: [
        { key: 'matcha', name: 'Matcha', img: 'https://placehold.co/80x80?text=Matcha' },
        { key: 'chocolate', name: 'Chocolate', img: 'https://placehold.co/80x80?text=Chocolate' },
        { key: 'lemonTea', name: 'Lemon Tea', img: 'https://placehold.co/80x80?text=Lemon+Tea' },
      ]
    }
  ];

  useEffect(() => {
    let mounted = true;

    async function fetchRestaurant() {
      try {
        const res = await fetch(`${API}/api/restaurants/${id}`);
        if (!res.ok) throw new Error('Failed to fetch restaurant');
        const data = await res.json();
        if (mounted) setRestaurant(data);
      } catch {
        setRestaurant(null);
      } finally {
        if (mounted) setLoading(false);
      }
    }

    fetchRestaurant();

    function handleUpdate(updated) {
      if (updated.restaurantId === Number(id)) {
        setRestaurant(prev => ({
          ...prev,
          tables_available: updated.tables_available,
          promo: updated.promo ?? prev.promo,
        }));
      }
    }

    socket.on('bookingUpdated', handleUpdate);
    return () => {
      mounted = false;
      socket.off('bookingUpdated', handleUpdate);
    };
  }, [id]);

  const handleBack = () => navigate(-1);

  const handleBooking = async (e) => {
    e.preventDefault();

    if (!customerName || !date || !time) {
      alert('Please fill all required fields');
      return;
    }

    if (!restaurant || restaurant.tables_available === 0) {
      alert('No tables available');
      return;
    }

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
          restaurant_id: id,
          order: Object.keys(orderItems), // selected sub-drinks
          user_id: user.id, // associate booking with logged-in user
        }),
      });

      const data = await res.json();

      if (res.ok) {
        alert('Booking successful!');
        setRestaurant(prev => ({ ...prev, tables_available: data.tables_available }));
        setOrderItems({});
        setExpandedCategory(null);
      } else {
        alert(data.message || 'Booking failed');
      }
    } catch (err) {
      console.error(err);
      alert('Booking failed due to network error');
    }
  };

  if (loading) return <div className="text-center py-12 text-gray-500">Loading restaurant details...</div>;
  if (!restaurant) return <div className="text-center py-12 text-red-600">Restaurant not found.</div>;

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 flex flex-col lg:flex-row gap-8">
      <span
        onClick={handleBack}
        className="mb-2 text-sm text-gray-700 hover:underline cursor-pointer select-none"
      >
        ← Back
      </span>

      {/* Left Column: Restaurant Info */}
      <div className="flex-1 space-y-4">
        <img
          src={restaurant.image || 'https://placehold.co/600x400'}
          alt={restaurant.name}
          className="w-full h-80 rounded-xl object-cover shadow"
        />
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-semibold text-gray-800">{restaurant.name}</h2>
          {restaurant.rating && (
            <span className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full font-medium">
              {restaurant.rating} ★
            </span>
          )}
        </div>
        <p className="text-gray-600">📍 {restaurant.address}, {restaurant.city}</p>
        <div className="flex gap-4 text-sm text-gray-700 border-t border-b py-2">
          <span>🍽️ {restaurant.cuisine}</span>
          <span>💰 {restaurant.price_range || '$-$$'}</span>
          <span>🏷️ {restaurant.type}</span>
        </div>
        {restaurant.promo && (
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-3 rounded">
            <p className="font-semibold text-yellow-800">Promo Available</p>
            <p className="text-yellow-700 text-sm">{restaurant.promo}</p>
          </div>
        )}
      </div>

      {/* Right Column: Booking + Drink Selection */}
      <div className="w-full lg:w-96 border rounded-xl p-6 bg-white shadow sticky top-4 space-y-4">
        {!user ? (
          <div className="text-center py-12 text-red-600 font-semibold">
            ⚠️ Please log in first to view and book.
          </div>
        ) : (
          <>
            <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">Reserve a Table</h3>

            <div className="flex justify-between items-center text-sm text-gray-600 bg-gray-50 p-2 rounded">
              <span>Tables Available:</span>
              <strong className="text-gray-800">{restaurant.tables_available ?? 0}</strong>
            </div>

            {restaurant.tables_available === 0 ? (
              <div className="text-center py-4 bg-red-50 text-red-600 rounded font-medium">Fully Booked for Today</div>
            ) : (
              <form onSubmit={handleBooking} className="space-y-3">

                {/* Customer Info */}
                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1">Name</label>
                  <input
                    type="text"
                    placeholder={user.name}
                    value={customerName}
                    onChange={e => setCustomerName(e.target.value)}
                    required
                    className="w-full border px-3 py-2 rounded focus:border-gray-400 focus:ring focus:ring-gray-200 outline-none transition"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 mb-1">Date</label>
                    <input
                      type="date"
                      value={date}
                      onChange={e => setDate(e.target.value)}
                      required
                      className="w-full border px-3 py-2 rounded focus:border-gray-400 focus:ring focus:ring-gray-200 outline-none transition"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 mb-1">Time</label>
                    <input
                      type="time"
                      value={time}
                      onChange={e => setTime(e.target.value)}
                      required
                      className="w-full border px-3 py-2 rounded focus:border-gray-400 focus:ring focus:ring-gray-200 outline-none transition"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 mb-1">Guests</label>
                    <input
                      type="number"
                      min="1"
                      max="20"
                      value={guests}
                      onChange={e => setGuests(Number(e.target.value))}
                      className="w-full border px-3 py-2 rounded focus:border-gray-400 focus:ring focus:ring-gray-200 outline-none transition"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 mb-1">Phone</label>
                    <input
                      type="tel"
                      placeholder="Optional"
                      value={phone}
                      onChange={e => setPhone(e.target.value)}
                      className="w-full border px-3 py-2 rounded focus:border-gray-400 focus:ring focus:ring-gray-200 outline-none transition"
                    />
                  </div>
                </div>

                {/* Main Drink Selection */}
                <div className="space-y-2">
                  <label className="block text-xs font-semibold text-gray-500 mb-1">Choose a Drink Category</label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {drinksMenu.map(item => (
                      <div
                        key={item.key}
                        onClick={() => setExpandedCategory(expandedCategory === item.key ? null : item.key)}
                        className={`cursor-pointer flex items-center p-2 border rounded shadow-sm transition
                          ${expandedCategory === item.key ? 'border-gray-800 bg-gray-200' : 'border-gray-300 bg-white'}
                        `}
                      >
                        <img src={item.img} alt={item.name} className="w-16 h-16 object-cover rounded mr-2" />
                        <span className="font-medium text-gray-700">{item.name}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Sub Options */}
                {expandedCategory && (
                  <div className="space-y-2 mt-2">
                    <label className="block text-xs font-semibold text-gray-500 mb-1">Select Flavor</label>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      {drinksMenu.find(d => d.key === expandedCategory).subOptions.map(sub => {
                        const selected = orderItems[sub.key];
                        return (
                          <div
                            key={sub.key}
                            onClick={() =>
                              setOrderItems(prev => ({
                                ...prev,
                                [sub.key]: !prev[sub.key] ? 1 : 0
                              }))
                            }
                            className={`cursor-pointer flex flex-col items-center p-2 border rounded shadow-sm transition
                              ${selected ? 'border-gray-800 bg-gray-200' : 'border-gray-300 bg-white'}
                            `}
                          >
                            <img src={sub.img} alt={sub.name} className="w-20 h-20 object-cover rounded mb-1" />
                            <span className="text-sm font-medium text-gray-700">{sub.name}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Selected Drinks Summary */}
                {Object.values(orderItems).some(v => v > 0) && (
                  <div className="p-2 bg-gray-100 rounded text-sm text-gray-700">
                    <span className="font-medium">Selected Drinks:</span>{' '}
                    {Object.keys(orderItems)
                      .filter(k => orderItems[k])
                      .map(k => {
                        const sub = drinksMenu.flatMap(d => d.subOptions).find(s => s.key === k);
                        return sub ? sub.name : '';
                      })
                      .join(', ')}
                  </div>
                )}

                <button
                  type="submit"
                  className="w-full bg-gray-800 text-white font-semibold py-3 rounded hover:bg-gray-900 transition"
                >
                  Confirm Booking
                </button>
              </form>
            )}
          </>
        )}
      </div>
    </div>
  );
}
