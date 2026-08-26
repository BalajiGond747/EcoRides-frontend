import React, { useEffect, useState } from "react";
import {
  ArrowRight,
  Battery,
  CalendarDays,
  CarFront,
  CheckCircle2,
  ChevronRight,
  CreditCard,
  Gauge,
  Tag,
  Leaf,
  MapPin,
  ShieldCheck,
  Users,
  Zap,
} from "lucide-react";
import { Link } from "react-router-dom";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import api from "../services/api";

const IMAGE_BASE_URL = "http://localhost:8080";

const getImageUrl = (imageUrl) => {
  if (!imageUrl) {
    return "";
  }

  if (imageUrl.startsWith("http://") || imageUrl.startsWith("https://")) {
    return imageUrl;
  }

  return `${IMAGE_BASE_URL}${imageUrl}`;
};

const HomePage = () => {
  const [featuredCars, setFeaturedCars] = useState([]);
  const [loadingCars, setLoadingCars] = useState(true);
  const [coupons, setCoupons] = useState([]);

  useEffect(() => {
    const fetchFeaturedCars = async () => {
      try {
        setLoadingCars(true);

        const response = await api.get("/cars", {
          params: {
            page: 0,
            size: 4,
            sortBy: "createdAt",
            sortDir: "desc",
          },
        });

        const data = response.data?.data;

        const cars = Array.isArray(data) ? data : data?.content || [];

        setFeaturedCars(cars.slice(0, 4));
      } catch (error) {
        console.error("Unable to load featured cars:", error);
        setFeaturedCars([]);
      } finally {
        setLoadingCars(false);
      }
    };

    const fetchActiveCoupons = async () => {
      try {
        const response = await api.get("/coupons", {
          params: {
            page: 0,
            size: 3,
            isActive: true,
          },
        });

        const data = response.data?.data;
        const activeCoupons = Array.isArray(data) ? data : data?.content || [];

        setCoupons(activeCoupons.slice(0, 3));
      } catch (error) {
        console.error("Unable to load coupons:", error);
        setCoupons([]);
      } finally {
      }
    };

    fetchFeaturedCars();
    fetchActiveCoupons();
  }, []);

  const features = [
    {
      icon: <Leaf className="w-6 h-6" />,
      title: "Zero Emission",
      description:
        "Drive cleaner and make every journey a more sustainable choice.",
    },
    {
      icon: <CarFront className="w-6 h-6" />,
      title: "Premium EV Fleet",
      description:
        "Choose from modern electric vehicles available through EcoRides.",
    },
    {
      icon: <CalendarDays className="w-6 h-6" />,
      title: "Easy Booking",
      description:
        "Choose your car, location and dates in just a few simple steps.",
    },
    {
      icon: <ShieldCheck className="w-6 h-6" />,
      title: "Secure Payments",
      description: "Complete your rental payment securely through Razorpay.",
    },
  ];

  const benefits = [
    {
      icon: <CarFront className="w-5 h-5" />,
      title: "Choose Your EV",
      description:
        "Explore available cars and select the vehicle that fits your trip.",
    },
    {
      icon: <MapPin className="w-5 h-5" />,
      title: "Select a Location",
      description: "Choose the location where your selected car is available.",
    },
    {
      icon: <CreditCard className="w-5 h-5" />,
      title: "Book & Pay",
      description:
        "Create your booking and complete the payment securely online.",
    },
    {
      icon: <CheckCircle2 className="w-5 h-5" />,
      title: "Drive & Enjoy",
      description: "Once confirmed, pick up your EV and enjoy your journey.",
    },
  ];

  const steps = [
    {
      number: "01",
      icon: <MapPin className="w-5 h-5" />,
      title: "Choose Location",
      description: "Select your preferred pickup location and rental dates.",
    },
    {
      number: "02",
      icon: <CarFront className="w-5 h-5" />,
      title: "Select Your EV",
      description:
        "Browse the available electric cars and choose your favorite.",
    },
    {
      number: "03",
      icon: <CreditCard className="w-5 h-5" />,
      title: "Book & Pay",
      description:
        "Create your booking and complete payment securely through Razorpay.",
    },
    {
      number: "04",
      icon: <Zap className="w-5 h-5" />,
      title: "Drive & Enjoy",
      description:
        "Pick up your confirmed rental and enjoy your electric journey.",
    },
  ];

  return (
    <div className="min-h-screen overflow-hidden bg-[#020B08] text-white">
      <Navbar />

      <section className="relative isolate overflow-hidden border-b border-emerald-900/50">
        <div className="absolute inset-0 -z-20 bg-[#020B08]" />

        <div className="absolute -right-40 top-10 -z-10 h-[600px] w-[600px] rounded-full bg-emerald-500/20 blur-[130px]" />

        <div className="absolute -left-52 bottom-0 -z-10 h-[500px] w-[500px] rounded-full bg-green-500/10 blur-[120px]" />

        <div className="pointer-events-none absolute inset-0 -z-10 opacity-40">
          <span className="absolute left-[12%] top-[20%] h-2 w-2 animate-pulse rounded-full bg-emerald-400" />
          <span className="absolute left-[65%] top-[18%] h-1.5 w-1.5 animate-ping rounded-full bg-emerald-300" />
          <span className="absolute right-[14%] top-[55%] h-2 w-2 animate-pulse rounded-full bg-green-300" />
          <span className="absolute bottom-[20%] left-[42%] h-1.5 w-1.5 animate-ping rounded-full bg-emerald-400" />
        </div>

        <div className="mx-auto max-w-7xl px-5 py-16 sm:px-6 lg:px-8 lg:py-24">
          <div className="grid items-center gap-14 lg:grid-cols-[0.9fr_1.1fr]">
            <div>
              <div className="inline-flex animate-[fadeUp_.7s_ease-out] items-center gap-2 rounded-full border border-emerald-400/25 bg-emerald-500/10 px-4 py-2 text-sm font-bold text-emerald-300 backdrop-blur-xl">
                <Leaf className="h-4 w-4" />
                100% Electric • Zero Emission
              </div>

              <h1 className="mt-7 animate-[fadeUp_.8s_ease-out] text-5xl font-black leading-[.95] tracking-tight sm:text-6xl lg:text-7xl">
                Rent Electric.
                <span className="mt-2 block bg-gradient-to-r from-emerald-300 via-green-400 to-emerald-500 bg-clip-text text-transparent">
                  Drive the Future.
                </span>
              </h1>

              <p className="mt-7 max-w-xl animate-[fadeUp_1s_ease-out] text-lg leading-8 text-emerald-100/70 sm:text-xl">
                Experience modern electric cars with flexible rental options,
                easy online booking and secure digital payments.
              </p>

              <div className="mt-9 flex flex-col gap-3 sm:flex-row">
                <Link
                  to="/cars"
                  className="group inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-500 px-7 py-3.5 font-black text-white shadow-xl shadow-emerald-950/50 transition-all duration-300 hover:-translate-y-1 hover:bg-emerald-400 hover:shadow-emerald-500/20"
                >
                  Book Your Ride
                  <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                </Link>

                <Link
                  to="/cars"
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-emerald-400/30 bg-white/5 px-7 py-3.5 font-bold text-white backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:border-emerald-300/60 hover:bg-emerald-500/10"
                >
                  <CarFront className="h-5 w-5 text-emerald-300" />
                  Explore Cars
                </Link>
              </div>

              <div className="mt-8 flex flex-wrap items-center gap-5">
                <div className="flex -space-x-2">
                  {["E", "V", "R", "C"].map((letter) => (
                    <div
                      key={letter}
                      className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-[#020B08] bg-emerald-800 text-xs font-black text-emerald-200"
                    >
                      {letter}
                    </div>
                  ))}
                </div>

                <div>
                  <p className="text-sm font-bold">
                    Electric Mobility Made Simple
                  </p>

                  <p className="mt-1 text-sm text-emerald-100/60">
                    Book • Pay • Drive
                  </p>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="absolute -inset-10 rounded-full bg-emerald-400/10 blur-3xl" />

              <div className="relative animate-[heroFloat_6s_ease-in-out_infinite] rounded-[2rem] border border-emerald-400/25 bg-white/[.04] p-3 shadow-2xl shadow-black/50 backdrop-blur-2xl">
                <div className="relative overflow-hidden rounded-[1.6rem] border border-emerald-300/10 bg-[#061712]">
                  <div className="relative h-64 overflow-hidden sm:h-80">
                    {featuredCars[0]?.imageUrl ? (
                      <img
                        src={getImageUrl(featuredCars[0].imageUrl)}
                        alt={featuredCars[0].name}
                        className="h-full w-full object-cover opacity-90 transition-transform duration-700 hover:scale-105"
                        onError={(e) => {
                          e.currentTarget.style.display = "none";
                        }}
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-emerald-950 via-[#061712] to-[#020B08]">
                        <CarFront className="h-24 w-24 text-emerald-500/20" />
                      </div>
                    )}

                    <div className="absolute inset-0 bg-gradient-to-t from-[#061712] via-[#061712]/20 to-transparent" />

                    <div className="absolute left-5 top-5 rounded-full border border-emerald-300/30 bg-emerald-950/70 px-3 py-1.5 text-xs font-black text-emerald-300 backdrop-blur-md">
                      ⚡ FEATURED EV
                    </div>

                    <div className="absolute bottom-5 left-5">
                      <p className="text-xs font-bold uppercase tracking-[.2em] text-emerald-300">
                        Featured Ride
                      </p>

                      <h2 className="mt-1 text-3xl font-black">
                        {featuredCars[0]?.name || "Electric Vehicle"}
                      </h2>

                      <p className="mt-1 text-sm text-emerald-100/60">
                        Comfortable • Modern • Efficient
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-2 p-4">
                    <div className="rounded-xl border border-emerald-300/10 bg-emerald-950/60 p-3">
                      <Battery className="h-4 w-4 text-emerald-400" />
                      <p className="mt-2 text-[10px] text-emerald-300/50">
                        BATTERY
                      </p>
                      <p className="text-sm font-black">
                        {featuredCars[0]?.batteryLevel != null
                          ? `${featuredCars[0].batteryLevel}%`
                          : "—"}
                      </p>
                    </div>

                    <div className="rounded-xl border border-emerald-300/10 bg-emerald-950/60 p-3">
                      <Gauge className="h-4 w-4 text-emerald-400" />
                      <p className="mt-2 text-[10px] text-emerald-300/50">
                        RANGE
                      </p>
                      <p className="text-sm font-black">
                        {featuredCars[0]?.rangeKm
                          ? `${featuredCars[0].rangeKm} km`
                          : "—"}
                      </p>
                    </div>

                    <div className="rounded-xl border border-emerald-300/10 bg-emerald-950/60 p-3">
                      <Users className="h-4 w-4 text-emerald-400" />
                      <p className="mt-2 text-[10px] text-emerald-300/50">
                        SEATS
                      </p>
                      <p className="text-sm font-black">
                        {featuredCars[0]?.seatingCapacity || "—"}
                      </p>
                    </div>
                  </div>

                  <div className="mx-4 mb-4 flex items-center justify-between rounded-xl border border-emerald-400/20 bg-emerald-500/10 p-4">
                    <div>
                      <p className="text-xs text-emerald-300/60">
                        Starting from
                      </p>

                      <p className="text-xl font-black">
                        {featuredCars[0]?.pricePerDay
                          ? `₹${Number(
                              featuredCars[0].pricePerDay
                            ).toLocaleString("en-IN")}`
                          : "View pricing"}

                        {featuredCars[0]?.pricePerDay && (
                          <span className="text-xs text-emerald-200/50">
                            {" "}
                            / day
                          </span>
                        )}
                      </p>
                    </div>

                    <Link
                      to="/cars"
                      className="rounded-lg bg-emerald-500 px-4 py-2 text-xs font-black transition hover:bg-emerald-400"
                    >
                      View Cars
                    </Link>
                  </div>
                </div>
              </div>

              <div className="absolute -bottom-6 -left-3 flex animate-[notificationFloat_4s_ease-in-out_infinite] items-center gap-3 rounded-2xl border border-emerald-300/20 bg-emerald-950/95 px-4 py-3 shadow-xl backdrop-blur-xl sm:-left-8">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/15">
                  <CheckCircle2 className="h-5 w-5 text-emerald-400" />
                </div>

                <div>
                  <p className="text-[10px] font-bold text-emerald-400">
                    ECORIDES
                  </p>

                  <p className="text-sm font-black">
                    Simple. Secure. Electric.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="relative z-10 mx-auto -mt-1 max-w-7xl px-5 sm:px-6 lg:px-8">
        <div className="rounded-3xl border border-emerald-400/20 bg-emerald-950/80 p-5 shadow-2xl shadow-black/40 backdrop-blur-2xl sm:p-7">
          <div className="mb-5">
            <p className="text-xs font-black uppercase tracking-[.2em] text-emerald-400">
              Find your perfect electric car
            </p>

            <h2 className="mt-1 text-2xl font-black">Plan your next ride</h2>
          </div>

          <div className="grid gap-3 lg:grid-cols-[1fr_1fr_1fr_auto]">
            <div className="rounded-xl border border-emerald-300/10 bg-white/[.03] p-4">
              <p className="text-[10px] font-bold uppercase tracking-wider text-emerald-300/50">
                Pickup Location
              </p>

              <div className="mt-2 flex items-center gap-2">
                <MapPin className="h-4 w-4 text-emerald-400" />

                <span className="text-sm font-bold text-white/80">
                  Choose from available locations
                </span>
              </div>
            </div>

            <div className="rounded-xl border border-emerald-300/10 bg-white/[.03] p-4">
              <p className="text-[10px] font-bold uppercase tracking-wider text-emerald-300/50">
                Rental Dates
              </p>

              <div className="mt-2 flex items-center gap-2">
                <CalendarDays className="h-4 w-4 text-emerald-400" />

                <span className="text-sm font-bold text-white/80">
                  Select your dates
                </span>
              </div>
            </div>

            <div className="rounded-xl border border-emerald-300/10 bg-white/[.03] p-4">
              <p className="text-[10px] font-bold uppercase tracking-wider text-emerald-300/50">
                Available Fleet
              </p>

              <div className="mt-2 flex items-center gap-2">
                <CarFront className="h-4 w-4 text-emerald-400" />

                <span className="text-sm font-bold text-white/80">
                  Browse electric cars
                </span>
              </div>
            </div>

            <Link
              to="/cars"
              className="group flex items-center justify-center gap-2 rounded-xl bg-emerald-500 px-7 py-4 font-black transition-all hover:bg-emerald-400 hover:shadow-lg hover:shadow-emerald-500/20"
            >
              Search Cars
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-14 sm:px-6 lg:px-8">
        <div className="grid overflow-hidden rounded-3xl border border-emerald-400/15 bg-emerald-950/70 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group border-emerald-400/10 p-6 transition-all hover:bg-emerald-500/[.05] lg:border-r lg:last:border-r-0"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-400 transition-all group-hover:bg-emerald-500 group-hover:text-white">
                {feature.icon}
              </div>

              <h3 className="mt-4 font-black">{feature.title}</h3>

              <p className="mt-2 text-sm leading-6 text-emerald-100/55">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="border-y border-emerald-900/60 bg-[#03110D] py-20">
        <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
          <div className="mb-10 flex items-end justify-between gap-5">
            <div>
              <span className="text-xs font-black uppercase tracking-[.2em] text-emerald-400">
                Our Fleet
              </span>

              <h2 className="mt-3 text-3xl font-black sm:text-4xl">
                Featured Electric Cars
              </h2>

              <p className="mt-3 text-emerald-100/55">
                Real vehicles from the EcoRides fleet.
              </p>
            </div>

            <Link
              to="/cars"
              className="hidden items-center gap-2 text-sm font-bold text-emerald-400 transition hover:text-emerald-300 sm:flex"
            >
              View all
              <ChevronRight className="h-4 w-4" />
            </Link>
          </div>

          {loadingCars ? (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {[1, 2, 3, 4].map((item) => (
                <div
                  key={item}
                  className="overflow-hidden rounded-3xl border border-emerald-400/10 bg-emerald-950/60"
                >
                  <div className="h-48 animate-pulse bg-emerald-900/30" />

                  <div className="space-y-3 p-5">
                    <div className="h-3 w-20 animate-pulse rounded bg-emerald-900/40" />
                    <div className="h-6 w-36 animate-pulse rounded bg-emerald-900/40" />
                    <div className="h-8 w-full animate-pulse rounded bg-emerald-900/30" />
                  </div>
                </div>
              ))}
            </div>
          ) : featuredCars.length > 0 ? (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {featuredCars.map((car) => (
                <div
                  key={car.id || car.registrationNumber}
                  className="group overflow-hidden rounded-3xl border border-emerald-400/15 bg-emerald-950/60 transition-all duration-500 hover:-translate-y-2 hover:border-emerald-400/40 hover:shadow-2xl hover:shadow-emerald-950/50"
                >
                  <div className="relative h-48 overflow-hidden bg-[#061712]">
                    {car.imageUrl ? (
                      <img
                        src={getImageUrl(car.imageUrl)}
                        alt={car.name}
                        loading="lazy"
                        decoding="async"
                        className="h-full w-full object-cover transition duration-700 group-hover:scale-110"
                        onError={(e) => {
                          e.currentTarget.style.display = "none";

                          const fallback = e.currentTarget.nextElementSibling;

                          if (fallback) {
                            fallback.style.display = "flex";
                          }
                        }}
                      />
                    ) : null}

                    <div
                      className={`${
                        car.imageUrl ? "hidden" : "flex"
                      } absolute inset-0 items-center justify-center bg-gradient-to-br from-emerald-950 to-[#061712]`}
                    >
                      <CarFront className="h-16 w-16 text-emerald-500/20" />
                    </div>

                    <div className="absolute inset-0 bg-gradient-to-t from-emerald-950 to-transparent" />

                    <span className="absolute left-4 top-4 rounded-full bg-emerald-500 px-2.5 py-1 text-[9px] font-black">
                      AVAILABLE
                    </span>
                  </div>

                  <div className="p-5">
                    <p className="text-xs text-emerald-400">
                      {car.category || "Electric Vehicle"}
                    </p>

                    <h3 className="mt-1 text-xl font-black">{car.name}</h3>

                    <div className="mt-4 grid grid-cols-3 gap-2 text-[10px] text-emerald-100/55">
                      <span className="rounded-lg bg-white/[.03] p-2 text-center">
                        {car.seatingCapacity
                          ? `${car.seatingCapacity} Seats`
                          : "EV"}
                      </span>

                      <span className="rounded-lg bg-white/[.03] p-2 text-center">
                        {car.rangeKm ? `${car.rangeKm} km` : "EV"}
                      </span>

                      <span className="rounded-lg bg-white/[.03] p-2 text-center">
                        {car.batteryLevel != null
                          ? `${car.batteryLevel}%`
                          : "Ready"}
                      </span>
                    </div>

                    <div className="mt-5 flex items-center justify-between gap-3">
                      <div>
                        <span className="text-xl font-black text-emerald-400">
                          {car.pricePerDay != null
                            ? `₹${Number(car.pricePerDay).toLocaleString(
                                "en-IN"
                              )}`
                            : "View"}
                        </span>

                        {car.pricePerDay != null && (
                          <span className="text-xs text-white/40"> / day</span>
                        )}
                      </div>

                      <Link
                        to="/cars"
                        className="rounded-lg border border-emerald-400/25 px-3 py-2 text-xs font-bold transition hover:bg-emerald-500 hover:text-white"
                      >
                        View Details
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="rounded-3xl border border-emerald-400/10 bg-emerald-950/50 p-12 text-center">
              <CarFront className="mx-auto h-14 w-14 text-emerald-500/30" />

              <h3 className="mt-5 text-xl font-black">Fleet coming soon</h3>

              <p className="mt-2 text-sm text-emerald-100/50">
                Check the cars page for the latest available vehicles.
              </p>

              <Link
                to="/cars"
                className="mt-6 inline-flex items-center gap-2 rounded-xl bg-emerald-500 px-6 py-3 font-bold transition hover:bg-emerald-400"
              >
                Browse Cars
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          )}

          <div className="mt-8 text-center sm:hidden">
            <Link
              to="/cars"
              className="inline-flex items-center gap-2 text-sm font-bold text-emerald-400"
            >
              View all cars
              <ChevronRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {coupons.length > 0 && (
        <section className="border-b border-emerald-900/60 bg-[#020B08] py-14">
          <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
            <div className="mb-8 flex items-end justify-between gap-5">
              <div>
                <span className="text-xs font-black uppercase tracking-[.2em] text-emerald-400">
                  Special Offers
                </span>
                <h2 className="mt-2 text-2xl font-black sm:text-3xl">
                  Save on your next ride
                </h2>
                <p className="mt-2 text-sm text-emerald-100/55 sm:text-base">
                  Use an available EcoRides coupon when you book.
                </p>
              </div>

              <Link
                to="/cars"
                className="hidden items-center gap-2 text-sm font-bold text-emerald-400 transition hover:text-emerald-300 sm:flex"
              >
                Browse Cars
                <ChevronRight className="h-4 w-4" />
              </Link>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              {coupons.map((coupon) => {
                const isPercentage = coupon.type === "PERCENTAGE";
                const value = Number(coupon.value || 0);

                return (
                  <div
                    key={coupon.code}
                    className="group rounded-2xl border border-emerald-400/15 bg-emerald-950/60 p-5 transition-all duration-300 hover:-translate-y-1 hover:border-emerald-400/40 hover:bg-emerald-900/60"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400">
                          <Tag className="h-5 w-5" />
                        </div>
                        <div>
                          <p className="text-xs font-bold uppercase tracking-wider text-emerald-300/60">
                            Coupon
                          </p>
                          <p className="mt-0.5 text-lg font-black text-white">
                            {coupon.code}
                          </p>
                        </div>
                      </div>

                      <span className="rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-black text-emerald-300">
                        {isPercentage
                          ? `${value}% OFF`
                          : `₹${value.toLocaleString("en-IN")} OFF`}
                      </span>
                    </div>

                    {coupon.expiryDate && (
                      <p className="mt-4 text-xs text-emerald-100/45">
                        Valid until{" "}
                        {new Date(
                          `${coupon.expiryDate}T00:00:00`
                        ).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </p>
                    )}

                    <Link
                      to="/cars"
                      className="mt-4 inline-flex items-center gap-1 text-xs font-black text-emerald-400 transition group-hover:text-emerald-300"
                    >
                      Use when booking
                      <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                  </div>
                );
              })}
            </div>

            <div className="mt-5 sm:hidden">
              <Link
                to="/cars"
                className="inline-flex items-center gap-2 text-sm font-bold text-emerald-400"
              >
                Browse Cars
                <ChevronRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </section>
      )}

      <section className="bg-emerald-950 py-20 lg:py-24">
        <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
          <div className="grid items-center gap-14 lg:grid-cols-2">
            <div>
              <span className="text-xs font-black uppercase tracking-[.2em] text-emerald-400">
                One platform
              </span>

              <h2 className="mt-4 text-3xl font-black leading-tight sm:text-4xl lg:text-5xl">
                Everything you need for a better rental experience.
              </h2>

              <p className="mt-6 max-w-xl text-lg leading-8 text-emerald-100/60">
                EcoRides brings vehicles, locations, bookings, secure payments
                and invoices together into one straightforward rental
                experience.
              </p>

              <Link
                to="/cars"
                className="group mt-8 inline-flex items-center gap-2 rounded-xl bg-emerald-500 px-6 py-3.5 font-black transition hover:-translate-y-1 hover:bg-emerald-400"
              >
                Explore the Fleet
                <ChevronRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              {benefits.map((benefit, index) => (
                <div
                  key={index}
                  className="group rounded-3xl border border-emerald-400/15 bg-[#04120E]/80 p-6 transition-all duration-300 hover:-translate-y-1 hover:border-emerald-400/40 hover:bg-emerald-900/70"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-400 transition group-hover:bg-emerald-500 group-hover:text-white">
                    {benefit.icon}
                  </div>

                  <h3 className="mt-5 text-lg font-black">{benefit.title}</h3>

                  <p className="mt-2 text-sm leading-6 text-emerald-100/55">
                    {benefit.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="border-t border-emerald-900/60 bg-[#020B08] py-20 lg:py-24">
        <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
          <div className="mx-auto mb-14 max-w-3xl text-center">
            <span className="text-xs font-black uppercase tracking-[.2em] text-emerald-400">
              Simple process
            </span>

            <h2 className="mt-4 text-3xl font-black sm:text-4xl">
              How EcoRides Works
            </h2>

            <p className="mt-4 text-lg text-emerald-100/55">
              From choosing your EV to getting behind the wheel, everything is
              designed to be straightforward.
            </p>
          </div>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {steps.map((step, index) => (
              <div
                key={step.number}
                className="group relative rounded-3xl border border-emerald-400/15 bg-emerald-950/60 p-7 transition-all duration-300 hover:-translate-y-2 hover:border-emerald-400/40"
              >
                <div className="flex items-center justify-between">
                  <span className="text-4xl font-black text-emerald-900">
                    {step.number}
                  </span>

                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400 transition group-hover:bg-emerald-500 group-hover:text-white">
                    {step.icon}
                  </div>
                </div>

                <h3 className="mt-7 text-xl font-black">{step.title}</h3>

                <p className="mt-3 text-sm leading-6 text-emerald-100/55">
                  {step.description}
                </p>

                <div className="mt-7 h-1 w-8 rounded-full bg-emerald-500 transition-all duration-300 group-hover:w-16" />

                {index < steps.length - 1 && (
                  <div className="absolute -right-3 top-1/2 z-10 hidden h-6 w-6 -translate-y-1/2 rounded-full border-4 border-[#020B08] bg-emerald-500 lg:block" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-emerald-900/60 bg-emerald-950 pb-20 pt-8">
        <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
          <div className="relative overflow-hidden rounded-[2rem] border border-emerald-400/25 bg-gradient-to-br from-emerald-700 via-emerald-600 to-emerald-800 px-7 py-14 text-center shadow-2xl sm:px-12 sm:py-16">
            <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full border-[35px] border-white/10" />

            <div className="absolute -bottom-24 -left-24 h-72 w-72 rounded-full border-[35px] border-white/10" />

            <div className="relative">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-white/20 bg-white/10">
                <Leaf className="h-8 w-8" />
              </div>

              <h2 className="mt-6 text-3xl font-black sm:text-4xl md:text-5xl">
                Ready to Drive the Future?
              </h2>

              <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-white/80">
                Find an available EV, choose your dates and start your journey
                with EcoRides.
              </p>

              <Link
                to="/cars"
                className="group mt-8 inline-flex items-center gap-2 rounded-xl bg-white px-8 py-4 font-black text-emerald-800 shadow-xl transition-all hover:-translate-y-1 hover:bg-emerald-50"
              >
                Book Your Ride Now
                <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />

      <style>{`
        @keyframes heroFloat {
          0%, 100% {
            transform: translateY(0);
          }

          50% {
            transform: translateY(-10px);
          }
        }

        @keyframes notificationFloat {
          0%, 100% {
            transform: translateY(0);
          }

          50% {
            transform: translateY(-7px);
          }
        }

        @keyframes fadeUp {
          from {
            opacity: 0;
            transform: translateY(18px);
          }

          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
};

export default HomePage;
