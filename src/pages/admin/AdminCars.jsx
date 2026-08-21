import React, { useEffect, useState } from "react";
import { CarFront, Edit, Plus, Power, Search, Trash2, X } from "lucide-react";
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
  imageUrl: "",
};

const AdminCars = () => {
  const [cars, setCars] = useState([]);
  const [form, setForm] = useState(emptyCar);
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchCars();
  }, []);

  const fetchCars = async () => {
    try {
      const response = await api.get("/cars");
      setCars(response.data?.data || []);
    } catch (error) {
      toast.error(error.response?.data?.message || "Unable to load cars");
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
      imageUrl: car.imageUrl || "",
    });

    setShowForm(true);
  };

  const submit = async (e) => {
    e.preventDefault();

    try {
      const payload = {
        ...form,
        pricePerDay: Number(form.pricePerDay),
        batteryLevel: Number(form.batteryLevel),
        rangeKm: Number(form.rangeKm),
        locationId: Number(form.locationId),
        seatingCapacity: form.seatingCapacity
          ? Number(form.seatingCapacity)
          : null,
      };

      if (editingId) {
        await api.put(`/cars/${editingId}`, payload);

        toast.success("Car updated successfully");
      } else {
        await api.post("/cars", payload);

        toast.success("Car created successfully");
      }

      setShowForm(false);
      fetchCars();
    } catch (error) {
      toast.error(error.response?.data?.message || "Unable to save car");
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

  const updateStatus = async (car, status) => {
    try {
      await api.put(`/cars/${car.id}/status`, null, {
        params: { status },
      });

      toast.success("Car status updated");

      fetchCars();
    } catch (error) {
      toast.error(error.response?.data?.message || "Unable to update status");
    }
  };

  const filteredCars = cars.filter((car) => {
    const value = search.toLowerCase();

    return (
      car.name?.toLowerCase().includes(value) ||
      car.category?.toLowerCase().includes(value) ||
      car.registrationNumber?.toLowerCase().includes(value)
    );
  });

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
        <div className="relative max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />

          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search cars..."
            className="w-full pl-11 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-green-500 focus:outline-none"
          />
        </div>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-5">
          <div className="bg-white rounded-3xl shadow-xl w-full max-w-3xl max-h-[90vh] overflow-auto">
            <div className="p-6 border-b flex justify-between items-center">
              <h3 className="text-xl font-bold">
                {editingId ? "Edit Car" : "Add New Car"}
              </h3>

              <button onClick={() => setShowForm(false)}>
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
                <Input
                  label="Image URL"
                  name="imageUrl"
                  value={form.imageUrl}
                  onChange={handleChange}
                />
              </div>

              <div className="md:col-span-2 flex gap-3">
                <button
                  type="submit"
                  className="flex-1 bg-green-600 text-white py-3 rounded-full font-semibold"
                >
                  {editingId ? "Update Car" : "Create Car"}
                </button>

                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="px-6 py-3 rounded-full bg-gray-100"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredCars.map((car) => (
          <div
            key={car.id}
            className="bg-white rounded-2xl shadow overflow-hidden"
          >
            <div className="h-40 bg-gradient-to-br from-green-100 to-blue-50 flex items-center justify-center">
              {car.imageUrl ? (
                <img
                  src={car.imageUrl}
                  alt={car.name}
                  className="w-full h-full object-cover"
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
