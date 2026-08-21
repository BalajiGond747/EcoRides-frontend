import React, { useEffect, useState } from "react";
import {
  Calendar,
  CheckCircle,
  Search,
  XCircle,
  Play,
  Flag,
} from "lucide-react";
import { toast } from "react-toastify";

import api from "../../services/api";

const AdminBookings = () => {
  const [bookings, setBookings] = useState([]);

  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const response = await api.get("/bookings");

      setBookings(response.data?.data || []);
    } catch (error) {
      toast.error(error.response?.data?.message || "Unable to load bookings");
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

  const filtered = bookings.filter((booking) => {
    const value = search.toLowerCase();

    return (
      String(booking.id).includes(value) ||
      booking.bookingReference?.toLowerCase().includes(value) ||
      booking.status?.toLowerCase().includes(value)
    );
  });

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Booking Management</h2>

        <p className="text-gray-500 mt-1">Monitor and manage all bookings.</p>
      </div>

      <div className="bg-white rounded-xl shadow p-4 mb-6">
        <div className="relative max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />

          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search bookings..."
            className="w-full pl-11 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-green-500 focus:outline-none"
          />
        </div>
      </div>

      <div className="grid gap-5">
        {filtered.map((booking) => (
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
    </div>
  );
};

const formatDate = (value) => {
  if (!value) return "—";

  return new Date(value).toLocaleString();
};

export default AdminBookings;
