import React, { useState } from "react";
import {
  ArrowRight,
  Eye,
  EyeOff,
  Leaf,
  Loader2,
  LockKeyhole,
} from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import api from "../services/api";

const ResetPasswordPage = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const email = location.state?.email;

  const [formData, setFormData] = useState({
    newPassword: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  if (!email) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />

        <div className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-xl font-bold">
              Password reset session expired
            </h2>

            <Link
              to="/forgot-password"
              className="inline-block mt-4 text-emerald-600 font-semibold"
            >
              Start again
            </Link>
          </div>
        </div>

        <Footer />
      </div>
    );
  }

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.newPassword !== formData.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    if (formData.newPassword.length < 8 || formData.newPassword.length > 20) {
      toast.error("Password must be between 8 and 20 characters");
      return;
    }

    try {
      setLoading(true);

      const response = await api.post("/auth/reset-password", {
        email,
        newPassword: formData.newPassword,
        confirmPassword: formData.confirmPassword,
      });

      toast.success(response.data?.message || "Password reset successful");

      navigate("/login", { replace: true });
    } catch (error) {
      toast.error(error.response?.data?.message || "Unable to reset password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-emerald-50 via-white to-green-50">
      <Navbar />

      <section className="flex-grow flex items-center justify-center px-4 py-12">
        <div className="bg-white shadow-xl rounded-3xl max-w-md w-full p-6 sm:p-8 border border-emerald-100">
          <div className="flex flex-col items-center mb-8">
            <div className="w-14 h-14 rounded-full bg-emerald-100 flex items-center justify-center mb-3">
              <LockKeyhole className="w-7 h-7 text-emerald-600" />
            </div>

            <h2 className="text-2xl font-bold text-gray-900">Reset Password</h2>

            <p className="text-sm text-gray-500 mt-2 text-center break-all">
              Create a new password for {email}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-gray-700 font-medium mb-1">
                New Password
              </label>

              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="newPassword"
                  value={formData.newPassword}
                  onChange={handleChange}
                  minLength={8}
                  maxLength={20}
                  required
                  disabled={loading}
                  autoComplete="new-password"
                  placeholder="Enter new password"
                  className="w-full px-4 py-2.5 pr-11 border border-gray-300 rounded-lg
                             focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-1">
                Confirm Password
              </label>

              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  minLength={8}
                  maxLength={20}
                  required
                  disabled={loading}
                  autoComplete="new-password"
                  placeholder="Confirm new password"
                  className="w-full px-4 py-2.5 pr-11 border border-gray-300 rounded-lg
                             focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />

                <button
                  type="button"
                  onClick={() => setShowConfirmPassword((prev) => !prev)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                >
                  {showConfirmPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-emerald-600 text-white py-3 rounded-full
                         font-semibold hover:bg-emerald-700
                         flex items-center justify-center gap-2
                         disabled:bg-emerald-300"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Resetting...
                </>
              ) : (
                <>
                  Reset Password
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default ResetPasswordPage;
