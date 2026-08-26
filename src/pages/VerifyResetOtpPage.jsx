import React, { useState } from "react";
import { ArrowRight, KeyRound, Leaf, Loader2 } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import api from "../services/api";

const VerifyResetOtpPage = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const email = location.state?.email;

  const [otp, setOtp] = useState("");
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

  const handleVerify = async (e) => {
    e.preventDefault();

    if (!/^\d{6}$/.test(otp)) {
      toast.error("Enter a valid 6-digit OTP");
      return;
    }

    try {
      setLoading(true);

      const response = await api.post("/auth/verify-reset-otp", {
        email,
        otp,
      });

      toast.success(response.data?.message || "OTP verified successfully");

      navigate("/reset-password", {
        replace: true,
        state: { email },
      });
    } catch (error) {
      toast.error(error.response?.data?.message || "Invalid or expired OTP");
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
              <KeyRound className="w-7 h-7 text-emerald-600" />
            </div>

            <h2 className="text-2xl font-bold text-gray-900">
              Verify Reset OTP
            </h2>

            <p className="text-sm text-gray-500 text-center mt-2">
              Enter the OTP sent to
            </p>

            <p className="font-medium text-emerald-600 mt-1 break-all">
              {email}
            </p>
          </div>

          <form onSubmit={handleVerify} className="space-y-5">
            <input
              type="text"
              inputMode="numeric"
              maxLength={6}
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
              placeholder="Enter 6-digit OTP"
              required
              disabled={loading}
              className="w-full px-4 py-3 text-center text-2xl tracking-[0.5em]
                         border border-gray-300 rounded-lg
                         focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />

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
                  Verifying...
                </>
              ) : (
                <>
                  Verify OTP
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-600">
            <Link
              to="/forgot-password"
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

export default VerifyResetOtpPage;
