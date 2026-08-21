import React, { useEffect, useState } from "react";
import { Plus, Tag, Power, X } from "lucide-react";
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

  useEffect(() => {
    fetchCoupons();
  }, []);

  const fetchCoupons = async () => {
    try {
      const response = await api.get("/coupons");

      setCoupons(response.data?.data || []);
    } catch (error) {
      toast.error(error.response?.data?.message || "Unable to load coupons");
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

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
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

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {coupons.map((coupon) => (
          <div key={coupon.code} className="bg-white rounded-2xl shadow p-6">
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
