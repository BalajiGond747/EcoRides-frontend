import React, { useEffect, useMemo, useState } from "react";
import {
  CreditCard,
  Search,
  RefreshCw,
  CheckCircle,
  XCircle,
  Clock,
  RotateCcw,
  IndianRupee,
} from "lucide-react";
import { toast } from "react-toastify";
import { getAllPayments } from "../../services/payment";

const AdminPaymentsPage = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

  const fetchPayments = async () => {
    try {
      setLoading(true);

      const response = await getAllPayments();

      if (response?.success) {
        setPayments(response.data || []);
      } else {
        toast.error(response?.message || "Failed to fetch payments");
      }
    } catch (error) {
      console.error("Failed to fetch payments:", error);

      toast.error(error?.response?.data?.message || "Unable to load payments");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayments();
  }, []);

  const filteredPayments = useMemo(() => {
    return payments.filter((payment) => {
      const matchesStatus =
        statusFilter === "ALL" || payment.status === statusFilter;

      const search = searchTerm.toLowerCase();

      const matchesSearch =
        !search ||
        String(payment.id || "").includes(search) ||
        String(payment.bookingId || "").includes(search) ||
        String(payment.razorpayOrderId || "")
          .toLowerCase()
          .includes(search) ||
        String(payment.razorpayPaymentId || "")
          .toLowerCase()
          .includes(search);

      return matchesStatus && matchesSearch;
    });
  }, [payments, searchTerm, statusFilter]);

  const statistics = useMemo(() => {
    const successfulPayments = payments.filter(
      (payment) => payment.status === "SUCCESS"
    );

    const pendingPayments = payments.filter(
      (payment) => payment.status === "PENDING"
    );

    const failedPayments = payments.filter(
      (payment) => payment.status === "FAILED"
    );

    const refundedPayments = payments.filter(
      (payment) => payment.status === "REFUNDED"
    );

    const totalRevenue = successfulPayments.reduce(
      (total, payment) => total + Number(payment.amount || 0),
      0
    );

    return {
      total: payments.length,
      successful: successfulPayments.length,
      pending: pendingPayments.length,
      failed: failedPayments.length,
      refunded: refundedPayments.length,
      revenue: totalRevenue,
    };
  }, [payments]);

  const getStatusStyle = (status) => {
    switch (status) {
      case "SUCCESS":
        return "bg-green-100 text-green-700";

      case "PENDING":
        return "bg-yellow-100 text-yellow-700";

      case "FAILED":
        return "bg-red-100 text-red-700";

      case "REFUNDED":
        return "bg-purple-100 text-purple-700";

      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "SUCCESS":
        return <CheckCircle className="w-4 h-4" />;

      case "PENDING":
        return <Clock className="w-4 h-4" />;

      case "FAILED":
        return <XCircle className="w-4 h-4" />;

      case "REFUNDED":
        return <RotateCcw className="w-4 h-4" />;

      default:
        return null;
    }
  };

  const formatDate = (date) => {
    if (!date) return "-";

    return new Date(date).toLocaleString("en-IN", {
      dateStyle: "medium",
      timeStyle: "short",
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-3">
            <div className="p-3 bg-green-100 rounded-xl">
              <CreditCard className="w-7 h-7 text-green-600" />
            </div>

            <div>
              <h1 className="text-2xl font-bold text-gray-900">Payments</h1>

              <p className="text-gray-500">
                Manage and monitor all customer payments
              </p>
            </div>
          </div>
        </div>

        <button
          onClick={fetchPayments}
          disabled={loading}
          className="flex items-center justify-center gap-2 px-5 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          Refresh
        </button>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
        <div className="bg-white rounded-xl shadow-sm p-5">
          <p className="text-sm text-gray-500">Total Payments</p>

          <h2 className="text-2xl font-bold text-gray-900 mt-1">
            {statistics.total}
          </h2>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-5">
          <p className="text-sm text-gray-500">Successful</p>

          <h2 className="text-2xl font-bold text-green-600 mt-1">
            {statistics.successful}
          </h2>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-5">
          <p className="text-sm text-gray-500">Pending</p>

          <h2 className="text-2xl font-bold text-yellow-600 mt-1">
            {statistics.pending}
          </h2>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-5">
          <p className="text-sm text-gray-500">Failed</p>

          <h2 className="text-2xl font-bold text-red-600 mt-1">
            {statistics.failed}
          </h2>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-5">
          <p className="text-sm text-gray-500">Successful Revenue</p>

          <h2 className="text-2xl font-bold text-green-600 mt-1 flex items-center">
            <IndianRupee className="w-5 h-5" />

            {statistics.revenue.toLocaleString("en-IN")}
          </h2>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />

            <input
              type="text"
              placeholder="Search payment, booking or Razorpay ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          {/* Status */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            <option value="ALL">All Status</option>
            <option value="SUCCESS">Success</option>
            <option value="PENDING">Pending</option>
            <option value="FAILED">Failed</option>
            <option value="REFUNDED">Refunded</option>
          </select>
        </div>
      </div>

      {/* Payment Table */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <RefreshCw className="w-8 h-8 text-green-600 animate-spin" />
          </div>
        ) : filteredPayments.length === 0 ? (
          <div className="text-center py-16">
            <CreditCard className="w-12 h-12 text-gray-300 mx-auto mb-3" />

            <h3 className="text-lg font-semibold text-gray-700">
              No payments found
            </h3>

            <p className="text-gray-500 mt-1">
              No payment records match your search.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="text-left px-5 py-4 text-sm font-semibold text-gray-600">
                    Payment ID
                  </th>

                  <th className="text-left px-5 py-4 text-sm font-semibold text-gray-600">
                    Booking
                  </th>

                  <th className="text-left px-5 py-4 text-sm font-semibold text-gray-600">
                    Amount
                  </th>

                  <th className="text-left px-5 py-4 text-sm font-semibold text-gray-600">
                    Method
                  </th>

                  <th className="text-left px-5 py-4 text-sm font-semibold text-gray-600">
                    Status
                  </th>

                  <th className="text-left px-5 py-4 text-sm font-semibold text-gray-600">
                    Razorpay Order
                  </th>

                  <th className="text-left px-5 py-4 text-sm font-semibold text-gray-600">
                    Date
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y">
                {filteredPayments.map((payment) => (
                  <tr key={payment.id} className="hover:bg-gray-50 transition">
                    <td className="px-5 py-4 font-medium text-gray-900">
                      #{payment.id}
                    </td>

                    <td className="px-5 py-4 text-gray-700">
                      #{payment.bookingId}
                    </td>

                    <td className="px-5 py-4 font-semibold text-gray-900">
                      ₹{Number(payment.amount || 0).toLocaleString("en-IN")}
                    </td>

                    <td className="px-5 py-4 text-gray-600">
                      {payment.paymentMethod || "-"}
                    </td>

                    <td className="px-5 py-4">
                      <span
                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${getStatusStyle(
                          payment.status
                        )}`}
                      >
                        {getStatusIcon(payment.status)}
                        {payment.status || "UNKNOWN"}
                      </span>
                    </td>

                    <td className="px-5 py-4">
                      <span className="text-xs font-mono text-gray-600">
                        {payment.razorpayOrderId || "-"}
                      </span>
                    </td>

                    <td className="px-5 py-4 text-sm text-gray-600">
                      {formatDate(payment.createdAt)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Result count */}
      {!loading && (
        <div className="mt-4 text-sm text-gray-500">
          Showing {filteredPayments.length} of {payments.length} payments
        </div>
      )}
    </div>
  );
};

export default AdminPaymentsPage;
