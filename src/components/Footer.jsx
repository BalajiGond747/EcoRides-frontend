import { Leaf, Car, MapPin, ShieldCheck, Mail, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white w-full">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div
          className="grid grid-cols-1 sm:grid-cols-2
                        md:grid-cols-4 gap-10"
        >
          <div className="space-y-4">
            <Link to="/" className="inline-flex items-center gap-3">
              <div
                className="bg-gradient-to-r
                              from-green-500
                              to-emerald-600
                              p-2.5 rounded-xl"
              >
                <Leaf className="w-6 h-6 text-white" />
              </div>

              <span className="text-2xl font-bold">EcoRides</span>
            </Link>

            <p className="text-gray-400 text-sm leading-relaxed">
              A simple electric vehicle rental platform designed to make
              sustainable mobility easier and more convenient.
            </p>
          </div>

          <div>
            <h4 className="font-semibold mb-5">Platform</h4>

            <ul className="space-y-3 text-gray-400 text-sm">
              <li>
                <Link
                  to="/cars"
                  className="hover:text-green-400 transition
                             inline-flex items-center gap-2"
                >
                  <Car className="w-4 h-4" />
                  Browse EVs
                </Link>
              </li>

              <li>
                <Link
                  to="/locations"
                  className="hover:text-green-400 transition
                             inline-flex items-center gap-2"
                >
                  <MapPin className="w-4 h-4" />
                  Locations
                </Link>
              </li>

              <li>
                <Link
                  to="/bookings"
                  className="hover:text-green-400 transition
                             inline-flex items-center gap-2"
                >
                  <ArrowRight className="w-4 h-4" />
                  My Bookings
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-5">Features</h4>

            <ul className="space-y-3 text-gray-400 text-sm">
              <li className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-green-500" />
                Secure authentication
              </li>

              <li className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-green-500" />
                Secure payments
              </li>

              <li className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-green-500" />
                Digital invoices
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-5">Support</h4>

            <ul className="space-y-3 text-gray-400 text-sm">
              <li>
                <span className="inline-flex items-center gap-2">
                  <Mail className="w-4 h-4 text-green-500" />
                  Support through EcoRides
                </span>
              </li>

              <li className="leading-relaxed">
                Need help with a booking or payment? Please use the available
                support options in the application.
              </li>
            </ul>
          </div>
        </div>

        <div
          className="border-t border-gray-800 mt-10 pt-6
                        flex flex-col md:flex-row
                        items-center justify-between
                        gap-4"
        >
          <p className="text-gray-500 text-sm">
            © {new Date().getFullYear()} EcoRides. All rights reserved.
          </p>

          <div
            className="flex items-center gap-2
                          text-gray-500 text-sm"
          >
            <Leaf className="w-4 h-4 text-green-500" />

            <span>Driving towards a sustainable future.</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
