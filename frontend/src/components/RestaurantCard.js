// src/components/RestaurantCard.js
import React from 'react';
import { Link } from 'react-router-dom';

export default function RestaurantCard({ restaurant }) {
  return (
    <div className="bg-white shadow-md rounded-lg overflow-hidden hover:shadow-xl transition">
      {/* WRAP THE IMAGE IN A LINK */}
      <Link to={`/restaurants/${restaurant.id}`}>
        <img
          src={restaurant.image || '/placeholder.jpg'}
          alt={restaurant.name}
          className="w-full h-48 object-cover cursor-pointer hover:opacity-95 transition"
        />
      </Link>

      <div className="p-4">
        {/* You can also wrap the title if you want the text to be clickable too */}
        <Link to={`/restaurants/${restaurant.id}`}>
            <h3 className="text-lg font-semibold hover:text-emerald-600">{restaurant.name}</h3>
        </Link>
        
        <p className="text-gray-500">{restaurant.cuisine}</p>
        <p className="text-gray-700 mt-2">{restaurant.city}</p> 
        
        <Link
          to={`/restaurants/${restaurant.id}`}
          className="inline-block mt-3 bg-emerald-600 text-white px-4 py-2 rounded hover:bg-emerald-700 transition"
        >
          View & Book
        </Link>
      </div>
    </div>
  );
}