import React, { useEffect, useState } from "react";
import { ArrowRight, Eye, EyeOff, Leaf, Loader2 } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import api from "../services/api";

const RegisterPage = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    address: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  
  useEffect(() => {
    const verified = location.state?.verified;
    const registrationData = location.state?.registrationData;

    if (!verified || !registrationData) {
      return;
    }

    const completeRegistration = async () => {
      try {
        setLoading(true);

        const response = await api.post("/auth/register", registrationData);

        toast.success(response.data?.message || "Registration successful");

        navigate("/login", { replace: true });
      } catch (error) {
        console.error("Registration error:", error);

        toast.error(error.response?.data?.message || "Registration failed");

        navigate("/register", { replace: true });
      } finally {
        setLoading(false);
      }
    };

    completeRegistration();
  }, [location.state, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    if (formData.password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    if (formData.phone.length !== 10) {
      toast.error("Enter a valid 10-digit phone number");
      return;
    }

    try {
      setLoading(true);

      const response = await api.post("/auth/send-registration-otp", {
        email: formData.email.trim(),
      });

      toast.success(response.data?.message || "OTP sent to your email");

      navigate("/verify-registration-otp", {
        state: {
          registrationData: {
            firstName: formData.firstName.trim(),
            lastName: formData.lastName.trim(),
            email: formData.email.trim(),
            password: formData.password,
            confirmPassword: formData.confirmPassword,
            phone: formData.phone,
            address: formData.address.trim(),
          },
        },
      });
    } catch (error) {
      console.error("Send registration OTP error:", error);

      toast.error(
        error.response?.data?.message || "Unable to send registration OTP"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-emerald-50 via-white to-green-50">
      <Navbar />

      <section className="flex-grow flex items-center justify-center px-4 py-12 sm:py-16">
        <div className="bg-white shadow-xl rounded-3xl max-w-lg w-full p-6 sm:p-8 border border-emerald-100">
          {/* Header */}
          <div className="flex flex-col items-center justify-center mb-8">
            <div className="flex items-center justify-center w-14 h-14 rounded-full bg-emerald-100 mb-3">
              <Leaf className="w-7 h-7 text-emerald-600" />
            </div>

            <h2 className="text-2xl font-bold text-gray-900">
              Create Your EcoRide Account
            </h2>

            <p className="text-sm text-gray-500 mt-1 text-center">
              Join us for a smarter and greener way to travel.
            </p>
          </div>

          <form onSubmit={handleRegister} className="space-y-4">
            {/* First + Last Name */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="firstName"
                  className="block text-gray-700 font-medium mb-1"
                >
                  First Name
                </label>

                <input
                  id="firstName"
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  placeholder="First Name"
                  minLength={3}
                  maxLength={50}
                  required
                  disabled={loading}
                  autoComplete="given-name"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg
                             focus:outline-none focus:ring-2 focus:ring-emerald-500
                             focus:border-emerald-500 disabled:bg-gray-100"
                />
              </div>

              <div>
                <label
                  htmlFor="lastName"
                  className="block text-gray-700 font-medium mb-1"
                >
                  Last Name
                </label>

                <input
                  id="lastName"
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  placeholder="Last Name"
                  minLength={3}
                  maxLength={50}
                  required
                  disabled={loading}
                  autoComplete="family-name"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg
                             focus:outline-none focus:ring-2 focus:ring-emerald-500
                             focus:border-emerald-500 disabled:bg-gray-100"
                />
              </div>
            </div>

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
                placeholder="you@example.com"
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
              <label
                htmlFor="password"
                className="block text-gray-700 font-medium mb-1"
              >
                Password
              </label>

              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Create a password"
                  minLength={6}
                  maxLength={20}
                  required
                  disabled={loading}
                  autoComplete="new-password"
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
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-gray-700 font-medium mb-1"
              >
                Confirm Password
              </label>

              <div className="relative">
                <input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Confirm your password"
                  minLength={6}
                  maxLength={20}
                  required
                  disabled={loading}
                  autoComplete="new-password"
                  className="w-full px-4 py-2.5 pr-11 border border-gray-300 rounded-lg
                             focus:outline-none focus:ring-2 focus:ring-emerald-500
                             focus:border-emerald-500 disabled:bg-gray-100"
                />

                <button
                  type="button"
                  onClick={() => setShowConfirmPassword((prev) => !prev)}
                  disabled={loading}
                  className="absolute right-3 top-1/2 -translate-y-1/2
                             text-gray-500 hover:text-emerald-600"
                >
                  {showConfirmPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Phone */}
            <div>
              <label
                htmlFor="phone"
                className="block text-gray-700 font-medium mb-1"
              >
                Phone Number
              </label>

              <input
                id="phone"
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, "").slice(0, 10);

                  setFormData((prev) => ({
                    ...prev,
                    phone: value,
                  }));
                }}
                placeholder="10-digit phone number"
                pattern="[6-9][0-9]{9}"
                maxLength={10}
                required
                disabled={loading}
                autoComplete="tel"
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg
                           focus:outline-none focus:ring-2 focus:ring-emerald-500
                           focus:border-emerald-500 disabled:bg-gray-100"
              />
            </div>

            {/* Address */}
            <div>
              <label
                htmlFor="address"
                className="block text-gray-700 font-medium mb-1"
              >
                Address
              </label>

              <textarea
                id="address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="Enter your address"
                minLength={10}
                maxLength={200}
                required
                disabled={loading}
                autoComplete="street-address"
                rows={3}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg
                           focus:outline-none focus:ring-2 focus:ring-emerald-500
                           focus:border-emerald-500 resize-none disabled:bg-gray-100"
              />
            </div>

            {/* Register */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-emerald-600 text-white py-3 rounded-full
                         font-semibold hover:bg-emerald-700 transition
                         flex items-center justify-center gap-2 mt-6
                         disabled:bg-emerald-300 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  Continue
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <p className="mt-6 text-gray-600 text-sm text-center">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-emerald-600 font-semibold hover:text-emerald-700 hover:underline"
            >
              Login
            </Link>
          </p>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default RegisterPage;
