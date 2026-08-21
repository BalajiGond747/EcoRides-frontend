import React, { useEffect, useState } from "react";
import {
  CalendarDays,
  CarFront,
  Eye,
  Loader2,
  MapPin,
  XCircle,
} from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import api from "../services/api";
import { getCurrentUser } from "../services/auth";

const MyBookingsPage = () => {
  const currentUser = getCurrentUser();

  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (currentUser?.userId) {
      fetchBookings();
    } else {
      setLoading(false);
    }
  }, [currentUser?.userId]);

  const fetchBookings = async () => {
    try {
      setLoading(true);

      const response = await api.get(`/bookings/user/${currentUser.userId}`);

      setBookings(response.data?.data || []);
    } catch (error) {
      console.error("Fetch bookings error:", error);

      toast.error(error.response?.data?.message || "Unable to fetch bookings");
    } finally {
      setLoading(false);
    }
  };

  const cancelBooking = async (id) => {
    const reason = window.prompt("Enter cancellation reason:");

    if (!reason?.trim()) {
      return;
    }

    try {
      await api.patch(`/bookings/${id}/cancel`, null, {
        params: {
          reason: reason.trim(),
        },
      });

      toast.success("Booking cancelled");

      fetchBookings();
    } catch (error) {
      toast.error(error.response?.data?.message || "Unable to cancel booking");
    }
  };

  return (
    <PageShell>
      <main className="flex-grow px-4 py-10">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">My Bookings</h1>

            <p className="text-gray-500 mt-2">
              View and manage your rental bookings.
            </p>
          </div>

          {loading && (
            <div className="flex justify-center py-20">
              <Loader2 className="w-10 h-10 text-emerald-600 animate-spin" />
            </div>
          )}

          {!loading && bookings.length === 0 && (
            <div className="bg-white rounded-3xl shadow-md p-12 text-center">
              <CalendarDays className="w-14 h-14 mx-auto text-gray-300" />

              <h2 className="text-xl font-bold mt-4">No bookings yet</h2>

              <Link
                to="/cars"
                className="inline-block mt-5 px-6 py-3
                           rounded-full bg-emerald-600
                           text-white font-semibold"
              >
                Browse Cars
              </Link>
            </div>
          )}

          {!loading && bookings.length > 0 && (
            <div className="space-y-5">
              {bookings.map((booking) => (
                <BookingCard
                  key={booking.id}
                  booking={booking}
                  onCancel={cancelBooking}
                />
              ))}
            </div>
          )}
        </div>
      </main>
    </PageShell>
  );
};

const BookingCard = ({ booking, onCancel }) => {
  const canCancel =
    booking.status === "PENDING" || booking.status === "CONFIRMED";

  return (
    <div
      className="bg-white rounded-3xl shadow-md
                    border border-emerald-100 p-6"
    >
      <div
        className="flex flex-col lg:flex-row
                      lg:items-center lg:justify-between
                      gap-5"
      >
        <div className="flex items-start gap-4">
          <div
            className="w-14 h-14 rounded-2xl
                          bg-emerald-100
                          flex items-center justify-center
                          shrink-0"
          >
            <CarFront className="w-7 h-7 text-emerald-600" />
          </div>

          <div>
            <h2 className="font-bold text-lg">
              Booking #{booking.bookingReference || booking.id}
            </h2>

            <p className="text-gray-500 text-sm mt-1">
              Car ID: {booking.carId}
            </p>

            <p
              className="flex items-center gap-1
                          text-gray-500 text-sm mt-2"
            >
              <MapPin className="w-4 h-4" />
              Location {booking.locationId}
            </p>
          </div>
        </div>

        <span
          className={`px-4 py-2 rounded-full
                          font-semibold text-sm
                          self-start lg:self-auto
                          ${getStatusClass(booking.status)}`}
        >
          {booking.status}
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
        <DateItem label="Start" value={formatDate(booking.startTime)} />

        <DateItem label="End" value={formatDate(booking.endTime)} />
      </div>

      <div
        className="flex flex-col sm:flex-row
                      sm:items-center sm:justify-between
                      gap-4 border-t border-gray-100
                      mt-6 pt-5"
      >
        <div>
          <p className="text-sm text-gray-500">Total Amount</p>

          <p className="text-xl font-bold text-emerald-600">
            ₹{booking.totalAmount ?? "—"}
          </p>
        </div>

        <div className="flex gap-3 flex-wrap">
          <Link
            to={`/bookings/${booking.id}`}
            className="inline-flex items-center gap-2
                       px-5 py-2.5 rounded-full
                       bg-emerald-600 text-white
                       font-semibold hover:bg-emerald-700"
          >
            <Eye className="w-4 h-4" />
            View
          </Link>

          {canCancel && (
            <button
              onClick={() => onCancel(booking.id)}
              className="inline-flex items-center gap-2
                         px-5 py-2.5 rounded-full
                         border border-red-300
                         text-red-600 font-semibold
                         hover:bg-red-50"
            >
              <XCircle className="w-4 h-4" />
              Cancel
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

const DateItem = ({ label, value }) => (
  <div className="bg-gray-50 rounded-2xl p-4">
    <p className="text-xs text-gray-500 uppercase font-semibold">{label}</p>

    <p className="text-gray-900 mt-1">{value}</p>
  </div>
);

const getStatusClass = (status) => {
  switch (status) {
    case "PENDING":
      return "bg-yellow-100 text-yellow-700";

    case "CONFIRMED":
      return "bg-blue-100 text-blue-700";

    case "ACTIVE":
      return "bg-emerald-100 text-emerald-700";

    case "COMPLETED":
      return "bg-green-100 text-green-700";

    case "CANCELLED":
      return "bg-red-100 text-red-700";

    default:
      return "bg-gray-100 text-gray-700";
  }
};

const formatDate = (value) => {
  if (!value) return "—";

  return new Date(value).toLocaleString();
};

const PageShell = ({ children }) => (
  <div
    className="min-h-screen flex flex-col
                  bg-gradient-to-br
                  from-emerald-50 via-white to-green-50"
  >
    <Navbar />
    {children}
    <Footer />
  </div>
);

export default MyBookingsPage;
