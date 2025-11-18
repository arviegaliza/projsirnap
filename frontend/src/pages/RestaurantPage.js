import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import BookingForm from '../components/BookingForm';

const API = process.env.REACT_APP_API_BASE || 'http://localhost:4000';

export default function RestaurantPage() {
  const { id } = useParams();
  const [restaurant, setRestaurant] = useState(null);

  useEffect(() => {
    async function fetchOne() {
      try {
        const res = await fetch(`${API}/api/restaurants/${id}`);
        const data = await res.json();
        setRestaurant(data);
      } catch (e) {
        console.error(e);
      }
    }
    fetchOne();
  }, [id]);

  if (!restaurant) return <div className="max-w-5xl mx-auto px-4 py-8">Loading...</div>;

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 flex gap-8">
      <div className="flex-1">
        <h2 className="text-2xl font-bold">{restaurant.name}</h2>
        <p className="text-sm text-gray-600">{restaurant.address} • {restaurant.city}</p>
        <p className="mt-2 text-sm">{restaurant.cuisine} • {restaurant.price_range} • {restaurant.rating}★</p>
      </div>
      <div className="w-96 border rounded p-4 bg-white shadow-sm">
        <div className="text-sm text-gray-600">
          Available tables: <strong>{restaurant.tables_available ?? '-'}</strong>
        </div>
        <BookingForm restaurant={restaurant} />
      </div>
    </div>
  );
}
