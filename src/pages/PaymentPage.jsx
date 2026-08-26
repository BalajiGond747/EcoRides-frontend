import React, { useState } from "react";
import {
  ArrowLeft,
  CheckCircle2,
  CreditCard,
  Loader2,
  Receipt,
  ShieldCheck,
} from "lucide-react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import api from "../services/api";

const PaymentPage = () => {
  const { bookingId } = useParams();
  const navigate = useNavigate();

  const [payment, setPayment] = useState(null);

  const [loading, setLoading] = useState(false);
  const [verifying, setVerifying] = useState(false);

  const [paymentResponse, setPaymentResponse] = useState(null);

  const [paymentSuccess, setPaymentSuccess] = useState(false);

  const createPaymentOrder = async () => {
    if (!bookingId) {
      toast.error("Booking ID is missing.");
      return;
    }

    try {
      setLoading(true);

      const response = await api.post(`/payments/create-order/${bookingId}`);

      const data = response.data?.data;

      if (!data) {
        throw new Error("Payment order information was not returned.");
      }

      setPayment(data);

      toast.success(
        response.data?.message || "Payment order created successfully"
      );

      openRazorpayCheckout(data);
    } catch (error) {
      console.error("Create payment order error:", error);

      toast.error(
        error.response?.data?.message || "Unable to create payment order"
      );
    } finally {
      setLoading(false);
    }
  };

  const openRazorpayCheckout = (paymentData) => {
    if (!window.Razorpay) {
      toast.error("Razorpay Checkout is not loaded. Please refresh the page.");

      console.error("window.Razorpay is undefined.");

      return;
    }

    if (!paymentData.razorpayOrderId) {
      toast.error("Razorpay order ID is missing.");

      return;
    }

    if (!paymentData.key) {
      toast.error("Razorpay key ID is missing.");

      return;
    }

    const options = {
      key: paymentData.key,

      amount: Math.round(Number(paymentData.amount) * 100),

      currency: "INR",

      name: "EcoRide",

      description: `Payment for Booking #${bookingId}`,

      order_id: paymentData.razorpayOrderId,

      handler: function (response) {
        console.log("Razorpay payment response:", response);

        setPaymentResponse(response);

        toast.success("Payment completed. Verifying payment...");

        verifyRazorpayPayment(paymentData, response);
      },

      prefill: {
        name: "",
        email: "",
        contact: "",
      },

      notes: {
        bookingId: String(bookingId),
      },

      theme: {
        color: "#059669",
      },

      modal: {
        ondismiss: function () {
          toast.info("Payment window closed.");
        },
      },
    };

    const razorpay = new window.Razorpay(options);

    razorpay.on("payment.failed", function (response) {
      console.error("Razorpay payment failed:", response);

      toast.error(response.error?.description || "Payment failed.");
    });

    razorpay.open();
  };

  const verifyRazorpayPayment = async (paymentData, razorpayResponse) => {
    if (!paymentData) {
      toast.error("Payment order information is missing.");

      return;
    }

    if (!razorpayResponse) {
      toast.error("Razorpay response is missing.");

      return;
    }

    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
      razorpayResponse;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      console.error("Incomplete Razorpay response:", razorpayResponse);

      toast.error("Razorpay verification details are incomplete.");

      return;
    }

    try {
      setVerifying(true);

      const payload = {
        bookingId: Number(bookingId),

        amount: paymentData.amount,

        paymentMethod: "RAZORPAY",

        razorpayOrderId: razorpay_order_id,

        razorpayPaymentId: razorpay_payment_id,

        razorpaySignature: razorpay_signature,
      };

      console.log("Payment verification payload:", payload);

      const response = await api.post("/payments/verify", payload);

      console.log("Payment verification response:", response.data);

      setPaymentSuccess(true);

      setPayment((previous) => ({
        ...previous,
        status: "SUCCESS",
        razorpayPaymentId: razorpay_payment_id,
        razorpaySignature: razorpay_signature,
      }));

      toast.success(response.data?.message || "Payment verified successfully!");

      setTimeout(() => {
        navigate(`/bookings/${bookingId}`);
      }, 1500);
    } catch (error) {
      console.error("Payment verification error:", error);

      toast.error(
        error.response?.data?.message || "Payment verification failed."
      );
    } finally {
      setVerifying(false);
    }
  };

  const handleManualVerify = async () => {
    if (!payment || !paymentResponse) {
      toast.error("Complete the Razorpay payment first.");

      return;
    }

    await verifyRazorpayPayment(payment, paymentResponse);
  };

  return (
    <PageShell>
      <main className="flex-grow px-4 py-10">
        <div className="max-w-xl mx-auto">
          <Link
            to={`/bookings/${bookingId}`}
            className="inline-flex items-center gap-2 text-emerald-600 font-semibold mb-6 hover:text-emerald-700"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Booking
          </Link>

          <div className="bg-white rounded-3xl shadow-xl border border-emerald-100 p-7">
            <div className="w-16 h-16 rounded-2xl bg-emerald-100 flex items-center justify-center mx-auto">
              <CreditCard className="w-8 h-8 text-emerald-600" />
            </div>

            <h1 className="text-2xl font-bold text-center mt-5">
              Complete Payment
            </h1>

            <p className="text-gray-500 text-center mt-2">
              Booking #{bookingId}
            </p>

            <div className="mt-7 bg-emerald-50 border border-emerald-100 rounded-2xl p-5">
              <div className="flex items-start gap-3">
                <ShieldCheck className="w-6 h-6 text-emerald-600 flex-shrink-0 mt-0.5" />

                <div>
                  <p className="font-semibold text-gray-800">
                    Secure Razorpay Payment
                  </p>

                  <p className="text-sm text-gray-600 mt-1">
                    You'll be redirected to Razorpay's secure checkout where you
                    can choose UPI, Card, Net Banking and other available
                    payment methods.
                  </p>
                </div>
              </div>
            </div>

            {payment && (
              <div className="mt-7 space-y-5">
                <div>
                  <p className="text-sm text-gray-500">Amount</p>

                  <p className="text-3xl font-bold text-emerald-600">
                    ₹{Number(payment.amount || 0).toLocaleString("en-IN")}
                  </p>
                </div>

                <div className="bg-gray-50 rounded-2xl p-4">
                  <div className="flex items-start gap-3">
                    <Receipt className="w-5 h-5 text-gray-500 mt-1" />

                    <div className="min-w-0">
                      <p className="text-sm text-gray-500">Razorpay Order ID</p>

                      <p className="font-semibold text-gray-800 break-all mt-1">
                        {payment.razorpayOrderId || "—"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {!payment && !paymentSuccess && (
              <button
                type="button"
                onClick={createPaymentOrder}
                disabled={loading}
                className="w-full mt-8 py-3.5 rounded-full bg-emerald-600 text-white font-semibold hover:bg-emerald-700 disabled:bg-emerald-300 disabled:cursor-not-allowed transition"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Creating Payment Order...
                  </span>
                ) : (
                  "Pay with Razorpay"
                )}
              </button>
            )}

            {paymentResponse && !paymentSuccess && (
              <div className="mt-6 bg-green-50 border border-green-200 rounded-2xl p-5">
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="w-7 h-7 text-green-600" />

                  <div>
                    <p className="font-semibold text-green-700">
                      Payment completed
                    </p>

                    <p className="text-sm text-gray-600 mt-1">Payment ID:</p>

                    <p className="text-xs font-mono break-all text-gray-700">
                      {paymentResponse.razorpay_payment_id}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {verifying && (
              <div className="mt-6 bg-blue-50 border border-blue-200 rounded-2xl p-5">
                <div className="flex items-center justify-center gap-3">
                  <Loader2 className="w-6 h-6 text-blue-600 animate-spin" />

                  <p className="font-semibold text-blue-700">
                    Verifying payment...
                  </p>
                </div>
              </div>
            )}

            {paymentResponse && !paymentSuccess && !verifying && (
              <button
                type="button"
                onClick={handleManualVerify}
                className="w-full mt-5 py-3 rounded-full bg-green-600 text-white font-semibold hover:bg-green-700 transition"
              >
                <span className="flex items-center justify-center gap-2">
                  <CheckCircle2 className="w-5 h-5" />
                  Verify Payment
                </span>
              </button>
            )}

            {paymentSuccess && (
              <div className="mt-7 bg-green-50 border border-green-200 rounded-2xl p-6 text-center">
                <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-8 h-8 text-green-600" />
                </div>

                <h2 className="text-xl font-bold text-green-700 mt-4">
                  Payment Successful
                </h2>

                <p className="text-gray-600 mt-2">
                  Your booking has been confirmed.
                </p>

                <p className="text-sm text-gray-500 mt-3">
                  Redirecting to your booking...
                </p>
              </div>
            )}

            {!paymentSuccess && (
              <p className="text-xs text-gray-400 text-center mt-6">
                Payments are processed securely through Razorpay.
              </p>
            )}
          </div>
        </div>
      </main>
    </PageShell>
  );
};

const PageShell = ({ children }) => (
  <div className="min-h-screen flex flex-col bg-gradient-to-br from-emerald-50 via-white to-green-50">
    <Navbar />

    {children}

    <Footer />
  </div>
);

export default PaymentPage;
