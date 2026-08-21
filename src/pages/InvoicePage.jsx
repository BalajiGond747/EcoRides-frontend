import React, { useEffect, useState } from "react";
import { ArrowLeft, Download, FileText, Loader2 } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { toast } from "react-toastify";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import api from "../services/api";

const InvoicePage = () => {
  const { bookingId } = useParams();

  const [invoice, setInvoice] = useState(null);
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    fetchInvoice();
  }, [bookingId]);

  const fetchInvoice = async () => {
    try {
      const response = await api.get(`/invoices/booking/${bookingId}`);

      setInvoice(response.data?.data);
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
      link.download = `invoice_${bookingId}.pdf`;

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
        <div className="flex-grow flex items-center justify-center">
          <Loader2 className="w-10 h-10 text-emerald-600 animate-spin" />
        </div>
      </PageShell>
    );
  }

  if (!invoice) {
    return (
      <PageShell>
        <div className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <FileText className="w-14 h-14 mx-auto text-gray-300" />

            <h2 className="text-xl font-bold mt-4">Invoice not found</h2>

            <Link
              to={`/bookings/${bookingId}`}
              className="inline-block mt-5 px-6 py-3
                         rounded-full
                         bg-emerald-600 text-white"
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
            className="inline-flex items-center gap-2
                       text-emerald-600 font-semibold mb-6"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Booking
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
                            text-white p-8"
            >
              <div className="flex items-center gap-3">
                <FileText className="w-8 h-8" />

                <div>
                  <p className="text-emerald-100">EcoRide</p>

                  <h1 className="text-3xl font-bold">Invoice</h1>
                </div>
              </div>
            </div>

            <div className="p-7 sm:p-9">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <InvoiceItem
                  label="Invoice Number"
                  value={invoice.invoiceNumber}
                />

                <InvoiceItem label="Booking ID" value={invoice.bookingId} />

                <InvoiceItem
                  label="Generated At"
                  value={formatDate(invoice.generatedAt)}
                />

                <InvoiceItem
                  label="Last Updated"
                  value={formatDate(invoice.updatedAt)}
                />
              </div>

              <div
                className="border-t border-gray-100
                              mt-8 pt-7 space-y-5"
              >
                <AmountRow label="Amount" value={invoice.amount} />

                <AmountRow label="Tax" value={invoice.tax} />

                <div
                  className="border-t pt-5
                                flex items-center
                                justify-between"
                >
                  <span className="text-xl font-bold">Total</span>

                  <span className="text-2xl font-bold text-emerald-600">
                    ₹{invoice.totalAmount}
                  </span>
                </div>
              </div>

              <button
                onClick={downloadInvoice}
                disabled={downloading}
                className="w-full mt-8 py-3 rounded-full
                           bg-emerald-600 text-white
                           font-semibold
                           hover:bg-emerald-700
                           disabled:bg-emerald-300"
              >
                {downloading ? (
                  <span className="flex items-center justify-center gap-2">
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Downloading...
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    <Download className="w-5 h-5" />
                    Download Invoice PDF
                  </span>
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
  <div className="bg-gray-50 rounded-2xl p-4">
    <p className="text-sm text-gray-500">{label}</p>

    <p className="font-semibold text-gray-900 mt-1 break-all">{value || "—"}</p>
  </div>
);

const AmountRow = ({ label, value }) => (
  <div className="flex justify-between items-center">
    <span className="text-gray-600">{label}</span>

    <span className="font-semibold">₹{value ?? "0.00"}</span>
  </div>
);

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

export default InvoicePage;
