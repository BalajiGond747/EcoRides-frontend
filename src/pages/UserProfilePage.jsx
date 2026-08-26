import React, { useEffect, useState } from "react";
import {
  UserCircle,
  Mail,
  Phone,
  MapPin,
  Save,
  Loader2,
  KeyRound,
  ArrowLeft,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import api from "../services/api";
import { getCurrentUser, setCurrentUser } from "../services/auth";

const UserProfilePage = () => {
  const navigate = useNavigate();
  const currentUser = getCurrentUser();

  const [profile, setProfile] = useState(null);

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    address: "",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!currentUser?.userId && !currentUser?.id) {
      navigate("/login");
      return;
    }

    fetchProfile();
  }, []);

  const userId = currentUser?.userId || currentUser?.id;

  const fetchProfile = async () => {
    try {
      const response = await api.get(`/users/${userId}`);

      const data = response.data?.data;

      setProfile(data);

      setForm({
        firstName: data?.firstName || "",
        lastName: data?.lastName || "",
        phone: data?.phone || "",
        address: data?.address || "",
      });
    } catch (error) {
      toast.error(error.response?.data?.message || "Unable to load profile");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setSaving(true);

      const response = await api.put(`/users/${userId}`, form);

      const updatedUser = response.data?.data;

      setProfile(updatedUser);

      const storedUser = {
        ...currentUser,
        id: updatedUser.id,
        userId: updatedUser.id,
        email: updatedUser.email,
        userRole: updatedUser.userRole,
      };

      setCurrentUser(storedUser);

      toast.success("Profile updated successfully");
    } catch (error) {
      toast.error(error.response?.data?.message || "Unable to update profile");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 via-white to-green-50">
        <Loader2 className="w-10 h-10 text-emerald-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-green-50 py-10">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="mb-6">
          <button
            type="button"
            onClick={() => navigate("/")}
            className="inline-flex items-center gap-2 px-5 py-2.5
                       rounded-full bg-white
                       border border-emerald-200
                       text-emerald-700 font-semibold
                       shadow-sm
                       hover:bg-emerald-50
                       hover:border-emerald-300
                       transition"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </button>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="bg-gradient-to-br from-emerald-600 to-emerald-500 text-white rounded-3xl shadow-xl p-8">
            <UserCircle className="w-24 h-24 mx-auto" />

            <h1 className="text-2xl font-bold text-center mt-5">
              {profile?.firstName} {profile?.lastName}
            </h1>

            <p className="text-center text-emerald-100 mt-1 break-all">
              {profile?.email}
            </p>

            <div className="mt-8 space-y-4">
              <div className="flex items-start gap-3">
                <Phone className="w-5 h-5 shrink-0 mt-0.5" />
                <span>{profile?.phone || "Not provided"}</span>
              </div>

              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 shrink-0 mt-0.5" />
                <span>{profile?.address || "Not provided"}</span>
              </div>

              <div className="flex items-start gap-3">
                <Mail className="w-5 h-5 shrink-0 mt-0.5" />
                <span className="break-all">{profile?.email}</span>
              </div>
            </div>

            <div className="border-t border-white/30 mt-8 pt-6">
              <p className="text-emerald-100 text-sm">Account Role</p>

              <p className="font-bold">{profile?.userRole}</p>
            </div>
          </div>

          <div className="lg:col-span-2 bg-white rounded-3xl shadow-xl p-6 sm:p-8">
            <h2 className="text-2xl font-bold text-gray-900">My Profile</h2>

            <p className="text-gray-500 mt-1 mb-7">
              Update your personal information.
            </p>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid md:grid-cols-2 gap-5">
                <Input
                  label="First Name"
                  name="firstName"
                  value={form.firstName}
                  onChange={handleChange}
                />

                <Input
                  label="Last Name"
                  name="lastName"
                  value={form.lastName}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">
                  Email
                </label>

                <div className="flex items-center gap-3">
                  <Mail className="text-gray-400 shrink-0" />

                  <input
                    value={profile?.email || ""}
                    disabled
                    className="w-full px-4 py-3 rounded-xl
                               border bg-gray-100 text-gray-500"
                  />
                </div>
              </div>

              <Input
                label="Phone"
                name="phone"
                value={form.phone}
                onChange={handleChange}
                placeholder="10 digit phone number"
              />

              <div>
                <label className="block text-sm font-semibold mb-2">
                  Address
                </label>

                <textarea
                  name="address"
                  value={form.address}
                  onChange={handleChange}
                  required
                  rows={4}
                  className="w-full px-4 py-3 rounded-xl
                             border border-gray-300
                             focus:ring-2 focus:ring-emerald-500
                             focus:border-emerald-500
                             focus:outline-none"
                />
              </div>

              <button
                type="submit"
                disabled={saving}
                className="w-full bg-emerald-600 text-white py-3
                           rounded-full font-semibold
                           hover:bg-emerald-700
                           disabled:bg-emerald-300
                           disabled:cursor-not-allowed
                           flex justify-center items-center gap-2
                           transition"
              >
                {saving ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="w-5 h-5" />
                    Save Changes
                  </>
                )}
              </button>
            </form>

            <div className="border-t mt-8 pt-6 grid sm:grid-cols-2 gap-4">
              <Link
                to="/change-password"
                className="flex items-center justify-center gap-2
                           p-4 rounded-xl
                           bg-emerald-50 text-emerald-700
                           font-semibold
                           hover:bg-emerald-100
                           transition"
              >
                <KeyRound className="w-5 h-5" />
                Change Password
              </Link>

              <Link
                to="/change-email"
                className="flex items-center justify-center gap-2
                           p-4 rounded-xl
                           bg-emerald-50 text-emerald-700
                           font-semibold
                           hover:bg-emerald-100
                           transition"
              >
                <Mail className="w-5 h-5" />
                Change Email
              </Link>
            </div>

            <div className="mt-6 text-center">
              <Link
                to="/"
                className="inline-flex items-center gap-2
                           text-emerald-600 font-semibold
                           hover:text-emerald-700
                           hover:underline"
              >
                <ArrowLeft className="w-4 h-4" />
                Return to Home
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const Input = ({ label, name, value, onChange, placeholder }) => (
  <div>
    <label className="block text-sm font-semibold mb-2">{label}</label>

    <input
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      required
      className="w-full px-4 py-3 rounded-xl
                 border border-gray-300
                 focus:ring-2 focus:ring-emerald-500
                 focus:border-emerald-500
                 focus:outline-none"
    />
  </div>
);

export default UserProfilePage;
