import React, { useState } from "react";
import { ArrowRight, KeyRound, Loader2 } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import api from "../services/api";
import { logout } from "../services/auth";

const VerifyEmailChangeOtpPage = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const newEmail = location.state?.newEmail;

  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);

  if (!newEmail) {
    return (
      <div className="min-h-screen flex flex-col bg-gradient-to-br from-emerald-50 via-white to-green-50">
        <Navbar />

        <div className="flex-grow flex items-center justify-center px-4">
          <div className="text-center">
            <h2 className="text-xl font-bold text-gray-900">
              Email change session expired
            </h2>

            <p className="text-gray-500 mt-2">
              Please start the email change process again.
            </p>

            <Link
              to="/change-email"
              className="inline-block mt-5 bg-emerald-600 text-white px-6 py-2 rounded-full"
            >
              Change Email
            </Link>
          </div>
        </div>

        <Footer />
      </div>
    );
  }

  const handleVerify = async (e) => {
    e.preventDefault();

    if (!/^\d{6}$/.test(otp)) {
      toast.error("Enter a valid 6-digit OTP");
      return;
    }

    try {
      setLoading(true);

      const verifyResponse = await api.post("/auth/verify-email-change-otp", {
        email: newEmail,
        otp,
      });

      toast.success(
        verifyResponse.data?.message || "New email verified successfully"
      );

      const changeResponse = await api.patch("/auth/change-email", {
        newEmail,
      });

      toast.success(
        changeResponse.data?.message || "Email updated successfully"
      );

      setTimeout(() => {
        logout();
      }, 1000);
    } catch (error) {
      console.error("Email change verification error:", error);

      toast.error(
        error.response?.data?.message || "Unable to verify email change"
      );

      setLoading(false);
    }
  };

  const handleResend = async () => {
    try {
      setResending(true);

      const response = await api.post("/auth/send-email-change-otp", {
        newEmail,
      });

      toast.success(response.data?.message || "OTP sent again");
    } catch (error) {
      console.error("Resend email change OTP error:", error);

      toast.error(error.response?.data?.message || "Unable to resend OTP");
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-emerald-50 via-white to-green-50">
      <Navbar />

      <section className="flex-grow flex items-center justify-center px-4 py-12">
        <div className="bg-white shadow-xl rounded-3xl max-w-md w-full p-6 sm:p-8 border border-emerald-100">
          <div className="flex flex-col items-center mb-8">
            <div className="w-14 h-14 rounded-full bg-emerald-100 flex items-center justify-center mb-3">
              <KeyRound className="w-7 h-7 text-emerald-600" />
            </div>

            <h2 className="text-2xl font-bold text-gray-900">
              Verify New Email
            </h2>

            <p className="text-sm text-gray-500 text-center mt-2">
              Enter the OTP sent to
            </p>

            <p className="font-medium text-emerald-600 mt-1 break-all">
              {newEmail}
            </p>
          </div>

          <form onSubmit={handleVerify} className="space-y-5">
            <input
              type="text"
              inputMode="numeric"
              maxLength={6}
              value={otp}
              onChange={(e) =>
                setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))
              }
              placeholder="Enter 6-digit OTP"
              required
              disabled={loading}
              className="w-full px-4 py-3 text-center text-2xl tracking-[0.5em]
                         border border-gray-300 rounded-lg
                         focus:outline-none focus:ring-2 focus:ring-emerald-500
                         focus:border-emerald-500"
            />

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-emerald-600 text-white py-3 rounded-full
                         font-semibold hover:bg-emerald-700
                         flex items-center justify-center gap-2
                         disabled:bg-emerald-300 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Updating...
                </>
              ) : (
                <>
                  Verify & Change Email
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <button
            type="button"
            onClick={handleResend}
            disabled={resending || loading}
            className="w-full mt-4 text-emerald-600 font-semibold
                       hover:underline disabled:text-gray-400"
          >
            {resending ? "Sending..." : "Didn't receive OTP? Resend"}
          </button>

          <p className="mt-5 text-center text-sm">
            <Link
              to="/change-email"
              className="text-emerald-600 font-semibold hover:underline"
            >
              Change email address
            </Link>
          </p>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default VerifyEmailChangeOtpPage;
