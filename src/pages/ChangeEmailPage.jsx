import React, { useState } from "react";
import { ArrowRight, Leaf, Loader2, Mail } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import api from "../services/api";
import { getCurrentUser } from "../services/auth";

const ChangeEmailPage = () => {
  const navigate = useNavigate();

  const currentUser = getCurrentUser();

  const [newEmail, setNewEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!newEmail.trim()) {
      toast.error("New email is required");
      return;
    }

    if (newEmail.trim().toLowerCase() === currentUser?.email?.toLowerCase()) {
      toast.error("New email must be different from your current email");
      return;
    }

    try {
      setLoading(true);

      const response = await api.post("/auth/send-email-change-otp", {
        newEmail: newEmail.trim(),
      });

      toast.success(response.data?.message || "OTP sent to your new email");

      navigate("/verify-email-change-otp", {
        state: {
          newEmail: newEmail.trim(),
        },
      });
    } catch (error) {
      console.error("Send email change OTP error:", error);

      toast.error(
        error.response?.data?.message || "Unable to send email change OTP"
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

            <h2 className="text-2xl font-bold text-gray-900">Change Email</h2>

            <p className="text-sm text-gray-500 text-center mt-2">
              Enter your new email address. We'll send you an OTP.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label
                htmlFor="newEmail"
                className="block text-gray-700 font-medium mb-1"
              >
                New Email
              </label>

              <input
                id="newEmail"
                type="email"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                placeholder="Enter new email"
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

          <p className="mt-6 text-center text-sm">
            <Link
              to="/"
              className="text-emerald-600 font-semibold hover:underline"
            >
              Back
            </Link>
          </p>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default ChangeEmailPage;
