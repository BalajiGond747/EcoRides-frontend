import React, { useEffect, useState } from "react";
import {
  Battery,
  CarFront,
  Loader2,
  MapPin,
  Search,
  Users,
  Zap,
} from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import api from "../services/api";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";

const getImageUrl = (imageUrl) => {
  if (!imageUrl) return "";

  if (imageUrl.startsWith("http://localhost:8080")) {
    return imageUrl.replace("http://localhost:8080", API_BASE_URL);
  }

  if (/^https?:\/\//i.test(imageUrl)) return imageUrl;

  return `${API_BASE_URL}${imageUrl.startsWith("/") ? "" : "/"}${imageUrl}`;
};

const CarsPage = () => {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("ALL");
  const [availableOnly, setAvailableOnly] = useState(false);

  const [page, setPage] = useState(0);
  const [size] = useState(9);

  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);

  const [sortBy, setSortBy] = useState("createdAt");
  const [sortDir, setSortDir] = useState("desc");

  const [categories, setCategories] = useState([]);

  useEffect(() => {
    fetchCars();
  }, [page, search, category, availableOnly, sortBy, sortDir]);

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

      if (availableOnly) {
        params.status = "AVAILABLE";
        params.isActive = true;
      }

      const response = await api.get("/cars", {
        params,
      });

      const paginationData = response.data?.data;

      setCars(paginationData?.content || []);
      setTotalPages(paginationData?.totalPages || 0);
      setTotalElements(paginationData?.totalElements || 0);

      if (page === 0 && !search.trim() && category === "ALL") {
        const values = (paginationData?.content || [])
          .map((car) => car.category)
          .filter(Boolean);

        setCategories((previous) => [...new Set([...previous, ...values])]);
      }
    } catch (error) {
      console.error("Fetch cars error:", error);

      toast.error(error.response?.data?.message || "Unable to fetch cars");

      setCars([]);
      setTotalPages(0);
      setTotalElements(0);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchChange = (event) => {
    setSearch(event.target.value);
    setPage(0);
  };

  const handleCategoryChange = (event) => {
    setCategory(event.target.value);
    setPage(0);
  };

  const handleAvailabilityChange = (event) => {
    setAvailableOnly(event.target.checked);
    setPage(0);
  };

  const handleSortChange = (event) => {
    const value = event.target.value;

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

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-emerald-50 via-white to-green-50">
      <Navbar />

      <main className="flex-grow px-4 py-10">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">
              Explore Electric Cars
            </h1>

            <p className="text-gray-500 mt-2">
              Find the perfect electric car for your journey.
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-md border border-emerald-100 p-4 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="relative">
                <Search
                  className="absolute left-4 top-1/2
                             -translate-y-1/2
                             w-5 h-5 text-gray-400"
                />

                <input
                  type="text"
                  value={search}
                  onChange={handleSearchChange}
                  placeholder="Search cars..."
                  className="w-full pl-12 pr-4 py-3 rounded-xl
                             border border-gray-300
                             focus:outline-none
                             focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <select
                value={category}
                onChange={handleCategoryChange}
                className="w-full px-4 py-3 rounded-xl
                           border border-gray-300
                           focus:outline-none
                           focus:ring-2 focus:ring-emerald-500"
              >
                <option value="ALL">All Categories</option>

                {categories.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>

              <select
                defaultValue="latest"
                onChange={handleSortChange}
                className="w-full px-4 py-3 rounded-xl
                           border border-gray-300
                           focus:outline-none
                           focus:ring-2 focus:ring-emerald-500"
              >
                <option value="latest">Latest</option>
                <option value="priceLow">Price: Low to High</option>
                <option value="priceHigh">Price: High to Low</option>
                <option value="nameAsc">Name: A to Z</option>
                <option value="nameDesc">Name: Z to A</option>
              </select>

              <label
                className="flex items-center gap-3 px-4 py-3
                           rounded-xl border border-gray-300
                           cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={availableOnly}
                  onChange={handleAvailabilityChange}
                  className="w-5 h-5 accent-emerald-600"
                />

                <span className="font-medium text-gray-700">
                  Available cars only
                </span>
              </label>
            </div>
          </div>

          {loading && (
            <div className="flex justify-center py-20">
              <Loader2 className="w-10 h-10 text-emerald-600 animate-spin" />
            </div>
          )}

          {!loading && cars.length === 0 && (
            <div className="bg-white rounded-3xl shadow-md p-12 text-center">
              <CarFront className="w-14 h-14 mx-auto text-gray-300" />

              <h2 className="text-xl font-bold text-gray-800 mt-4">
                No cars found
              </h2>

              <p className="text-gray-500 mt-2">
                Try changing your search or filters.
              </p>
            </div>
          )}

          {!loading && cars.length > 0 && (
            <>
              <div className="flex items-center justify-between mb-4">
                <p className="text-sm text-gray-500">
                  {totalElements} car{totalElements !== 1 ? "s" : ""} found
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {cars.map((car) => (
                  <CarCard key={car.id} car={car} />
                ))}
              </div>

              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-4 mt-10">
                  <button
                    type="button"
                    onClick={handlePreviousPage}
                    disabled={page === 0 || loading}
                    className="px-5 py-2.5 rounded-full
                               border border-emerald-600
                               text-emerald-700 font-semibold
                               disabled:opacity-40
                               disabled:cursor-not-allowed
                               hover:bg-emerald-50 transition"
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
                    className="px-5 py-2.5 rounded-full
                               bg-emerald-600 text-white
                               font-semibold
                               disabled:opacity-40
                               disabled:cursor-not-allowed
                               hover:bg-emerald-700 transition"
                  >
                    Next
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

const CarCard = ({ car }) => {
  const isAvailable = car.status === "AVAILABLE" && car.isActive !== false;

  return (
    <div
      className="bg-white rounded-3xl shadow-md
                 border border-emerald-100
                 overflow-hidden hover:shadow-xl transition"
    >
      <div
        className="h-52 bg-gradient-to-br
                   from-emerald-100 to-green-50
                   flex items-center justify-center overflow-hidden"
      >
        {car.imageUrl ? (
          <img
            src={getImageUrl(car.imageUrl)}
            alt={car.name}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.currentTarget.style.display = "none";
              e.currentTarget.nextElementSibling.style.display = "flex";
            }}
          />
        ) : null}

        <div
          className={`w-full h-full items-center justify-center ${
            car.imageUrl ? "hidden" : "flex"
          }`}
        >
          <CarFront className="w-24 h-24 text-emerald-500" />
        </div>
      </div>

      <div className="p-6">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h2 className="text-xl font-bold text-gray-900">{car.name}</h2>

            <p className="text-sm text-gray-500 mt-1">{car.category}</p>
          </div>

          <span
            className={`px-3 py-1 rounded-full text-xs font-semibold ${
              isAvailable
                ? "bg-emerald-100 text-emerald-700"
                : "bg-gray-100 text-gray-600"
            }`}
          >
            {car.status || "UNKNOWN"}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-3 mt-5 text-sm">
          <Info icon={<Zap className="w-4 h-4" />} text={`${car.rangeKm} km`} />

          <Info
            icon={<Battery className="w-4 h-4" />}
            text={`${car.batteryLevel}%`}
          />

          <Info
            icon={<Users className="w-4 h-4" />}
            text={`${car.seatingCapacity || "—"} seats`}
          />

          <Info
            icon={<MapPin className="w-4 h-4" />}
            text={`Location ${car.locationId}`}
          />
        </div>

        <div className="flex items-center justify-between mt-6">
          <div>
            <span className="text-2xl font-bold text-emerald-600">
              ₹{car.pricePerDay}
            </span>

            <span className="text-gray-500 text-sm"> / day</span>
          </div>

          <Link
            to={`/cars/${car.id}`}
            className="px-5 py-2.5 rounded-full
                       bg-emerald-600 text-white
                       font-semibold hover:bg-emerald-700 transition"
          >
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
};

const Info = ({ icon, text }) => (
  <div className="flex items-center gap-2 text-gray-600">
    <span className="text-emerald-600">{icon}</span>

    {text}
  </div>
);

export default CarsPage;
