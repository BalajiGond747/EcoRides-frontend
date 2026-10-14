import React, { useEffect, useState } from "react";
import {
  ArrowLeft,
  Battery,
  CarFront,
  Loader2,
  MapPin,
  Users,
  Zap,
} from "lucide-react";
import { Link, useNavigate, useParams } from "react-router-dom";
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

const CarDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [car, setCar] = useState(null);
  const [locationName, setLocationName] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCar();
  }, [id]);

  const fetchCar = async () => {
    try {
      setLoading(true);

      const response = await api.get(`/cars/${id}`);

      const carData = response.data?.data || null;

      setCar(carData);

      if (carData?.locationId) {
        try {
          const locationResponse = await api.get(
            `/locations/${carData.locationId}`
          );

          const locationData = locationResponse.data?.data;

          setLocationName(locationData?.name || "Location unavailable");
        } catch (locationError) {
          console.error("Fetch location error:", locationError);

          setLocationName("Location unavailable");
        }
      } else {
        setLocationName("Location unavailable");
      }
    } catch (error) {
      console.error("Fetch car error:", error);

      toast.error(error.response?.data?.message || "Unable to fetch car");
    } finally {
      setLoading(false);
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

  if (!car) {
    return (
      <PageShell>
        <div className="flex-grow flex items-center justify-center px-4">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900">Car not found</h2>

            <p className="text-gray-500 mt-2">
              The car you are looking for is unavailable.
            </p>

            <button
              type="button"
              onClick={() => navigate("/cars")}
              className="mt-5 px-6 py-3 rounded-full
                         bg-emerald-600 text-white
                         font-semibold
                         hover:bg-emerald-700
                         transition"
            >
              Back to Cars
            </button>
          </div>
        </div>
      </PageShell>
    );
  }

  const canBook = car.status === "AVAILABLE" && car.isActive !== false;

  return (
    <PageShell>
      <main className="flex-grow px-4 py-10">
        <div className="max-w-5xl mx-auto">
          <Link
            to="/cars"
            className="inline-flex items-center gap-2
                       text-emerald-600
                       font-semibold
                       mb-6
                       hover:text-emerald-700
                       transition"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Cars
          </Link>

          <div
            className="bg-white rounded-3xl
                       shadow-xl
                       overflow-hidden
                       border border-emerald-100"
          >
            <div className="grid grid-cols-1 lg:grid-cols-2">
              <div
                className="min-h-[350px]
                           bg-gradient-to-br
                           from-emerald-100
                           to-green-50
                           flex items-center justify-center"
              >
                {car.imageUrl ? (
                  <img
                    src={getImageUrl(car.imageUrl)}
                    alt={car.name}
                    className="w-full h-64 object-cover rounded-2xl"
                    onError={(e) => {
                      e.currentTarget.style.display = "none";
                      e.currentTarget.nextElementSibling.style.display = "flex";
                    }}
                  />
                ) : (
                  <CarFront className="w-40 h-40 text-emerald-500" />
                )}
              </div>

              <div className="p-8">
                <div
                  className="flex items-start
                             justify-between
                             gap-4"
                >
                  <div>
                    <p className="text-emerald-600 font-semibold">
                      {car.category}
                    </p>

                    <h1
                      className="text-3xl
                                 font-bold
                                 text-gray-900
                                 mt-1"
                    >
                      {car.name}
                    </h1>
                  </div>

                  <span
                    className={`px-3 py-1
                                rounded-full
                                text-sm
                                font-semibold
                                whitespace-nowrap
                                ${
                                  car.status === "AVAILABLE"
                                    ? "bg-emerald-100 text-emerald-700"
                                    : car.status === "MAINTENANCE"
                                    ? "bg-yellow-100 text-yellow-700"
                                    : car.status === "INACTIVE"
                                    ? "bg-gray-100 text-gray-600"
                                    : "bg-blue-100 text-blue-700"
                                }`}
                  >
                    {car.status}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-4 mt-8">
                  <Detail
                    icon={<Battery />}
                    label="Battery"
                    value={`${car.batteryLevel}%`}
                  />

                  <Detail
                    icon={<Zap />}
                    label="Range"
                    value={`${car.rangeKm} km`}
                  />

                  <Detail
                    icon={<Users />}
                    label="Seats"
                    value={car.seatingCapacity || "—"}
                  />

                  <Detail
                    icon={<MapPin />}
                    label="Location"
                    value={locationName || "Loading..."}
                  />
                </div>

                <div
                  className="border-t
                             border-gray-100
                             mt-8
                             pt-6"
                >
                  <p className="text-gray-500">Price per day</p>

                  <p
                    className="text-3xl
                               font-bold
                               text-emerald-600
                               mt-1"
                  >
                    ₹{car.pricePerDay}
                  </p>
                </div>

                {canBook ? (
                  <Link
                    to={`/bookings/create?carId=${car.id}&locationId=${car.locationId}`}
                    className="block
                               text-center
                               w-full
                               mt-7
                               bg-emerald-600
                               text-white
                               py-3
                               rounded-full
                               font-semibold
                               hover:bg-emerald-700
                               transition"
                  >
                    Book This Car
                  </Link>
                ) : (
                  <button
                    type="button"
                    disabled
                    className="w-full
                               mt-7
                               bg-gray-300
                               text-gray-600
                               py-3
                               rounded-full
                               font-semibold
                               cursor-not-allowed"
                  >
                    Car Not Available
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </PageShell>
  );
};

const Detail = ({ icon, label, value }) => (
  <div
    className="bg-gray-50
               rounded-2xl
               p-4
               border border-gray-100"
  >
    <div
      className="flex items-center
                 gap-2
                 text-emerald-600"
    >
      {React.cloneElement(icon, {
        className: "w-5 h-5",
      })}

      <span className="text-sm font-semibold">{label}</span>
    </div>

    <p
      className="text-gray-900
                 font-medium
                 mt-2
                 break-words"
    >
      {value}
    </p>
  </div>
);

const PageShell = ({ children }) => (
  <div
    className="min-h-screen
               flex flex-col
               bg-gradient-to-br
               from-emerald-50
               via-white
               to-green-50"
  >
    <Navbar />

    {children}

    <Footer />
  </div>
);

export default CarDetailsPage;
