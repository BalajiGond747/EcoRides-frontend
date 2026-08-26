import React, { useEffect, useState } from "react";
import {
  CalendarDays,
  CarFront,
  Download,
  FileText,
  Loader2,
  MapPin,
  Receipt,
  Search,
  User,
  X,
} from "lucide-react";
import { toast } from "react-toastify";

import api from "../../services/api";

const AdminInvoices = () => {
  const [bookings, setBookings] = useState([]);

  const [invoice, setInvoice] = useState(null);

  const [selectedBooking, setSelectedBooking] = useState(null);

  const [loading, setLoading] = useState(true);
  const [invoiceLoading, setInvoiceLoading] = useState(false);
  const [downloading, setDownloading] = useState(false);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      setLoading(true);

      const response = await api.get("/bookings", {
        params: {
          page: 0,
          size: 100,
          sortBy: "createdAt",
          sortDir: "desc",
        },
      });

      const data = response.data?.data;

      setBookings(data?.content || []);
    } catch (error) {
      console.error("Fetch bookings error:", error);

      toast.error(error.response?.data?.message || "Unable to fetch bookings");
    } finally {
      setLoading(false);
    }
  };

  const openInvoice = async (booking) => {
    try {
      setSelectedBooking(booking);
      setInvoice(null);
      setInvoiceLoading(true);

      try {
        const response = await api.get(`/invoices/booking/${booking.id}`);

        if (response.data?.data) {
          setInvoice(response.data.data);
          return;
        }
      } catch (error) {}

      const generateResponse = await api.post(`/invoices/${booking.id}`);

      setInvoice(generateResponse.data?.data || null);

      toast.success("Invoice generated successfully");
    } catch (error) {
      console.error("Invoice error:", error);

      toast.error(
        error.response?.data?.message || "Unable to generate invoice"
      );
    } finally {
      setInvoiceLoading(false);
    }
  };

  const closeInvoice = () => {
    setSelectedBooking(null);
    setInvoice(null);
  };

  const downloadInvoice = async () => {
    if (!selectedBooking) {
      return;
    }

    try {
      setDownloading(true);

      const response = await api.get(
        `/invoices/${selectedBooking.id}/download`,
        {
          responseType: "blob",
        }
      );

      const blob = new Blob([response.data], {
        type: "application/pdf",
      });

      const url = window.URL.createObjectURL(blob);

      const link = document.createElement("a");

      link.href = url;

      link.download = `invoice_${
        invoice?.invoiceNumber ||
        selectedBooking.bookingReference ||
        selectedBooking.id
      }.pdf`;

      document.body.appendChild(link);

      link.click();

      link.remove();

      window.URL.revokeObjectURL(url);

      toast.success("Invoice downloaded");
    } catch (error) {
      console.error("Download invoice error:", error);

      toast.error("Unable to download invoice");
    } finally {
      setDownloading(false);
    }
  };

  const eligibleBookings = bookings.filter(
    (booking) =>
      booking.status === "CONFIRMED" ||
      booking.status === "ACTIVE" ||
      booking.status === "COMPLETED"
  );

  const filteredBookings = eligibleBookings.filter((booking) => {
    const searchText = search.trim().toLowerCase();

    const matchesSearch =
      !searchText ||
      String(booking.bookingReference || "")
        .toLowerCase()
        .includes(searchText) ||
      String(booking.id).toLowerCase().includes(searchText) ||
      String(booking.userId).toLowerCase().includes(searchText) ||
      String(booking.carId).toLowerCase().includes(searchText);

    const matchesStatus =
      statusFilter === "ALL" || booking.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Invoice Management</h2>

        <p className="text-gray-500 mt-1">
          Generate, view and download invoices for completed and paid bookings.
        </p>
      </div>

      <div
        className="bg-white rounded-2xl shadow
                   border border-gray-100
                   p-5 mb-6"
      >
        <div
          className="flex flex-col
                     md:flex-row gap-4"
        >
          <div className="relative flex-1">
            <Search
              className="absolute left-4 top-1/2
                         -translate-y-1/2
                         w-5 h-5 text-gray-400"
            />

            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search booking reference, booking ID, user ID or car ID"
              className="w-full pl-11 pr-4 py-3
                         border border-gray-200
                         rounded-xl
                         outline-none
                         focus:ring-2
                         focus:ring-emerald-500"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-3
                       border border-gray-200
                       rounded-xl
                       outline-none
                       focus:ring-2
                       focus:ring-emerald-500
                       bg-white"
          >
            <option value="ALL">All Eligible Bookings</option>

            <option value="CONFIRMED">Confirmed</option>

            <option value="ACTIVE">Active</option>

            <option value="COMPLETED">Completed</option>
          </select>
        </div>
      </div>

      {loading && (
        <div
          className="bg-white rounded-2xl
                     shadow p-12
                     flex justify-center"
        >
          <Loader2
            className="w-10 h-10
                       text-emerald-600
                       animate-spin"
          />
        </div>
      )}

      {!loading && filteredBookings.length === 0 && (
        <div
          className="bg-white rounded-2xl
                       shadow p-12
                       text-center"
        >
          <FileText
            className="w-14 h-14
                         mx-auto text-gray-300"
          />

          <h3
            className="text-xl font-bold
                         text-gray-800 mt-4"
          >
            No eligible bookings
          </h3>

          <p className="text-gray-500 mt-2">
            Confirmed, active or completed bookings will appear here.
          </p>
        </div>
      )}

      {!loading && filteredBookings.length > 0 && (
        <div className="space-y-4">
          {filteredBookings.map((booking) => (
            <BookingInvoiceCard
              key={booking.id}
              booking={booking}
              onOpenInvoice={openInvoice}
            />
          ))}
        </div>
      )}

      {selectedBooking && (
        <InvoiceModal
          booking={selectedBooking}
          invoice={invoice}
          loading={invoiceLoading}
          downloading={downloading}
          onClose={closeInvoice}
          onDownload={downloadInvoice}
        />
      )}
    </div>
  );
};

