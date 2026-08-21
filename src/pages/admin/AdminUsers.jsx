import React, { useEffect, useState } from "react";
import { Search, UserCircle, UserCheck, UserX, Trash2 } from "lucide-react";
import { toast } from "react-toastify";

import api from "../../services/api";

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await api.get("/users");

      setUsers(response.data?.data || []);
    } catch (error) {
      toast.error(error.response?.data?.message || "Unable to load users");
    }
  };

  const deleteUser = async (id) => {
    if (!window.confirm("Delete this user?")) {
      return;
    }

    try {
      await api.delete(`/users/${id}`);

      toast.success("User deleted successfully");

      fetchUsers();
    } catch (error) {
      toast.error(error.response?.data?.message || "Unable to delete user");
    }
  };

  const toggleUser = async (user, active) => {
    try {
      await api.put(`/users/${user.id}/${active ? "activate" : "deactivate"}`);

      toast.success(active ? "User activated" : "User deactivated");

      fetchUsers();
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Unable to change user status"
      );
    }
  };

  const filtered = users.filter((user) => {
    const value = search.toLowerCase();

    return (
      user.firstName?.toLowerCase().includes(value) ||
      user.lastName?.toLowerCase().includes(value) ||
      user.email?.toLowerCase().includes(value) ||
      user.phone?.includes(value)
    );
  });

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800">User Management</h2>

        <p className="text-gray-500 mt-1">
          View and manage registered EcoRide users.
        </p>
      </div>

      <div className="bg-white rounded-xl shadow p-4 mb-6">
        <div className="relative max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />

          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search users..."
            className="w-full pl-11 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-green-500 focus:outline-none"
          />
        </div>
      </div>

      <div className="bg-white rounded-xl shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-gray-50">
              <tr>
                <Th>User</Th>
                <Th>Email</Th>
                <Th>Phone</Th>
                <Th>Role</Th>
                <Th>Address</Th>
                <Th>Actions</Th>
              </tr>
            </thead>

            <tbody className="divide-y">
              {filtered.map((user) => (
                <tr key={user.id}>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <UserCircle className="w-9 h-9 text-green-600" />

                      <div>
                        <p className="font-semibold">
                          {user.firstName} {user.lastName}
                        </p>

                        <p className="text-xs text-gray-500">ID: {user.id}</p>
                      </div>
                    </div>
                  </td>

                  <td className="px-6 py-4 text-sm">{user.email}</td>

                  <td className="px-6 py-4 text-sm">{user.phone}</td>

                  <td className="px-6 py-4">
                    <span className="px-3 py-1 rounded-full bg-green-100 text-green-700 text-xs font-semibold">
                      {user.userRole}
                    </span>
                  </td>

                  <td className="px-6 py-4 text-sm max-w-xs">{user.address}</td>

                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      <button
                        onClick={() => toggleUser(user, true)}
                        className="p-2 bg-green-50 text-green-700 rounded-lg"
                        title="Activate"
                      >
                        <UserCheck className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => toggleUser(user, false)}
                        className="p-2 bg-yellow-50 text-yellow-700 rounded-lg"
                        title="Deactivate"
                      >
                        <UserX className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => deleteUser(user.id)}
                        className="p-2 bg-red-50 text-red-600 rounded-lg"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const Th = ({ children }) => (
  <th className="px-6 py-4 text-left text-xs font-semibold uppercase text-gray-500">
    {children}
  </th>
);

export default AdminUsers;
