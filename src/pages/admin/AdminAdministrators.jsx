import React, { useEffect, useState } from "react";
import {
  Search,
  ShieldCheck,
  UserCheck,
  UserX,
  Trash2,
  Edit,
  Loader2,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

import api from "../../services/api";

const AdminAdministrators = () => {
  const [admins, setAdmins] = useState([]);

  const [search, setSearch] = useState("");

  const [page, setPage] = useState(0);
  const [size] = useState(10);

  const [totalPages, setTotalPages] = useState(0);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAdmins();
  }, [page]);

  const fetchAdmins = async () => {
    try {
      setLoading(true);

      const response = await api.get("/admins", {
        params: {
          page,
          size,
          sortBy: "createdAt",
          sortDir: "desc",
        },
      });

      const pageData = response.data?.data;

      setAdmins(pageData?.content || []);
      setTotalPages(pageData?.totalPages || 0);
    } catch (error) {
      console.error("Fetch administrators error:", error);

      toast.error(
        error.response?.data?.message || "Unable to load administrators"
      );
    } finally {
      setLoading(false);
    }
  };

  const filteredAdmins = admins.filter((admin) => {
    const value = search.trim().toLowerCase();

    if (!value) {
      return true;
    }

    return (
      admin.firstName?.toLowerCase().includes(value) ||
      admin.lastName?.toLowerCase().includes(value) ||
      admin.email?.toLowerCase().includes(value) ||
      admin.phone?.includes(value)
    );
  });

  const activateAdmin = async (id) => {
    try {
      await api.put(`/admins/${id}/activate`);

      toast.success("Administrator activated successfully");

      fetchAdmins();
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Unable to activate administrator"
      );
    }
  };

  const deactivateAdmin = async (id) => {
    if (
      !window.confirm("Are you sure you want to deactivate this administrator?")
    ) {
      return;
    }

    try {
      await api.put(`/admins/${id}/deactivate`);

      toast.success("Administrator deactivated successfully");

      fetchAdmins();
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Unable to deactivate administrator"
      );
    }
  };

  const deleteAdmin = async (id) => {
    if (
      !window.confirm(
        "Delete this administrator? This action will deactivate the administrator."
      )
    ) {
      return;
    }

    try {
      await api.delete(`/admins/${id}`);

      toast.success("Administrator deleted successfully");

      fetchAdmins();
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Unable to delete administrator"
      );
    }
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
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-emerald-100 flex items-center justify-center">
              <ShieldCheck className="w-6 h-6 text-emerald-600" />
            </div>

            <div>
              <h2 className="text-2xl font-bold text-gray-800">
                Manage Administrators
              </h2>

              <p className="text-gray-500 mt-1">
                View and manage EcoRides administrators.
              </p>
            </div>
          </div>
        </div>

        <Link
          to="/admin/administrators/new"
          className="inline-flex items-center justify-center gap-2
                     px-5 py-3 rounded-full
                     bg-emerald-600 text-white
                     font-semibold
                     hover:bg-emerald-700
                     transition"
        >
          <ShieldCheck className="w-5 h-5" />
          Add Administrator
        </Link>
      </div>

      <div className="bg-white rounded-xl shadow p-4 mb-6">
        <div className="relative max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />

          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search administrators..."
            className="w-full pl-11 pr-4 py-3
                       border border-gray-200 rounded-xl
                       focus:ring-2 focus:ring-emerald-500
                       focus:outline-none"
          />
        </div>
      </div>

      {loading && (
        <div className="bg-white rounded-2xl shadow p-12 flex justify-center">
          <Loader2 className="w-10 h-10 text-emerald-600 animate-spin" />
        </div>
      )}

      {!loading && filteredAdmins.length === 0 && (
        <div className="bg-white rounded-2xl shadow p-12 text-center">
          <ShieldCheck className="w-14 h-14 mx-auto text-gray-300" />

          <h3 className="text-xl font-bold text-gray-800 mt-4">
            No administrators found
          </h3>

          <p className="text-gray-500 mt-2">
            Try changing your search or add a new administrator.
          </p>
        </div>
      )}

      {!loading && filteredAdmins.length > 0 && (
        <div className="bg-white rounded-2xl shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-gray-50">
                <tr>
                  <Th>Administrator</Th>
                  <Th>Email</Th>
                  <Th>Phone</Th>
                  <Th>Address</Th>
                  <Th>Status</Th>
                  <Th>Actions</Th>
                </tr>
              </thead>

              <tbody className="divide-y">
                {filteredAdmins.map((admin) => (
                  <tr
                    key={admin.id}
                    className="hover:bg-emerald-50/40 transition"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center">
                          <ShieldCheck className="w-5 h-5 text-emerald-600" />
                        </div>

                        <div>
                          <p className="font-semibold text-gray-800">
                            {admin.firstName} {admin.lastName}
                          </p>

                          <p className="text-xs text-gray-500">
                            ID: {admin.id}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-4 text-sm text-gray-700">
                      {admin.email}
                    </td>

                    <td className="px-6 py-4 text-sm text-gray-700">
                      {admin.phone || "—"}
                    </td>

                    <td className="px-6 py-4 text-sm text-gray-700 max-w-xs">
                      <div className="truncate">{admin.address || "—"}</div>
                    </td>

                    <td className="px-6 py-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          admin.isActive
                            ? "bg-emerald-100 text-emerald-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {admin.isActive ? "ACTIVE" : "INACTIVE"}
                      </span>
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <Link
                          to={`/admin/administrators/${admin.id}/edit`}
                          className="p-2 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100"
                          title="Edit administrator"
                        >
                          <Edit className="w-4 h-4" />
                        </Link>

                        {admin.isActive ? (
                          <button
                            type="button"
                            onClick={() => deactivateAdmin(admin.id)}
                            className="p-2 bg-yellow-50 text-yellow-700 rounded-lg hover:bg-yellow-100"
                            title="Deactivate administrator"
                          >
                            <UserX className="w-4 h-4" />
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={() => activateAdmin(admin.id)}
                            className="p-2 bg-emerald-50 text-emerald-700 rounded-lg hover:bg-emerald-100"
                            title="Activate administrator"
                          >
                            <UserCheck className="w-4 h-4" />
                          </button>
                        )}

                        <button
                          type="button"
                          onClick={() => deleteAdmin(admin.id)}
                          className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100"
                          title="Delete administrator"
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

          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-4 px-6 py-5 border-t">
              <button
                type="button"
                onClick={handlePreviousPage}
                disabled={page === 0 || loading}
                className="inline-flex items-center gap-1
                           px-4 py-2 rounded-full
                           border border-emerald-600
                           text-emerald-700 font-semibold
                           disabled:opacity-40
                           disabled:cursor-not-allowed
                           hover:bg-emerald-50"
              >
                <ChevronLeft className="w-4 h-4" />
                Previous
              </button>

              <span className="text-sm font-medium text-gray-600">
                Page {page + 1} of {totalPages}
              </span>

              <button
                type="button"
                onClick={handleNextPage}
                disabled={page >= totalPages - 1 || loading}
                className="inline-flex items-center gap-1
                           px-4 py-2 rounded-full
                           bg-emerald-600 text-white
                           font-semibold
                           disabled:opacity-40
                           disabled:cursor-not-allowed
                           hover:bg-emerald-700"
              >
                Next
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
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

export default AdminAdministrators;
