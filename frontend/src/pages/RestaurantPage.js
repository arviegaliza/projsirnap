// frontend/src/pages/RestaurantPage.js
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import BookingForm from '../components/BookingForm';
import { io } from 'socket.io-client';

const API = process.env.REACT_APP_API_BASE || 'http://localhost:4000';
const socket = io(API); // connect to backend socket

export default function RestaurantPage() {
  const { id } = useParams();
  const [restaurant, setRestaurant] = useState(null);

  // Fetch restaurant details
  const fetchRestaurant = async () => {
    try {
      const res = await fetch(`${API}/api/restaurants/${id}`);
      const data = await res.json();
      setRestaurant(data);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchRestaurant();

    // Listen for real-time booking updates
    socket.on('bookingUpdated', (updatedData) => {
      if (updatedData.restaurantId === id) {
        fetchRestaurant(); // refetch current restaurant
      }
    });

    // Cleanup
    return () => {
      socket.off('bookingUpdated');
    };
  }, [id]);

  if (!restaurant)
    return <div className="max-w-5xl mx-auto px-4 py-8">Loading...</div>;

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 flex flex-col lg:flex-row gap-8">
      <div className="flex-1">
        <h2 className="text-2xl font-bold">{restaurant.name}</h2>
        <p className="text-sm text-gray-600">
          {restaurant.address} • {restaurant.city}
        </p>
        <p className="mt-2 text-sm">
          {restaurant.cuisine} • {restaurant.price_range} • {restaurant.rating}★
        </p>
      </div>
      <div className="w-full lg:w-96 border rounded p-4 bg-white shadow-sm">
        <div className="text-sm text-gray-600 mb-2">
          Available tables: <strong>{restaurant.tables_available ?? '-'}</strong>
        </div>
        <BookingForm restaurant={restaurant} socket={socket} />
      </div>
    </div>
  );
}
