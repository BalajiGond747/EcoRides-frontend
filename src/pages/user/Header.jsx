import React from 'react';

import {
  Leaf,
  Menu,
  Car,
  User,
  CalendarCheck,
  Bell,
} from 'lucide-react';

import { Link, useNavigate } from 'react-router-dom';

import {toast} from 'sonner';

export default function Header() {

  const token = localStorage.getItem('token');

  const navigate = useNavigate();

  const handleProtectedRoute = (path) => {
    if (!token) {
      toast.error('Please login or register first');

      setTimeout(() => {
        navigate('/login');
      }, 500);
      return;
    }

    navigate(path);
  };

  return (
    <header className="sticky top-0 z-50 border-b border-green-200 bg-green-50/90 backdrop-blur-xl shadow-sm">

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <div className="flex items-center justify-between h-18">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 shrink-0">

            <div className="w-11 h-11 rounded-2xl bg-linear-to-br from-green-500 to-emerald-600 flex items-center justify-center shadow-md shadow-green-200">
              <Leaf size={21} className="text-white" strokeWidth={2.2} />
            </div>

            <div>
              <h1 className="text-xl font-black tracking-tight text-green-700">
                EcoRides
              </h1>

              <p className="text-[11px] text-gray-700 -mt-1">
                Smart eco transportation
              </p>
            </div>

          </Link>

          {/* Navigation */}
          <nav className="hidden lg:flex items-center gap-7">

            {/* Book Ride */}
            <button
              onClick={() => handleProtectedRoute('/book-ride')}
              className="flex items-center gap-2 text-sm font-semibold text-green-500 hover:text-green-900 transition-colors cursor-pointer"
            >
              <Car size={20} />
              Book Ride
            </button>

            {/* My Bookings */}
            <button
              onClick={() => handleProtectedRoute('/my-bookings')}
              className="flex items-center gap-2 text-sm font-semibold text-green-500  hover:text-green-900  transition-colors cursor-pointer"
            >
              <CalendarCheck size={18} />
              My Bookings
            </button>

            {/* Profile */}
            <button
              onClick={() => handleProtectedRoute('/profile')}
              className="flex items-center gap-2 text-sm font-semibold text-green-500 hover:text-green-900 transition-colors cursor-pointer"
            >
              <User size={18} />
              My Profile
            </button>

          </nav>

          {/* Right Side */}
          <div className="hidden lg:flex items-center gap-3">

            {/* Notification */}
            <button
              onClick={() => handleProtectedRoute('/notifications')}
              className="relative w-11 h-11 rounded-2xl border border-green-100 flex items-center justify-center text-gray-600 hover:bg-green-50 transition-all"
            >
              <Bell size={18} />

              <span className="absolute top-2.5 right-2.5 w-2 h-2 rounded-full bg-green-500" />
            </button>

            {/* Login */}
            {!token && (
              <Link
                to="/login"
                className="px-4 py-2 text-sm font-semibold text-green-700 border border-green-200 rounded-xl hover:bg-green-50 transition-all"
              >
                Login
              </Link>
            )}

            {/* Register */}
            {!token && (
              <Link
                to="/register"
                className="px-5 py-2.5 bg-linear-to-r from-green-500 to-emerald-600 text-white text-sm font-bold rounded-xl hover:from-green-600 hover:to-emerald-700 transition-all shadow-md shadow-green-200"
              >
                Register
              </Link>
            )}

          </div>

          {/* Mobile Menu */}
          <button className="lg:hidden w-10 h-10 rounded-xl border border-green-100 flex items-center justify-center text-gray-600 hover:bg-green-50 transition-colors">
            <Menu size={20} />
          </button>

        </div>
      </div>
    </header>
  );
}