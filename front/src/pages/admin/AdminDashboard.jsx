import React from "react";
import { Outlet } from "react-router-dom"; // For nested routes
import AdminSidebar from "./AdminSidebar"; // The Sidebar Component
import "./AdminDashboard.css";

const AdminDashboard = () => {
  return (
    <div className="admin-dashboard d-flex">
      {/* Sidebar */}
      <AdminSidebar />

      {/* Main Content */}
      <div className="main-content flex-grow-1 p-4">
        <Outlet /> {/* This will render the nested routes */}
      </div>
    </div>
  );
};

export default AdminDashboard;
