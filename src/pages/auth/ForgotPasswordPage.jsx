import React, { useState } from "react";
import {
  Eye,
  EyeOff,
  Lock,
  Phone,
  Car,
  ArrowLeft,
  CheckCircle,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";

const API_BASE = "http://localhost:8080/api";

export default function ForgotPasswordPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    phone: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [done, setDone] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validateStep1 = () => {
    const errs = {};
    if (!formData.phone) {
      errs.phone = "Phone number is required";
    } else if (!/^\d{10}$/.test(formData.phone)) {
      errs.phone = "Enter a valid 10-digit phone number";
    }
    return errs;
  };

  const validateStep2 = () => {
    const errs = {};
    if (!formData.newPassword) {
      errs.newPassword = "New password is required";
    } else if (formData.newPassword.length < 6) {
      errs.newPassword = "Password must be at least 6 characters";
    }
    if (!formData.confirmPassword) {
      errs.confirmPassword = "Please confirm your password";
    } else if (formData.newPassword !== formData.confirmPassword) {
      errs.confirmPassword = "Passwords do not match";
    }
    return errs;
  };

  const handleVerifyPhone = async () => {
    const errs = validateStep1();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    setIsLoading(true);
    try {
      await axios.post(`${API_BASE}/auth/verify-phone`, {
        phone: formData.phone,
      });
      toast.success("Phone verified! Set your new password.");
      setStep(2);
    } catch (err) {
      const msg = err.response?.data?.message || "Phone number not found.";
      toast.error(msg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async () => {
    const errs = validateStep2();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    setIsLoading(true);
    try {
      await axios.post(`${API_BASE}/auth/reset-password`, {
        phone: formData.phone,
        newPassword: formData.newPassword,
        confirmPassword: formData.confirmPassword,
      });
      setDone(true);
      toast.success("Password reset successfully!");
    } catch (err) {
      const msg = err.response?.data?.message || "Failed to reset password.";
      toast.error(msg);
    } finally {
      setIsLoading(false);
    }
  };

  if (done) {
    return (
      <div className="min-h-screen bg-linear-to-br from-green-50 via-emerald-50 to-green-100 flex items-center justify-center p-4 relative overflow-hidden">
        <Toaster position="top-right" />
        <div className="absolute w-96 h-96 rounded-full bg-green-200 opacity-30 -top-24 -right-20 pointer-events-none" />
        <div className="absolute w-64 h-64 rounded-full bg-emerald-200 opacity-25 -bottom-16 -left-16 pointer-events-none" />
        <div className="w-full max-w-md relative z-10">
          <div className="bg-white rounded-2xl shadow-xl shadow-green-100 p-10 text-center">
            <div className="w-20 h-20 rounded-full bg-green-50 flex items-center justify-center mx-auto mb-5 shadow-md shadow-green-100">
              <CheckCircle
                size={40}
                className="text-green-500"
                strokeWidth={1.8}
              />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Password Reset!
            </h2>
            <p className="text-sm text-gray-500 mb-7">
              Your password has been updated. You can now sign in with your new
              password.
            </p>
            <button
              onClick={() => navigate("/login")}
              className="w-full py-2.5 bg-linear-to-r from-green-500 to-emerald-600 text-white text-sm font-bold rounded-xl
                hover:from-green-600 hover:to-emerald-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2
                transition-all shadow-md shadow-green-200"
            >
              Go to Sign In
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-green-50 via-emerald-50 to-green-100 flex items-center justify-center p-4 relative overflow-hidden">
      <Toaster position="top-right" />

      <div className="absolute w-96 h-96 rounded-full bg-green-200 opacity-30 -top-24 -right-20 pointer-events-none" />
      <div className="absolute w-64 h-64 rounded-full bg-emerald-200 opacity-25 -bottom-16 -left-16 pointer-events-none" />

      <div className="w-full max-w-md relative z-10">
        <div className="bg-white rounded-2xl shadow-xl shadow-green-100 p-8">
          {/* Project Name */}
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-2xl bg-linear-to-br from-green-500 to-emerald-600 flex items-center justify-center shadow-md shadow-green-200">
              <Car size={20} className="text-white" strokeWidth={2.3} />
            </div>

            <div>
              <h1 className="text-xl font-black tracking-tight text-green-700 leading-none">
                EcoRides
              </h1>

              <p className="text-[11px] text-gray-400 mt-1">
                Smart eco transportation
              </p>
            </div>
          </div>

          {/* Step Indicator */}
          <div className="flex items-center gap-2 mb-7">
            {/* Step 1 */}
            <div className="flex items-center gap-2">
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shadow-sm
                ${
                  step > 1
                    ? "bg-green-500 text-white"
                    : step === 1
                    ? "bg-linear-to-br from-green-400 to-emerald-600 text-white shadow-md shadow-green-200"
                    : "bg-gray-200 text-gray-400"
                }`}
              >
                {step > 1 ? "✓" : "1"}
              </div>
              <span
                className={`text-xs font-medium ${
                  step === 1 ? "text-green-700" : "text-gray-400"
                }`}
              >
                Verify Phone
              </span>
            </div>

            {/* Connector */}
            <div className="flex-1 h-px bg-gray-200 mx-1" />

            {/* Step 2 */}
            <div className="flex items-center gap-2">
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shadow-sm
                ${
                  step === 2
                    ? "bg-linear-to-br from-green-400 to-emerald-600 text-white shadow-md shadow-green-200"
                    : "bg-gray-200 text-gray-400"
                }`}
              >
                2
              </div>
              <span
                className={`text-xs font-medium ${
                  step === 2 ? "text-green-700" : "text-gray-400"
                }`}
              >
                New Password
              </span>
            </div>
          </div>

          {step === 1 ? (
            <>
              <h1 className="text-2xl font-bold text-gray-900 tracking-tight mb-1">
                Forgot password?
              </h1>
              <p className="text-sm text-gray-500 mb-6">
                Enter your registered phone number to continue
              </p>

              <div className="mb-6">
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                  Phone Number
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Phone
                      size={15}
                      className={
                        errors.phone ? "text-red-400" : "text-gray-400"
                      }
                    />
                  </div>
                  <input
                    name="phone"
                    type="tel"
                    maxLength={10}
                    value={formData.phone}
                    onChange={handleChange}
                    onKeyDown={(e) => e.key === "Enter" && handleVerifyPhone()}
                    placeholder="Enter 10-digit phone number"
                    className={`block w-full pl-9 pr-3 py-2.5 text-sm border rounded-xl outline-none transition-all
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

              <button
                type="button"
                onClick={handleVerifyPhone}
                disabled={isLoading}
                className="w-full py-2.5 bg-linear-to-r from-green-500 to-emerald-600 text-white text-sm font-bold rounded-xl
                  hover:from-green-600 hover:to-emerald-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2
                  transition-all duration-200 shadow-md shadow-green-200 disabled:opacity-60 disabled:cursor-not-allowed mb-5"
              >
                {isLoading ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Verifying...
                  </span>
                ) : (
                  "Verify Phone"
                )}
              </button>
            </>
          ) : (
            <>
              <h1 className="text-2xl font-bold text-gray-900 tracking-tight mb-1">
                Set new password
              </h1>
              <p className="text-sm text-gray-500 mb-6">
                Choose a strong password for your account
              </p>

              {/* New Password */}
              <div className="mb-4">
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                  New Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock
                      size={15}
                      className={
                        errors.newPassword ? "text-red-400" : "text-gray-400"
                      }
                    />
                  </div>
                  <input
                    name="newPassword"
                    type={showNew ? "text" : "password"}
                    value={formData.newPassword}
                    onChange={handleChange}
                    placeholder="At least 6 characters"
                    className={`block w-full pl-9 pr-10 py-2.5 text-sm border rounded-xl outline-none transition-all
                      focus:ring-2 focus:ring-green-400 focus:border-transparent
                      ${
                        errors.newPassword
                          ? "border-red-300 bg-red-50 placeholder-red-300"
                          : "border-green-200 bg-green-50 placeholder-gray-400 hover:border-green-300"
                      }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowNew((p) => !p)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                  >
                    {showNew ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
                {errors.newPassword && (
                  <p className="mt-1 text-xs text-red-500">
                    {errors.newPassword}
                  </p>
                )}
              </div>

              {/* Confirm Password */}
              <div className="mb-6">
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                  Confirm Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock
                      size={15}
                      className={
                        errors.confirmPassword
                          ? "text-red-400"
                          : "text-gray-400"
                      }
                    />
                  </div>
                  <input
                    name="confirmPassword"
                    type={showConfirm ? "text" : "password"}
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="Re-enter new password"
                    className={`block w-full pl-9 pr-10 py-2.5 text-sm border rounded-xl outline-none transition-all
                      focus:ring-2 focus:ring-green-400 focus:border-transparent
                      ${
                        errors.confirmPassword
                          ? "border-red-300 bg-red-50 placeholder-red-300"
                          : formData.confirmPassword &&
                            formData.confirmPassword === formData.newPassword
                          ? "border-green-400 bg-green-50"
                          : "border-green-200 bg-green-50 placeholder-gray-400 hover:border-green-300"
                      }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirm((p) => !p)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                  >
                    {showConfirm ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
                {errors.confirmPassword ? (
                  <p className="mt-1 text-xs text-red-500">
                    {errors.confirmPassword}
                  </p>
                ) : (
                  formData.confirmPassword &&
                  formData.confirmPassword === formData.newPassword && (
                    <p className="mt-1 text-xs text-green-600 font-medium">
                      ✓ Passwords match
                    </p>
                  )
                )}
              </div>

              <button
                type="button"
                onClick={handleResetPassword}
                disabled={isLoading}
                className="w-full py-2.5 bg-linear-to-r from-green-500 to-emerald-600 text-white text-sm font-bold rounded-xl
                  hover:from-green-600 hover:to-emerald-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2
                  transition-all duration-200 shadow-md shadow-green-200 disabled:opacity-60 disabled:cursor-not-allowed mb-3"
              >
                {isLoading ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Resetting...
                  </span>
                ) : (
                  "Reset Password"
                )}
              </button>

              <button
                type="button"
                onClick={() => {
                  setStep(1);
                  setErrors({});
                }}
                className="w-full py-2.5 flex items-center justify-center gap-2 text-sm font-semibold text-gray-500
                  border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors mb-5"
              >
                <ArrowLeft size={15} />
                Back
              </button>
            </>
          )}

          <p className="text-center text-xs text-gray-500">
            Remember your password?{" "}
            <Link
              to="/login"
              className="font-semibold text-green-600 hover:text-green-800 transition-colors"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
