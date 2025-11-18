// src/components/NotFound.js
import React from 'react';
import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="p-8 text-center">
      <h1 className="text-3xl font-bold mb-4">404 - Page Not Found</h1>
      <p className="mb-4">The page you are looking for does not exist.</p>
      <Link to="/" className="text-emerald-600 hover:underline">Go back home</Link>
    </div>
  );
}
