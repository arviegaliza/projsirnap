import React from 'react';

export default function Footer() {
  return (
    <footer className="bg-gray-100 text-gray-600 py-6 text-center mt-12">
      &copy; {new Date().getFullYear()} TableReserve. All rights reserved.
    </footer>
  );
}
