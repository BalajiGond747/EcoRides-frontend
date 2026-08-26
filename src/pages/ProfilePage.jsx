import React, { useEffect, useState } from "react";
import {
  ArrowLeft,
  Edit3,
  Loader2,
  Mail,
  MapPin,
  Phone,
  Save,
  User,
  X,
} from "lucide-react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import api from "../services/api";
import { getCurrentUser } from "../services/auth";

const ProfilePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const currentUser = getCurrentUser();

  const userId = id || currentUser?.userId;

  const [profile, setProfile] = useState(null);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    address: "",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!userId) {
        toast.error("Unable to identify user");
        navigate("/login", { replace: true });
        return;
      }

      try {
        setLoading(true);

        const response = await api.get(`/users/${userId}`);

        const user = response.data?.data;

        if (!user) {
          throw new Error("User data not found");
        }

        setProfile(user);

        setFormData({
          firstName: user.firstName || "",
          lastName: user.lastName || "",
          phone: user.phone || "",
          address: user.address || "",
        });
      } catch (error) {
        console.error("Fetch profile error:", error);

        toast.error(error.response?.data?.message || "Unable to fetch profile");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [userId, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleEdit = () => {
    setEditing(true);
  };

  const handleCancel = () => {
    setFormData({
      firstName: profile?.firstName || "",
      lastName: profile?.lastName || "",
      phone: profile?.phone || "",
      address: profile?.address || "",
    });

    setEditing(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!userId) {
      toast.error("User ID is missing");
      return;
    }

    if (formData.firstName.trim().length < 3) {
      toast.error("First name must be at least 3 characters");
      return;
    }

    if (formData.lastName.trim().length < 3) {
      toast.error("Last name must be at least 3 characters");
      return;
    }

    if (!/^[6-9]\d{9}$/.test(formData.phone)) {
      toast.error("Enter a valid 10-digit phone number");
      return;
    }

    if (!formData.address.trim()) {
      toast.error("Address is required");
      return;
    }

    try {
      setSaving(true);

      const response = await api.put(`/users/${userId}`, {
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        phone: formData.phone.trim(),
        address: formData.address.trim(),
      });

      const updatedUser = response.data?.data;

      if (updatedUser) {
        setProfile(updatedUser);

        setFormData({
          firstName: updatedUser.firstName || "",
          lastName: updatedUser.lastName || "",
          phone: updatedUser.phone || "",
          address: updatedUser.address || "",
        });
      }

      toast.success(response.data?.message || "Profile updated successfully");

      setEditing(false);
    } catch (error) {
      console.error("Update profile error:", error);

      toast.error(error.response?.data?.message || "Unable to update profile");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-gradient-to-br from-emerald-50 via-white to-green-50">
        <Navbar />

        <div className="flex-grow flex items-center justify-center">
          <div className="flex flex-col items-center gap-3">
            <Loader2 className="w-10 h-10 text-emerald-600 animate-spin" />

            <p className="text-gray-600">Loading profile...</p>
          </div>
        </div>

        <Footer />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen flex flex-col bg-gradient-to-br from-emerald-50 via-white to-green-50">
        <Navbar />

        <div className="flex-grow flex items-center justify-center px-4">
          <div className="text-center">
            <User className="w-12 h-12 mx-auto text-gray-400" />

            <h2 className="text-xl font-bold text-gray-900 mt-4">
              Profile not found
            </h2>

            <Link
              to="/"
              className="inline-flex items-center gap-2 mt-5
                         px-5 py-2.5 rounded-full
                         bg-emerald-600 text-white
                         hover:bg-emerald-700 transition"
            >
              <ArrowLeft className="w-4 h-4" />
              Back Home
            </Link>
          </div>
        </div>

        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-emerald-50 via-white to-green-50">
      <Navbar />

      <main className="flex-grow px-4 py-10">
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">My Profile</h1>

              <p className="text-gray-500 mt-1">
                View and manage your account information.
              </p>
            </div>

            {!editing && (
              <button
                type="button"
                onClick={handleEdit}
                className="inline-flex items-center justify-center gap-2
                           px-5 py-2.5 rounded-full
                           bg-emerald-600 text-white
                           font-semibold
                           hover:bg-emerald-700 transition"
              >
                <Edit3 className="w-4 h-4" />
                Edit Profile
              </button>
            )}
          </div>

          <div className="bg-white rounded-3xl shadow-xl border border-emerald-100 overflow-hidden">
            <div className="bg-gradient-to-r from-emerald-600 to-emerald-700 px-6 sm:px-8 py-8 text-white">
              <div className="flex items-center gap-5">
                <div
                  className="w-20 h-20 rounded-full bg-white/20
                                border border-white/30
                                flex items-center justify-center"
                >
                  <User className="w-10 h-10" />
                </div>

                <div>
                  <h2 className="text-2xl font-bold">
                    {profile.firstName} {profile.lastName}
                  </h2>

                  <p className="text-emerald-100 mt-1">{profile.email}</p>

                  <span
                    className="inline-block mt-2 px-3 py-1
                                   rounded-full bg-white/20
                                   text-sm font-medium"
                  >
                    {profile.userRole}
                  </span>
                </div>
              </div>
            </div>

            <div className="p-6 sm:p-8">
              {editing ? (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label
                        htmlFor="firstName"
                        className="block text-sm font-semibold text-gray-700 mb-2"
                      >
                        First Name
                      </label>

                      <input
                        id="firstName"
                        name="firstName"
                        type="text"
                        value={formData.firstName}
                        onChange={handleChange}
                        minLength={3}
                        maxLength={50}
                        required
                        disabled={saving}
                        className="w-full px-4 py-3 rounded-xl
                                   border border-gray-300
                                   focus:outline-none
                                   focus:ring-2 focus:ring-emerald-500
                                   focus:border-emerald-500
                                   disabled:bg-gray-100"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="lastName"
                        className="block text-sm font-semibold text-gray-700 mb-2"
                      >
                        Last Name
                      </label>

                      <input
                        id="lastName"
                        name="lastName"
                        type="text"
                        value={formData.lastName}
                        onChange={handleChange}
                        minLength={3}
                        maxLength={50}
                        required
                        disabled={saving}
                        className="w-full px-4 py-3 rounded-xl
                                   border border-gray-300
                                   focus:outline-none
                                   focus:ring-2 focus:ring-emerald-500
                                   focus:border-emerald-500
                                   disabled:bg-gray-100"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="phone"
                        className="block text-sm font-semibold text-gray-700 mb-2"
                      >
                        Phone Number
                      </label>

                      <input
                        id="phone"
                        name="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={handleChange}
                        maxLength={10}
                        required
                        disabled={saving}
                        className="w-full px-4 py-3 rounded-xl
                                   border border-gray-300
                                   focus:outline-none
                                   focus:ring-2 focus:ring-emerald-500
                                   focus:border-emerald-500
                                   disabled:bg-gray-100"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Email
                      </label>

                      <div className="relative">
                        <Mail
                          className="absolute left-4 top-1/2
                                     -translate-y-1/2
                                     w-5 h-5 text-gray-400"
                        />

                        <input
                          type="email"
                          value={profile.email || ""}
                          readOnly
                          className="w-full pl-12 pr-4 py-3 rounded-xl
                                     border border-gray-200
                                     bg-gray-100 text-gray-500
                                     cursor-not-allowed"
                        />
                      </div>

                      <p className="text-xs text-gray-500 mt-1">
                        Use Change Email from the profile menu to change your
                        email.
                      </p>
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="address"
                      className="block text-sm font-semibold text-gray-700 mb-2"
                    >
                      Address
                    </label>

                    <div className="relative">
                      <MapPin
                        className="absolute left-4 top-4
                                   w-5 h-5 text-gray-400"
                      />

                      <textarea
                        id="address"
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        minLength={10}
                        maxLength={200}
                        rows={4}
                        required
                        disabled={saving}
                        className="w-full pl-12 pr-4 py-3 rounded-xl
                                   border border-gray-300
                                   resize-none
                                   focus:outline-none
                                   focus:ring-2 focus:ring-emerald-500
                                   focus:border-emerald-500
                                   disabled:bg-gray-100"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3 pt-2">
                    <button
                      type="submit"
                      disabled={saving}
                      className="flex-1 inline-flex items-center
                                 justify-center gap-2
                                 px-5 py-3 rounded-full
                                 bg-emerald-600 text-white
                                 font-semibold
                                 hover:bg-emerald-700 transition
                                 disabled:bg-emerald-300
                                 disabled:cursor-not-allowed"
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

                    <button
                      type="button"
                      onClick={handleCancel}
                      disabled={saving}
                      className="flex-1 inline-flex items-center
                                 justify-center gap-2
                                 px-5 py-3 rounded-full
                                 border border-gray-300
                                 text-gray-700
                                 font-semibold
                                 hover:bg-gray-50 transition"
                    >
                      <X className="w-5 h-5" />
                      Cancel
                    </button>
                  </div>
                </form>
              ) : (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <ProfileItem
                      icon={<User className="w-5 h-5" />}
                      label="First Name"
                      value={profile.firstName}
                    />

                    <ProfileItem
                      icon={<User className="w-5 h-5" />}
                      label="Last Name"
                      value={profile.lastName}
                    />

                    <ProfileItem
                      icon={<Mail className="w-5 h-5" />}
                      label="Email"
                      value={profile.email}
                    />

                    <ProfileItem
                      icon={<Phone className="w-5 h-5" />}
                      label="Phone"
                      value={profile.phone}
                    />
                  </div>

                  <ProfileItem
                    icon={<MapPin className="w-5 h-5" />}
                    label="Address"
                    value={profile.address}
                  />

                  <div className="border-t border-gray-100 pt-6">
                    <h3 className="font-semibold text-gray-900 mb-4">
                      Account Information
                    </h3>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <ProfileItem label="Role" value={profile.userRole} />

                      <ProfileItem label="User ID" value={profile.id} />

                      <ProfileItem
                        label="Account Created"
                        value={
                          profile.createdAt
                            ? formatDate(profile.createdAt)
                            : "—"
                        }
                      />

                      <ProfileItem
                        label="Last Updated"
                        value={
                          profile.updatedAt
                            ? formatDate(profile.updatedAt)
                            : "—"
                        }
                      />
                    </div>
                  </div>

                  <div className="border-t border-gray-100 pt-6">
                    <h3 className="font-semibold text-gray-900 mb-4">
                      Account Security
                    </h3>

                    <div className="flex flex-col sm:flex-row gap-3">
                      <Link
                        to="/change-password"
                        className="flex-1 text-center px-5 py-3
                                   rounded-full
                                   border border-emerald-600
                                   text-emerald-600
                                   font-semibold
                                   hover:bg-emerald-50 transition"
                      >
                        Change Password
                      </Link>

                      <Link
                        to="/change-email"
                        className="flex-1 text-center px-5 py-3
                                   rounded-full
                                   border border-emerald-600
                                   text-emerald-600
                                   font-semibold
                                   hover:bg-emerald-50 transition"
                      >
                        Change Email
                      </Link>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

const ProfileItem = ({ icon, label, value }) => {
  return (
    <div className="bg-gray-50 rounded-2xl p-4">
      <div className="flex items-center gap-2 text-emerald-600 mb-2">
        {icon}

        <span className="text-sm font-semibold">{label}</span>
      </div>

      <p className="text-gray-900 break-words">{value || "—"}</p>
    </div>
  );
};

const formatDate = (date) => {
  try {
    return new Date(date).toLocaleString();
  } catch {
    return date;
  }
};

export default ProfilePage;
