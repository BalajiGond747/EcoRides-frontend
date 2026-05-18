import React from "react";
import { Leaf, Mail, Phone, MapPinned } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-gray-950 text-gray-300 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Section */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-2xl bg-linear-to-br from-green-500 to-emerald-600 flex items-center justify-center shadow-lg shadow-green-900/40">
                <Leaf size={20} className="text-white" />
              </div>

              <div>
                <h3 className="text-lg font-black text-white">EcoRides</h3>

                <p className="text-xs text-gray-500">
                  Sustainable transportation
                </p>
              </div>
            </div>

            <p className="text-sm text-gray-400 leading-relaxed mb-5">
              Building a greener future through smart transportation and
              eco-friendly ride sharing solutions.
            </p>

            {/* Social Icons */}
            <div className="flex items-center gap-3">
              {["FB", "IG", "TW"].map((item, index) => (
                <button
                  key={index}
                  className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-green-600 hover:border-green-500 transition-all text-sm font-bold"
                >
                  {item}
                </button>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-bold mb-5">Quick Links</h4>

            <div className="space-y-3 text-sm">
              {["About Us", "Services", "Pricing", "Contact", "Support"].map(
                (item) => (
                  <a
                    key={item}
                    href="#"
                    className="block text-gray-400 hover:text-green-400 transition-colors"
                  >
                    {item}
                  </a>
                )
              )}
            </div>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-white font-bold mb-5">Services</h4>

            <div className="space-y-3 text-sm">
              {[
                "Ride Sharing",
                "Eco Tracking",
                "Corporate Travel",
                "Daily Commute",
                "Bike Pooling",
              ].map((item) => (
                <a
                  key={item}
                  href="#"
                  className="block text-gray-400 hover:text-green-400 transition-colors"
                >
                  {item}
                </a>
              ))}
            </div>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white font-bold mb-5">Contact</h4>

            <div className="space-y-4 text-sm">
              <div className="flex items-start gap-3">
                <Phone size={17} className="text-green-500 mt-0.5" />
                <span className="text-gray-400">+91 9876543210</span>
              </div>

              <div className="flex items-start gap-3">
                <Mail size={17} className="text-green-500 mt-0.5" />
                <span className="text-gray-400">support@ecorides.com</span>
              </div>

              <div className="flex items-start gap-3">
                <MapPinned size={17} className="text-green-500 mt-0.5" />
                <span className="text-gray-400">
                  Hyderabad, Telangana, India
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-white/10 pt-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-gray-500 text-center md:text-left">
            © 2026 EcoRides. All rights reserved.
          </p>

          <div className="flex items-center gap-6 text-sm text-gray-500">
            <a href="#" className="hover:text-green-400 transition-colors">
              Privacy Policy
            </a>

            <a href="#" className="hover:text-green-400 transition-colors">
              Terms & Conditions
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
