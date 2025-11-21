// src/components/LoginPayment.js
import React, { useState } from 'react';

export default function LoginPayment({ onLogin }) {
  const [name, setName] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('gcash');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name) {
      alert('Please enter your name');
      return;
    }
    // mock login + payment
    onLogin({ name, paymentMethod });
  };

  return (
    <div className="max-w-md mx-auto mt-20 p-6 border rounded shadow">
      <h2 className="text-xl font-semibold mb-4 text-gray-800">Login & Payment</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
          <input
            type="text"
            placeholder="John Doe"
            value={name}
            onChange={e => setName(e.target.value)}
            className="w-full border px-3 py-2 rounded focus:ring focus:ring-gray-200 outline-none"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Payment Method</label>
          <select
            value={paymentMethod}
            onChange={e => setPaymentMethod(e.target.value)}
            className="w-full border px-3 py-2 rounded focus:ring focus:ring-gray-200 outline-none"
          >
            <option value="gcash">GCash</option>
            <option value="paypal">PayPal</option>
          </select>
        </div>
        <button
          type="submit"
          className="w-full bg-gray-800 text-white py-2 rounded hover:bg-gray-900 transition"
        >
          Proceed
        </button>
      </form>
    </div>
  );
}
