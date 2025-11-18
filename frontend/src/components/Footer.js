import React from 'react';

export default function Footer() {
  return (
    <footer className="bg-gray-100 text-gray-600 py-4 text-center">
      &copy; {new Date().getFullYear()} Restaurant Booking App. All rights reserved.
    </footer>
  );
}
