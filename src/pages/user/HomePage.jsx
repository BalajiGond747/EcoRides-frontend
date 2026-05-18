import React from "react";

import { Leaf, Bike, ShieldCheck, ArrowRight } from "lucide-react";

import { Link } from "react-router-dom";

import Header from "./Header";
import Footer from "./Footer";

export default function HomePage() {
  const token = localStorage.getItem("token");

  return (
    <div className="min-h-screen bg-white ">
      <Header />

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 bg-linear-to-br from-green-50 via-white to-emerald-50" />

        <div className="absolute w-125 h-125 rounded-full bg-green-200/30 blur-3xl -top-32 -right-32" />

        <div className="absolute w-100 h-100 rounded-full bg-emerald-200/30 blur-3xl -bottom-24 -left-24" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
          <div className="grid lg:grid-cols-2 gap-14 items-center">
            {/* Left Content */}
            <div>
              <div className="inline-flex items-center gap-2 bg-green-100 border border-green-200 rounded-full px-4 py-1.5 mb-6">
                <Leaf size={14} className="text-green-700" />

                <span className="text-xs font-semibold text-green-700">
                  Sustainable Ride Sharing Platform
                </span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-gray-900 leading-tight mb-6">
                Ride Smarter.
                <span className="block text-green-600">Travel Greener.</span>
              </h1>

              <p className="text-base sm:text-lg text-gray-600 leading-relaxed max-w-xl mb-8">
                EcoRides helps people travel sustainably through smart ride
                sharing, eco-friendly transport options, and affordable daily
                commuting.
              </p>

              {/* Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 mb-10">
                <Link
                  to={token ? "/dashboard" : "/register"}
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-linear-to-r from-green-500 to-emerald-600 text-white font-bold rounded-2xl hover:from-green-600 hover:to-emerald-700 transition-all shadow-lg shadow-green-200"
                >
                  {token ? "Go to Dashboard" : "Start Riding"}

                  <ArrowRight size={18} />
                </Link>

                <Link
                  to="/about"
                  className="px-6 py-3 border border-green-200 bg-white text-green-700 font-semibold rounded-2xl hover:bg-green-50 transition-all text-center"
                >
                  Learn More
                </Link>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-5 max-w-lg">
                {[
                  { value: "25K+", label: "Happy Riders" },
                  { value: "120+", label: "Cities Covered" },
                  { value: "98%", label: "Eco Savings" },
                ].map((item) => (
                  <div
                    key={item.label}
                    className="bg-white border border-green-100 rounded-2xl p-4 shadow-sm shadow-green-100"
                  >
                    <h3 className="text-2xl font-black text-green-600 mb-1">
                      {item.value}
                    </h3>

                    <p className="text-xs text-gray-500">{item.label}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Hero Image */}
            <div className="relative">
              <div className="relative rounded-[2.5rem] overflow-hidden shadow-2xl shadow-green-100 border border-green-100 bg-white">
                <img
                  src="https://images.unsplash.com/photo-1553440569-bcc63803a83d?q=80&w=1400&auto=format&fit=crop"
                  alt="EcoRides"
                  className="w-full h-125 object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <span className="inline-block text-sm font-bold text-green-600 bg-green-100 px-4 py-1.5 rounded-full mb-4">
              Why Choose EcoRides
            </span>

            <h2 className="text-3xl sm:text-4xl font-black text-gray-900 mb-4">
              Smart transportation for modern cities
            </h2>

            <p className="text-gray-600 max-w-2xl mx-auto leading-relaxed">
              Experience sustainable transportation designed for comfort,
              affordability, and a cleaner future.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-7">
            {[
              {
                icon: Bike,
                title: "Affordable Rides",
                description:
                  "Save money on daily transportation with optimized shared rides.",
              },
              {
                icon: Leaf,
                title: "Eco Friendly",
                description:
                  "Reduce pollution and carbon emissions with shared rides.",
              },
              {
                icon: ShieldCheck,
                title: "Safe & Verified",
                description:
                  "All drivers and rides are verified for secure journeys.",
              },
            ].map((feature, index) => {
              const Icon = feature.icon;

              return (
                <div
                  key={index}
                  className="group bg-white border border-green-100 rounded-3xl p-7 hover:-translate-y-2 hover:shadow-2xl hover:shadow-green-100 transition-all duration-300"
                >
                  <div className="w-14 h-14 rounded-2xl bg-linear-to-br from-green-500 to-emerald-600 flex items-center justify-center shadow-lg shadow-green-200 mb-6">
                    <Icon size={26} className="text-white" />
                  </div>

                  <h3 className="text-xl font-bold text-gray-900 mb-3">
                    {feature.title}
                  </h3>

                  <p className="text-gray-600 leading-relaxed text-sm">
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Cars Section */}
      <section className="py-20 bg-green-50/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <span className="inline-block text-sm font-bold text-green-600 bg-green-100 px-4 py-1.5 rounded-full mb-4">
              Our Eco Fleet
            </span>

            <h2 className="text-3xl sm:text-4xl font-black text-gray-900 mb-4">
              Comfortable rides for every journey
            </h2>

            <p className="text-gray-600 max-w-2xl mx-auto">
              Choose from our modern eco-friendly vehicle collection.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                name: "Eco Sedan",
                image:
                  "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?q=80&w=1400&auto=format&fit=crop",
              },
              {
                name: "Family SUV",
                image:
                  "https://images.unsplash.com/photo-1503376780353-7e6692767b70?q=80&w=1400&auto=format&fit=crop",
              },
              {
                name: "Premium Ride",
                image:
                  "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?q=80&w=1400&auto=format&fit=crop",
              },
            ].map((car, index) => (
              <div
                key={index}
                className="group bg-white rounded-4xl overflow-hidden border border-green-100 shadow-lg hover:-translate-y-2 hover:shadow-2xl hover:shadow-green-100 transition-all duration-300"
              >
                <div className="overflow-hidden">
                  <img
                    src={car.image}
                    alt={car.name}
                    className="w-full h-56 object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                </div>

                <div className="p-6">
                  <h3 className="text-xl font-black text-gray-900 mb-2">
                    {car.name}
                  </h3>

                  <p className="text-sm text-gray-600 mb-5">
                    Smart eco transportation with premium comfort.
                  </p>

                  <button className="w-full py-3 bg-linear-to-r from-green-500 to-emerald-600 text-white rounded-2xl font-bold hover:from-green-600 hover:to-emerald-700 transition-all">
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Business Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left */}
            <div>
              <span className="inline-block text-sm font-bold text-green-600 bg-green-100 px-4 py-1.5 rounded-full mb-5">
                Why Businesses Trust Us
              </span>

              <h2 className="text-4xl font-black text-gray-900 leading-tight mb-6">
                Smart transportation solutions for modern India
              </h2>

              <p className="text-gray-600 leading-relaxed mb-8">
                EcoRides provides secure, eco-friendly, and affordable ride
                sharing solutions trusted by thousands.
              </p>

              <div className="space-y-5">
                {[
                  "Verified and trained drivers",
                  "Affordable ride pricing",
                  "Real-time booking system",
                  "Eco-friendly transportation",
                ].map((item, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <div className="w-7 h-7 rounded-full bg-green-100 flex items-center justify-center">
                      <ShieldCheck size={15} className="text-green-700" />
                    </div>

                    <p className="font-medium text-gray-700">{item}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Right */}
            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1511919884226-fd3cad34687c?q=80&w=1400&auto=format&fit=crop"
                alt="EcoRides"
                className="rounded-[2.5rem] shadow-2xl border border-green-100"
              />
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative overflow-hidden rounded-[2.5rem] bg-linear-to-r from-green-600 to-emerald-700 p-10 lg:p-14 shadow-2xl shadow-green-200">
            <div className="absolute w-72 h-72 rounded-full bg-white/10 -top-20 -right-16 blur-2xl" />

            <div className="absolute w-72 h-72 rounded-full bg-white/10 -bottom-24 -left-20 blur-2xl" />

            <div className="relative text-center text-white max-w-3xl mx-auto">
              <h2 className="text-3xl sm:text-4xl font-black mb-5 leading-tight">
                Join thousands of eco-conscious riders today
              </h2>

              <p className="text-green-50 leading-relaxed mb-8 text-base sm:text-lg">
                Start your sustainable commuting journey with EcoRides.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  to={token ? "/dashboard" : "/register"}
                  className="px-7 py-3 bg-white text-green-700 font-bold rounded-2xl hover:bg-green-50 transition-all"
                >
                  {token ? "Open Dashboard" : "Create Account"}
                </Link>

                <Link
                  to={token ? "/book-ride" : "/login"}
                  className="px-7 py-3 border border-white/30 text-white font-semibold rounded-2xl hover:bg-white/10 transition-all"
                >
                  {token ? "Book Ride" : "Sign In"}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