const BookingInvoiceCard = ({ booking, onOpenInvoice }) => {
  return (
    <div
      className="bg-white rounded-2xl shadow
                 border border-gray-100
                 p-5"
    >
      <div
        className="flex flex-col
                   lg:flex-row
                   lg:items-center
                   lg:justify-between
                   gap-5"
      >
        <div className="flex items-start gap-4">
          <div
            className="w-14 h-14
                       rounded-2xl
                       bg-emerald-100
                       flex items-center
                       justify-center
                       shrink-0"
          >
            <Receipt
              className="w-7 h-7
                         text-emerald-600"
            />
          </div>

          <div>
            <div
              className="flex flex-wrap
                         items-center gap-3"
            >
              <h3
                className="text-lg font-bold
                           text-gray-800"
              >
                {booking.bookingReference || `Booking #${booking.id}`}
              </h3>

              <StatusBadge status={booking.status} />
            </div>

            <p
              className="text-sm text-gray-500
                         mt-1"
            >
              Booking ID: {booking.id}
            </p>

            <div
              className="flex flex-wrap
                         gap-x-5 gap-y-2
                         mt-3 text-sm
                         text-gray-500"
            >
              <span
                className="flex items-center
                           gap-1"
              >
                <User className="w-4 h-4" />
                User #{booking.userId}
              </span>

              <span
                className="flex items-center
                           gap-1"
              >
                <CarFront className="w-4 h-4" />
                Car #{booking.carId}
              </span>

              <span
                className="flex items-center
                           gap-1"
              >
                <MapPin className="w-4 h-4" />
                Location #{booking.locationId}
              </span>
            </div>
          </div>
        </div>

        <div
          className="flex flex-col
                     sm:flex-row
                     sm:items-center
                     gap-4
                     lg:min-w-[280px]
                     lg:justify-end"
        >
          <div className="sm:text-right">
            <p
              className="text-xs
                         text-gray-500
                         uppercase
                         font-semibold"
            >
              Total
            </p>

            <p
              className="text-xl font-bold
                         text-emerald-600"
            >
              ₹{booking.totalAmount ?? "—"}
            </p>
          </div>

          <button
            type="button"
            onClick={() => onOpenInvoice(booking)}
            className="inline-flex
                       items-center
                       justify-center
                       gap-2
                       px-5 py-3
                       rounded-xl
                       bg-emerald-600
                       text-white
                       font-semibold
                       hover:bg-emerald-700
                       transition"
          >
            <FileText className="w-5 h-5" />
            Invoice
          </button>
        </div>
      </div>

      <div
        className="grid grid-cols-1
                   sm:grid-cols-2
                   gap-4
                   mt-5 pt-5
                   border-t
                   border-gray-100"
      >
        <DateItem label="Start" value={booking.startTime} />

        <DateItem label="End" value={booking.endTime} />
      </div>
    </div>
  );
};

