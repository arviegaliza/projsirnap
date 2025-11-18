import React from 'react';
import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <section className="bg-gradient-to-r from-emerald-50 to-white rounded-lg p-8 shadow-sm text-center">
        <h1 className="text-4xl font-bold text-emerald-700">No lines. Just book.</h1>
        <p className="mt-4 text-gray-600 text-lg">
          Discover local restaurants and cafés, and reserve your table instantly.
        </p>
        <div className="mt-8 flex justify-center gap-4">
          <Link
            to="/restaurants"
            className="px-6 py-3 bg-emerald-600 text-white rounded-lg shadow hover:bg-emerald-700 transition"
          >
            Find a table
          </Link>
          <Link
            to="/signup"
            className="px-6 py-3 border rounded-lg text-emerald-600 hover:bg-emerald-50 transition"
          >
            Sign up
          </Link>
        </div>
      </section>

      <section className="mt-12 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="p-6 bg-white rounded-lg shadow">
          <h3 className="text-xl font-semibold">Fast Booking</h3>
          <p className="mt-2 text-gray-500 text-sm">
            Reserve your table in seconds and skip the waiting lines.
          </p>
        </div>
        <div className="p-6 bg-white rounded-lg shadow">
          <h3 className="text-xl font-semibold">Exclusive Deals</h3>
          <p className="mt-2 text-gray-500 text-sm">
            Get special promos and discounts available only on our platform.
          </p>
        </div>
        <div className="p-6 bg-white rounded-lg shadow">
          <h3 className="text-xl font-semibold">Local Focus</h3>
          <p className="mt-2 text-gray-500 text-sm">
            Discover hidden gems and local favorites in your city.
          </p>
        </div>
      </section>
    </div>
  );
}
