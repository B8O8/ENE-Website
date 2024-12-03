import React, { useState } from "react";
import AdminSidebar from "./AdminSidebar";
import { Outlet } from "react-router-dom";
import "./AdminDashboard.css";

const AdminDashboard = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true); // Sidebar open/closed state

  return (
    <div className="admin-dashboard d-flex">
      {/* Sidebar */}
      <AdminSidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />

      {/* Main Content */}
      <div
        className="main-content flex-grow-1"
        style={{
          marginLeft: isSidebarOpen ? "250px" : "60px", // Adjust margin dynamically
          transition: "margin-left 0.3s ease-in-out",
          padding: "20px",
        }}
      >
        <Outlet /> {/* Nested routes */}
      </div>
    </div>
  );
};

export default AdminDashboard;
