import React, { useState } from "react";

import { Eye, EyeOff, Lock, Phone, Car } from "lucide-react";

import { Link, useNavigate } from "react-router-dom";

import axios from "axios";

import toast from "react-hot-toast";

const API_BASE = "http://localhost:8080/api";

export default function LoginPage() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    phone: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);

  const [errors, setErrors] = useState({});

  const [isLoading, setIsLoading] = useState(false);

  // Handle Input Change
  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "phone") {
      const numericValue = value.replace(/\D/g, "");

      setFormData((prev) => ({
        ...prev,
        phone: numericValue,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }

    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  // Validation
  const validate = () => {
    const errs = {};

    if (!formData.phone) {
      errs.phone = "Phone number is required";
    } else if (!/^\d{10}$/.test(formData.phone)) {
      errs.phone = "Enter a valid 10-digit phone number";
    }

    if (!formData.password) {
      errs.password = "Password is required";
    }

    return errs;
  };

  // Submit
  const handleSubmit = async () => {
    const errs = validate();

    if (Object.keys(errs).length > 0) {
      setErrors(errs);

      return;
    }

    setIsLoading(true);

    try {
      const res = await axios.post(`${API_BASE}/auth/login`, formData);

      if (res.data?.token) {
        localStorage.setItem("token", res.data.token);
      }

      toast.success("Logged in successfully!");

      setTimeout(() => {
        navigate("/dashboard");
      }, 800);
    } catch (err) {
      const msg =
        err.response?.data?.message || "Login failed. Please try again.";

      toast.error(msg);
    } finally {
      setIsLoading(false);
    }
  };

  // Enter Key
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSubmit();
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-green-50 via-emerald-50 to-green-100 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Shapes */}
      <div className="absolute w-96 h-96 rounded-full bg-green-200 opacity-30 -top-24 -right-20 pointer-events-none" />

      <div className="absolute w-64 h-64 rounded-full bg-emerald-200 opacity-25 -bottom-16 -left-16 pointer-events-none" />

      <div className="w-full max-w-md relative z-10">
        <div className="bg-white rounded-3xl shadow-2xl shadow-green-100 p-8">


          {/* Project Logo */}
          <div className="flex items-center justify-center gap-3 mb-8">
            <div className="w-12 h-12 rounded-2xl bg-linear-to-br from-green-500 to-emerald-600 flex items-center justify-center shadow-lg shadow-green-200">
              <Car size={24} className="text-white" strokeWidth={2.3} />
            </div>

            <div>
              <h1 className="text-3xl font-black tracking-tight text-green-700 leading-none">
                EcoRides
              </h1>

              <p className="text-xs text-gray-400 mt-1">
                Smart eco transportation
              </p>
            </div>
          </div>

          {/* Heading */}
          <div className="mb-7">
            <h2 className="text-2xl font-bold text-gray-900 tracking-tight mb-1">
              Welcome back
            </h2>

            <p className="text-sm text-gray-500">
              Sign in to continue to your account
            </p>
          </div>

          {/* Phone Field */}
          <div className="mb-4">
            <label className="block text-xs font-semibold text-gray-700 mb-1.5">
              Phone Number
            </label>

            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Phone
                  size={16}
                  className={errors.phone ? "text-red-400" : "text-gray-400"}
                />
              </div>

              <input
                name="phone"
                type="tel"
                inputMode="numeric"
                maxLength={10}
                value={formData.phone}
                onChange={handleChange}
                onKeyDown={handleKeyDown}
                placeholder="Enter 10-digit phone number"
                className={`block w-full pl-9 pr-3 py-3 text-sm border rounded-2xl outline-none transition-all
                  focus:ring-2 focus:ring-green-400 focus:border-transparent
                  ${
                    errors.phone
                      ? "border-red-300 bg-red-50 placeholder-red-300"
                      : "border-green-200 bg-green-50 placeholder-gray-400 hover:border-green-300"
                  }`}
              />
            </div>

            {errors.phone && (
              <p className="mt-1 text-xs text-red-500">{errors.phone}</p>
            )}
          </div>

          {/* Password */}
          <div className="mb-5">
            <label className="block text-xs font-semibold text-gray-700 mb-1.5">
              Password
            </label>

            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock
                  size={16}
                  className={errors.password ? "text-red-400" : "text-gray-400"}
                />
              </div>

              <input
                name="password"
                type={showPassword ? "text" : "password"}
                value={formData.password}
                onChange={handleChange}
                onKeyDown={handleKeyDown}
                placeholder="Enter your password"
                className={`block w-full pl-9 pr-10 py-3 text-sm border rounded-2xl outline-none transition-all
                  focus:ring-2 focus:ring-green-400 focus:border-transparent
                  ${
                    errors.password
                      ? "border-red-300 bg-red-50 placeholder-red-300"
                      : "border-green-200 bg-green-50 placeholder-gray-400 hover:border-green-300"
                  }`}
              />

              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>

            {errors.password && (
              <p className="mt-1 text-xs text-red-500">{errors.password}</p>
            )}
          </div>

          {/* Remember & Forgot */}
          <div className="flex items-center justify-between mb-6">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                className="w-3.5 h-3.5 rounded accent-green-500 cursor-pointer"
              />

              <span className="text-xs text-gray-600">Remember me</span>
            </label>

            <Link
              to="/forgot-password"
              className="text-xs font-semibold text-green-600 hover:text-green-800 transition-colors"
            >
              Forgot password?
            </Link>
          </div>

          {/* Login Button */}
          <button
            type="button"
            onClick={handleSubmit}
            disabled={isLoading}
            className="w-full py-3 bg-linear-to-r from-green-500 to-emerald-600 text-white text-sm font-bold rounded-2xl
              hover:from-green-600 hover:to-emerald-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2
              transition-all duration-200 shadow-lg shadow-green-200 disabled:opacity-60 disabled:cursor-not-allowed mb-5"
          >
            {isLoading ? (
              <span className="flex items-center justify-center gap-2">
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Signing in...
              </span>
            ) : (
              "Sign In"
            )}
          </button>

          {/* Google Auth */}
          <button
            type="button"
            className="w-full flex items-center justify-center gap-3 py-3 border border-green-100 bg-white text-gray-700 text-sm font-semibold rounded-2xl hover:bg-green-50 transition-all mb-5"
          >
            <img
              src="https://www.svgrepo.com/show/475656/google-color.svg"
              alt="Google"
              className="w-5 h-5"
            />
            Continue with Google
          </button>

          {/* Divider */}
          <div className="relative mb-5">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-100" />
            </div>

            <div className="relative flex justify-center">
              <span className="px-3 bg-white text-xs text-gray-400">or</span>
            </div>
          </div>

          {/* Register */}
          <p className="text-center text-xs text-gray-500">
            Don't have an account?{" "}
            <Link
              to="/register"
              className="font-semibold text-green-600 hover:text-green-800 transition-colors"
            >
              Create one here
            </Link>
          </p>
        </div>

        {/* Footer */}
        <p className="text-center text-xs text-gray-400 mt-5">
          By signing in, you agree to our{" "}
          <a href="#" className="text-green-600 hover:underline">
            Terms
          </a>{" "}
          and{" "}
          <a href="#" className="text-green-600 hover:underline">
            Privacy Policy
          </a>
        </p>
      </div>
    </div>
  );
}
