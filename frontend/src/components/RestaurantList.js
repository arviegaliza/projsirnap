// src/components/RestaurantList.js
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { io } from 'socket.io-client';
import L from 'leaflet';

const API = process.env.REACT_APP_API_BASE || 'http://localhost:4000';
const socket = io(API);

// Fix default marker icon issue
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

// Example mock data for Philippines
const mockRestaurants = [
  { id: 1, name: "Cafe Manila", type: "Café", cuisine: "Coffee & Pastries", city: "Manila", address: "123 Rizal St", price_range: "$", rating: 4.2, promo: "10% off", tables_available: 5, lat: 14.5995, lng: 120.9842 },
  { id: 2, name: "Luzon Grill", type: "Restaurant", cuisine: "Filipino", city: "Quezon City", address: "456 EDSA Ave", price_range: "$$", rating: 4.5, promo: "", tables_available: 3, lat: 14.6760, lng: 121.0437 },
  { id: 3, name: "Baguio Bakery", type: "Café", cuisine: "Pastries", city: "Baguio", address: "789 Session Rd", price_range: "$", rating: 4.0, promo: "Free drink", tables_available: 8, lat: 16.4023, lng: 120.5960 },
];

export default function RestaurantList() {
  const [restaurants, setRestaurants] = useState([]);
  const [q, setQ] = useState('');

  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        const res = await fetch(`${API}/api/restaurants`);
        const data = await res.json();
        setRestaurants(data.length ? data : mockRestaurants);
      } catch (err) {
        console.error(err);
        setRestaurants(mockRestaurants);
      }
    };

    fetchRestaurants();

    // Listen for real-time updates
    socket.on('bookingUpdated', (updatedData) => {
      setRestaurants(prev =>
        prev.map(r =>
          r.id === updatedData.restaurantId
            ? { ...r, tables_available: updatedData.tables_available, promo: updatedData.promo }
            : r
        )
      );
    });

    return () => {
      socket.off('bookingUpdated');
    };
  }, []);

  const filtered = restaurants.filter(
    r => r.name.toLowerCase().includes(q.toLowerCase()) || r.cuisine?.toLowerCase().includes(q.toLowerCase())
  );

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <input
        value={q}
        onChange={e => setQ(e.target.value)}
        placeholder="Search restaurants or cuisine"
        className="w-full border px-3 py-2 rounded focus:border-emerald-500 focus:ring focus:ring-emerald-200 mb-6"
      />

      {/* Map centered on Philippines */}
      <MapContainer center={[12.8797, 121.7740]} zoom={5} scrollWheelZoom={false} className="h-80 w-full rounded-lg shadow-md mb-8">
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {filtered.map(r => (
          <Marker key={r.id} position={[r.lat, r.lng]}>
            <Popup>
              <strong>{r.name}</strong> ({r.type})<br />
              {r.cuisine} • {r.city}<br />
              {r.tables_available ?? '-'} tables available<br />
              {r.promo && <span className="text-yellow-700">{r.promo}</span>}<br />
              <Link to={`/restaurant/${r.id}`} className="text-emerald-600 hover:underline">View</Link>
            </Popup>
          </Marker>
        ))}
      </MapContainer>

      {/* Restaurant List */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.length ? (
          filtered.map(r => (
            <div key={r.id} className="border rounded p-4 flex flex-col justify-between hover:shadow-md transition">
              <div>
                <h3 className="text-lg font-semibold">{r.name} ({r.type})</h3>
                <p className="text-sm text-gray-500">{r.cuisine} • {r.city}</p>
                {r.promo && <span className="inline-block mt-2 text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded">{r.promo}</span>}
              </div>
              <div className="mt-4 flex items-center justify-between">
                <div className="text-sm text-gray-600">
                  {r.rating ?? '–'} ★ • {r.price_range ?? '–'} • {r.tables_available ?? '-'} tables
                </div>
                <Link to={`/restaurant/${r.id}`} className="text-sm bg-emerald-600 text-white px-3 py-1 rounded hover:bg-emerald-700 transition">View</Link>
              </div>
            </div>
          ))
        ) : (
          <div className="text-gray-500">No restaurants found.</div>
        )}
      </div>
    </div>
  );
}
