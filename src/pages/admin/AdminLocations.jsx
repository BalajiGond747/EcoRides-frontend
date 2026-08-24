import React, { useEffect, useState } from "react";
import {
  FaMapMarkerAlt,
  FaPlus,
  FaEdit,
  FaPowerOff,
  FaCheckCircle,
  FaTimesCircle,
  FaSave,
  FaTimes,
} from "react-icons/fa";
import { Search } from "lucide-react";
import api from "../../services/api";

const initialForm = {
  name: "",
  city: "",
  state: "",
  address: "",
  pincode: "",
  isActive: true,
};

const AdminLocations = () => {
  const [locations, setLocations] = useState([]);
  const [form, setForm] = useState(initialForm);

  const [editingId, setEditingId] = useState(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Search / filters
  const [search, setSearch] = useState("");
  const [city, setCity] = useState("");
  const [isActive, setIsActive] = useState("ALL");

  // Sorting
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortDir, setSortDir] = useState("desc");

  // Pagination
  const [page, setPage] = useState(0);
  const [size] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);

  const fetchLocations = async () => {
    try {
      setLoading(true);
      setError("");

      const params = {
        page,
        size,
        sortBy,
        sortDir,
      };

      if (search.trim()) {
        params.search = search.trim();
      }

      if (city.trim()) {
        params.city = city.trim();
      }

      if (isActive !== "ALL") {
        params.isActive = isActive === "true";
      }

      const response = await api.get("/locations", {
        params,
      });

      const data = response.data?.data;

      setLocations(data?.content || []);
      setTotalPages(data?.totalPages || 0);
      setTotalElements(data?.totalElements || 0);
    } catch (err) {
      console.error("Fetch locations error:", err);

      setError(err.response?.data?.message || "Failed to load locations.");

      setLocations([]);
      setTotalPages(0);
      setTotalElements(0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLocations();
  }, [page, search, city, isActive, sortBy, sortDir]);

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const resetForm = () => {
    setForm(initialForm);
    setEditingId(null);
    setError("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");
    setSuccess("");

    if (
      !form.name.trim() ||
      !form.city.trim() ||
      !form.state.trim() ||
      !form.address.trim() ||
      !form.pincode.trim()
    ) {
      setError("Please fill all required fields.");
      return;
    }

    if (!/^\d{6}$/.test(form.pincode)) {
      setError("Pincode must contain exactly 6 digits.");
      return;
    }

    try {
      setSaving(true);

      const payload = {
        name: form.name.trim(),
        city: form.city.trim(),
        state: form.state.trim(),
        address: form.address.trim(),
        pincode: form.pincode.trim(),
        isActive: form.isActive,
      };

      if (editingId) {
        await api.put(`/locations/${editingId}`, payload);

        setSuccess("Location updated successfully.");
      } else {
        await api.post("/locations", payload);

        setSuccess("Location created successfully.");
      }

      resetForm();

      setPage(0);

      await fetchLocations();
    } catch (err) {
      console.error("Save location error:", err);

      setError(err.response?.data?.message || "Failed to save location.");
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (location) => {
    setEditingId(location.id);

    setForm({
      name: location.name || "",
      city: location.city || "",
      state: location.state || "",
      address: location.address || "",
      pincode: location.pincode || "",
      isActive: location.isActive ?? true,
    });

    setError("");
    setSuccess("");

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const handleToggleStatus = async (location) => {
    setError("");
    setSuccess("");

    try {
      if (location.isActive) {
        await api.put(`/locations/${location.id}/deactivate`);

        setSuccess(`${location.name} deactivated successfully.`);
      } else {
        await api.put(`/locations/${location.id}/activate`);

        setSuccess(`${location.name} activated successfully.`);
      }

      await fetchLocations();
    } catch (err) {
      console.error("Location status error:", err);

      setError(
        err.response?.data?.message || "Failed to update location status."
      );
    }
  };

  const handleSearchChange = (event) => {
    setSearch(event.target.value);
    setPage(0);
  };

  const handleCityChange = (event) => {
    setCity(event.target.value);
    setPage(0);
  };

  const handleActiveChange = (event) => {
    setIsActive(event.target.value);
    setPage(0);
  };

  const handleSortChange = (event) => {
    const value = event.target.value;

    if (value === "nameAsc") {
      setSortBy("name");
      setSortDir("asc");
    } else if (value === "nameDesc") {
      setSortBy("name");
      setSortDir("desc");
    } else if (value === "cityAsc") {
      setSortBy("city");
      setSortDir("asc");
    } else if (value === "cityDesc") {
      setSortBy("city");
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
    <div className="space-y-6">
      {/* PAGE HEADER */}
      <div className="bg-gradient-to-r from-green-600 to-emerald-600 rounded-xl shadow p-6 text-white">
        <div className="flex items-center gap-4">
          <div className="bg-white/20 p-3 rounded-full">
            <FaMapMarkerAlt className="text-2xl" />
          </div>

          <div>
            <h2 className="text-2xl font-bold">Location Management</h2>

            <p className="text-green-100 mt-1">
              Manage EcoRide rental locations.
            </p>
          </div>
        </div>
      </div>

      {/* SUCCESS MESSAGE */}
      {success && (
        <div className="flex items-center gap-3 bg-green-100 border border-green-300 text-green-700 px-4 py-3 rounded-lg">
          <FaCheckCircle />
          <span>{success}</span>
        </div>
      )}

      {/* ERROR MESSAGE */}
      {error && (
        <div className="flex items-center gap-3 bg-red-100 border border-red-300 text-red-700 px-4 py-3 rounded-lg">
          <FaTimesCircle />
          <span>{error}</span>
        </div>
      )}

      {/* ADD / EDIT FORM */}
      <div className="bg-white rounded-xl shadow p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="bg-green-100 p-3 rounded-lg">
              {editingId ? (
                <FaEdit className="text-green-600" />
              ) : (
                <FaPlus className="text-green-600" />
              )}
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-800">
                {editingId ? "Update Location" : "Add New Location"}
              </h3>

              <p className="text-sm text-gray-500">
                {editingId
                  ? "Update the selected location."
                  : "Create a new rental location."}
              </p>
            </div>
          </div>

          {editingId && (
            <button
              type="button"
              onClick={resetForm}
              className="flex items-center gap-2 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
            >
              <FaTimes />
              Cancel
            </button>
          )}
        </div>

        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 md:grid-cols-2 gap-5"
        >
          {/* NAME */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Location Name *
            </label>

            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="EcoRide Hyderabad Central"
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500"
              required
            />
          </div>

          {/* CITY */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              City *
            </label>

            <input
              type="text"
              name="city"
              value={form.city}
              onChange={handleChange}
              placeholder="Hyderabad"
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500"
              required
            />
          </div>

          {/* STATE */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              State *
            </label>

            <input
              type="text"
              name="state"
              value={form.state}
              onChange={handleChange}
              placeholder="Telangana"
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500"
              required
            />
          </div>

          {/* PINCODE */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Pincode *
            </label>

            <input
              type="text"
              name="pincode"
              value={form.pincode}
              onChange={handleChange}
              placeholder="500081"
              maxLength={6}
              inputMode="numeric"
              pattern="\d{6}"
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500"
              required
            />
          </div>

          {/* ADDRESS */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Address *
            </label>

            <textarea
              name="address"
              value={form.address}
              onChange={handleChange}
              placeholder="Hitech City Road, Madhapur, Hyderabad"
              rows={3}
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500"
              required
            />
          </div>

          {/* ACTIVE */}
          <div className="md:col-span-2 flex items-center gap-3">
            <input
              id="location-active"
              type="checkbox"
              name="isActive"
              checked={form.isActive}
              onChange={handleChange}
              className="w-5 h-5 accent-green-600"
            />

            <label
              htmlFor="location-active"
              className="text-sm font-medium text-gray-700"
            >
              Location is active
            </label>
          </div>

          {/* BUTTON */}
          <div className="md:col-span-2 flex justify-end">
            <button
              type="submit"
              disabled={saving}
              className="flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {editingId ? <FaSave /> : <FaPlus />}

              {saving
                ? "Saving..."
                : editingId
                ? "Update Location"
                : "Add Location"}
            </button>
          </div>
        </form>
      </div>

      {/* SEARCH / FILTERS */}
      <div className="bg-white rounded-xl shadow p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* SEARCH */}
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />

            <input
              value={search}
              onChange={handleSearchChange}
              placeholder="Search locations..."
              className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          {/* CITY */}
          <input
            value={city}
            onChange={handleCityChange}
            placeholder="Filter by city..."
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500"
          />

          {/* ACTIVE */}
          <select
            value={isActive}
            onChange={handleActiveChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            <option value="ALL">All Locations</option>
            <option value="true">Active Only</option>
            <option value="false">Inactive Only</option>
          </select>

          {/* SORT */}
          <select
            defaultValue="latest"
            onChange={handleSortChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            <option value="latest">Latest</option>
            <option value="oldest">Oldest</option>
            <option value="nameAsc">Name: A to Z</option>
            <option value="nameDesc">Name: Z to A</option>
            <option value="cityAsc">City: A to Z</option>
            <option value="cityDesc">City: Z to A</option>
          </select>
        </div>

        <div className="mt-4 text-sm text-gray-500">
          {loading
            ? "Loading locations..."
            : `${totalElements} location${
                totalElements !== 1 ? "s" : ""
              } found`}
        </div>
      </div>

      {/* LOCATION LIST */}
      <div className="bg-white rounded-xl shadow overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-800">Locations</h3>

              <p className="text-sm text-gray-500 mt-1">
                {totalElements} location
                {totalElements !== 1 ? "s" : ""}
              </p>
            </div>

            <FaMapMarkerAlt className="text-green-600 text-xl" />
          </div>
        </div>

        {/* LOADING */}
        {loading && (
          <div className="p-10 text-center text-gray-500">
            Loading locations...
          </div>
        )}

        {/* EMPTY */}
        {!loading && locations.length === 0 && (
          <div className="p-12 text-center">
            <FaMapMarkerAlt className="mx-auto text-5xl text-gray-300 mb-4" />

            <h4 className="text-lg font-semibold text-gray-700">
              No locations found
            </h4>

            <p className="text-gray-500 mt-1">
              Try changing your search or filters.
            </p>
          </div>
        )}

        {/* TABLE */}
        {!loading && locations.length > 0 && (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">
                    Location
                  </th>

                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">
                    City
                  </th>

                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">
                    State
                  </th>

                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">
                    Pincode
                  </th>

                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">
                    Status
                  </th>

                  <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody className="bg-white divide-y divide-gray-200">
                {locations.map((location) => (
                  <tr key={location.id} className="hover:bg-gray-50">
                    {/* LOCATION */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                          <FaMapMarkerAlt className="text-green-600" />
                        </div>

                        <div>
                          <p className="font-semibold text-gray-800">
                            {location.name}
                          </p>

                          <p className="text-sm text-gray-500 max-w-xs truncate">
                            {location.address}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* CITY */}
                    <td className="px-6 py-4 text-sm text-gray-700">
                      {location.city}
                    </td>

                    {/* STATE */}
                    <td className="px-6 py-4 text-sm text-gray-700">
                      {location.state}
                    </td>

                    {/* PINCODE */}
                    <td className="px-6 py-4 text-sm text-gray-700">
                      {location.pincode}
                    </td>

                    {/* STATUS */}
                    <td className="px-6 py-4">
                      {location.isActive ? (
                        <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-100 text-green-700 text-xs font-semibold">
                          <FaCheckCircle />
                          Active
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-100 text-red-700 text-xs font-semibold">
                          <FaTimesCircle />
                          Inactive
                        </span>
                      )}
                    </td>

                    {/* ACTIONS */}
                    <td className="px-6 py-4">
                      <div className="flex justify-end gap-2">
                        {/* EDIT */}
                        <button
                          type="button"
                          onClick={() => handleEdit(location)}
                          className="p-3 rounded-lg bg-blue-100 text-blue-700 hover:bg-blue-200"
                          title="Edit Location"
                        >
                          <FaEdit />
                        </button>

                        {/* ACTIVATE / DEACTIVATE */}
                        <button
                          type="button"
                          onClick={() => handleToggleStatus(location)}
                          className={`p-3 rounded-lg ${
                            location.isActive
                              ? "bg-red-100 text-red-700 hover:bg-red-200"
                              : "bg-green-100 text-green-700 hover:bg-green-200"
                          }`}
                          title={
                            location.isActive
                              ? "Deactivate Location"
                              : "Activate Location"
                          }
                        >
                          <FaPowerOff />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* PAGINATION */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-4 p-6 border-t border-gray-200">
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
      </div>
    </div>
  );
};

export default AdminLocations;
