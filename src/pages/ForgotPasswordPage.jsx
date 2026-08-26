import React, { useState } from "react";
import { ArrowRight, Leaf, Loader2, Mail } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import api from "../services/api";

const ForgotPasswordPage = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email.trim()) {
      toast.error("Email is required");
      return;
    }

    try {
      setLoading(true);

      const response = await api.post("/auth/forgot-password", {
        email: email.trim(),
      });

      toast.success(
        response.data?.message || "Password reset OTP sent to your email"
      );

      navigate("/verify-reset-otp", {
        state: { email: email.trim() },
      });
    } catch (error) {
      console.error("Forgot password error:", error);

      toast.error(
        error.response?.data?.message || "Unable to send password reset OTP"
      );
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
              <Mail className="w-7 h-7 text-emerald-600" />
            </div>

            <h2 className="text-2xl font-bold text-gray-900">
              Forgot Password?
            </h2>

            <p className="text-sm text-gray-500 text-center mt-2">
              Enter your registered email and we'll send you an OTP.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
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
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
                disabled={loading}
                autoComplete="email"
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg
                           focus:outline-none focus:ring-2 focus:ring-emerald-500
                           focus:border-emerald-500 disabled:bg-gray-100"
              />
            </div>

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
                  Sending OTP...
                </>
              ) : (
                <>
                  Send OTP
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-600">
            Remember your password?{" "}
            <Link
              to="/login"
              className="text-emerald-600 font-semibold hover:underline"
            >
              Back to Login
            </Link>
          </p>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default ForgotPasswordPage;
