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
        [api.get("/cars"), api.get("/users"), api.get("/bookings")]
      );

      setCars(carsResponse.data?.data || []);

      setUsers(usersResponse.data?.data || []);

      setBookings(bookingsResponse.data?.data || []);
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

  const navigate = useNavigate();
  const location = useLocation();

  const isActiveTab = (path) => location.pathname === `/admin${path}`;

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* SIDEBAR */}

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

      {/* CONTENT */}

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
              <div className="ml-4">
                <button
                  type="button"
                  onClick={() => navigate("/admin/profile")}
                  className="h-10 w-10 rounded-full bg-green-600
               flex items-center justify-center
               text-white font-semibold
               hover:bg-green-700 transition"
                  title="Admin Profile"
                >
                  <UserCircle className="w-6 h-6" />
                </button>
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
