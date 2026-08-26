import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { getCurrentUser } from "../services/auth";

const AdminRoute = () => {
  const user = getCurrentUser();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (user.userRole !== "ADMIN") {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default AdminRoute;