import React, { useEffect, useState } from "react";

import {
  FaCar,
  FaUsers,
  FaMoneyCheckAlt,
  FaReceipt,
  FaChartLine,
  FaCog,
  FaSignOutAlt,
  FaBars,
  FaTimes,
  FaSearch,
  FaPlus,
  FaFileInvoiceDollar,
  FaHome,
  FaTags,
} from "react-icons/fa";

import {
  Routes,
  Route,
  Navigate,
  useNavigate,
  useLocation,
  Link,
} from "react-router-dom";

import { Bar, Doughnut } from "react-chartjs-2";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";

import { ChevronDown, LogOut } from "lucide-react";

import api from "../../services/api";
import { logout } from "../../services/auth";

import AdminCars from "./AdminCars";
import AdminBookings from "./AdminBookings";
import AdminUsers from "./AdminUsers";
import AdminInvoices from "./AdminInvoices";
import AdminCoupons from "./AdminCoupons";
import AdminLocations from "./AdminLocations";
import { FaMapMarkerAlt } from "react-icons/fa";

import AdminPaymentsPage from "./AdminPayments";
import AdminProfile from "./AdminProfile";
import { UserCircle } from "lucide-react";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Tooltip,
  Legend
);

const DashboardOverview = () => {
  const [cars, setCars] = useState([]);

  const [users, setUsers] = useState([]);

  const [bookings, setBookings] = useState([]);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [carsResponse, usersResponse, bookingsResponse] = await Promise.all(
        [
          api.get("/cars", {
            params: {
              page: 0,
              size: 100,
              sortBy: "createdAt",
              sortDir: "desc",
            },
          }),

          api.get("/users", {
            params: {
              page: 0,
              size: 100,
              sortBy: "createdAt",
              sortDir: "desc",
            },
          }),

          api.get("/bookings", {
            params: {
              page: 0,
              size: 100,
              sortBy: "createdAt",
              sortDir: "desc",
            },
          }),
        ]
      );

      setCars(carsResponse.data?.data?.content || []);

      setUsers(usersResponse.data?.data?.content || []);

      setBookings(bookingsResponse.data?.data?.content || []);
    } catch (error) {
      console.error("Dashboard error:", error);
    } finally {
      setLoading(false);
    }
  };
  const revenue = bookings.reduce(
    (total, booking) => total + Number(booking.totalAmount || 0),
    0
  );

  const activeBookings = bookings.filter(
    (booking) => booking.status === "ACTIVE"
  ).length;

  const availableCars = cars.filter((car) => car.status === "AVAILABLE").length;

  const bookingStatusData = {
    labels: ["Pending", "Confirmed", "Active", "Completed", "Cancelled"],

    datasets: [
      {
        data: [
          bookings.filter((b) => b.status === "PENDING").length,
          bookings.filter((b) => b.status === "CONFIRMED").length,
          bookings.filter((b) => b.status === "ACTIVE").length,
          bookings.filter((b) => b.status === "COMPLETED").length,
          bookings.filter((b) => b.status === "CANCELLED").length,
        ],

        backgroundColor: [
          "#F59E0B",
          "#3B82F6",
          "#8B5CF6",
          "#10B981",
          "#EF4444",
        ],

        borderColor: "#FFFFFF",
        borderWidth: 2,

        hoverOffset: 8,
      },
    ],
  };

  const carStatusData = {
    labels: [
      "Available",
      "Booked",
      "In Use",
      "Charging",
      "Maintenance",
      "Inactive",
    ],

    datasets: [
      {
        label: "Cars",

        data: [
          cars.filter((c) => c.status === "AVAILABLE").length,
          cars.filter((c) => c.status === "BOOKED").length,
          cars.filter((c) => c.status === "IN_USE").length,
          cars.filter((c) => c.status === "CHARGING").length,
          cars.filter((c) => c.status === "MAINTENANCE").length,
          cars.filter((c) => c.status === "INACTIVE").length,
        ],

        backgroundColor: [
          "#10B981",
          "#3B82F6",
          "#8B5CF6",
          "#06B6D4",
          "#F59E0B",
          "#6B7280",
        ],

        borderColor: [
          "#059669",
          "#2563EB",
          "#7C3AED",
          "#0891B2",
          "#D97706",
          "#4B5563",
        ],

        borderWidth: 1,
        borderRadius: 8,
        hoverBackgroundColor: [
          "#34D399",
          "#60A5FA",
          "#A78BFA",
          "#22D3EE",
          "#FBBF24",
          "#9CA3AF",
        ],
      },
    ],
  };

  const statsData = [
    {
      title: "Total Cars",
      value: cars.length,
      icon: <FaCar className="text-green-500" />,
    },

    {
      title: "Available Cars",
      value: availableCars,
      icon: <FaCar className="text-emerald-500" />,
    },

    {
      title: "Total Users",
      value: users.length,
      icon: <FaUsers className="text-blue-500" />,
    },

    {
      title: "Active Bookings",
      value: activeBookings,
      icon: <FaReceipt className="text-amber-500" />,
    },

    {
      title: "Revenue",
      value: `₹${revenue.toLocaleString()}`,
      icon: <FaMoneyCheckAlt className="text-emerald-500" />,
    },
  ];

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow p-10 text-center">
        Loading dashboard...
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-800 mb-6">
        Dashboard Overview
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-5 mb-8">
        {statsData.map((stat, index) => (
          <div key={index} className="bg-white rounded-lg shadow p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  {stat.title}
                </p>

                <p className="text-2xl font-bold text-gray-800 mt-1">
                  {stat.value}
                </p>
              </div>

              <div className="text-3xl">{stat.icon}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-5">
            Booking Status
          </h3>

          <div className="max-w-sm mx-auto">
            <Doughnut data={bookingStatusData} />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-5">
            Fleet Status
          </h3>

          <Bar
            data={carStatusData}
            options={{
              responsive: true,
              plugins: {
                legend: {
                  display: false,
                },
              },
            }}
          />
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          Recent Bookings
        </h3>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Booking
                </th>

                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  User
                </th>

                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Car
                </th>

                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Amount
                </th>

                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Status
                </th>
              </tr>
            </thead>

            <tbody className="bg-white divide-y divide-gray-200">
              {bookings.slice(0, 8).map((booking) => (
                <tr key={booking.id}>
                  <td className="px-6 py-4 text-sm font-medium">
                    {booking.bookingReference || `#${booking.id}`}
                  </td>

                  <td className="px-6 py-4 text-sm text-gray-500">
                    {booking.userId}
                  </td>

                  <td className="px-6 py-4 text-sm text-gray-500">
                    {booking.carId}
                  </td>

                  <td className="px-6 py-4 text-sm text-gray-500">
                    ₹{booking.totalAmount || 0}
                  </td>

                  <td className="px-6 py-4">
                    <span className="px-3 py-1 rounded-full bg-green-100 text-green-700 text-xs font-semibold">
                      {booking.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const AdminDashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [profileOpen, setProfileOpen] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  const isActiveTab = (path) => location.pathname === `/admin${path}`;

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <div
        className={`bg-green-800 text-white w-64 flex-shrink-0 transition-all duration-300 ${
          sidebarOpen ? "ml-0" : "-ml-64"
        } md:ml-0`}
      >
        <div className="p-4 flex items-center justify-between">
          <div className="flex items-center">
            <div className="bg-gradient-to-r from-green-500 to-emerald-500 p-2 rounded-full mr-2">
              <FaCar className="w-5 h-5 text-white" />
            </div>

            <h1 className="text-xl font-bold">EcoRide Admin</h1>
          </div>

          <button className="md:hidden" onClick={() => setSidebarOpen(false)}>
            <FaTimes />
          </button>
        </div>

        <nav className="mt-6">
          <Link
            to="/"
            className="px-4 py-3 flex items-center hover:bg-green-700"
          >
            <FaHome className="mr-3" />
            Back to Main Site
          </Link>

          <MenuItem
            active={isActiveTab("") || isActiveTab("/dashboard")}
            icon={<FaChartLine />}
            label="Dashboard"
            onClick={() => navigate("/admin/dashboard")}
          />

          <MenuItem
            active={isActiveTab("/cars")}
            icon={<FaPlus />}
            label="Cars"
            onClick={() => navigate("/admin/cars")}
          />

          <MenuItem
            active={isActiveTab("/bookings")}
            icon={<FaReceipt />}
            label="Bookings"
            onClick={() => navigate("/admin/bookings")}
          />

          <MenuItem
            active={isActiveTab("/payments")}
            icon={<FaMoneyCheckAlt />}
            label="Payments"
            onClick={() => navigate("/admin/payments")}
          />

          <MenuItem
            active={isActiveTab("/users")}
            icon={<FaUsers />}
            label="Users"
            onClick={() => navigate("/admin/users")}
          />

          <MenuItem
            active={isActiveTab("/invoices")}
            icon={<FaFileInvoiceDollar />}
            label="Invoices"
            onClick={() => navigate("/admin/invoices")}
          />

          <MenuItem
            active={isActiveTab("/coupons")}
            icon={<FaTags />}
            label="Coupons"
            onClick={() => navigate("/admin/coupons")}
          />

          <MenuItem
            active={isActiveTab("/locations")}
            icon={<FaMapMarkerAlt />}
            label="Locations"
            onClick={() => navigate("/admin/locations")}
          />
        </nav>

        <div className="absolute bottom-0 w-64 p-4 border-t border-green-700">
          <div className="flex items-center hover:bg-green-700 p-2 rounded cursor-pointer">
            <FaCog className="mr-3" />
            <span>Settings</span>
          </div>

          <button
            onClick={handleLogout}
            className="w-full flex items-center hover:bg-green-700 p-2 rounded"
          >
            <FaSignOutAlt className="mr-3" />
            <span>Logout</span>
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-auto">
        <header className="bg-white shadow-sm">
          <div className="flex items-center justify-between p-4">
            <button className="md:hidden" onClick={() => setSidebarOpen(true)}>
              <FaBars className="text-gray-600" />
            </button>

            <div className="flex-1 mx-4">
              <h2 className="text-xl font-semibold text-gray-800">
                {isActiveTab("") || isActiveTab("/dashboard")
                  ? "Dashboard Overview"
                  : ""}

                {isActiveTab("/cars") && "Car Management"}

                {isActiveTab("/bookings") && "Booking Management"}

                {isActiveTab("/payments") && "Payment Management"}

                {isActiveTab("/users") && "User Management"}

                {isActiveTab("/invoices") && "Invoice Management"}

                {isActiveTab("/coupons") && "Coupon Management"}
              </h2>
            </div>

            <div className="flex items-center">
              <div className="relative hidden sm:block">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaSearch className="text-gray-400" />
                </div>

                <input
                  type="text"
                  placeholder="Search..."
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>

              <div className="relative ml-4">
                <button
                  type="button"
                  onClick={() => setProfileOpen((previous) => !previous)}
                  className="flex items-center gap-2.5
               px-3 py-2 rounded-full
               bg-emerald-600
               border-2 border-white/70
               text-white
               shadow-md
               hover:bg-emerald-500
               hover:border-white
               transition-all duration-200"
                  title="Admin Profile"
                >
                  <div
                    className="h-9 w-9 rounded-full
                 bg-white
                 border border-emerald-200
                 flex items-center justify-center
                 shadow-sm"
                  >
                    <UserCircle className="w-6 h-6 text-emerald-600" />
                  </div>

                  <div className="hidden sm:block text-left">
                    <p className="text-sm font-semibold leading-tight text-white">
                      Admin Profile
                    </p>
                  </div>

                  <ChevronDown
                    className={`w-4 h-4 transition-transform duration-200 ${
                      profileOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {profileOpen && (
                  <div
                    className="absolute right-0 mt-2 w-56
                 bg-white rounded-2xl
                 shadow-xl
                 border border-emerald-100
                 overflow-hidden z-50"
                  >
                    <Link
                      to="/admin/profile"
                      onClick={() => setProfileOpen(false)}
                      className="flex items-center gap-3
                   px-4 py-3
                   text-gray-700
                   hover:bg-emerald-50
                   transition"
                    >
                      <UserCircle className="w-5 h-5 text-emerald-600" />

                      <div>
                        <p className="font-semibold">My Profile</p>

                        <p className="text-xs text-gray-500">
                          Administrator account
                        </p>
                      </div>
                    </Link>

                    <div className="border-t border-gray-100" />

                    <button
                      type="button"
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3
                   px-4 py-3
                   text-red-600
                   hover:bg-red-50
                   transition"
                    >
                      <LogOut className="w-5 h-5" />

                      <div className="text-left">
                        <p className="font-semibold">Logout</p>
                      </div>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>

        <main className="p-6">
          <Routes>
            <Route index element={<Navigate to="/admin/dashboard" replace />} />

            <Route path="dashboard" element={<DashboardOverview />} />

            <Route path="cars" element={<AdminCars />} />

            <Route path="bookings" element={<AdminBookings />} />

            <Route path="payments" element={<AdminPaymentsPage />} />

            <Route path="users" element={<AdminUsers />} />

            <Route path="invoices" element={<AdminInvoices />} />

            <Route path="coupons" element={<AdminCoupons />} />

            <Route path="locations" element={<AdminLocations />} />

            <Route path="profile" element={<AdminProfile />} />
          </Routes>
        </main>
      </div>
    </div>
  );
};

const MenuItem = ({ active, icon, label, onClick }) => (
  <div
    className={`px-4 py-3 flex items-center cursor-pointer ${
      active ? "bg-green-700" : "hover:bg-green-700"
    }`}
    onClick={onClick}
  >
    <span className="mr-3">{icon}</span>

    <span>{label}</span>
  </div>
);

export default AdminDashboard;
