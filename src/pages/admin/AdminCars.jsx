import React, { useEffect, useState } from "react";
import { CarFront, Edit, Plus, Power, Search, X } from "lucide-react";
import { toast } from "react-toastify";

import api from "../../services/api";

const emptyCar = {
  name: "",
  category: "",
  registrationNumber: "",
  pricePerDay: "",
  batteryLevel: 100,
  rangeKm: "",
  locationId: "",
  seatingCapacity: "",
};

const AdminCars = () => {
  const [cars, setCars] = useState([]);
  const [form, setForm] = useState(emptyCar);
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("ALL");
  const [status, setStatus] = useState("ALL");
  const [isActive, setIsActive] = useState("ALL");

  const [sortBy, setSortBy] = useState("createdAt");
  const [sortDir, setSortDir] = useState("desc");

  const [page, setPage] = useState(0);
  const [size] = useState(9);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchCars();
  }, [page, search, category, status, isActive, sortBy, sortDir]);

  const fetchCars = async () => {
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

      if (category !== "ALL") {
        params.category = category;
      }

      if (status !== "ALL") {
        params.status = status;
      }

      if (isActive !== "ALL") {
        params.isActive = isActive === "true";
      }

      const response = await api.get("/cars", {
        params,
      });

      const data = response.data?.data;

      setCars(data?.content || []);
      setTotalPages(data?.totalPages || 0);
      setTotalElements(data?.totalElements || 0);
    } catch (error) {
      console.error("Fetch cars error:", error);

      toast.error(error.response?.data?.message || "Unable to load cars");

      setCars([]);
      setTotalPages(0);
      setTotalElements(0);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const openCreate = () => {
    setForm(emptyCar);
    setEditingId(null);

    setImageFile(null);
    setImagePreview("");

    setShowForm(true);
  };

  const openEdit = (car) => {
    setEditingId(car.id);

    setForm({
      name: car.name || "",
      category: car.category || "",
      registrationNumber: car.registrationNumber || "",
      pricePerDay: car.pricePerDay || "",
      batteryLevel: car.batteryLevel ?? 100,
      rangeKm: car.rangeKm || "",
      locationId: car.locationId || "",
      seatingCapacity: car.seatingCapacity || "",
    });

    setImageFile(null);

    setImagePreview(car.imageUrl || "");

    setShowForm(true);
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];

    if (!file) {
      return;
    }

    const allowedTypes = ["image/jpeg", "image/png", "image/webp"];

    if (!allowedTypes.includes(file.type)) {
      toast.error("Only JPG, PNG or WebP images are allowed");

      e.target.value = "";
      return;
    }

    const maxSize = 5 * 1024 * 1024;

    if (file.size > maxSize) {
      toast.error("Image must be smaller than 5 MB");

      e.target.value = "";
      return;
    }

    if (imagePreview && imagePreview.startsWith("blob:")) {
      URL.revokeObjectURL(imagePreview);
    }

    const previewUrl = URL.createObjectURL(file);

    setImageFile(file);
    setImagePreview(previewUrl);
  };

  const closeForm = () => {
    if (imagePreview && imagePreview.startsWith("blob:")) {
      URL.revokeObjectURL(imagePreview);
    }

    setShowForm(false);
    setEditingId(null);
    setForm(emptyCar);
    setImageFile(null);
    setImagePreview("");
  };

  const submit = async (e) => {
    e.preventDefault();

    if (!editingId && !imageFile) {
      toast.error("Please select a car image");
      return;
    }

    try {
      setSaving(true);

      const carData = {
        ...form,

        pricePerDay: Number(form.pricePerDay),

        batteryLevel: Number(form.batteryLevel),

        rangeKm: Number(form.rangeKm),

        locationId: Number(form.locationId),

        seatingCapacity: form.seatingCapacity
          ? Number(form.seatingCapacity)
          : null,
      };

      delete carData.imageUrl;

      const formData = new FormData();

      formData.append(
        "car",
        new Blob([JSON.stringify(carData)], {
          type: "application/json",
        })
      );

      if (imageFile) {
        formData.append("image", imageFile);
      }

      if (editingId) {
        await api.put(`/cars/${editingId}`, formData);

        toast.success("Car updated successfully");
      } else {
        await api.post("/cars", formData);

        toast.success("Car created successfully");
      }

      closeForm();

      setPage(0);

      fetchCars();
    } catch (error) {
      console.error("Save car error:", error);

      toast.error(error.response?.data?.message || "Unable to save car");
    } finally {
      setSaving(false);
    }
  };

  const changeActive = async (car) => {
    try {
      await api.put(
        `/cars/${car.id}/${car.isActive ? "deactivate" : "activate"}`
      );

      toast.success(car.isActive ? "Car deactivated" : "Car activated");

      fetchCars();
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Unable to change car status"
      );
    }
  };

  const updateStatus = async (car, newStatus) => {
    try {
      await api.put(`/cars/${car.id}/status`, null, {
        params: {
          status: newStatus,
        },
      });

      toast.success("Car status updated");

      fetchCars();
    } catch (error) {
      toast.error(error.response?.data?.message || "Unable to update status");
    }
  };

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    setPage(0);
  };

  const handleCategoryChange = (e) => {
    setCategory(e.target.value);
    setPage(0);
  };

  const handleStatusChange = (e) => {
    setStatus(e.target.value);
    setPage(0);
  };

  const handleActiveChange = (e) => {
    setIsActive(e.target.value);
    setPage(0);
  };

  const handleSortChange = (e) => {
    const value = e.target.value;

    if (value === "priceLow") {
      setSortBy("pricePerDay");
      setSortDir("asc");
    } else if (value === "priceHigh") {
      setSortBy("pricePerDay");
      setSortDir("desc");
    } else if (value === "nameAsc") {
      setSortBy("name");
      setSortDir("asc");
    } else if (value === "nameDesc") {
      setSortBy("name");
      setSortDir("desc");
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

  const getImageUrl = (imageUrl) => {
    if (!imageUrl) return "";

    if (imageUrl.startsWith("http://") || imageUrl.startsWith("https://")) {
      return imageUrl;
    }

    return `http://localhost:8080${imageUrl}`;
  };

  return (
    <div>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Car Management</h2>

          <p className="text-gray-500 mt-1">
            Add, edit and manage your electric fleet.
          </p>
        </div>

        <button
          onClick={openCreate}
          className="bg-green-600 text-white px-5 py-3 rounded-full font-semibold flex items-center justify-center gap-2 hover:bg-green-700"
        >
          <Plus className="w-5 h-5" />
          Add Car
        </button>
      </div>

      <div className="bg-white rounded-xl shadow p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-4">
          <div className="relative xl:col-span-2">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />

            <input
              value={search}
              onChange={handleSearchChange}
              placeholder="Search cars..."
              className="w-full pl-11 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-green-500 focus:outline-none"
            />
          </div>

          <select
            value={category}
            onChange={handleCategoryChange}
            className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-green-500 focus:outline-none"
          >
            <option value="ALL">All Categories</option>

            <option value="SEDAN">SEDAN</option>

            <option value="SUV">SUV</option>

            <option value="HATCHBACK">HATCHBACK</option>

            <option value="LUXURY">LUXURY</option>
          </select>

          <select
            value={status}
            onChange={handleStatusChange}
            className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-green-500 focus:outline-none"
          >
            <option value="ALL">All Status</option>

            <option value="AVAILABLE">AVAILABLE</option>

            <option value="BOOKED">BOOKED</option>

            <option value="IN_USE">IN_USE</option>

            <option value="CHARGING">CHARGING</option>

            <option value="MAINTENANCE">MAINTENANCE</option>

            <option value="INACTIVE">INACTIVE</option>
          </select>

          <select
            value={isActive}
            onChange={handleActiveChange}
            className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-green-500 focus:outline-none"
          >
            <option value="ALL">All Cars</option>

            <option value="true">Active Only</option>

            <option value="false">Inactive Only</option>
          </select>
        </div>

        <div className="mt-4 flex flex-col sm:flex-row gap-4">
          <select
            defaultValue="latest"
            onChange={handleSortChange}
            className="w-full sm:w-64 px-4 py-3 border rounded-xl focus:ring-2 focus:ring-green-500 focus:outline-none"
          >
            <option value="latest">Latest</option>

            <option value="priceLow">Price: Low to High</option>

            <option value="priceHigh">Price: High to Low</option>

            <option value="nameAsc">Name: A to Z</option>

            <option value="nameDesc">Name: Z to A</option>
          </select>

          <div className="flex items-center text-sm text-gray-500">
            {loading
              ? "Loading cars..."
              : `${totalElements} car${totalElements !== 1 ? "s" : ""} found`}
          </div>
        </div>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-5">
          <div className="bg-white rounded-3xl shadow-xl w-full max-w-3xl max-h-[90vh] overflow-auto">
            <div className="p-6 border-b flex justify-between items-center">
              <h3 className="text-xl font-bold">
                {editingId ? "Edit Car" : "Add New Car"}
              </h3>

              <button type="button" onClick={closeForm}>
                <X />
              </button>
            </div>

            <form onSubmit={submit} className="p-6 grid md:grid-cols-2 gap-5">
              <Input
                label="Car Name"
                name="name"
                value={form.name}
                onChange={handleChange}
              />

              <Input
                label="Category"
                name="category"
                value={form.category}
                onChange={handleChange}
              />

              <Input
                label="Registration Number"
                name="registrationNumber"
                value={form.registrationNumber}
                onChange={handleChange}
              />

              <Input
                label="Price Per Day"
                name="pricePerDay"
                type="number"
                value={form.pricePerDay}
                onChange={handleChange}
              />

              <Input
                label="Battery Level"
                name="batteryLevel"
                type="number"
                value={form.batteryLevel}
                onChange={handleChange}
              />

              <Input
                label="Range KM"
                name="rangeKm"
                type="number"
                value={form.rangeKm}
                onChange={handleChange}
              />

              <Input
                label="Location ID"
                name="locationId"
                type="number"
                value={form.locationId}
                onChange={handleChange}
              />

              <Input
                label="Seating Capacity"
                name="seatingCapacity"
                type="number"
                value={form.seatingCapacity}
                onChange={handleChange}
              />

              <div className="md:col-span-2">
                <label className="block text-sm font-semibold mb-2">
                  Car Image
                </label>

                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={handleImageChange}
                  className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-green-500 focus:outline-none"
                />

                <p className="text-xs text-gray-500 mt-2">
                  JPG, PNG or WebP. Maximum 5 MB.
                </p>

                {editingId && !imageFile && imagePreview && (
                  <p className="text-xs text-gray-500 mt-2">
                    Current image is being used. Select a new file only if you
                    want to replace it.
                  </p>
                )}

                {imagePreview && (
                  <div className="mt-4">
                    <img
                      src={imagePreview}
                      alt="Car preview"
                      className="w-full h-48 object-cover rounded-xl border"
                    />
                  </div>
                )}
              </div>

              <div className="md:col-span-2 flex gap-3">
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 bg-green-600 text-white py-3 rounded-full font-semibold disabled:bg-green-300"
                >
                  {saving
                    ? "Saving..."
                    : editingId
                    ? "Update Car"
                    : "Create Car"}
                </button>

                <button
                  type="button"
                  onClick={closeForm}
                  disabled={saving}
                  className="px-6 py-3 rounded-full bg-gray-100 disabled:opacity-50"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {loading ? (
        <div className="bg-white rounded-2xl shadow p-10 text-center text-gray-500">
          Loading cars...
        </div>
      ) : cars.length === 0 ? (
        <div className="bg-white rounded-2xl shadow p-10 text-center text-gray-500">
          No cars found.
        </div>
      ) : (
        <>
          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
            {cars.map((car) => (
              <div
                key={car.id}
                className="bg-white rounded-2xl shadow overflow-hidden"
              >
                <div className="h-40 bg-gradient-to-br from-green-100 to-blue-50 flex items-center justify-center">
                  {car.imageUrl ? (
                    <img
                      src={getImageUrl(car.imageUrl)}
                      alt={car.name}
                      loading="lazy"
                      decoding="async"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        console.error("Car image failed:", {
                          imageUrl: car.imageUrl,
                          resolvedUrl: getImageUrl(car.imageUrl),
                        });
                      }}
                      onLoad={() => {
                        console.log(
                          "Car image loaded:",
                          getImageUrl(car.imageUrl)
                        );
                      }}
                    />
                  ) : (
                    <CarFront className="w-20 h-20 text-green-600" />
                  )}
                </div>

                <div className="p-5">
                  <div className="flex justify-between gap-3">
                    <div>
                      <h3 className="font-bold text-lg">{car.name}</h3>

                      <p className="text-green-600">{car.category}</p>
                    </div>

                    <span className="text-xs px-3 py-1 h-fit rounded-full bg-green-100 text-green-700">
                      {car.status}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-3 mt-5 text-sm">
                    <p>
                      Battery:
                      <b> {car.batteryLevel}%</b>
                    </p>

                    <p>
                      Range:
                      <b> {car.rangeKm} km</b>
                    </p>

                    <p>
                      Price:
                      <b> ₹{car.pricePerDay}</b>
                    </p>

                    <p>
                      Location:
                      <b> {car.locationId}</b>
                    </p>
                  </div>

                  <div className="flex gap-2 mt-5">
                    <button
                      onClick={() => openEdit(car)}
                      className="flex-1 bg-green-50 text-green-700 py-2 rounded-lg flex justify-center gap-2"
                    >
                      <Edit className="w-4 h-4" />
                      Edit
                    </button>

                    <button
                      onClick={() => changeActive(car)}
                      className="px-4 bg-gray-100 rounded-lg"
                      title="Activate / Deactivate"
                    >
                      <Power className="w-4 h-4" />
                    </button>
                  </div>

                  <select
                    value={car.status || ""}
                    onChange={(e) => updateStatus(car, e.target.value)}
                    className="w-full mt-3 border rounded-lg px-3 py-2"
                  >
                    <option value="">Update status</option>

                    <option value="AVAILABLE">AVAILABLE</option>

                    <option value="BOOKED">BOOKED</option>

                    <option value="IN_USE">IN_USE</option>

                    <option value="CHARGING">CHARGING</option>

                    <option value="MAINTENANCE">MAINTENANCE</option>

                    <option value="INACTIVE">INACTIVE</option>
                  </select>
                </div>
              </div>
            ))}
          </div>

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

const Input = ({ label, name, value, onChange, type = "text" }) => (
  <div>
    <label className="block text-sm font-semibold mb-2">{label}</label>

    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      required
      className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-green-500 focus:outline-none"
    />
  </div>
);

export default AdminCars;
