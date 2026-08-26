import React, { useEffect, useState } from "react";
import {
  ArrowLeft,
  CarFront,
  Download,
  FileText,
  Loader2,
  MapPin,
} from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { toast } from "react-toastify";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import api from "../services/api";

const InvoicePage = () => {
  const { bookingId } = useParams();

  const [invoice, setInvoice] = useState(null);
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    fetchInvoice();
  }, [bookingId]);

  const fetchInvoice = async () => {
    try {
      const invoiceResponse = await api.get(`/invoices/booking/${bookingId}`);

      setInvoice(invoiceResponse.data?.data);

      const bookingResponse = await api.get(`/bookings/${bookingId}`);

      setBooking(bookingResponse.data?.data);
    } catch (error) {
      console.error("Fetch invoice error:", error);

      toast.error(error.response?.data?.message || "Unable to fetch invoice");
    } finally {
      setLoading(false);
    }
  };

  const downloadInvoice = async () => {
    try {
      setDownloading(true);

      const response = await api.get(`/invoices/${bookingId}/download`, {
        responseType: "blob",
      });

      const blob = new Blob([response.data], {
        type: "application/pdf",
      });

      const url = window.URL.createObjectURL(blob);

      const link = document.createElement("a");

      link.href = url;

      link.download = `EcoRides_Invoice_${bookingId}.pdf`;

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

  if (loading) {
    return (
      <PageShell>
        <div
          className="flex-grow
                     flex items-center
                     justify-center"
        >
          <Loader2
            className="w-10 h-10
                       text-emerald-600
                       animate-spin"
          />
        </div>
      </PageShell>
    );
  }

  if (!invoice) {
    return (
      <PageShell>
        <div
          className="flex-grow
                     flex items-center
                     justify-center"
        >
          <div className="text-center">
            <FileText
              className="w-14 h-14
                         mx-auto
                         text-gray-300"
            />

            <h2 className="text-xl font-bold mt-4">Invoice not found</h2>

            <Link
              to={`/bookings/${bookingId}`}
              className="inline-block
                         mt-5
                         px-6 py-3
                         rounded-full
                         bg-emerald-600
                         text-white
                         font-semibold"
            >
              Back to Booking
            </Link>
          </div>
        </div>
      </PageShell>
    );
  }

  return (
    <PageShell>
      <main className="flex-grow px-4 py-10">
        <div className="max-w-3xl mx-auto">
          <Link
            to={`/bookings/${bookingId}`}
            className="inline-flex
                       items-center
                       gap-2
                       text-emerald-600
                       font-semibold
                       mb-6"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Booking
          </Link>

          <div
            className="bg-white
                       rounded-3xl
                       shadow-xl
                       border border-emerald-100
                       overflow-hidden"
          >
            <div
              className="bg-gradient-to-r
                         from-emerald-600
                         to-emerald-700
                         text-white
                         p-8"
            >
              <div
                className="flex
                           items-center
                           gap-3"
              >
                <FileText className="w-8 h-8" />

                <div>
                  <p className="text-emerald-100">EcoRides</p>

                  <h1 className="text-3xl font-bold">Rental Invoice</h1>
                </div>
              </div>
            </div>

            <div className="p-7 sm:p-9">
              <div
                className="grid
                           grid-cols-1
                           sm:grid-cols-2
                           gap-5"
              >
                <InvoiceItem
                  label="Invoice Number"
                  value={invoice.invoiceNumber}
                />

                <InvoiceItem
                  label="Booking Reference"
                  value={booking?.bookingReference || invoice.bookingId}
                />

                <InvoiceItem
                  label="Invoice Date"
                  value={formatDate(invoice.generatedAt)}
                />

                <InvoiceItem label="Booking Status" value={booking?.status} />
              </div>

              {booking && (
                <div
                  className="mt-7
                             p-5
                             rounded-2xl
                             bg-gray-50
                             border border-gray-100"
                >
                  <div
                    className="flex
                               items-center
                               gap-3"
                  >
                    <CarFront
                      className="w-6 h-6
                                 text-emerald-600"
                    />

                    <div>
                      <p className="text-sm text-gray-500">Vehicle</p>

                      <p className="font-bold text-gray-900">
                        {booking.carName || `Car #${booking.carId}`}
                      </p>
                    </div>
                  </div>

                  <div
                    className="flex
                               items-center
                               gap-3
                               mt-4"
                  >
                    <MapPin
                      className="w-6 h-6
                                 text-emerald-600"
                    />

                    <div>
                      <p className="text-sm text-gray-500">Rental Station</p>

                      <p className="font-bold text-gray-900">
                        {booking.locationName ||
                          `Location #${booking.locationId}`}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {booking && (
                <div className="mt-7">
                  <h2 className="font-bold text-lg">Rental Period</h2>

                  <div
                    className="grid
                               grid-cols-1
                               sm:grid-cols-3
                               gap-4
                               mt-4"
                  >
                    <InvoiceItem
                      label="Start"
                      value={formatDate(booking.startTime)}
                    />

                    <InvoiceItem
                      label="End"
                      value={formatDate(booking.endTime)}
                    />

                    <InvoiceItem
                      label="Rental Days"
                      value={`${booking.rentalDays || 1}`}
                    />
                  </div>
                </div>
              )}

              <div
                className="border-t
                           border-gray-100
                           mt-8
                           pt-7"
              >
                <h2
                  className="font-bold
                             text-lg
                             mb-5"
                >
                  Charges
                </h2>

                <div className="space-y-4">
                  <AmountRow
                    label="Rental Amount"
                    value={booking?.rentalAmount ?? invoice.amount}
                  />

                  <AmountRow
                    label="Discount"
                    value={booking?.discountAmount ?? 0}
                    negative
                  />

                  <AmountRow
                    label="GST"
                    value={booking?.taxAmount ?? invoice.tax}
                  />

                  <div
                    className="border-t
                               pt-5
                               flex
                               justify-between
                               items-center"
                  >
                    <span className="text-xl font-bold">Total Paid</span>

                    <span
                      className="text-2xl
                                 font-bold
                                 text-emerald-600"
                    >
                      ₹{invoice.totalAmount}
                    </span>
                  </div>
                </div>
              </div>

              <div
                className="mt-6
                           p-5
                           rounded-2xl
                           bg-emerald-50
                           border
                           border-emerald-100"
              >
                <p className="text-sm text-gray-500">Payment Status</p>

                <p
                  className="font-bold
                             text-emerald-700
                             mt-1"
                >
                  PAID
                </p>

                <p
                  className="text-sm
                             text-gray-600
                             mt-2"
                >
                  This invoice represents the amount successfully paid for this
                  booking.
                </p>
              </div>

              <button
                type="button"
                onClick={downloadInvoice}
                disabled={downloading}
                className="w-full
                           mt-8
                           py-3
                           rounded-full
                           bg-emerald-600
                           text-white
                           font-semibold
                           hover:bg-emerald-700
                           disabled:bg-emerald-300
                           flex
                           items-center
                           justify-center
                           gap-2"
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
            </div>
          </div>
        </div>
      </main>
    </PageShell>
  );
};

const InvoiceItem = ({ label, value }) => (
  <div
    className="bg-gray-50
               rounded-2xl
               p-4"
  >
    <p className="text-sm text-gray-500">{label}</p>

    <p
      className="font-semibold
                 text-gray-900
                 mt-1
                 break-words"
    >
      {value || "—"}
    </p>
  </div>
);

const AmountRow = ({ label, value, negative = false }) => (
  <div
    className="flex
               justify-between
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

export default InvoicePage;
