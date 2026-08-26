import React, { useState } from "react";
import {
  ArrowRight,
  Eye,
  EyeOff,
  Leaf,
  Loader2,
  LockKeyhole,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import api from "../services/api";

const ChangePasswordPage = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);

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
      toast.error("New passwords do not match");
      return;
    }

    if (formData.newPassword.length < 8 || formData.newPassword.length > 20) {
      toast.error("New password must be between 8 and 20 characters");
      return;
    }

    try {
      setLoading(true);

      const response = await api.patch("/auth/update-password", {
        oldPassword: formData.oldPassword,
        newPassword: formData.newPassword,
        confirmPassword: formData.confirmPassword,
      });

      toast.success(response.data?.message || "Password updated successfully");

      setFormData({
        oldPassword: "",
        newPassword: "",
        confirmPassword: "",
      });

      navigate(-1);
    } catch (error) {
      console.error("Update password error:", error);

      toast.error(error.response?.data?.message || "Unable to update password");
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

            <h2 className="text-2xl font-bold text-gray-900">
              Change Password
            </h2>

            <p className="text-sm text-gray-500 text-center mt-2">
              Update your account password securely.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <PasswordField
              label="Current Password"
              name="oldPassword"
              value={formData.oldPassword}
              onChange={handleChange}
              placeholder="Enter current password"
              show={showOldPassword}
              setShow={setShowOldPassword}
              disabled={loading}
            />

            <PasswordField
              label="New Password"
              name="newPassword"
              value={formData.newPassword}
              onChange={handleChange}
              placeholder="Enter new password"
              show={showNewPassword}
              setShow={setShowNewPassword}
              disabled={loading}
            />

            <PasswordField
              label="Confirm New Password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Confirm new password"
              show={showConfirmPassword}
              setShow={setShowConfirmPassword}
              disabled={loading}
            />

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
                  Updating...
                </>
              ) : (
                <>
                  Update Password
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

const PasswordField = ({
  label,
  name,
  value,
  onChange,
  placeholder,
  show,
  setShow,
  disabled,
}) => {
  return (
    <div>
      <label htmlFor={name} className="block text-gray-700 font-medium mb-1">
        {label}
      </label>

      <div className="relative">
        <input
          id={name}
          type={show ? "text" : "password"}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          minLength={8}
          maxLength={20}
          required
          disabled={disabled}
          className="w-full px-4 py-2.5 pr-11 border border-gray-300 rounded-lg
                     focus:outline-none focus:ring-2 focus:ring-emerald-500
                     focus:border-emerald-500 disabled:bg-gray-100"
        />

        <button
          type="button"
          onClick={() => setShow((prev) => !prev)}
          disabled={disabled}
          className="absolute right-3 top-1/2 -translate-y-1/2
                     text-gray-500 hover:text-emerald-600"
        >
          {show ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
        </button>
      </div>
    </div>
  );
};

export default ChangePasswordPage;
