import React, { useEffect, useState } from "react";
import { ArrowLeft, CalendarDays, CarFront, Loader2, Tag } from "lucide-react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import api from "../services/api";
import { getCurrentUser } from "../services/auth";

const CreateBookingPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const currentUser = getCurrentUser();

  const carId = searchParams.get("carId");
  const locationId = searchParams.get("locationId");

  const [car, setCar] = useState(null);
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingCoupons, setLoadingCoupons] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    startTime: "",
    endTime: "",
    couponCode: "",
  });

  useEffect(() => {
    if (!carId) {
      toast.error("Car is required");
      navigate("/cars");
      return;
    }

    fetchCar();
    fetchCoupons();
  }, [carId]);

  const fetchCar = async () => {
    try {
      setLoading(true);

      const response = await api.get(`/cars/${carId}`);

      setCar(response.data?.data);
    } catch (error) {
      toast.error(error.response?.data?.message || "Unable to fetch car");

      navigate("/cars");
    } finally {
      setLoading(false);
    }
  };

  const fetchCoupons = async () => {
    try {
      setLoadingCoupons(true);

      const response = await api.get("/coupons", {
        params: {
          page: 0,
          size: 100,
          isActive: true,
        },
      });

      const data = response.data?.data;
      const activeCoupons = Array.isArray(data) ? data : data?.content || [];

      setCoupons(activeCoupons);
    } catch (error) {
      console.error("Unable to load coupons:", error);
      setCoupons([]);
    } finally {
      setLoadingCoupons(false);
    }
  };

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleCouponSelect = (code) => {
    setFormData((prev) => ({
      ...prev,
      couponCode: code,
    }));

    toast.success(`Coupon ${code} selected`);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!currentUser?.userId) {
      toast.error("Please login again");
      navigate("/login");
      return;
    }

    if (!formData.startTime || !formData.endTime) {
      toast.error("Select start and end time");
      return;
    }

    const start = new Date(formData.startTime);
    const end = new Date(formData.endTime);

    if (start <= new Date()) {
      toast.error("Start time must be in the future");
      return;
    }

    if (end <= start) {
      toast.error("End time must be after start time");
      return;
    }

    try {
      setSubmitting(true);

      const response = await api.post("/bookings", {
        userId: currentUser.userId,
        carId: Number(carId),
        locationId: Number(locationId || car?.locationId),
        couponCode: formData.couponCode.trim() || null,
        startTime: formatLocalDateTime(formData.startTime),
        endTime: formatLocalDateTime(formData.endTime),
      });

      const booking = response.data?.data;

      toast.success(response.data?.message || "Booking created successfully");

      if (booking?.id) {
        navigate(`/bookings/${booking.id}`);
      } else {
        navigate("/bookings");
      }
    } catch (error) {
      console.error("Create booking error:", error);

      toast.error(error.response?.data?.message || "Unable to create booking");
    } finally {
      setSubmitting(false);
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

  return (
    <PageShell>
      <main className="flex-grow px-4 py-10">
        <div className="max-w-3xl mx-auto">
          <Link
            to={`/cars/${carId}`}
            className="inline-flex items-center gap-2
                       text-emerald-600 font-semibold mb-6"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Car
          </Link>

          <div
            className="bg-white rounded-3xl shadow-xl
                          border border-emerald-100 p-6 sm:p-8"
          >
            <div className="flex items-center gap-4 mb-8">
              <div
                className="w-14 h-14 rounded-2xl
                              bg-emerald-100
                              flex items-center justify-center"
              >
                <CarFront className="w-7 h-7 text-emerald-600" />
              </div>

              <div>
                <h1 className="text-2xl font-bold">Book {car?.name}</h1>

                <p className="text-gray-500">₹{car?.pricePerDay} / day</p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <DateInput
                  label="Start Time"
                  name="startTime"
                  value={formData.startTime}
                  onChange={handleChange}
                  disabled={submitting}
                />

                <DateInput
                  label="End Time"
                  name="endTime"
                  value={formData.endTime}
                  onChange={handleChange}
                  disabled={submitting}
                />
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-2">
                  Coupon Code
                  <span className="text-gray-400 font-normal"> (optional)</span>
                </label>

                <div className="flex flex-col sm:flex-row gap-3">
                  <input
                    type="text"
                    name="couponCode"
                    value={formData.couponCode}
                    onChange={handleChange}
                    maxLength={50}
                    placeholder="Enter coupon code"
                    disabled={submitting}
                    className="flex-1 px-4 py-3 rounded-xl
                               border border-gray-300
                               focus:outline-none
                               focus:ring-2 focus:ring-emerald-500"
                  />

                  {formData.couponCode && (
                    <button
                      type="button"
                      onClick={() =>
                        setFormData((prev) => ({ ...prev, couponCode: "" }))
                      }
                      disabled={submitting}
                      className="px-5 py-3 rounded-xl
                                 border border-gray-300
                                 text-gray-600 font-semibold
                                 hover:bg-gray-50
                                 disabled:opacity-50"
                    >
                      Clear
                    </button>
                  )}
                </div>

                <p className="text-xs text-gray-500 mt-2">
                  Choose an available offer below or enter a coupon code
                  manually.
                </p>
              </div>

              {loadingCoupons ? (
                <div className="rounded-2xl border border-emerald-100 bg-emerald-50/50 p-4">
                  <div className="flex items-center gap-2 text-sm text-emerald-700">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Loading available offers...
                  </div>
                </div>
              ) : coupons.length > 0 ? (
                <div className="rounded-2xl border border-emerald-100 bg-emerald-50/50 p-5">
                  <div className="flex items-center gap-2 text-emerald-700">
                    <Tag className="w-5 h-5" />
                    <h2 className="font-bold">Available Offers</h2>
                  </div>

                  <p className="mt-1 text-sm text-gray-500">
                    Select an offer and it will be added to your coupon code.
                  </p>

                  <div className="mt-4 space-y-3">
                    {coupons.map((coupon) => {
                      const isSelected = formData.couponCode === coupon.code;
                      const isPercentage = coupon.type === "PERCENTAGE";
                      const value = Number(coupon.value || 0);

                      return (
                        <div
                          key={coupon.code}
                          className={`flex flex-col gap-3 rounded-xl border bg-white p-4 sm:flex-row sm:items-center sm:justify-between ${
                            isSelected
                              ? "border-emerald-500 ring-2 ring-emerald-100"
                              : "border-gray-200"
                          }`}
                        >
                          <div>
                            <div className="flex items-center gap-3">
                              <span className="font-black text-gray-900">
                                {coupon.code}
                              </span>

                              <span className="rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-bold text-emerald-700">
                                {isPercentage
                                  ? `${value}% OFF`
                                  : `₹${value.toLocaleString("en-IN")} OFF`}
                              </span>
                            </div>

                            {coupon.expiryDate && (
                              <p className="mt-1 text-xs text-gray-500">
                                Valid until{" "}
                                {formatCouponDate(coupon.expiryDate)}
                              </p>
                            )}
                          </div>

                          <button
                            type="button"
                            onClick={() => handleCouponSelect(coupon.code)}
                            disabled={submitting}
                            className={`shrink-0 rounded-lg px-4 py-2 text-sm font-bold transition ${
                              isSelected
                                ? "bg-emerald-600 text-white"
                                : "border border-emerald-200 text-emerald-700 hover:bg-emerald-50"
                            } disabled:opacity-50`}
                          >
                            {isSelected ? "Selected" : "Use Coupon"}
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ) : null}

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3 rounded-full
                           bg-emerald-600 text-white
                           font-semibold hover:bg-emerald-700
                           disabled:bg-emerald-300"
              >
                {submitting ? (
                  <span className="flex items-center justify-center gap-2">
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Creating Booking...
                  </span>
                ) : (
                  "Confirm Booking"
                )}
              </button>
            </form>
          </div>
        </div>
      </main>

      <Footer />
    </PageShell>
  );
};

const DateInput = ({ label, name, value, onChange, disabled }) => (
  <div>
    <label className="block font-semibold text-gray-700 mb-2">{label}</label>

    <div className="relative">
      <CalendarDays
        className="absolute left-4 top-1/2
                   -translate-y-1/2
                   w-5 h-5 text-gray-400"
      />

      <input
        type="datetime-local"
        name={name}
        value={value}
        onChange={onChange}
        required
        disabled={disabled}
        className="w-full pl-12 pr-4 py-3 rounded-xl
                   border border-gray-300
                   focus:outline-none
                   focus:ring-2 focus:ring-emerald-500"
      />
    </div>
  </div>
);

const formatLocalDateTime = (value) => {
  return value.length === 16 ? `${value}:00` : value;
};

const formatCouponDate = (value) => {
  if (!value) {
    return "—";
  }

  return new Date(`${value}T00:00:00`).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
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

export default CreateBookingPage;
