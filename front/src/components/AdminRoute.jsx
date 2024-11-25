import React from "react";
import { Navigate } from "react-router-dom";
import {jwtDecode} from "jwt-decode";

const AdminRoute = ({ children }) => {
  const token = localStorage.getItem("token");

  if (!token) {
    // Redirect to login if token does not exist
    return <Navigate to="/login" replace />;
  }

  try {
    const decodedToken = jwtDecode(token);
    const currentTime = Math.floor(Date.now() / 1000); // Current time in seconds

    if (decodedToken.exp < currentTime) {
      // Redirect to login if token is expired
      localStorage.removeItem("token"); // Clear the expired token
      return <Navigate to="/login" replace />;
    }

    if (decodedToken.rank !== "Admin") {
      // Redirect to user dashboard if the user is not an admin
      return <Navigate to="/user-dashboard" replace />;
    }
  } catch (error) {
    console.error("Error decoding token:", error);
    // Redirect to login if there's an error decoding the token
    localStorage.removeItem("token"); // Clear the invalid token
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default AdminRoute;
