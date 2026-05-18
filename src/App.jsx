import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "sonner";

import HomePage from "./pages/user/HomePage";

import LoginPage from "./pages/auth/LoginPage";
import RegisterPage from "./pages/auth/RegisterPage";
import ForgotPasswordPage from "./pages/auth/ForgotPasswordPage";
import UpdatePasswordPage from "./pages/auth/UpdatePasswordPage";

// Example protected pages
// Create these later
const DashboardPage = () => <div>Dashboard</div>;
const BookRidePage = () => <div>Book Ride</div>;

// Auth Guard
const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem("token");

  return token ? children : <Navigate to="/login" replace />;
};

export default function App() {
  const token = localStorage.getItem("token");

  return (
    <BrowserRouter>
      {/* Global Toast */}
      <Toaster
        position="top-right"
        richColors
        expand
        closeButton
        duration={3500}
        toastOptions={{
          style: {
            minWidth: "380px",
            minHeight: "72px",
            padding: "18px 22px",
            borderRadius: "18px",
            fontSize: "15px",
            fontWeight: "600",
          },
        }}
      />
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<HomePage />} />

        <Route
          path="/login"
          element={token ? <Navigate to="/dashboard" replace /> : <LoginPage />}
        />

        <Route
          path="/register"
          element={
            token ? <Navigate to="/dashboard" replace /> : <RegisterPage />
          }
        />

        <Route
          path="/forgot-password"
          element={
            token ? (
              <Navigate to="/dashboard" replace />
            ) : (
              <ForgotPasswordPage />
            )
          }
        />

        {/* Protected Routes */}
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <DashboardPage />
            </PrivateRoute>
          }
        />

        <Route
          path="/book-ride"
          element={
            <PrivateRoute>
              <BookRidePage />
            </PrivateRoute>
          }
        />

        <Route
          path="/update-password"
          element={
            <PrivateRoute>
              <UpdatePasswordPage />
            </PrivateRoute>
          }
        />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
