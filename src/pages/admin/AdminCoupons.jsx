import React, { useEffect, useState } from "react";
import { Plus, Tag, Power, X, Search } from "lucide-react";
import { toast } from "react-toastify";

import api from "../../services/api";

const AdminCoupons = () => {
  const [coupons, setCoupons] = useState([]);

  const [showForm, setShowForm] = useState(false);

  const [form, setForm] = useState({
    code: "",
    type: "PERCENTAGE",
    value: "",
    expiryDate: "",
    isActive: true,
  });

  // Search / filters
  const [search, setSearch] = useState("");
  const [type, setType] = useState("ALL");
  const [isActive, setIsActive] = useState("ALL");

  // Sorting
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortDir, setSortDir] = useState("desc");

  // Pagination
  const [page, setPage] = useState(0);
  const [size] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchCoupons();
  }, [page, search, type, isActive, sortBy, sortDir]);

  const fetchCoupons = async () => {
    try {
      setLoading(true);

      const params = {
        page,
        size,
        sortBy,
        sortDir,
      };

      if (search.trim()) {
        params.search = search.trim();
      }

      if (type !== "ALL") {
        params.type = type;
      }

      if (isActive !== "ALL") {
        params.isActive = isActive === "true";
      }

      const response = await api.get("/coupons", {
        params,
      });

      const data = response.data?.data;

      setCoupons(data?.content || []);
      setTotalPages(data?.totalPages || 0);
      setTotalElements(data?.totalElements || 0);
    } catch (error) {
      console.error("Fetch coupons error:", error);

      toast.error(error.response?.data?.message || "Unable to load coupons");

      setCoupons([]);
      setTotalPages(0);
      setTotalElements(0);
    } finally {
      setLoading(false);
    }
  };

  const createCoupon = async (e) => {
    e.preventDefault();

    try {
      await api.post("/coupons", {
        ...form,
        value: Number(form.value),
      });

      toast.success("Coupon created successfully");

      setShowForm(false);

      setForm({
        code: "",
        type: "PERCENTAGE",
        value: "",
        expiryDate: "",
        isActive: true,
      });

      setPage(0);
      fetchCoupons();
    } catch (error) {
      toast.error(error.response?.data?.message || "Unable to create coupon");
    }
  };

  const toggleCoupon = async (coupon) => {
    try {
      await api.put(
        `/coupons/${coupon.code}/${coupon.isActive ? "deactivate" : "activate"}`
      );

      toast.success(
        coupon.isActive ? "Coupon deactivated" : "Coupon activated"
      );

      fetchCoupons();
    } catch (error) {
      toast.error(error.response?.data?.message || "Unable to update coupon");
    }
  };

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    setPage(0);
  };

  const handleTypeChange = (e) => {
    setType(e.target.value);
    setPage(0);
  };

  const handleActiveChange = (e) => {
    setIsActive(e.target.value);
    setPage(0);
  };

  const handleSortChange = (e) => {
    const value = e.target.value;

    if (value === "expirySoon") {
      setSortBy("expiryDate");
      setSortDir("asc");
    } else if (value === "expiryLate") {
      setSortBy("expiryDate");
      setSortDir("desc");
    } else if (value === "valueLow") {
      setSortBy("value");
      setSortDir("asc");
    } else if (value === "valueHigh") {
      setSortBy("value");
      setSortDir("desc");
    } else if (value === "oldest") {
      setSortBy("createdAt");
      setSortDir("asc");
    } else {
      setSortBy("createdAt");
      setSortDir("desc");
    }

    setPage(0);
  };

  const handlePreviousPage = () => {
    if (page > 0) {
      setPage((previous) => previous - 1);
    }
  };

  const handleNextPage = () => {
    if (page < totalPages - 1) {
      setPage((previous) => previous + 1);
    }
  };

  return (
    <div>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">
            Coupon Management
          </h2>

          <p className="text-gray-500 mt-1">
            Create and manage promotional coupons.
          </p>
        </div>

        <button
          onClick={() => setShowForm(true)}
          className="px-5 py-3 rounded-full bg-green-600 text-white font-semibold flex gap-2 items-center"
        >
          <Plus className="w-5 h-5" />
          Create Coupon
        </button>
      </div>

      {/* Search / Filters */}
      <div className="bg-white rounded-xl shadow p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />

            <input
              value={search}
              onChange={handleSearchChange}
              placeholder="Search coupon code..."
              className="w-full pl-11 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-green-500 focus:outline-none"
            />
          </div>

          {/* Type */}
          <select
            value={type}
            onChange={handleTypeChange}
            className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-green-500 focus:outline-none"
          >
            <option value="ALL">All Types</option>
            <option value="PERCENTAGE">Percentage</option>
            <option value="FLAT">Flat</option>
          </select>

          {/* Active */}
          <select
            value={isActive}
            onChange={handleActiveChange}
            className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-green-500 focus:outline-none"
          >
            <option value="ALL">All Coupons</option>
            <option value="true">Active Only</option>
            <option value="false">Inactive Only</option>
          </select>

          {/* Sort */}
          <select
            defaultValue="latest"
            onChange={handleSortChange}
            className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-green-500 focus:outline-none"
          >
            <option value="latest">Latest</option>
            <option value="oldest">Oldest</option>
            <option value="expirySoon">Expiry: Soonest</option>
            <option value="expiryLate">Expiry: Latest</option>
            <option value="valueLow">Value: Low to High</option>
            <option value="valueHigh">Value: High to Low</option>
          </select>
        </div>

        <div className="mt-4 text-sm text-gray-500">
          {loading
            ? "Loading coupons..."
            : `${totalElements} coupon${totalElements !== 1 ? "s" : ""} found`}
        </div>
      </div>

      {showForm && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-5">
          <form
            onSubmit={createCoupon}
            className="bg-white rounded-3xl p-7 w-full max-w-lg shadow-xl"
          >
            <div className="flex justify-between mb-6">
              <h3 className="text-xl font-bold">Create Coupon</h3>

              <button type="button" onClick={() => setShowForm(false)}>
                <X />
              </button>
            </div>

            <div className="space-y-4">
              <Input
                label="Coupon Code"
                value={form.code}
                onChange={(e) =>
                  setForm({
                    ...form,
                    code: e.target.value,
                  })
                }
              />

              <div>
                <label className="block font-semibold text-sm mb-2">Type</label>

                <select
                  value={form.type}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      type: e.target.value,
                    })
                  }
                  className="w-full border rounded-xl px-4 py-3"
                >
                  <option value="PERCENTAGE">Percentage</option>

                  <option value="FLAT">Flat</option>
                </select>
              </div>

              <Input
                label="Value"
                type="number"
                value={form.value}
                onChange={(e) =>
                  setForm({
                    ...form,
                    value: e.target.value,
                  })
                }
              />

              <div>
                <label className="block font-semibold text-sm mb-2">
                  Expiry Date
                </label>

                <input
                  type="date"
                  value={form.expiryDate}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      expiryDate: e.target.value,
                    })
                  }
                  required
                  className="w-full border rounded-xl px-4 py-3"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full mt-6 bg-green-600 text-white py-3 rounded-full font-semibold"
            >
              Create Coupon
            </button>
          </form>
        </div>
      )}

      {/* Coupons */}
      {loading ? (
        <div className="bg-white rounded-2xl shadow p-10 text-center text-gray-500">
          Loading coupons...
        </div>
      ) : coupons.length === 0 ? (
        <div className="bg-white rounded-2xl shadow p-10 text-center text-gray-500">
          No coupons found.
        </div>
      ) : (
        <>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {coupons.map((coupon) => (
              <div
                key={coupon.code}
                className="bg-white rounded-2xl shadow p-6"
              >
                <div className="flex justify-between">
                  <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center">
                    <Tag className="text-green-600" />
                  </div>

                  <span className="px-3 py-1 h-fit rounded-full bg-green-100 text-green-700 text-xs font-semibold">
                    {coupon.isActive ? "ACTIVE" : "INACTIVE"}
                  </span>
                </div>

                <h3 className="text-xl font-bold mt-5">{coupon.code}</h3>

                <p className="text-green-600 font-semibold mt-1">
                  {coupon.type === "PERCENTAGE"
                    ? `${coupon.value}% OFF`
                    : `₹${coupon.value} OFF`}
                </p>

                <p className="text-sm text-gray-500 mt-3">
                  Expires: {coupon.expiryDate}
                </p>

                <button
                  onClick={() => toggleCoupon(coupon)}
                  className="mt-5 w-full py-2 rounded-xl bg-gray-100 flex justify-center gap-2"
                >
                  <Power className="w-4 h-4" />

                  {coupon.isActive ? "Deactivate" : "Activate"}
                </button>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-4 mt-8 mb-4">
              <button
                type="button"
                onClick={handlePreviousPage}
                disabled={page === 0 || loading}
                className="px-5 py-2.5 rounded-full border border-green-600 text-green-700 font-semibold disabled:opacity-40 disabled:cursor-not-allowed hover:bg-green-50"
              >
                Previous
              </button>

              <span className="text-sm font-medium text-gray-600">
                Page {page + 1} of {totalPages}
              </span>

              <button
                type="button"
                onClick={handleNextPage}
                disabled={page >= totalPages - 1 || loading}
                className="px-5 py-2.5 rounded-full bg-green-600 text-white font-semibold disabled:opacity-40 disabled:cursor-not-allowed hover:bg-green-700"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

const Input = ({ label, value, onChange, type = "text" }) => (
  <div>
    <label className="block font-semibold text-sm mb-2">{label}</label>

    <input
      type={type}
      value={value}
      onChange={onChange}
      required
      className="w-full border rounded-xl px-4 py-3"
    />
  </div>
);

export default AdminCoupons;
