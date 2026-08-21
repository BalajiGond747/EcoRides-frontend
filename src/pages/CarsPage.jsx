import React, { useEffect, useMemo, useState } from "react";
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

const CarsPage = () => {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("ALL");
  const [availableOnly, setAvailableOnly] = useState(false);

  useEffect(() => {
    fetchCars();
  }, []);

  const fetchCars = async (onlyAvailable = availableOnly) => {
    try {
      setLoading(true);

      const endpoint = onlyAvailable ? "/cars/available" : "/cars";

      const response = await api.get(endpoint);

      setCars(response.data?.data || []);
    } catch (error) {
      console.error("Fetch cars error:", error);

      toast.error(error.response?.data?.message || "Unable to fetch cars");
    } finally {
      setLoading(false);
    }
  };

  const categories = useMemo(() => {
    const values = cars.map((car) => car.category).filter(Boolean);

    return ["ALL", ...new Set(values)];
  }, [cars]);

  const filteredCars = useMemo(() => {
    return cars.filter((car) => {
      const searchValue = search.trim().toLowerCase();

      const matchesSearch =
        !searchValue ||
        car.name?.toLowerCase().includes(searchValue) ||
        car.category?.toLowerCase().includes(searchValue) ||
        car.registrationNumber?.toLowerCase().includes(searchValue);

      const matchesCategory = category === "ALL" || car.category === category;

      return matchesSearch && matchesCategory;
    });
  }, [cars, search, category]);

  const handleAvailabilityChange = (event) => {
    const checked = event.target.checked;

    setAvailableOnly(checked);
    fetchCars(checked);
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
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="relative">
                <Search
                  className="absolute left-4 top-1/2
                             -translate-y-1/2
                             w-5 h-5 text-gray-400"
                />

                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search cars..."
                  className="w-full pl-12 pr-4 py-3 rounded-xl
                             border border-gray-300
                             focus:outline-none
                             focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-4 py-3 rounded-xl
                           border border-gray-300
                           focus:outline-none
                           focus:ring-2 focus:ring-emerald-500"
              >
                {categories.map((item) => (
                  <option key={item} value={item}>
                    {item === "ALL" ? "All Categories" : item}
                  </option>
                ))}
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

          {!loading && filteredCars.length === 0 && (
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

          {!loading && filteredCars.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCars.map((car) => (
                <CarCard key={car.id} car={car} />
              ))}
            </div>
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
            src={car.imageUrl}
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
