import React, { useEffect, useState } from "react";
import {
  ArrowLeft,
  CalendarDays,
  CreditCard,
  FileText,
  Loader2,
  MapPin,
  CarFront,
  Receipt,
  Tag,
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
  const [payment, setPayment] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBooking();
  }, [id]);

  const fetchBooking = async () => {
    try {
      setLoading(true);

      const response = await api.get(`/bookings/${id}`);

      const bookingData = response.data?.data;

      setBooking(bookingData);

      try {
        const paymentResponse = await api.get(`/payments/booking/${id}`);

        setPayment(paymentResponse.data?.data || null);
      } catch (paymentError) {
        console.log("Payment information unavailable");
        setPayment(null);
      }
    } catch (error) {
      console.error("Fetch booking error:", error);

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
              type="button"
              onClick={() => navigate("/bookings")}
              className="mt-5 px-6 py-3 rounded-full
                         bg-emerald-600 text-white
                         font-semibold"
            >
              Back to Bookings
            </button>
          </div>
        </div>
      </PageShell>
    );
  }

  const paymentSuccessful = payment?.status === "SUCCESS";

  return (
    <PageShell>
      <main className="flex-grow px-4 py-10">
        <div className="max-w-4xl mx-auto">
          <Link
            to="/bookings"
            className="inline-flex items-center gap-2
                       text-emerald-600 font-semibold mb-6
                       hover:text-emerald-700"
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
              <div
                className="grid grid-cols-1
                           sm:grid-cols-2 gap-5"
              >
                <Info
                  icon={<CarFront />}
                  label="Car"
                  value={booking.carName || `Car #${booking.carId}`}
                />

                <Info
                  icon={<MapPin />}
                  label="Pickup Station"
                  value={
                    booking.locationName || `Location ${booking.locationId}`
                  }
                />
              </div>

              <div className="mt-5">
                <h3
                  className="text-lg font-bold
                             text-gray-900 mb-4"
                >
                  Rental Period
                </h3>

                <div
                  className="grid grid-cols-1
                             sm:grid-cols-3 gap-5"
                >
                  <Info
                    icon={<CalendarDays />}
                    label="Start"
                    value={formatDate(booking.startTime)}
                  />

                  <Info
                    icon={<CalendarDays />}
                    label="End"
                    value={formatDate(booking.endTime)}
                  />

                  <Info
                    icon={<CalendarDays />}
                    label="Rental Days"
                    value={`${booking.rentalDays || 1} day${
                      (booking.rentalDays || 1) > 1 ? "s" : ""
                    }`}
                  />
                </div>
              </div>

              {booking.couponCode && (
                <div
                  className="mt-6 p-4 rounded-2xl
                             bg-emerald-50
                             border border-emerald-100"
                >
                  <div
                    className="flex items-center gap-2
                               text-emerald-700"
                  >
                    <Tag className="w-5 h-5" />

                    <span className="font-semibold">Coupon Applied</span>
                  </div>

                  <p
                    className="font-bold
                               text-emerald-800 mt-1"
                  >
                    {booking.couponCode}
                  </p>
                </div>
              )}

              <div
                className="border-t border-gray-100
                           mt-8 pt-7"
              >
                <h3
                  className="text-lg font-bold
                             text-gray-900 mb-5"
                >
                  Payment Summary
                </h3>

                <div className="space-y-4">
                  <AmountRow
                    label="Rental Amount"
                    value={booking.rentalAmount}
                  />

                  <AmountRow
                    label="Discount"
                    value={booking.discountAmount}
                    negative
                  />

                  <AmountRow label="GST" value={booking.taxAmount} />

                  <div
                    className="border-t border-gray-200
                               pt-5 flex items-center
                               justify-between"
                  >
                    <span className="text-xl font-bold">Total Paid</span>

                    <span
                      className="text-2xl font-bold
                                 text-emerald-600"
                    >
                      ₹{booking.totalAmount ?? "—"}
                    </span>
                  </div>
                </div>
              </div>

              <div
                className="mt-6 p-4 rounded-2xl
                           bg-gray-50
                           border border-gray-100"
              >
                <p className="text-sm text-gray-500">Payment Status</p>

                <p
                  className={`font-bold mt-1 ${
                    paymentSuccessful ? "text-emerald-600" : "text-yellow-600"
                  }`}
                >
                  {paymentSuccessful
                    ? "PAID"
                    : payment?.status || "PAYMENT PENDING"}
                </p>
              </div>

              {booking.cancellationReason && (
                <div
                  className="mt-6 p-4 rounded-2xl
                             bg-red-50
                             border border-red-100"
                >
                  <p className="text-sm text-red-500">Cancellation Reason</p>

                  <p
                    className="font-medium
                               text-red-700 mt-1"
                  >
                    {booking.cancellationReason}
                  </p>
                </div>
              )}

              <div
                className="border-t border-gray-100
                           mt-8 pt-6
                           flex flex-wrap gap-3"
              >
                {!paymentSuccessful && booking.status === "PENDING" && (
                  <Link
                    to={`/payments/${booking.id}`}
                    className="inline-flex items-center gap-2
                                 px-5 py-3 rounded-full
                                 bg-emerald-600 text-white
                                 font-semibold
                                 hover:bg-emerald-700"
                  >
                    <CreditCard className="w-5 h-5" />
                    Complete Payment
                  </Link>
                )}

                {paymentSuccessful && (
                  <Link
                    to={`/invoices/booking/${booking.id}`}
                    className="inline-flex items-center gap-2
                               px-5 py-3 rounded-full
                               bg-emerald-600 text-white
                               font-semibold
                               hover:bg-emerald-700"
                  >
                    <FileText className="w-5 h-5" />
                    View Invoice
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </PageShell>
  );
};

const Info = ({ icon, label, value }) => (
  <div
    className="bg-gray-50 rounded-2xl p-4
               border border-gray-100"
  >
    <div
      className="flex items-center gap-2
                 text-emerald-600"
    >
      {React.cloneElement(icon, {
        className: "w-5 h-5",
      })}

      <span className="text-sm font-semibold">{label}</span>
    </div>

    <p
      className="mt-2 font-medium
                 text-gray-900"
    >
      {value || "—"}
    </p>
  </div>
);

const AmountRow = ({ label, value, negative = false }) => (
  <div
    className="flex justify-between
               items-center"
  >
    <span className="text-gray-600">{label}</span>

    <span
      className={`font-semibold ${negative ? "text-red-600" : "text-gray-900"}`}
    >
      {negative ? "-" : ""}₹{value ?? "0.00"}
    </span>
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
  if (!value) {
    return "—";
  }

  return new Date(value).toLocaleString("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
  });
};

const PageShell = ({ children }) => (
  <div
    className="min-h-screen
               flex flex-col
               bg-gradient-to-br
               from-emerald-50
               via-white
               to-green-50"
  >
    <Navbar />

    {children}

    <Footer />
  </div>
);

export default BookingDetailsPage;
