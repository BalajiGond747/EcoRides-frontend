import React, { useEffect, useMemo, useState } from "react";
import {
  MapPin,
  Search,
  Loader2,
  Building2,
  MapPinned,
  CarFront,
} from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import api from "../services/api";

const LocationsPage = () => {
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchLocations();
  }, []);

  const fetchLocations = async () => {
    try {
      setLoading(true);

      const response = await api.get("/locations/active");

      setLocations(response.data?.data || []);
    } catch (error) {
      console.error("Fetch locations error:", error);

      toast.error(error.response?.data?.message || "Unable to fetch locations");
    } finally {
      setLoading(false);
    }
  };

  const filteredLocations = useMemo(() => {
    const searchValue = search.trim().toLowerCase();

    if (!searchValue) {
      return locations;
    }

    return locations.filter((location) => {
      return (
        location.name?.toLowerCase().includes(searchValue) ||
        location.city?.toLowerCase().includes(searchValue) ||
        location.state?.toLowerCase().includes(searchValue) ||
        location.address?.toLowerCase().includes(searchValue) ||
        location.pincode?.toLowerCase().includes(searchValue)
      );
    });
  }, [locations, search]);

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-emerald-50 via-white to-green-50">
      <Navbar />

      <main className="flex-grow px-4 py-10">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-emerald-100 mb-5">
              <MapPin className="w-8 h-8 text-emerald-600" />
            </div>

            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">
              Our Locations
            </h1>

            <p className="text-gray-500 mt-3 max-w-2xl mx-auto">
              Find EcoRide locations near you and start your electric journey
              from a convenient pickup point.
            </p>
          </div>

          {/* Search */}
          <div className="bg-white rounded-2xl shadow-md border border-emerald-100 p-4 mb-8">
            <div className="relative max-w-2xl mx-auto">
              <Search
                className="absolute left-4 top-1/2
                           -translate-y-1/2
                           w-5 h-5 text-gray-400"
              />

              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by location, city or state..."
                className="w-full pl-12 pr-4 py-3 rounded-xl
                           border border-gray-300
                           focus:outline-none
                           focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          {/* Loading */}
          {loading && (
            <div className="flex justify-center py-20">
              <Loader2 className="w-10 h-10 text-emerald-600 animate-spin" />
            </div>
          )}

          {/* Empty */}
          {!loading && filteredLocations.length === 0 && (
            <div className="bg-white rounded-3xl shadow-md p-12 text-center">
              <MapPinned className="w-16 h-16 mx-auto text-gray-300" />

              <h2 className="text-xl font-bold text-gray-800 mt-5">
                No locations found
              </h2>

              <p className="text-gray-500 mt-2">
                Try searching for another city or location.
              </p>
            </div>
          )}

          {/* Locations */}
          {!loading && filteredLocations.length > 0 && (
            <>
              <div className="mb-5">
                <p className="text-gray-600">
                  {filteredLocations.length} active location
                  {filteredLocations.length !== 1 ? "s" : ""} available
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredLocations.map((location) => (
                  <LocationCard key={location.id} location={location} />
                ))}
              </div>
            </>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

const LocationCard = ({ location }) => {
  return (
    <div
      className="bg-white rounded-3xl shadow-md
                 border border-emerald-100
                 overflow-hidden
                 hover:shadow-xl
                 transition"
    >
      {/* Card Header */}
      <div
        className="h-36 bg-gradient-to-br
                   from-emerald-100
                   to-green-50
                   flex items-center justify-center"
      >
        <div className="w-20 h-20 rounded-full bg-white shadow-md flex items-center justify-center">
          <MapPin className="w-10 h-10 text-emerald-600" />
        </div>
      </div>

      {/* Card Content */}
      <div className="p-6">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h2 className="text-xl font-bold text-gray-900">{location.name}</h2>

            <p className="text-sm text-emerald-600 font-medium mt-1">
              {location.city}, {location.state}
            </p>
          </div>

          <span
            className="px-3 py-1 rounded-full
                       bg-emerald-100
                       text-emerald-700
                       text-xs font-semibold"
          >
            ACTIVE
          </span>
        </div>

        {/* Address */}
        <div className="flex items-start gap-3 mt-5">
          <MapPinned className="w-5 h-5 text-emerald-600 mt-0.5 flex-shrink-0" />

          <div>
            <p className="text-sm text-gray-600">{location.address}</p>

            <p className="text-sm text-gray-500 mt-1">
              Pincode: {location.pincode}
            </p>
          </div>
        </div>

        {/* City */}
        <div className="flex items-center gap-3 mt-4">
          <Building2 className="w-5 h-5 text-emerald-600" />

          <p className="text-sm text-gray-600">
            {location.city}, {location.state}
          </p>
        </div>

        {/* View Cars */}
        <Link
          to={`/cars?locationId=${location.id}`}
          className="mt-6 w-full
                     flex items-center justify-center gap-2
                     px-5 py-3
                     rounded-full
                     bg-emerald-600
                     text-white
                     font-semibold
                     hover:bg-emerald-700
                     transition"
        >
          <CarFront className="w-5 h-5" />
          View Cars
        </Link>
      </div>
    </div>
  );
};

export default LocationsPage;
