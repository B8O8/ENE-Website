import React, { useState, useEffect } from "react";
import UserSidebar from "./UserSidebar";
import Wallet from "../../components/Wallet";
import { Outlet } from "react-router-dom";
import {jwtDecode} from "jwt-decode"; // Import jwtDecode
import "./UserDashboard.css";

const UserDashboard = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true); // Sidebar state
  const [userName, setUserName] = useState("User"); // Placeholder for user name

  useEffect(() => {
    // Decode token and fetch user data
    const getUserFromToken = () => {
      try {
        const token = localStorage.getItem("token"); // Retrieve token from localStorage
        if (!token) throw new Error("Token not found");

        const decodedToken = jwtDecode(token); // Decode the token
        const userName = decodedToken.name; // Get the user's name from the token
        setUserName(userName); // Update the state with the user's name
      } catch (error) {
        console.error("Error decoding token:", error);
      }
    };

    getUserFromToken();
  }, []);

  return (
    <div className="user-dashboard d-flex">
      {/* Sidebar */}
      <UserSidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />

      {/* Main Content */}
      <div
        className="main-content flex-grow-1"
        style={{
          marginLeft: isSidebarOpen ? "250px" : "60px", // Adjust margin dynamically
          transition: "margin-left 0.3s ease-in-out",
        }}
      >
        {/* Header */}
        <div
          className="dashboard-header d-flex justify-content-between align-items-center p-3 "
          style={{
            backgroundColor: "#fff",
            borderBottom: "1px solid #dee2e6",
            boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
          }}
        >
          <h2 className="m-0">Welcome {userName} to Your Dashboard</h2>
          <Wallet />
        </div>

        {/* Dynamic Content */}
        <div className="dashboard-content p-1">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
