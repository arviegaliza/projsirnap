// src/components/Home.js
import React from 'react';
import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-emerald-50 to-white rounded-lg p-12 shadow-md text-center max-w-6xl mx-auto mt-12">
        <h1 className="text-5xl font-extrabold text-emerald-700">
          No Lines. Just Book.
        </h1>
        <p className="mt-4 text-gray-600 text-lg max-w-2xl mx-auto">
          Discover local restaurants and cafés, reserve your table instantly, and enjoy a seamless dining experience.
        </p>
        <div className="mt-8 flex justify-center gap-6">
          <Link
            to="/restaurants"
            className="px-8 py-3 bg-emerald-600 text-white rounded-lg shadow-md font-semibold hover:bg-emerald-700 transition"
          >
            Find a Table
          </Link>
          <Link
            to="/signup"
            className="px-8 py-3 border border-emerald-600 text-emerald-600 rounded-lg font-semibold hover:bg-emerald-50 transition"
          >
            Sign Up
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="mt-16 max-w-6xl mx-auto px-4 grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
        <div className="p-8 bg-white rounded-xl shadow-md hover:shadow-lg transition">
          <h3 className="text-2xl font-bold text-emerald-600">Fast Booking</h3>
          <p className="mt-3 text-gray-600 text-sm">
            Reserve your table in seconds and skip the waiting lines. Experience hassle-free booking every time.
          </p>
        </div>
        <div className="p-8 bg-white rounded-xl shadow-md hover:shadow-lg transition">
          <h3 className="text-2xl font-bold text-emerald-600">Exclusive Deals</h3>
          <p className="mt-3 text-gray-600 text-sm">
            Access special promos and discounts available only through our platform. Save more while dining out.
          </p>
        </div>
        <div className="p-8 bg-white rounded-xl shadow-md hover:shadow-lg transition">
          <h3 className="text-2xl font-bold text-emerald-600">Local Focus</h3>
          <p className="mt-3 text-gray-600 text-sm">
            Discover hidden gems and local favorites in your city. Support local businesses and explore new cuisines.
          </p>
        </div>
      </section>

      {/* CTA Section */}
      <section className="mt-16 bg-emerald-600 rounded-xl text-white py-12 px-6 text-center max-w-6xl mx-auto shadow-lg">
        <h2 className="text-3xl font-bold">Ready to Book Your Table?</h2>
        <p className="mt-3 text-lg">
          Join thousands of satisfied diners and enjoy a seamless reservation experience.
        </p>
        <div className="mt-6 flex justify-center gap-6">
          <Link
            to="/restaurants"
            className="px-8 py-3 bg-white text-emerald-600 font-semibold rounded-lg shadow hover:bg-gray-100 transition"
          >
            Explore Restaurants
          </Link>
          <Link
            to="/signup"
            className="px-8 py-3 border border-white font-semibold rounded-lg hover:bg-white hover:text-emerald-600 transition"
          >
            Create Account
          </Link>
        </div>
      </section>
    </div>
  );
}
