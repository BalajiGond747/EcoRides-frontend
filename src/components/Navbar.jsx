import React, { useEffect, useRef, useState } from "react";
import { ChevronDown, Leaf, LogOut, User } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

import { getCurrentUser, logout } from "../services/auth";

const Navbar = () => {
  const navigate = useNavigate();

  const [currentUser, setCurrentUser] = useState(getCurrentUser());

  const [profileOpen, setProfileOpen] = useState(false);

  const menuRef = useRef(null);

  useEffect(() => {
    const refreshUser = () => {
      setCurrentUser(getCurrentUser());
    };

    window.addEventListener("storage", refreshUser);

    window.addEventListener("auth-change", refreshUser);

    return () => {
      window.removeEventListener("storage", refreshUser);

      window.removeEventListener("auth-change", refreshUser);
    };
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setProfileOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    setProfileOpen(false);
    logout();
  };

  const isUser = currentUser?.userRole === "USER";

  const isAdmin = currentUser?.userRole === "ADMIN";

  return (
    <nav
      className="bg-gradient-to-r
                    from-emerald-600
                    to-emerald-700
                    shadow-md sticky top-0
                    z-50 w-full"
    >
      <div
        className="w-full px-6 py-4
                      flex items-center
                      justify-between gap-4"
      >
        {/* Logo */}

        <Link to="/" className="flex items-center gap-2 shrink-0">
          <Leaf className="w-7 h-7 text-white" />

          <span className="text-2xl font-bold text-white">EcoRides</span>
        </Link>

        {/* Navigation */}

        <div className="flex items-center gap-3">
          {!currentUser && (
            <>
              <Link
                to="/login"
                className="px-5 py-2 rounded-full
                           bg-white/10 text-white
                           font-semibold
                           hover:bg-white/20 transition"
              >
                Login
              </Link>

              <Link
                to="/register"
                className="px-5 py-2 rounded-full
                           bg-white text-emerald-700
                           font-semibold
                           hover:bg-emerald-50 transition"
              >
                Register
              </Link>
            </>
          )}

          {isUser && (
            <>
              <Link
                to="/"
                className="hidden md:block
                           text-white font-medium
                           hover:text-emerald-100"
              >
                Home
              </Link>

              <Link
                to="/cars"
                className="hidden md:block
                           text-white font-medium
                           hover:text-emerald-100"
              >
                Cars
              </Link>

              <Link
                to="/bookings"
                className="hidden md:block
                           text-white font-medium
                           hover:text-emerald-100"
              >
                My Bookings
              </Link>

              <div className="relative" ref={menuRef}>
                <button
                  type="button"
                  onClick={() => setProfileOpen((previous) => !previous)}
                  className="flex items-center gap-2
                             px-3 py-2 rounded-full
                             bg-white text-emerald-700
                             font-semibold
                             hover:bg-emerald-50"
                >
                  <div
                    className="w-8 h-8 rounded-full
                                  bg-emerald-100
                                  flex items-center
                                  justify-center"
                  >
                    <User className="w-4 h-4" />
                  </div>

                  <span className="hidden sm:block">Profile</span>

                  <ChevronDown
                    className={`w-4 h-4 transition ${
                      profileOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {profileOpen && (
                  <div
                    className="absolute right-0
                                  mt-2 w-56
                                  bg-white rounded-2xl
                                  shadow-xl border
                                  border-gray-100
                                  overflow-hidden"
                  >
                    <Link
                      to={`/profile/${currentUser.userId}`}
                      onClick={() => setProfileOpen(false)}
                      className="flex items-center gap-3
                                 px-4 py-3
                                 text-gray-700
                                 hover:bg-emerald-50"
                    >
                      <User className="w-5 h-5 text-emerald-600" />
                      My Profile
                    </Link>

                    <Link
                      to="/change-password"
                      onClick={() => setProfileOpen(false)}
                      className="block px-4 py-3
                                 text-gray-700
                                 hover:bg-emerald-50"
                    >
                      Change Password
                    </Link>

                    <Link
                      to="/change-email"
                      onClick={() => setProfileOpen(false)}
                      className="block px-4 py-3
                                 text-gray-700
                                 hover:bg-emerald-50"
                    >
                      Change Email
                    </Link>

                    <div className="border-t border-gray-100" />

                    <button
                      type="button"
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3
                                 px-4 py-3 text-red-600
                                 hover:bg-red-50"
                    >
                      <LogOut className="w-5 h-5" />
                      Logout
                    </button>
                  </div>
                )}
              </div>
            </>
          )}

          {isAdmin && (
            <>
              <Link
                to="/admin/dashboard"
                className="text-white font-medium
                           hover:text-emerald-100"
              >
                Dashboard
              </Link>

              <button
                type="button"
                onClick={handleLogout}
                className="flex items-center gap-2
                           px-5 py-2 rounded-full
                           bg-white text-emerald-700
                           font-semibold
                           hover:bg-emerald-50"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
