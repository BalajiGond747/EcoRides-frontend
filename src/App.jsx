import "./App.css";

import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import VerifyRegistrationOtpPage from "./pages/VerifyRegistrationOtpPage";
import VerifyResetOtpPage from "./pages/VerifyResetOtpPage";
import ResetPasswordPage from "./pages/ResetPasswordPage";

import ChangePasswordPage from "./pages/ChangePasswordPage";
import ChangeEmailPage from "./pages/ChangeEmailPage";
import VerifyEmailChangeOtpPage from "./pages/VerifyEmailChangeOtpPage";

import UserProfilePage from "./pages/UserProfilePage";
import CarsPage from "./pages/CarsPage";
import CarDetailsPage from "./pages/CarDetailsPage";
import CreateBookingPage from "./pages/CreateBookingPage";
import MyBookingsPage from "./pages/MyBookingsPage";
import BookingDetailsPage from "./pages/BookingDetailsPage";
import PaymentPage from "./pages/PaymentPage";
import InvoicePage from "./pages/InvoicePage";
import ProfilePage from "./pages/ProfilePage";

import ProtectedRoute from "./utils/ProtectedRoute";
import AdminRoute from "./utils/AdminRoute";
import AdminDashboard from "./pages/admin/AdminDashboard";
import LocationsPage from "./pages/LocationsPage";

import { Routes, Route } from "react-router-dom";
import OAuth2CallbackPage from "./pages/OAuth2CallbackPage";

import AdminAdministrators from "./pages/admin/AdminAdministrators";
import AddAdministrator from "./pages/admin/AddAdministrator";

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />

      <Route path="/login" element={<LoginPage />} />

      <Route path="/register" element={<RegisterPage />} />

      <Route
        path="/verify-registration-otp"
        element={<VerifyRegistrationOtpPage />}
      />

      <Route path="/forgot-password" element={<ForgotPasswordPage />} />

      <Route path="/verify-reset-otp" element={<VerifyResetOtpPage />} />

      <Route path="/reset-password" element={<ResetPasswordPage />} />

      <Route path="/oauth2/callback" element={<OAuth2CallbackPage />} />

      <Route path="/locations" element={<LocationsPage />} />

      <Route element={<ProtectedRoute />}>
        <Route path="/profile" element={<UserProfilePage />} />

        <Route path="/users/:id" element={<UserProfilePage />} />

        <Route path="/cars" element={<CarsPage />} />

        <Route path="/cars/:id" element={<CarDetailsPage />} />

        <Route path="/bookings/create" element={<CreateBookingPage />} />

        <Route path="/bookings" element={<MyBookingsPage />} />

        <Route path="/bookings/:id" element={<BookingDetailsPage />} />

        <Route path="/payments/:bookingId" element={<PaymentPage />} />

        <Route path="/invoices/booking/:bookingId" element={<InvoicePage />} />

        <Route path="/change-password" element={<ChangePasswordPage />} />

        <Route path="/change-email" element={<ChangeEmailPage />} />

        <Route
          path="/verify-email-change-otp"
          element={<VerifyEmailChangeOtpPage />}
        />
        <Route path="/profile" element={<ProfilePage />} />

        <Route element={<AdminRoute />}>
          <Route path="/admin/*" element={<AdminDashboard />} />

          <Route
            path="/admin/administrators"
            element={<AdminAdministrators />}
          />

          <Route
            path="/admin/administrators/new"
            element={<AddAdministrator />}
          />
        </Route>
      </Route>
    </Routes>
  );
}

export default App;
