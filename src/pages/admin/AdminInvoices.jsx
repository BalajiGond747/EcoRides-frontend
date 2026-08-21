import React, { useState } from "react";
import { Download, FileText, Loader2 } from "lucide-react";
import { toast } from "react-toastify";

import api from "../../services/api";

const AdminInvoices = () => {
  const [bookingId, setBookingId] = useState("");

  const [invoice, setInvoice] = useState(null);

  const [loading, setLoading] = useState(false);

  const generateInvoice = async () => {
    if (!bookingId) {
      toast.error("Enter booking ID");
      return;
    }

    try {
      setLoading(true);

      const response = await api.post(`/invoices/${bookingId}`);

      setInvoice(response.data?.data);

      toast.success("Invoice generated");
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Unable to generate invoice"
      );
    } finally {
      setLoading(false);
    }
  };

  const download = async () => {
    try {
      const response = await api.get(`/invoices/${bookingId}/download`, {
        responseType: "blob",
      });

      const url = window.URL.createObjectURL(
        new Blob([response.data], {
          type: "application/pdf",
        })
      );

      const link = document.createElement("a");

      link.href = url;
      link.download = `invoice_${bookingId}.pdf`;

      document.body.appendChild(link);
      link.click();
      link.remove();

      window.URL.revokeObjectURL(url);
    } catch {
      toast.error("Unable to download invoice");
    }
  };

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Invoice Management</h2>

        <p className="text-gray-500 mt-1">
          Generate and download booking invoices.
        </p>
      </div>

      <div className="bg-white rounded-2xl shadow p-6 max-w-2xl">
        <label className="block font-semibold mb-2">Booking ID</label>

        <div className="flex gap-3">
          <input
            type="number"
            value={bookingId}
            onChange={(e) => setBookingId(e.target.value)}
            placeholder="Enter booking ID"
            className="flex-1 px-4 py-3 border rounded-xl"
          />

          <button
            onClick={generateInvoice}
            disabled={loading}
            className="px-6 bg-green-600 text-white rounded-xl font-semibold"
          >
            {loading ? "Generating..." : "Generate"}
          </button>
        </div>
      </div>

      {invoice && (
        <div className="bg-white rounded-2xl shadow p-6 max-w-2xl mt-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-xl bg-green-100 flex items-center justify-center">
              <FileText className="text-green-600" />
            </div>

            <div>
              <h3 className="text-xl font-bold">{invoice.invoiceNumber}</h3>

              <p className="text-gray-500">Booking #{invoice.bookingId}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mt-6">
            <p>
              Amount:
              <b> ₹{invoice.amount}</b>
            </p>

            <p>
              Tax:
              <b> ₹{invoice.tax}</b>
            </p>

            <p className="col-span-2 text-xl">
              Total:
              <b> ₹{invoice.totalAmount}</b>
            </p>
          </div>

          <button
            onClick={download}
            className="mt-6 w-full py-3 rounded-full bg-green-600 text-white font-semibold flex justify-center items-center gap-2"
          >
            <Download className="w-5 h-5" />
            Download PDF
          </button>
        </div>
      )}
    </div>
  );
};

export default AdminInvoices;
