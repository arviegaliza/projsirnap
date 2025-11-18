// frontend/src/App.js
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useParams } from 'react-router-dom';

import Header from './components/Header';
import Footer from './components/Footer';
import BookingForm from './components/BookingForm';

const API = process.env.REACT_APP_API_BASE || 'http://localhost:4000';

// Home Page
function Home() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <section className="bg-gradient-to-r from-emerald-50 to-white rounded-lg p-8 shadow-sm">
        <h1 className="text-3xl font-bold text-emerald-700">No lines. Just book.</h1>
        <p className="mt-2 text-gray-600">Discover local restaurants and reserve your table instantly.</p>
        <div className="mt-6 flex gap-3">
          <a href="/restaurants" className="px-5 py-2 bg-emerald-600 text-white rounded">
            Find a table
          </a>
        </div>
      </section>
    </div>
  );
}

// Restaurant List Page
function RestaurantList() {
  const [restaurants, setRestaurants] = useState([]);
  const [q, setQ] = useState('');

  useEffect(() => {
    async function fetchRestaurants() {
      try {
        const res = await fetch(`${API}/api/restaurants`);
        const data = await res.json();
        setRestaurants(data);
      } catch (err) {
        console.error(err);
      }
    }
    fetchRestaurants();
  }, []);

  const filtered = restaurants.filter(
    r =>
      r.name.toLowerCase().includes(q.toLowerCase()) ||
      (r.cuisine?.toLowerCase().includes(q.toLowerCase()))
  );

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <input
        value={q}
        onChange={e => setQ(e.target.value)}
        placeholder="Search restaurants or cuisine"
        className="w-full border px-3 py-2 rounded"
      />
      <div className="mt-6 grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.length
          ? filtered.map(r => (
              <div key={r.id} className="border rounded p-4 flex flex-col justify-between">
                <div>
                  <h3 className="text-lg font-semibold">{r.name}</h3>
                  <p className="text-sm text-gray-500">{r.cuisine} • {r.city}</p>
                  {r.promo && (
                    <span className="inline-block mt-2 text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded">
                      {r.promo}
                    </span>
                  )}
                </div>
                <div className="mt-4 flex items-center justify-between">
                  <div className="text-sm text-gray-600">
                    {r.rating ?? '–'} ★ • {r.price_range ?? '–'}
                  </div>
                  <a href={`/restaurant/${r.id}`} className="text-sm bg-emerald-600 text-white px-3 py-1 rounded">
                    View
                  </a>
                </div>
              </div>
            ))
          : <div className="text-gray-500">No restaurants found.</div>}
      </div>
    </div>
  );
}

// Restaurant Page
function RestaurantPage() {
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
        <div className="text-sm text-gray-600">Available tables: <strong>{restaurant.tables_available ?? '-'}</strong></div>
        <BookingForm restaurant={restaurant} />
      </div>
    </div>
  );
}

// Main App
export default function App() {
  const [user, setUser] = useState(null);

  return (
    <Router>
      <Header user={user} setUser={setUser} />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/restaurants" element={<RestaurantList />} />
        <Route path="/restaurant/:id" element={<RestaurantPage />} />
      </Routes>
      <Footer />
    </Router>
  );
}