const InvoiceModal = ({
  booking,
  invoice,
  loading,
  downloading,
  onClose,
  onDownload,
}) => {
  return (
    <div
      className="fixed inset-0 z-50
                 bg-black/40
                 flex items-center
                 justify-center
                 p-4"
    >
      <div
        className="bg-white
                   rounded-3xl
                   shadow-2xl
                   w-full
                   max-w-2xl
                   max-h-[90vh]
                   overflow-y-auto"
      >
        <div
          className="flex items-center
                     justify-between
                     p-6
                     border-b
                     border-gray-100"
        >
          <div
            className="flex items-center
                       gap-3"
          >
            <div
              className="w-11 h-11
                         rounded-xl
                         bg-emerald-100
                         flex items-center
                         justify-center"
            >
              <FileText
                className="w-6 h-6
                           text-emerald-600"
              />
            </div>

            <div>
              <h3
                className="text-xl font-bold
                           text-gray-800"
              >
                Invoice
              </h3>

              <p
                className="text-sm
                           text-gray-500"
              >
                {booking.bookingReference || `Booking #${booking.id}`}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-10 h-10
                       rounded-full
                       flex items-center
                       justify-center
                       hover:bg-gray-100
                       text-gray-500"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6">
          {loading && (
            <div
              className="py-16
                         flex justify-center"
            >
              <Loader2
                className="w-10 h-10
                           text-emerald-600
                           animate-spin"
              />
            </div>
          )}

          {!loading && invoice && (
            <>
              <div
                className="bg-emerald-50
                           rounded-2xl
                           p-5"
              >
                <p
                  className="text-sm
                             text-gray-500"
                >
                  Invoice Number
                </p>

                <p
                  className="text-2xl
                             font-bold
                             text-emerald-700
                             mt-1"
                >
                  {invoice.invoiceNumber}
                </p>
              </div>

              <div
                className="grid
                           grid-cols-1
                           sm:grid-cols-2
                           gap-4
                           mt-5"
              >
                <SummaryItem
                  icon={<CarFront />}
                  label="Car"
                  value={`Car #${booking.carId}`}
                />

                <SummaryItem
                  icon={<MapPin />}
                  label="Location"
                  value={`Location #${booking.locationId}`}
                />

                <SummaryItem
                  icon={<CalendarDays />}
                  label="Start"
                  value={formatDate(booking.startTime)}
                />

                <SummaryItem
                  icon={<CalendarDays />}
                  label="End"
                  value={formatDate(booking.endTime)}
                />
              </div>

              <div
                className="border-t
                           border-gray-100
                           mt-6 pt-6
                           space-y-4"
              >
                <AmountRow label="Amount" value={invoice.amount} />

                <AmountRow label="Tax / GST" value={invoice.tax} />

                <div
                  className="border-t
                             border-gray-200
                             pt-5
                             flex
                             items-center
                             justify-between"
                >
                  <span
                    className="text-xl
                               font-bold"
                  >
                    Total
                  </span>

                  <span
                    className="text-2xl
                               font-bold
                               text-emerald-600"
                  >
                    ₹{invoice.totalAmount ?? "0.00"}
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={onDownload}
                disabled={downloading}
                className="w-full
                           mt-7
                           py-3
                           rounded-full
                           bg-emerald-600
                           text-white
                           font-semibold
                           flex
                           justify-center
                           items-center
                           gap-2
                           hover:bg-emerald-700
                           disabled:bg-emerald-300
                           transition"
              >
                {downloading ? (
                  <>
                    <Loader2
                      className="w-5 h-5
                                 animate-spin"
                    />
                    Downloading...
                  </>
                ) : (
                  <>
                    <Download className="w-5 h-5" />
                    Download Invoice PDF
                  </>
                )}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

const SummaryItem = ({ icon, label, value }) => (
  <div
    className="bg-gray-50
               rounded-2xl
               p-4"
  >
    <div
      className="flex items-center
                 gap-2
                 text-emerald-600"
    >
      {React.cloneElement(icon, {
        className: "w-5 h-5",
      })}

      <span
        className="text-sm
                   font-semibold"
      >
        {label}
      </span>
    </div>

    <p
      className="mt-2
                 font-medium
                 text-gray-900"
    >
      {value || "—"}
    </p>
  </div>
);

const DateItem = ({ label, value }) => (
  <div
    className="bg-gray-50
               rounded-xl
               p-3"
  >
    <p
      className="text-xs
                 text-gray-500
                 uppercase
                 font-semibold"
    >
      {label}
    </p>

    <p
      className="text-sm
                 font-medium
                 text-gray-800
                 mt-1"
    >
      {formatDate(value)}
    </p>
  </div>
);

const AmountRow = ({ label, value }) => (
  <div
    className="flex
               items-center
               justify-between"
  >
    <span className="text-gray-600">{label}</span>

    <span className="font-semibold">₹{value ?? "0.00"}</span>
  </div>
);

const StatusBadge = ({ status }) => {
  const styles = {
    CONFIRMED: "bg-blue-100 text-blue-700",

    ACTIVE: "bg-emerald-100 text-emerald-700",

    COMPLETED: "bg-green-100 text-green-700",
  };

  return (
    <span
      className={`px-3 py-1
                  rounded-full
                  text-xs
                  font-semibold
                  ${styles[status] || "bg-gray-100 text-gray-700"}`}
    >
      {status}
    </span>
  );
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

export default AdminInvoices;
