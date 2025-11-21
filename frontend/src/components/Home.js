// src/components/Home.js
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

export default function Home() {
  const user = (() => {
    try {
      return JSON.parse(localStorage.getItem('user'));
    } catch {
      return null;
    }
  })();

  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 40);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="flex flex-col min-h-screen pb-12">
      <style>{`
        @keyframes floatY {
          0% { transform: translateY(0); }
          50% { transform: translateY(-6px); }
          100% { transform: translateY(0); }
        }
        .float-y { animation: floatY 4s ease-in-out infinite; }
      `}</style>

      {/* HERO SECTION */}
      <section
        className={`
          relative overflow-hidden max-w-6xl mx-auto mt-12 rounded-2xl p-8 sm:p-12 shadow-lg 
          bg-gradient-to-br from-[#f5efe6] to-[#e8dfd5]
          transition-transform duration-700
          ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}
        `}
      >
        {/* Floating Decorative Blob */}
        <div className="pointer-events-none absolute right-6 top-6 opacity-30 transform float-y">
          <svg width="120" height="120" viewBox="0 0 120 120" fill="none">
            <defs>
              <linearGradient id="coffeeBlob" x1="0" x2="1">
                <stop offset="0" stopColor="#d7c8b6" />
                <stop offset="1" stopColor="#f0ece6" />
              </linearGradient>
            </defs>
            <rect width="120" height="120" rx="24" fill="url(#coffeeBlob)" />
          </svg>
        </div>

        <div className="relative z-10 text-center">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-[#4b2e17]">
            No Lines. Just Book Your Coffee Spot.
          </h1>

          <p className="mt-4 text-[#6b533b] text-base sm:text-lg max-w-2xl mx-auto">
            Enjoy smooth reservations at your favorite cafés — sip, relax, and skip the waiting line.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row justify-center gap-4">
            <Link
              to="/restaurants"
              className="inline-flex items-center justify-center px-6 py-3 bg-[#6b3e2e] text-white rounded-lg shadow-md text-sm font-semibold hover:scale-[1.02] transition"
            >
              Find a Coffee Shop
            </Link>

            {!user && (
              <Link
                to="/signup"
                className="inline-flex items-center justify-center px-6 py-3 border border-[#b79b84] text-[#4b2e17] rounded-lg text-sm font-semibold hover:bg-[#f5efe6] transition"
              >
                Sign Up
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="max-w-6xl mx-auto px-4 mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {[
          {
            title: 'Fast Booking',
            desc: 'Reserve a seat instantly with no hassle.',
          },
          {
            title: 'Exclusive Café Deals',
            desc: 'Enjoy member-only discounts and seasonal offers.',
          },
          {
            title: 'Local Coffee Spots',
            desc: 'Discover artisan cafés and hidden coffee gems.',
          },
        ].map((item, i) => (
          <article
            key={item.title}
            className={`
              bg-white rounded-xl p-5 shadow-sm 
              hover:shadow-lg hover:-translate-y-1
              transform transition-all duration-300
              ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'}
            `}
            style={{ transitionDelay: `${i * 80}ms` }}
          >
            <h3 className="text-lg font-semibold text-[#4b2e17]">{item.title}</h3>
            <p className="mt-1 text-sm text-[#6b533b]">{item.desc}</p>
          </article>
        ))}
      </section>

      {/* CTA SECTION */}
      <section className="max-w-6xl mx-auto px-4 mt-10">
        <div
          className={`
            rounded-xl p-6 sm:p-8 text-center text-white shadow-lg overflow-hidden 
            transform transition duration-500
            bg-gradient-to-r from-[#4b2e17] to-[#6b3e2e]
            ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3'}
          `}
        >
          <h2 className="text-2xl sm:text-3xl font-bold">Ready for Your Next Coffee Moment?</h2>

          <p className="mt-2 text-sm sm:text-base text-[#f2e9df] max-w-2xl mx-auto">
            Reserve your seat and enjoy a perfectly brewed experience.
          </p>

          <div className="mt-5 flex flex-col sm:flex-row justify-center gap-3">
            <Link
              to="/restaurants"
              className="inline-flex items-center justify-center px-6 py-3 bg-white text-[#4b2e17] rounded-md font-semibold hover:scale-[1.02] transition"
            >
              Explore Cafés
            </Link>

            {!user && (
              <Link
                to="/signup"
                className="inline-flex items-center justify-center px-6 py-3 border border-white text-white rounded-md font-semibold hover:bg-white hover:text-[#4b2e17] transition"
              >
                Create Account
              </Link>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
