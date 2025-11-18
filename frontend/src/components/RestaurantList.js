// src/components/RestaurantList.js
import React, { useState, useEffect, useMemo, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { io } from 'socket.io-client';

const API = process.env.REACT_APP_API_BASE || 'http://localhost:4000';

// Mock fallback data
const mockRestaurants = [
  { id: 1, name: 'Cafe Manila', type: 'Café', cuisine: 'Coffee & Pastries', city: 'Manila', address: '123 Rizal St', price_range: '$', rating: 4.2, promo: '10% off', tables_available: 5, lat: 14.5995, lng: 120.9842 },
  { id: 2, name: 'Luzon Grill', type: 'Restaurant', cuisine: 'Filipino', city: 'Quezon City', address: '456 EDSA Ave', price_range: '$$', rating: 4.5, promo: '', tables_available: 3, lat: 14.6760, lng: 121.0437 },
  { id: 3, name: 'Baguio Bakery', type: 'Bakery', cuisine: 'Pastries', city: 'Baguio', address: '789 Session Rd', price_range: '$', rating: 4.0, promo: 'Free drink', tables_available: 8, lat: 16.4023, lng: 120.5960 },
];

const TYPE_STYLES = {
  'café': { color: '#8B5E3C', emoji: '☕' },
  'cafe': { color: '#8B5E3C', emoji: '☕' },
  'restaurant': { color: '#E53E3E', emoji: '🍽️' },
  'bakery': { color: '#F6C85F', emoji: '🥐' },
  'fast food': { color: '#F97316', emoji: '🍔' },
  'fast-food': { color: '#F97316', emoji: '🍔' },
  'other': { color: '#2563EB', emoji: '📍' },
};

// Map marker helper
function createDivIcon({ color = '#2563EB', emoji = '📍' }) {
  const html = `
    <div style="
      display:flex;
      align-items:center;
      justify-content:center;
      width:36px;
      height:36px;
      border-radius:18px;
      background:${color};
      color:white;
      font-size:18px;
      box-shadow:0 2px 6px rgba(0,0,0,0.3);
      border: 2px solid rgba(255,255,255,0.85);
    ">
      <span style="line-height:1">${emoji}</span>
    </div>
    <div style="width:0;height:0;border-left:8px solid transparent;border-right:8px solid transparent;border-top:10px solid ${color};margin:-2px auto 0;"></div>
  `;
  return L.divIcon({ html, className: '', iconSize: [36, 46], iconAnchor: [18, 46], popupAnchor: [0, -46] });
}

// Region bounds
const REGIONS = {
  luzon: { north: 19.5, south: 12.0, west: 119.0, east: 122.5 },
  visayas: { north: 12.0, south: 9.0, west: 123.0, east: 127.0 },
  mindanao: { north: 9.0, south: 5.0, west: 125.0, east: 127.5 },
};

const PAYMENT_OPTIONS = ['GCash', 'PayPal', 'Credit Card'];

export default function RestaurantList() {
  const [restaurants, setRestaurants] = useState([]);
  const [q, setQ] = useState('');
  const mapRef = useRef(null);

  useEffect(() => {
    let mounted = true;

    // Fetch restaurants
    const fetchRestaurants = async () => {
      try {
        const res = await fetch(`${API}/api/restaurants`);
        console.log('API response status:', res.status);
        const data = await res.json();
        if (!mounted) return;
        setRestaurants(Array.isArray(data) && data.length ? data : mockRestaurants);
      } catch (err) {
        console.warn('Using mock restaurants (fetch failed):', err.message);
        if (mounted) setRestaurants(mockRestaurants);
      }
    };

    fetchRestaurants();

    // Socket.IO setup
    const socket = io(API, { transports: ['websocket', 'polling'] });

    socket.on('connect', () => console.log('Connected Socket.IO:', socket.id));

    socket.on('bookingUpdated', updated => {
      setRestaurants(prev =>
        prev.map(r =>
          r.id === updated.restaurantId
            ? { ...r, tables_available: updated.tables_available, promo: updated.promo ?? r.promo }
            : r
        )
      );
    });

    return () => {
      mounted = false;
      socket.disconnect();
    };
  }, []);

  // Filter restaurants by query
  const filtered = useMemo(() => {
    const ql = q.trim().toLowerCase();
    return restaurants.filter(r => {
      const matchesText = !ql || r.name?.toLowerCase().includes(ql) ||
        r.cuisine?.toLowerCase().includes(ql) ||
        r.city?.toLowerCase().includes(ql) ||
        r.type?.toLowerCase().includes(ql);

      let matchesRegion = true;
      if (ql in REGIONS) {
        const b = REGIONS[ql];
        matchesRegion = r.lat >= b.south && r.lat <= b.north && r.lng >= b.west && r.lng <= b.east;
      }

      return matchesText && matchesRegion;
    });
  }, [q, restaurants]);

  // Prepare map markers
  const markers = useMemo(() => {
    return filtered.map(r => {
      const lat = Number(r.lat);
      const lng = Number(r.lng);
      if (!Number.isFinite(lat) || !Number.isFinite(lng)) return null;

      const key = (r.type || '').toLowerCase();
      const style = TYPE_STYLES[key] || TYPE_STYLES['other'];
      const icon = createDivIcon({ color: style.color, emoji: style.emoji });

      return { ...r, lat, lng, icon };
    }).filter(Boolean);
  }, [filtered]);

  // Fit map to markers
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    if (!markers.length) {
      map.setView([12.8797, 121.7740], 5);
      return;
    }

    if (markers.length === 1) {
      map.setView([markers[0].lat, markers[0].lng], 13);
    } else {
      const bounds = L.latLngBounds(markers.map(m => [m.lat, m.lng]));
      map.fitBounds(bounds, { padding: [40, 40], maxZoom: 13 });
    }
  }, [markers]);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Search input */}
      <div className="mb-4">
        <input
          value={q}
          onChange={e => setQ(e.target.value)}
          placeholder="Search by name, type, cuisine, city or region (Luzon, Visayas, Mindanao)"
          className="w-full border px-3 py-2 rounded focus:border-emerald-500 focus:ring focus:ring-emerald-200"
        />
      </div>

      {/* Map */}
      <div className="mb-6">
        <MapContainer
          center={[12.8797, 121.7740]}
          zoom={5}
          scrollWheelZoom={false}
          style={{ height: '380px', width: '100%', borderRadius: '0.5rem' }}
          whenCreated={map => { mapRef.current = map; }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {markers.map(r => (
            <Marker key={r.id} position={[r.lat, r.lng]} icon={r.icon}>
              <Popup>
                <div className="text-sm">
                  <strong>{r.name}</strong> <span className="text-xs text-gray-600">({r.type})</span><br />
                  <span className="text-xs">{r.cuisine} • {r.city}</span><br />
                  <span className="text-xs">{r.tables_available ?? '-'} tables available</span><br />
                  {r.promo && <span className="text-xs text-yellow-700">{r.promo}<br /></span>}
                  <span className="text-xs">Payment: {PAYMENT_OPTIONS.join(', ')}</span>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>

      {/* Restaurant list */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.length ? filtered.map(r => (
          <div key={r.id} className="border rounded p-4 flex flex-col justify-between hover:shadow-md transition">
            <div>
              <h3 className="text-lg font-semibold">{r.name} <span className="text-sm font-normal text-gray-500">({r.type || '—'})</span></h3>
              <p className="text-sm text-gray-500">{r.cuisine} • {r.city}</p>
              {r.promo && <span className="inline-block mt-2 text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded">{r.promo}</span>}
            </div>
            <div className="mt-4 flex items-center justify-between">
              <div className="text-sm text-gray-600">
                {r.rating ?? '–'} ★ • {r.price_range ?? '–'} • {r.tables_available ?? '-'} tables
              </div>
            </div>
          </div>
        )) : <div className="text-gray-500">No restaurants found.</div>}
      </div>
    </div>
  );
}
