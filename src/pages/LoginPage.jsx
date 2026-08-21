import React, { useState } from "react";
import { ArrowRight, Eye, EyeOff, Leaf, Loader2 } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import api from "../services/api";
import { setToken, setCurrentUser } from "../services/auth";

const LoginPage = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!formData.email.trim()) {
      toast.error("Email is required");
      return;
    }

    if (!formData.password) {
      toast.error("Password is required");
      return;
    }

    try {
      setLoading(true);

      const response = await api.post("/auth/login", {
        email: formData.email.trim(),
        password: formData.password,
      });

      const responseData = response.data;

      const authData = responseData?.data;

      if (!authData?.token) {
        toast.error("Login failed. Authentication token was not received.");
        return;
      }

     
      setToken(authData.token);

      setCurrentUser({
        userId: authData.userId,
        email: authData.email,
        userRole: authData.userRole,
      });

      toast.success(responseData.message || "Login successful");

      if (authData.userRole === "ADMIN") {
        navigate("/admin/dashboard", { replace: true });
      } else {
        navigate("/", { replace: true });
      }
    } catch (error) {
      console.error("Login error:", error);

      const message =
        error.response?.data?.message ||
        "Login failed. Please check your email and password.";

      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-emerald-50 via-white to-green-50">
      <Navbar />

      <section className="flex-grow flex items-center justify-center px-4 py-12 sm:py-16">
        <div className="bg-white shadow-xl rounded-3xl max-w-md w-full p-6 sm:p-8 border border-emerald-100">
          {/* Header */}
          <div className="flex flex-col items-center justify-center mb-8">
            <div className="flex items-center justify-center w-14 h-14 rounded-full bg-emerald-100 mb-3">
              <Leaf className="w-7 h-7 text-emerald-600" />
            </div>

            <h2 className="text-2xl font-bold text-gray-900">EcoRide Login</h2>

            <p className="text-sm text-gray-500 mt-1 text-center">
              Welcome back. Let's get you moving.
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="block text-gray-700 font-medium mb-1"
              >
                Email
              </label>

              <input
                id="email"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
                required
                disabled={loading}
                autoComplete="email"
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg
                           focus:outline-none focus:ring-2 focus:ring-emerald-500
                           focus:border-emerald-500 disabled:bg-gray-100"
              />
            </div>

            {/* Password */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label
                  htmlFor="password"
                  className="block text-gray-700 font-medium"
                >
                  Password
                </label>

                <Link
                  to="/forgot-password"
                  className="text-sm text-emerald-600 hover:text-emerald-700 hover:underline"
                >
                  Forgot password?
                </Link>
              </div>

              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  required
                  minLength={6}
                  maxLength={64}
                  disabled={loading}
                  autoComplete="current-password"
                  className="w-full px-4 py-2.5 pr-11 border border-gray-300 rounded-lg
                             focus:outline-none focus:ring-2 focus:ring-emerald-500
                             focus:border-emerald-500 disabled:bg-gray-100"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  disabled={loading}
                  className="absolute right-3 top-1/2 -translate-y-1/2
                             text-gray-500 hover:text-emerald-600"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Login button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-emerald-600 text-white py-3 rounded-full
                         font-semibold hover:bg-emerald-700 transition
                         flex items-center justify-center gap-2
                         disabled:bg-emerald-300 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Signing in...
                </>
              ) : (
                <>
                  Login
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Register */}
          <p className="mt-6 text-gray-600 text-sm text-center">
            Don't have an account?{" "}
            <Link
              to="/register"
              className="text-emerald-600 font-semibold hover:text-emerald-700 hover:underline"
            >
              Register
            </Link>
          </p>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default LoginPage;
