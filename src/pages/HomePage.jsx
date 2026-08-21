import React from "react";
import {
  ArrowRight,
  Battery,
  Leaf,
  Zap,
  Shield,
  Clock,
  Users,
  Car,
  CheckCircle,
  MapPin,
  CreditCard,
  FileText,
} from "lucide-react";
import { Link } from "react-router-dom";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const HomePage = () => {
  const features = [
    {
      icon: <Battery className="w-6 h-6 text-green-600" />,
      title: "Electric Vehicles",
      description:
        "Choose from a growing selection of electric vehicles available for your next journey.",
    },
    {
      icon: <Leaf className="w-6 h-6 text-green-600" />,
      title: "Drive Sustainably",
      description:
        "Enjoy comfortable electric mobility while making a more environmentally friendly choice.",
    },
    {
      icon: <Zap className="w-6 h-6 text-green-600" />,
      title: "Simple Booking",
      description:
        "Find an available vehicle, select your dates and location, and create your booking easily.",
    },
    {
      icon: <Shield className="w-6 h-6 text-green-600" />,
      title: "Secure Payments",
      description:
        "Complete your booking with secure Razorpay payment verification.",
    },
  ];

  const benefits = [
    {
      icon: <Car className="w-5 h-5 text-green-600" />,
      title: "Multiple EV Options",
      description: "Explore the available electric vehicles in our fleet.",
    },
    {
      icon: <MapPin className="w-5 h-5 text-blue-600" />,
      title: "Flexible Locations",
      description: "Choose from available rental locations.",
    },
    {
      icon: <CreditCard className="w-5 h-5 text-emerald-600" />,
      title: "Online Payments",
      description: "Pay securely through our integrated payment flow.",
    },
    {
      icon: <FileText className="w-5 h-5 text-green-600" />,
      title: "Digital Invoices",
      description: "Access and download your booking invoice after payment.",
    },
  ];

  const steps = [
    {
      number: "01",
      title: "Choose an EV",
      description:
        "Browse the available electric vehicles and find one that suits your journey.",
    },
    {
      number: "02",
      title: "Select Your Trip",
      description: "Choose your rental dates and preferred location.",
    },
    {
      number: "03",
      title: "Book & Pay",
      description: "Create your booking and complete the payment securely.",
    },
    {
      number: "04",
      title: "Enjoy Your Ride",
      description: "Your confirmed booking is ready for your electric journey.",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-green-50 via-white to-blue-50">
      <Navbar />

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-r from-green-100 via-white to-blue-50">
        <div className="absolute -top-24 -right-24 w-72 h-72 bg-green-200/40 rounded-full blur-3xl" />
        <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-blue-200/40 rounded-full blur-3xl" />

        <div className="relative max-w-7xl mx-auto px-6 py-16 md:py-24">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Hero Content */}
            <div>
              <div
                className="inline-flex items-center gap-2
                              bg-white border border-green-100
                              shadow-sm rounded-full
                              px-4 py-2 mb-6"
              >
                <Leaf className="w-4 h-4 text-green-600" />

                <span className="text-sm font-semibold text-green-700">
                  Smarter Electric Mobility
                </span>
              </div>

              <h1
                className="text-4xl md:text-6xl font-bold
                             text-gray-900 leading-tight mb-6"
              >
                Drive the <span className="text-green-600">Future</span> Today
              </h1>

              <p
                className="text-gray-600 text-lg md:text-xl
                            leading-relaxed max-w-xl mb-8"
              >
                Discover electric vehicles, choose your location, book your
                journey, and enjoy a simple and sustainable rental experience
                with EcoRides.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  to="/cars"
                  className="inline-flex items-center justify-center
                             gap-2 bg-green-600 text-white
                             px-7 py-3.5 rounded-full
                             font-semibold
                             hover:bg-green-700 transition
                             shadow-lg shadow-green-600/20"
                >
                  Explore EVs
                  <ArrowRight className="w-5 h-5" />
                </Link>

                <Link
                  to="/locations"
                  className="inline-flex items-center justify-center
                             gap-2 bg-white text-green-700
                             border border-green-200
                             px-7 py-3.5 rounded-full
                             font-semibold
                             hover:bg-green-50 transition"
                >
                  <MapPin className="w-5 h-5" />
                  View Locations
                </Link>
              </div>
            </div>
            {/* Hero Visual */}
            <div className="relative">
              <div
                className="bg-white/90 backdrop-blur-sm
               rounded-[2rem]
               shadow-2xl
               border border-green-100
               p-4 md:p-6"
              >
                <div
                  className="relative
                 bg-gradient-to-br
                 from-green-100
                 via-white
                 to-blue-100
                 rounded-[1.5rem]
                 min-h-[340px]
                 overflow-hidden"
                >
                  {/* Background scenery */}
                  <div className="absolute inset-0">
                    {/* Sun */}
                    <div
                      className="absolute top-8 right-10
                     w-16 h-16
                     rounded-full
                     bg-yellow-300/70
                     blur-[1px]"
                    />

                    {/* Hills */}
                    <div
                      className="absolute bottom-28 left-0
                     w-full h-32
                     bg-green-200/70
                     rounded-[50%_50%_0_0]"
                    />

                    {/* Trees */}
                    <div className="absolute bottom-24 left-8 text-5xl">🌳</div>

                    <div className="absolute bottom-28 right-8 text-5xl">
                      🌳
                    </div>

                    <div className="absolute bottom-32 left-1/3 text-4xl">
                      🌲
                    </div>

                    {/* Road */}
                    <div
                      className="absolute bottom-0 left-0
                     w-full h-28
                     bg-gray-700"
                    />

                    {/* Road markings */}
                    <div
                      className="absolute bottom-12 left-0
                     w-full flex justify-around"
                    >
                      <span className="w-16 h-1.5 bg-white rounded-full" />
                      <span className="w-16 h-1.5 bg-white rounded-full" />
                      <span className="w-16 h-1.5 bg-white rounded-full" />
                      <span className="w-16 h-1.5 bg-white rounded-full" />
                    </div>
                  </div>

                  {/* Moving family EV */}
                  <div
                    className="absolute bottom-14 left-0
                   z-20
                   animate-[drive_7s_ease-in-out_infinite]"
                  >
                    <div className="relative">
                      {/* Family */}
                      <div
                        className="absolute
                       -top-16 left-10
                       text-3xl
                       whitespace-nowrap
                       drop-shadow-md"
                      >
                        👨‍👩‍👧
                      </div>

                      {/* Car */}
                      <div
                        className="relative
                       w-64 md:w-72
                       h-24
                       bg-gradient-to-r
                       from-white
                       to-green-50
                       rounded-[3rem_3rem_1rem_1rem]
                       border-4
                       border-green-200
                       shadow-xl"
                      >
                        {/* Windows */}
                        <div
                          className="absolute top-3 left-12
                         w-28 h-10
                         bg-gradient-to-br
                         from-blue-200
                         to-blue-400
                         rounded-t-[2rem]
                         border-2
                         border-gray-600"
                        />

                        {/* Front windshield */}
                        <div
                          className="absolute top-3 right-10
                         w-12 h-10
                         bg-blue-300
                         rounded-tr-[2rem]
                         border-2
                         border-gray-600"
                        />

                        {/* Door line */}
                        <div
                          className="absolute top-14 left-20
                         w-20 h-8
                         border-r
                         border-gray-300"
                        />

                        {/* EV badge */}
                        <div
                          className="absolute top-14 left-4
                         w-8 h-8
                         rounded-full
                         bg-green-600
                         flex items-center
                         justify-center"
                        >
                          <Zap className="w-4 h-4 text-white" />
                        </div>

                        {/* Wheels */}
                        <div
                          className="absolute -bottom-5 left-10
                         w-11 h-11
                         rounded-full
                         bg-gray-900
                         border-4
                         border-gray-400
                         shadow-md"
                        />

                        <div
                          className="absolute -bottom-5 right-10
                         w-11 h-11
                         rounded-full
                         bg-gray-900
                         border-4
                         border-gray-400
                         shadow-md"
                        />

                        {/* Headlight */}
                        <div
                          className="absolute right-1 top-14
                         w-4 h-3
                         rounded-full
                         bg-yellow-200
                         shadow-[0_0_10px_rgba(253,224,71,0.8)]"
                        />
                      </div>

                      {/* Green motion trail */}
                      <div
                        className="absolute
                       -left-20
                       bottom-3
                       w-20 h-1
                       bg-green-300
                       rounded-full
                       opacity-70"
                      />

                      <div
                        className="absolute
                       -left-12
                       bottom-8
                       w-12 h-1
                       bg-blue-200
                       rounded-full
                       opacity-70"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Animation styles */}
              <style>
                {`
      @keyframes drive {
        0% {
          transform: translateX(-20px);
        }

        50% {
          transform: translateX(90px);
        }

        100% {
          transform: translateX(-20px);
        }
      }

      @keyframes float {
        0%,
        100% {
          transform: translateY(0);
        }

        50% {
          transform: translateY(-8px);
        }
      }
    `}
              </style>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <div
              className="inline-flex items-center gap-2
                            text-green-600 font-semibold mb-3"
            >
              <Leaf className="w-5 h-5" />

              <span>Why Choose EcoRides?</span>
            </div>

            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Everything you need for a better EV rental
            </h2>

            <p className="text-gray-600 text-lg">
              From finding the right vehicle to completing your booking,
              EcoRides keeps the experience simple.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-gradient-to-br
                           from-green-50
                           to-white
                           border border-green-100
                           rounded-2xl
                           p-6
                           hover:shadow-lg
                           hover:-translate-y-1
                           transition-all"
              >
                <div
                  className="w-12 h-12 rounded-xl
                                bg-green-100
                                flex items-center
                                justify-center mb-5"
                >
                  {feature.icon}
                </div>

                <h3 className="font-bold text-gray-900 text-lg mb-2">
                  {feature.title}
                </h3>

                <p className="text-gray-600 text-sm leading-relaxed">
                  {feature.description}
                </p>

                <CheckCircle
                  className="w-5 h-5
                                         text-green-500
                                         mt-5"
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section
        className="py-16
                          bg-gradient-to-r
                          from-green-50
                          to-blue-50"
      >
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <p className="text-green-600 font-semibold mb-3">
                Built for convenience
              </p>

              <h2
                className="text-3xl md:text-4xl
                             font-bold text-gray-900 mb-5"
              >
                A complete rental experience
              </h2>

              <p className="text-gray-600 text-lg leading-relaxed">
                EcoRides brings vehicles, locations, bookings, payments and
                invoices together in one platform.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              {benefits.map((benefit, index) => (
                <div
                  key={index}
                  className="bg-white rounded-2xl
                             p-5 shadow-sm
                             border border-green-100"
                >
                  <div
                    className="w-10 h-10 rounded-xl
                                  bg-gray-50
                                  flex items-center
                                  justify-center mb-4"
                  >
                    {benefit.icon}
                  </div>

                  <h3 className="font-semibold text-gray-900 mb-1">
                    {benefit.title}
                  </h3>

                  <p className="text-sm text-gray-600">{benefit.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <p className="text-green-600 font-semibold mb-3">Simple process</p>

            <h2
              className="text-3xl md:text-4xl
                           font-bold text-gray-900"
            >
              How EcoRides Works
            </h2>
          </div>

          <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-6">
            {steps.map((step) => (
              <div
                key={step.number}
                className="relative bg-gray-50
                           rounded-2xl p-6
                           border border-gray-100"
              >
                <span
                  className="text-4xl font-bold
                                 text-green-100"
                >
                  {step.number}
                </span>

                <h3
                  className="font-bold text-gray-900
                               text-lg mt-3 mb-2"
                >
                  {step.title}
                </h3>

                <p className="text-gray-600 text-sm leading-relaxed">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section
        className="py-16
                          bg-gradient-to-r
                          from-green-600
                          to-emerald-700
                          text-white"
      >
        <div className="max-w-4xl mx-auto px-6 text-center">
          <div
            className="w-14 h-14 rounded-2xl
                          bg-white/15
                          flex items-center
                          justify-center
                          mx-auto mb-5"
          >
            <Leaf className="w-7 h-7" />
          </div>

          <h2
            className="text-3xl md:text-4xl
                         font-bold mb-4"
          >
            Ready to go electric?
          </h2>

          <p className="text-green-50 text-lg mb-8">
            Find an EV, choose your dates, and start your journey with EcoRides.
          </p>

          <Link
            to="/cars"
            className="inline-flex items-center
                       gap-2
                       bg-white
                       text-green-700
                       px-7 py-3.5
                       rounded-full
                       font-semibold
                       hover:bg-green-50
                       transition
                       shadow-lg"
          >
            Browse Available EVs
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default HomePage;
