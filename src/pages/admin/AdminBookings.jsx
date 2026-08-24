import React, { useEffect, useState } from "react";
import { Calendar, Search, XCircle, Play, Flag } from "lucide-react";
import { toast } from "react-toastify";

import api from "../../services/api";

const AdminBookings = () => {
  const [bookings, setBookings] = useState([]);

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("ALL");

  const [sortBy, setSortBy] = useState("createdAt");
  const [sortDir, setSortDir] = useState("desc");

  const [page, setPage] = useState(0);
  const [size] = useState(10);

  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchBookings();
  }, [page, search, status, sortBy, sortDir]);

  const fetchBookings = async () => {
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

      if (status !== "ALL") {
        params.status = status;
      }

      const response = await api.get("/bookings", {
        params,
      });

      const data = response.data?.data;

      setBookings(data?.content || []);
      setTotalPages(data?.totalPages || 0);
      setTotalElements(data?.totalElements || 0);
    } catch (error) {
      console.error("Fetch bookings error:", error);

      toast.error(error.response?.data?.message || "Unable to load bookings");

      setBookings([]);
      setTotalPages(0);
      setTotalElements(0);
    } finally {
      setLoading(false);
    }
  };

  const startBooking = async (id) => {
    try {
      await api.patch(`/bookings/${id}/start`);

      toast.success("Booking started");

      fetchBookings();
    } catch (error) {
      toast.error(error.response?.data?.message || "Unable to start booking");
    }
  };

  const completeBooking = async (id) => {
    try {
      await api.patch(`/bookings/${id}/complete`);

      toast.success("Booking completed");

      fetchBookings();
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Unable to complete booking"
      );
    }
  };

  const cancelBooking = async (id) => {
    const reason = window.prompt("Cancellation reason:");

    if (!reason?.trim()) return;

    try {
      await api.patch(`/bookings/${id}/cancel`, null, {
        params: {
          reason,
        },
      });

      toast.success("Booking cancelled");

      fetchBookings();
    } catch (error) {
      toast.error(error.response?.data?.message || "Unable to cancel booking");
    }
  };

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    setPage(0);
  };

  const handleStatusChange = (e) => {
    setStatus(e.target.value);
    setPage(0);
  };

  const handleSortChange = (e) => {
    const value = e.target.value;

    if (value === "oldest") {
      setSortBy("createdAt");
      setSortDir("asc");
    } else if (value === "latest") {
      setSortBy("createdAt");
      setSortDir("desc");
    } else if (value === "startEarliest") {
      setSortBy("startTime");
      setSortDir("asc");
    } else if (value === "startLatest") {
      setSortBy("startTime");
      setSortDir("desc");
    } else if (value === "amountLow") {
      setSortBy("totalAmount");
      setSortDir("asc");
    } else if (value === "amountHigh") {
      setSortBy("totalAmount");
      setSortDir("desc");
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
        <h2 className="text-2xl font-bold text-gray-800">Booking Management</h2>

        <p className="text-gray-500 mt-1">Monitor and manage all bookings.</p>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-xl shadow p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />

            <input
              value={search}
              onChange={handleSearchChange}
              placeholder="Search bookings..."
              className="w-full pl-11 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-green-500 focus:outline-none"
            />
          </div>

          {/* Status */}
          <select
            value={status}
            onChange={handleStatusChange}
            className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-green-500 focus:outline-none"
          >
            <option value="ALL">All Statuses</option>
            <option value="PENDING">PENDING</option>
            <option value="CONFIRMED">CONFIRMED</option>
            <option value="ACTIVE">ACTIVE</option>
            <option value="COMPLETED">COMPLETED</option>
            <option value="CANCELLED">CANCELLED</option>
          </select>

          {/* Sorting */}
          <select
            defaultValue="latest"
            onChange={handleSortChange}
            className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-green-500 focus:outline-none"
          >
            <option value="latest">Latest Bookings</option>
            <option value="oldest">Oldest Bookings</option>
            <option value="startEarliest">Start Time: Earliest</option>
            <option value="startLatest">Start Time: Latest</option>
            <option value="amountLow">Amount: Low to High</option>
            <option value="amountHigh">Amount: High to Low</option>
          </select>
        </div>

        <div className="mt-4 text-sm text-gray-500">
          {loading
            ? "Loading bookings..."
            : `${totalElements} booking${totalElements !== 1 ? "s" : ""} found`}
        </div>
      </div>

      {/* Loading */}
      {loading && (
        <div className="bg-white rounded-2xl shadow p-10 text-center text-gray-500">
          Loading bookings...
        </div>
      )}

      {/* Empty */}
      {!loading && bookings.length === 0 && (
        <div className="bg-white rounded-2xl shadow p-10 text-center text-gray-500">
          No bookings found.
        </div>
      )}

      {/* Bookings */}
      {!loading && bookings.length > 0 && (
        <>
          <div className="grid gap-5">
            {bookings.map((booking) => (
              <div key={booking.id} className="bg-white rounded-2xl shadow p-6">
                <div className="flex flex-col lg:flex-row lg:items-center gap-5">
                  <div className="w-14 h-14 rounded-xl bg-green-100 flex items-center justify-center">
                    <Calendar className="w-7 h-7 text-green-600" />
                  </div>

                  <div className="flex-grow">
                    <div className="flex flex-wrap gap-3 items-center">
                      <h3 className="font-bold text-lg">
                        {booking.bookingReference || `Booking #${booking.id}`}
                      </h3>

                      <span className="px-3 py-1 rounded-full bg-green-100 text-green-700 text-xs font-semibold">
                        {booking.status}
                      </span>
                    </div>

                    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3 mt-3 text-sm text-gray-600">
                      <p>
                        User:
                        <b> {booking.userId}</b>
                      </p>

                      <p>
                        Car:
                        <b> {booking.carId}</b>
                      </p>

                      <p>
                        Location:
                        <b> {booking.locationId}</b>
                      </p>

                      <p>
                        Amount:
                        <b> ₹{booking.totalAmount}</b>
                      </p>

                      <p>
                        Start:
                        <b> {formatDate(booking.startTime)}</b>
                      </p>

                      <p>
                        End:
                        <b> {formatDate(booking.endTime)}</b>
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {booking.status === "CONFIRMED" && (
                      <button
                        onClick={() => startBooking(booking.id)}
                        className="p-3 bg-green-50 text-green-700 rounded-xl"
                        title="Start"
                      >
                        <Play className="w-5 h-5" />
                      </button>
                    )}

                    {booking.status === "ACTIVE" && (
                      <button
                        onClick={() => completeBooking(booking.id)}
                        className="p-3 bg-blue-50 text-blue-700 rounded-xl"
                        title="Complete"
                      >
                        <Flag className="w-5 h-5" />
                      </button>
                    )}

                    {(booking.status === "PENDING" ||
                      booking.status === "CONFIRMED") && (
                      <button
                        onClick={() => cancelBooking(booking.id)}
                        className="p-3 bg-red-50 text-red-600 rounded-xl"
                        title="Cancel"
                      >
                        <XCircle className="w-5 h-5" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-4 mt-8 mb-4">
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
        </>
      )}
    </div>
  );
};

const formatDate = (value) => {
  if (!value) return "—";

  return new Date(value).toLocaleString();
};

export default AdminBookings;
