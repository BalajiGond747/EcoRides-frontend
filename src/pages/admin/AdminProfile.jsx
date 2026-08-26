import React, { useEffect, useState } from "react";
import {
  ArrowLeft,
  Edit3,
  Loader2,
  Mail,
  MapPin,
  Phone,
  Save,
  ShieldCheck,
  User,
  Users,
  X,
  Lock,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import api from "../../services/api";
import { getCurrentUser, logout } from "../../services/auth";

const AdminProfile = () => {
  const navigate = useNavigate();
  const currentUser = getCurrentUser();

  const userId = currentUser?.userId || currentUser?.id;

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
        toast.error("Unable to identify administrator");
        navigate("/login", { replace: true });
        return;
      }

      try {
        setLoading(true);

        const response = await api.get(`/users/${userId}`);

        const admin = response.data?.data;

        if (!admin) {
          throw new Error("Administrator data not found");
        }

        if (admin.userRole !== "ADMIN") {
          toast.error("Administrator profile not found");
          navigate("/admin/dashboard", { replace: true });
          return;
        }

        setProfile(admin);

        setFormData({
          firstName: admin.firstName || "",
          lastName: admin.lastName || "",
          phone: admin.phone || "",
          address: admin.address || "",
        });
      } catch (error) {
        console.error("Fetch admin profile error:", error);

        toast.error(
          error.response?.data?.message ||
            "Unable to fetch administrator profile"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [userId, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((previous) => ({
      ...previous,
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
      toast.error("Administrator ID is missing");
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

      const updatedAdmin = response.data?.data;

      if (updatedAdmin) {
        setProfile(updatedAdmin);

        setFormData({
          firstName: updatedAdmin.firstName || "",
          lastName: updatedAdmin.lastName || "",
          phone: updatedAdmin.phone || "",
          address: updatedAdmin.address || "",
        });
      }

      toast.success(
        response.data?.message || "Administrator profile updated successfully"
      );

      setEditing(false);
    } catch (error) {
      console.error("Update admin profile error:", error);

      toast.error(
        error.response?.data?.message ||
          "Unable to update administrator profile"
      );
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = () => {
    logout();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-10 h-10 text-green-600 animate-spin" />

          <p className="text-gray-600">Loading administrator profile...</p>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] px-4">
        <div className="text-center">
          <ShieldCheck className="w-14 h-14 mx-auto text-gray-300" />

          <h2 className="text-xl font-bold text-gray-900 mt-4">
            Administrator profile not found
          </h2>

          <Link
            to="/admin/dashboard"
            className="inline-flex items-center gap-2 mt-5
                       px-5 py-2.5 rounded-full
                       bg-green-700 text-white
                       hover:bg-green-800 transition"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto">
      <div
        className="flex flex-col sm:flex-row sm:items-center
                      sm:justify-between gap-4 mb-8"
      >
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Admin Profile</h2>

          <p className="text-gray-500 mt-1">
            View and manage your administrator account.
          </p>
        </div>

        {!editing && (
          <button
            type="button"
            onClick={handleEdit}
            className="inline-flex items-center justify-center
                       gap-2 px-5 py-2.5 rounded-full
                       bg-green-700 text-white
                       font-semibold hover:bg-green-800 transition"
          >
            <Edit3 className="w-4 h-4" />
            Edit Profile
          </button>
        )}
      </div>

      <div
        className="bg-white rounded-3xl shadow-lg
                      border border-green-100 overflow-hidden"
      >
        <div
          className="bg-gradient-to-r
                        from-green-700 to-emerald-700
                        px-6 sm:px-8 py-8 text-white"
        >
          <div className="flex items-center gap-5">
            <div
              className="w-20 h-20 rounded-full
                            bg-white/20 border border-white/30
                            flex items-center justify-center"
            >
              <ShieldCheck className="w-10 h-10" />
            </div>

            <div>
              <h3 className="text-2xl font-bold">
                {profile.firstName} {profile.lastName}
              </h3>

              <p className="text-green-100 mt-1">{profile.email}</p>

              <span
                className="inline-flex items-center gap-2
                               mt-2 px-3 py-1 rounded-full
                               bg-white/20 text-sm font-medium"
              >
                <ShieldCheck className="w-4 h-4" />
                ADMIN
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
                    htmlFor="admin-firstName"
                    className="block text-sm font-semibold
                               text-gray-700 mb-2"
                  >
                    First Name
                  </label>

                  <input
                    id="admin-firstName"
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
                               focus:ring-2 focus:ring-green-500
                               disabled:bg-gray-100"
                  />
                </div>

                <div>
                  <label
                    htmlFor="admin-lastName"
                    className="block text-sm font-semibold
                               text-gray-700 mb-2"
                  >
                    Last Name
                  </label>

                  <input
                    id="admin-lastName"
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
                               focus:ring-2 focus:ring-green-500
                               disabled:bg-gray-100"
                  />
                </div>

                <div>
                  <label
                    htmlFor="admin-phone"
                    className="block text-sm font-semibold
                               text-gray-700 mb-2"
                  >
                    Phone Number
                  </label>

                  <input
                    id="admin-phone"
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
                               focus:ring-2 focus:ring-green-500
                               disabled:bg-gray-100"
                  />
                </div>

                <div>
                  <label
                    className="block text-sm font-semibold
                               text-gray-700 mb-2"
                  >
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
                      className="w-full pl-12 pr-4 py-3
                                 rounded-xl border border-gray-200
                                 bg-gray-100 text-gray-500
                                 cursor-not-allowed"
                    />
                  </div>

                  <p className="text-xs text-gray-500 mt-1">
                    Use Change Email to change your administrator email.
                  </p>
                </div>
              </div>

              <div>
                <label
                  htmlFor="admin-address"
                  className="block text-sm font-semibold
                             text-gray-700 mb-2"
                >
                  Address
                </label>

                <div className="relative">
                  <MapPin
                    className="absolute left-4 top-4
                               w-5 h-5 text-gray-400"
                  />

                  <textarea
                    id="admin-address"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    minLength={10}
                    maxLength={200}
                    rows={4}
                    required
                    disabled={saving}
                    className="w-full pl-12 pr-4 py-3
                               rounded-xl border border-gray-300
                               resize-none
                               focus:outline-none
                               focus:ring-2 focus:ring-green-500
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
                             bg-green-700 text-white
                             font-semibold
                             hover:bg-green-800
                             disabled:bg-green-300"
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
                             text-gray-700 font-semibold
                             hover:bg-gray-50"
                >
                  <X className="w-5 h-5" />
                  Cancel
                </button>
              </div>
            </form>
          ) : (
            <div className="space-y-6">
              <div>
                <h3 className="font-semibold text-gray-900 mb-4">
                  Personal Information
                </h3>

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

                <div className="mt-5">
                  <ProfileItem
                    icon={<MapPin className="w-5 h-5" />}
                    label="Address"
                    value={profile.address}
                  />
                </div>
              </div>

              <div className="border-t border-gray-100 pt-6">
                <h3 className="font-semibold text-gray-900 mb-4">
                  Account Information
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <ProfileItem
                    icon={<ShieldCheck className="w-5 h-5" />}
                    label="Role"
                    value={profile.userRole}
                  />

                  <ProfileItem label="Administrator ID" value={profile.id} />

                  <ProfileItem
                    label="Account Created"
                    value={formatDate(profile.createdAt)}
                  />

                  <ProfileItem
                    label="Last Updated"
                    value={formatDate(profile.updatedAt)}
                  />
                </div>
              </div>

              <div className="border-t border-gray-100 pt-6">
                <h3 className="font-semibold text-gray-900 mb-4">
                  Account Security
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <Link
                    to="/change-password"
                    className="inline-flex items-center
                               justify-center gap-2
                               px-5 py-3 rounded-full
                               border border-green-700
                               text-green-700
                               font-semibold
                               hover:bg-green-50 transition"
                  >
                    <Lock className="w-4 h-4" />
                    Change Password
                  </Link>

                  <Link
                    to="/change-email"
                    className="inline-flex items-center
                               justify-center gap-2
                               px-5 py-3 rounded-full
                               border border-green-700
                               text-green-700
                               font-semibold
                               hover:bg-green-50 transition"
                  >
                    <Mail className="w-4 h-4" />
                    Change Email
                  </Link>
                </div>
              </div>

              <div className="border-t border-gray-100 pt-6">
                <h3 className="font-semibold text-gray-900 mb-4">
                  Administration
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <Link
                    to="/admin/administrators"
                    className="inline-flex items-center
                               justify-center gap-2
                               px-5 py-3 rounded-full
                               bg-green-700 text-white
                               font-semibold
                               hover:bg-green-800 transition"
                  >
                    <Users className="w-4 h-4" />
                    Manage Administrators
                  </Link>

                  <Link
                    to="/admin/administrators/new"
                    className="inline-flex items-center
                               justify-center gap-2
                               px-5 py-3 rounded-full
                               border border-green-700
                               text-green-700
                               font-semibold
                               hover:bg-green-50 transition"
                  >
                    <ShieldCheck className="w-4 h-4" />
                    Add Administrator
                  </Link>
                </div>
              </div>

              <div className="border-t border-gray-100 pt-6">
                <button
                  type="button"
                  onClick={handleLogout}
                  className="w-full px-5 py-3 rounded-full
                             bg-red-600 text-white
                             font-semibold
                             hover:bg-red-700 transition"
                >
                  Logout
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const ProfileItem = ({ icon, label, value }) => {
  return (
    <div className="bg-gray-50 rounded-2xl p-4">
      <div className="flex items-center gap-2 text-green-700 mb-2">
        {icon}

        <span className="text-sm font-semibold">{label}</span>
      </div>

      <p className="text-gray-900 break-words">{value || "—"}</p>
    </div>
  );
};

const formatDate = (value) => {
  if (!value) {
    return "—";
  }

  try {
    return new Date(value).toLocaleString();
  } catch {
    return value;
  }
};

export default AdminProfile;
