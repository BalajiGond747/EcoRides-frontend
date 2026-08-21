import React, { useEffect, useState } from "react";
import {
  ArrowLeft,
  CalendarDays,
  CreditCard,
  FileText,
  Loader2,
  MapPin,
  Receipt,
} from "lucide-react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import api from "../services/api";

const BookingDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBooking();
  }, [id]);

  const fetchBooking = async () => {
    try {
      const response = await api.get(`/bookings/${id}`);

      setBooking(response.data?.data);
    } catch (error) {
      toast.error(error.response?.data?.message || "Unable to fetch booking");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <PageShell>
        <div className="flex-grow flex items-center justify-center">
          <Loader2 className="w-10 h-10 text-emerald-600 animate-spin" />
        </div>
      </PageShell>
    );
  }

  if (!booking) {
    return (
      <PageShell>
        <div className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold">Booking not found</h2>

            <button
              onClick={() => navigate("/bookings")}
              className="mt-5 px-6 py-3 rounded-full
                         bg-emerald-600 text-white"
            >
              Back to Bookings
            </button>
          </div>
        </div>
      </PageShell>
    );
  }

  return (
    <PageShell>
      <main className="flex-grow px-4 py-10">
        <div className="max-w-4xl mx-auto">
          <Link
            to="/bookings"
            className="inline-flex items-center gap-2
                       text-emerald-600 font-semibold mb-6"
          >
            <ArrowLeft className="w-5 h-5" />
            My Bookings
          </Link>

          <div
            className="bg-white rounded-3xl shadow-xl
                          border border-emerald-100
                          overflow-hidden"
          >
            <div
              className="bg-gradient-to-r
                            from-emerald-600
                            to-emerald-700
                            text-white p-7"
            >
              <p className="text-emerald-100 text-sm">Booking Reference</p>

              <h1 className="text-3xl font-bold mt-1">
                {booking.bookingReference || `#${booking.id}`}
              </h1>

              <span
                className={`inline-block mt-4
                                px-4 py-2 rounded-full
                                font-semibold
                                ${getStatusClass(booking.status)}`}
              >
                {booking.status}
              </span>
            </div>

            <div className="p-6 sm:p-8">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <Info
                  icon={<CalendarDays />}
                  label="Start Time"
                  value={formatDate(booking.startTime)}
                />

                <Info
                  icon={<CalendarDays />}
                  label="End Time"
                  value={formatDate(booking.endTime)}
                />

                <Info
                  icon={<MapPin />}
                  label="Location"
                  value={booking.locationId}
                />

                <Info icon={<Receipt />} label="Car" value={booking.carId} />
              </div>

              {booking.couponCode && (
                <div
                  className="mt-6 p-4 rounded-2xl
                                bg-emerald-50"
                >
                  <p className="text-sm text-gray-500">Coupon</p>

                  <p className="font-bold text-emerald-700">
                    {booking.couponCode}
                  </p>
                </div>
              )}

              {booking.cancellationReason && (
                <div className="mt-6 p-4 rounded-2xl bg-red-50">
                  <p className="text-sm text-red-500">Cancellation Reason</p>

                  <p className="font-medium text-red-700 mt-1">
                    {booking.cancellationReason}
                  </p>
                </div>
              )}

              <div
                className="border-t border-gray-100
                              mt-8 pt-6
                              flex flex-col sm:flex-row
                              sm:items-center
                              sm:justify-between gap-5"
              >
                <div>
                  <p className="text-sm text-gray-500">Total Amount</p>

                  <p className="text-3xl font-bold text-emerald-600">
                    ₹{booking.totalAmount ?? "—"}
                  </p>
                </div>

                <div className="flex flex-wrap gap-3">
                  <Link
                    to={`/payments/${booking.id}`}
                    className="inline-flex items-center gap-2
                               px-5 py-3 rounded-full
                               bg-emerald-600 text-white
                               font-semibold hover:bg-emerald-700"
                  >
                    <CreditCard className="w-5 h-5" />
                    Payment
                  </Link>

                  <Link
                    to={`/invoices/booking/${booking.id}`}
                    className="inline-flex items-center gap-2
                               px-5 py-3 rounded-full
                               border border-emerald-600
                               text-emerald-600
                               font-semibold
                               hover:bg-emerald-50"
                  >
                    <FileText className="w-5 h-5" />
                    Invoice
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </PageShell>
  );
};

const Info = ({ icon, label, value }) => (
  <div className="bg-gray-50 rounded-2xl p-4">
    <div className="flex items-center gap-2 text-emerald-600">
      {React.cloneElement(icon, {
        className: "w-5 h-5",
      })}

      <span className="text-sm font-semibold">{label}</span>
    </div>

    <p className="mt-2 font-medium text-gray-900">{value || "—"}</p>
  </div>
);

const getStatusClass = (status) => {
  switch (status) {
    case "PENDING":
      return "bg-yellow-100 text-yellow-800";

    case "CONFIRMED":
      return "bg-blue-100 text-blue-800";

    case "ACTIVE":
      return "bg-white/20 text-white";

    case "COMPLETED":
      return "bg-green-100 text-green-800";

    case "CANCELLED":
      return "bg-red-100 text-red-800";

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

export default BookingDetailsPage;
