import React, { useState } from "react";
import { ArrowLeft, Eye, EyeOff, Loader2, ShieldCheck } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import api from "../../services/api";

const AddAdministrator = () => {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
    address: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    setForm((previous) => ({
      ...previous,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (form.password !== form.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    if (form.password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    try {
      setLoading(true);

      const response = await api.post("/admins", {
        firstName: form.firstName.trim(),
        lastName: form.lastName.trim(),
        phone: form.phone.trim(),
        email: form.email.trim(),
        address: form.address.trim(),
        password: form.password,
        confirmPassword: form.confirmPassword,
      });

      toast.success(
        response.data?.message || "Administrator created successfully"
      );

      navigate("/admin/administrators", {
        replace: true,
      });
    } catch (error) {
      console.error("Create administrator error:", error);

      toast.error(
        error.response?.data?.message || "Unable to create administrator"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="mb-6">
        <Link
          to="/admin/administrators"
          className="inline-flex items-center gap-2
                     text-emerald-600 font-semibold
                     hover:text-emerald-700 mb-5"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Administrators
        </Link>

        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-emerald-100 flex items-center justify-center">
            <ShieldCheck className="w-6 h-6 text-emerald-600" />
          </div>

          <div>
            <h2 className="text-2xl font-bold text-gray-800">
              Add Administrator
            </h2>

            <p className="text-gray-500 mt-1">
              Create a new administrator account for EcoRides.
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow p-6 sm:p-8 max-w-4xl">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <h3 className="text-lg font-bold text-gray-800">
              Personal Information
            </h3>

            <p className="text-sm text-gray-500 mt-1 mb-5">
              Enter the administrator's basic information.
            </p>

            <div className="grid md:grid-cols-2 gap-5">
              <Input
                label="First Name"
                name="firstName"
                value={form.firstName}
                onChange={handleChange}
                placeholder="Enter first name"
              />

              <Input
                label="Last Name"
                name="lastName"
                value={form.lastName}
                onChange={handleChange}
                placeholder="Enter last name"
              />

              <Input
                label="Phone"
                name="phone"
                value={form.phone}
                onChange={handleChange}
                placeholder="10 digit phone number"
                type="tel"
                maxLength={10}
              />

              <Input
                label="Email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="admin@example.com"
                type="email"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2">Address</label>

            <textarea
              name="address"
              value={form.address}
              onChange={handleChange}
              placeholder="Enter administrator address"
              rows={4}
              required
              className="w-full px-4 py-3 rounded-xl
                         border border-gray-300
                         focus:ring-2 focus:ring-emerald-500
                         focus:border-emerald-500
                         focus:outline-none"
            />
          </div>

          <div>
            <h3 className="text-lg font-bold text-gray-800">
              Login Credentials
            </h3>

            <p className="text-sm text-gray-500 mt-1 mb-5">
              These credentials will be used by the administrator to log in.
            </p>

            <div className="grid md:grid-cols-2 gap-5">
              <PasswordInput
                label="Password"
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder="Enter password"
                visible={showPassword}
                onToggle={() => setShowPassword((previous) => !previous)}
              />

              <PasswordInput
                label="Confirm Password"
                name="confirmPassword"
                value={form.confirmPassword}
                onChange={handleChange}
                placeholder="Confirm password"
                visible={showConfirmPassword}
                onToggle={() => setShowConfirmPassword((previous) => !previous)}
              />
            </div>
          </div>

          <div className="rounded-xl bg-emerald-50 border border-emerald-100 p-4">
            <div className="flex gap-3">
              <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />

              <div>
                <p className="font-semibold text-emerald-800">
                  Administrator access
                </p>

                <p className="text-sm text-emerald-700 mt-1">
                  This account will be created as an active administrator and
                  will have access to the admin dashboard.
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <Link
              to="/admin/administrators"
              className="flex-1 text-center px-5 py-3 rounded-full
                         border border-gray-300
                         text-gray-700 font-semibold
                         hover:bg-gray-50 transition"
            >
              Cancel
            </Link>

            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-5 py-3 rounded-full
                         bg-emerald-600 text-white
                         font-semibold
                         hover:bg-emerald-700
                         disabled:bg-emerald-300
                         disabled:cursor-not-allowed
                         flex items-center justify-center gap-2
                         transition"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Creating...
                </>
              ) : (
                <>
                  <ShieldCheck className="w-5 h-5" />
                  Create Administrator
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const Input = ({
  label,
  name,
  value,
  onChange,
  placeholder,
  type = "text",
  maxLength,
}) => (
  <div>
    <label htmlFor={name} className="block text-sm font-semibold mb-2">
      {label}
    </label>

    <input
      id={name}
      name={name}
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      maxLength={maxLength}
      required
      className="w-full px-4 py-3 rounded-xl
                 border border-gray-300
                 focus:ring-2 focus:ring-emerald-500
                 focus:border-emerald-500
                 focus:outline-none"
    />
  </div>
);

const PasswordInput = ({
  label,
  name,
  value,
  onChange,
  placeholder,
  visible,
  onToggle,
}) => (
  <div>
    <label htmlFor={name} className="block text-sm font-semibold mb-2">
      {label}
    </label>

    <div className="relative">
      <input
        id={name}
        name={name}
        type={visible ? "text" : "password"}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required
        className="w-full px-4 py-3 pr-12 rounded-xl
                   border border-gray-300
                   focus:ring-2 focus:ring-emerald-500
                   focus:border-emerald-500
                   focus:outline-none"
      />

      <button
        type="button"
        onClick={onToggle}
        className="absolute right-3 top-1/2
                   -translate-y-1/2
                   text-gray-400
                   hover:text-emerald-600"
        aria-label={visible ? "Hide password" : "Show password"}
      >
        {visible ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
      </button>
    </div>
  </div>
);

export default AddAdministrator;
