import React, { useEffect, useState } from "react";
import { Search, UserCircle, UserCheck, UserX, Trash2 } from "lucide-react";
import { toast } from "react-toastify";

import api from "../../services/api";

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");

  const [page, setPage] = useState(0);
  const [size] = useState(10);

  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);

  const [sortBy, setSortBy] = useState("createdAt");
  const [sortDir, setSortDir] = useState("desc");

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, [page, search, sortBy, sortDir]);

  const fetchUsers = async () => {
    try {
      setLoading(true);

      const params = {
        page,
        size,
        sortBy,
        sortDir,
      };

      if (search.trim()) {
        params.search = search.trim();
      }

      const response = await api.get("/users", {
        params,
      });

      const data = response.data?.data;

      setUsers(data?.content || []);
      setTotalPages(data?.totalPages || 0);
      setTotalElements(data?.totalElements || 0);
    } catch (error) {
      console.error("Fetch users error:", error);

      toast.error(error.response?.data?.message || "Unable to load users");

      setUsers([]);
      setTotalPages(0);
      setTotalElements(0);
    } finally {
      setLoading(false);
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

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    setPage(0);
  };

  const handleSortChange = (e) => {
    const value = e.target.value;

    if (value === "nameAsc") {
      setSortBy("firstName");
      setSortDir("asc");
    } else if (value === "nameDesc") {
      setSortBy("firstName");
      setSortDir("desc");
    } else if (value === "emailAsc") {
      setSortBy("email");
      setSortDir("asc");
    } else if (value === "emailDesc") {
      setSortBy("email");
      setSortDir("desc");
    } else if (value === "oldest") {
      setSortBy("createdAt");
      setSortDir("asc");
    } else {
      setSortBy("createdAt");
      setSortDir("desc");
    }

    setPage(0);
  };

  const handlePreviousPage = () => {
    if (page > 0) {
      setPage((previous) => previous - 1);
    }
  };

  const handleNextPage = () => {
    if (page < totalPages - 1) {
      setPage((previous) => previous + 1);
    }
  };

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800">User Management</h2>

        <p className="text-gray-500 mt-1">
          View and manage registered EcoRide users.
        </p>
      </div>

      <div className="bg-white rounded-xl shadow p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />

            <input
              value={search}
              onChange={handleSearchChange}
              placeholder="Search users..."
              className="w-full pl-11 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-green-500 focus:outline-none"
            />
          </div>

          {/* Sorting */}
          <select
            defaultValue="latest"
            onChange={handleSortChange}
            className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-green-500 focus:outline-none"
          >
            <option value="latest">Latest Users</option>
            <option value="oldest">Oldest Users</option>
            <option value="nameAsc">Name: A to Z</option>
            <option value="nameDesc">Name: Z to A</option>
            <option value="emailAsc">Email: A to Z</option>
            <option value="emailDesc">Email: Z to A</option>
          </select>
        </div>

        <div className="mt-4 text-sm text-gray-500">
          {loading
            ? "Loading users..."
            : `${totalElements} user${totalElements !== 1 ? "s" : ""} found`}
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
              {loading ? (
                <tr>
                  <td
                    colSpan="6"
                    className="px-6 py-10 text-center text-gray-500"
                  >
                    Loading users...
                  </td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td
                    colSpan="6"
                    className="px-6 py-10 text-center text-gray-500"
                  >
                    No users found.
                  </td>
                </tr>
              ) : (
                users.map((user) => (
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

                    <td className="px-6 py-4 text-sm max-w-xs">
                      {user.address}
                    </td>

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
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-4 mt-8">
          <button
            type="button"
            onClick={handlePreviousPage}
            disabled={page === 0 || loading}
            className="px-5 py-2.5 rounded-full border border-green-600 text-green-700 font-semibold disabled:opacity-40 disabled:cursor-not-allowed hover:bg-green-50"
          >
            Previous
          </button>

          <span className="text-sm font-medium text-gray-600">
            Page {page + 1} of {totalPages}
          </span>

          <button
            type="button"
            onClick={handleNextPage}
            disabled={page >= totalPages - 1 || loading}
            className="px-5 py-2.5 rounded-full bg-green-600 text-white font-semibold disabled:opacity-40 disabled:cursor-not-allowed hover:bg-green-700"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

const Th = ({ children }) => (
  <th className="px-6 py-4 text-left text-xs font-semibold uppercase text-gray-500">
    {children}
  </th>
);

export default AdminUsers;
