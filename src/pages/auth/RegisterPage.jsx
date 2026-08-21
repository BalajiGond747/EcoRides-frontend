import React, { useState } from "react";
import {
  Eye,
  EyeOff,
  Lock,
  Phone,
  Mail,
  MapPin,
  User,
  Car,
  ChevronDown,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";

const API_BASE = "http://localhost:8080/api";
const USER_ROLES = ["USER", "ADMIN", "MODERATOR"];

export default function RegisterPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    password: "",
    email: "",
    address: "",
    userRole: "USER",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validate = () => {
    const errs = {};
    if (!formData.firstName.trim()) errs.firstName = "First name is required";
    if (!formData.lastName.trim()) errs.lastName = "Last name is required";
    if (!formData.phone) {
      errs.phone = "Phone number is required";
    } else if (!/^\d{10}$/.test(formData.phone)) {
      errs.phone = "Enter a valid 10-digit phone number";
    }
    if (!formData.password) {
      errs.password = "Password is required";
    } else if (formData.password.length < 6) {
      errs.password = "Password must be at least 6 characters";
    }
    if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
      errs.email = "Enter a valid email address";
    }
    if (
      formData.address &&
      (formData.address.length < 10 || formData.address.length > 200)
    ) {
      errs.address = "Address must be between 10 and 200 characters";
    }
    return errs;
  };

  const handleSubmit = async () => {
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    setIsLoading(true);
    try {
      await axios.post(`${API_BASE}/auth/register`, formData);
      toast.success("Account created! Please log in.");
      setTimeout(() => navigate("/login"), 900);
    } catch (err) {
      const msg =
        err.response?.data?.message || "Registration failed. Please try again.";
      toast.error(msg);
    } finally {
      setIsLoading(false);
    }
  };

  const getInputClass = (field) =>
    `block w-full pl-9 pr-3 py-2.5 text-sm border rounded-xl outline-none transition-all
    focus:ring-2 focus:ring-green-400 focus:border-transparent
    ${
      errors[field]
        ? "border-red-300 bg-red-50 placeholder-red-300"
        : "border-green-200 bg-green-50 placeholder-gray-400 hover:border-green-300"
    }`;

  const passwordStrength = () => {
    const len = formData.password.length;
    if (!len) return null;
    if (
      len >= 10 &&
      /[A-Z]/.test(formData.password) &&
      /\d/.test(formData.password)
    )
      return { label: "Strong", width: "w-full", color: "bg-green-500" };
    if (len >= 6)
      return { label: "Medium", width: "w-3/5", color: "bg-lime-400" };
    return { label: "Weak", width: "w-1/4", color: "bg-orange-400" };
  };

  const strength = passwordStrength();

  return (
    <div className="min-h-screen bg-linear-to-br from-green-50 via-emerald-50 to-green-100 flex items-center justify-center p-4 relative overflow-hidden">
      <Toaster position="top-right" />

      <div className="absolute w-96 h-96 rounded-full bg-green-200 opacity-30 -top-24 -right-20 pointer-events-none" />
      <div className="absolute w-64 h-64 rounded-full bg-emerald-200 opacity-25 -bottom-16 -left-16 pointer-events-none" />

      <div className="w-full max-w-lg relative z-10">
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

          <h1 className="text-2xl font-bold text-gray-900 tracking-tight mb-1">
            Create your account
          </h1>
          <p className="text-sm text-gray-500 mb-6">
            Fill in the details below to get started
          </p>

          {/* First + Last Name */}
          <div className="grid grid-cols-2 gap-3 mb-4">
            {/* First Name */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                First Name
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User
                    size={15}
                    className={
                      errors.firstName ? "text-red-400" : "text-gray-400"
                    }
                  />
                </div>
                <input
                  name="firstName"
                  type="text"
                  value={formData.firstName}
                  onChange={handleChange}
                  placeholder="John"
                  className={getInputClass("firstName")}
                />
              </div>
              {errors.firstName && (
                <p className="mt-1 text-xs text-red-500">{errors.firstName}</p>
              )}
            </div>

            {/* Last Name */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                Last Name
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User
                    size={15}
                    className={
                      errors.lastName ? "text-red-400" : "text-gray-400"
                    }
                  />
                </div>
                <input
                  name="lastName"
                  type="text"
                  value={formData.lastName}
                  onChange={handleChange}
                  placeholder="Doe"
                  className={getInputClass("lastName")}
                />
              </div>
              {errors.lastName && (
                <p className="mt-1 text-xs text-red-500">{errors.lastName}</p>
              )}
            </div>
          </div>

          {/* Phone */}
          <div className="mb-4">
            <label className="block text-xs font-semibold text-gray-700 mb-1.5">
              Phone Number
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Phone
                  size={15}
                  className={errors.phone ? "text-red-400" : "text-gray-400"}
                />
              </div>
              <input
                name="phone"
                type="tel"
                maxLength={10}
                value={formData.phone}
                onChange={handleChange}
                placeholder="10-digit phone number"
                className={getInputClass("phone")}
              />
            </div>
            {errors.phone && (
              <p className="mt-1 text-xs text-red-500">{errors.phone}</p>
            )}
          </div>

          {/* Email */}
          <div className="mb-4">
            <label className="block text-xs font-semibold text-gray-700 mb-1.5">
              Email Address{" "}
              <span className="font-normal text-gray-400">(optional)</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail
                  size={15}
                  className={errors.email ? "text-red-400" : "text-gray-400"}
                />
              </div>
              <input
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="john@example.com"
                className={getInputClass("email")}
              />
            </div>
            {errors.email && (
              <p className="mt-1 text-xs text-red-500">{errors.email}</p>
            )}
          </div>

          {/* Password */}
          <div className="mb-4">
            <label className="block text-xs font-semibold text-gray-700 mb-1.5">
              Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock
                  size={15}
                  className={errors.password ? "text-red-400" : "text-gray-400"}
                />
              </div>
              <input
                name="password"
                type={showPassword ? "text" : "password"}
                value={formData.password}
                onChange={handleChange}
                placeholder="At least 6 characters"
                className={`block w-full pl-9 pr-10 py-2.5 text-sm border rounded-xl outline-none transition-all
                  focus:ring-2 focus:ring-green-400 focus:border-transparent
                  ${
                    errors.password
                      ? "border-red-300 bg-red-50 placeholder-red-300"
                      : "border-green-200 bg-green-50 placeholder-gray-400 hover:border-green-300"
                  }`}
              />
              <button
                type="button"
                onClick={() => setShowPassword((p) => !p)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
            {errors.password && (
              <p className="mt-1 text-xs text-red-500">{errors.password}</p>
            )}
            {/* Strength bar */}
            {strength && !errors.password && (
              <div className="mt-2">
                <div className="w-full h-1 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-300 ${strength.width} ${strength.color}`}
                  />
                </div>
                <p
                  className={`text-xs mt-1 font-medium ${
                    strength.label === "Strong"
                      ? "text-green-600"
                      : strength.label === "Medium"
                      ? "text-lime-600"
                      : "text-orange-500"
                  }`}
                >
                  {strength.label}
                </p>
              </div>
            )}
          </div>

          {/* Address */}
          <div className="mb-4">
            <label className="block text-xs font-semibold text-gray-700 mb-1.5">
              Address{" "}
              <span className="font-normal text-gray-400">
                (optional, 10–200 chars)
              </span>
            </label>
            <div className="relative">
              <div className="absolute top-3 left-3 pointer-events-none">
                <MapPin
                  size={15}
                  className={errors.address ? "text-red-400" : "text-gray-400"}
                />
              </div>
              <textarea
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="Enter your full address"
                maxLength={200}
                rows={2}
                className={`block w-full pl-9 pr-3 py-2.5 text-sm border rounded-xl outline-none transition-all resize-none
                  focus:ring-2 focus:ring-green-400 focus:border-transparent
                  ${
                    errors.address
                      ? "border-red-300 bg-red-50 placeholder-red-300"
                      : "border-green-200 bg-green-50 placeholder-gray-400 hover:border-green-300"
                  }`}
              />
            </div>
            <div className="flex justify-between items-center mt-1">
              {errors.address ? (
                <p className="text-xs text-red-500">{errors.address}</p>
              ) : (
                <span />
              )}
              <span className="text-xs text-gray-400 ml-auto">
                {formData.address.length}/200
              </span>
            </div>
          </div>

          {/* Role
          <div className="mb-6">
            <label className="block text-xs font-semibold text-gray-700 mb-1.5">Role</label>
            <div className="relative">
              <select
                name="userRole"
                value={formData.userRole}
                onChange={handleChange}
                className="block w-full pl-3 pr-8 py-2.5 text-sm border border-green-200 bg-green-50 rounded-xl outline-none
                  appearance-none cursor-pointer transition-all hover:border-green-300
                  focus:ring-2 focus:ring-green-400 focus:border-transparent"
              >
                {USER_ROLES.map(r => <option key={r} value={r}>{r}</option>)}
              </select>
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                <ChevronDown size={15} className="text-gray-400" />
              </div>
            </div>
          </div> */}

          {/* Submit */}
          <button
            type="button"
            onClick={handleSubmit}
            disabled={isLoading}
            className="w-full py-2.5 bg-linear-to-r from-green-500 to-emerald-600 text-white text-sm font-bold rounded-xl
              hover:from-green-600 hover:to-emerald-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2
              transition-all duration-200 shadow-md shadow-green-200 disabled:opacity-60 disabled:cursor-not-allowed mb-5"
          >
            {isLoading ? (
              <span className="flex items-center justify-center gap-2">
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Creating account...
              </span>
            ) : (
              "Create Account"
            )}
          </button>

          <p className="text-center text-xs text-gray-500">
            Already have an account?{" "}
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
