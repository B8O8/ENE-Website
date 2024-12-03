import React from "react";
import { Link, useNavigate  } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCartShopping,
  faTree,
  faFilm,
  faSignal,
  faUser,
  faGaugeHigh,
  faSignOutAlt,
} from "@fortawesome/free-solid-svg-icons";
import {jwtDecode} from "jwt-decode";

const UserSidebar = ({ isOpen, setIsOpen }) => {
  const navigate = useNavigate();

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const handleLogout = () => {
    localStorage.removeItem("token"); // Remove the token from local storage
    navigate("/login"); // Redirect to login page
  };

  // Decode the token to check if the user is an admin
  const token = localStorage.getItem("token");
  let isAdmin = false;

  if (token) {
    try {
      const decoded = jwtDecode(token);
      isAdmin = decoded.rank === "Admin"; // Check if the user is an admin
    } catch (error) {
      console.error("Failed to decode token:", error);
    }
  }

  return (
    <div
      className="sidebar bg-dark text-white vh-100 position-fixed top-0 start-0"
      style={{
        width: isOpen ? "250px" : "60px", // Dynamic width
        overflowX: "hidden",
        transition: "width 0.3s ease-in-out",
        zIndex: 1040,
      }}
    >
      {/* Sidebar Header */}
      <div
        className="d-flex align-items-center justify-content-between p-2"
        style={{ borderBottom: "1px solid #495057" }}
      >
        <h3
          className="text-center mb-0"
          style={{
            fontSize: "1.2rem",
            display: isOpen ? "block" : "none", // Hide when closed
          }}
        >
          User Dashboard
        </h3>

        {/* Toggle Button */}
        <button
          onClick={toggleSidebar}
          className="btn btn-dark"
          style={{
            fontSize: "1rem",
            padding: "5px 10px",
            border: "none",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {isOpen ? "←" : "→"}
        </button>
      </div>

      {/* Sidebar Links */}
      <ul className="nav flex-column mt-3">
        <li className="nav-item mb-3">
          <Link
            to="/user-dashboard/commissions"
            className="nav-link text-white d-flex align-items-center"
          >
            <FontAwesomeIcon icon={faCartShopping} className="me-2" />
            {isOpen && "E-Com"}
          </Link>
        </li>
        <li className="nav-item mb-3">
          <Link
            to="/user-dashboard/referrals"
            className="nav-link text-white d-flex align-items-center"
          >
            <FontAwesomeIcon icon={faTree} className="me-2" />
            {isOpen && "Referral Tree"}
          </Link>
        </li>
        <li className="nav-item mb-3">
          <Link
            to="/user-dashboard/courses"
            className="nav-link text-white d-flex align-items-center"
          >
            <FontAwesomeIcon icon={faFilm} className="me-2" />
            {isOpen && "Courses"}
          </Link>
        </li>
        <li className="nav-item mb-3">
          <Link
            to="https://t.me/Hello_ENE"
            className="nav-link text-white d-flex align-items-center"
          >
            <FontAwesomeIcon icon={faSignal} className="me-2" />
            {isOpen && "Signal"}
          </Link>
        </li>
        <li className="nav-item mb-3">
          <Link
            to="/user-dashboard/profile"
            className="nav-link text-white d-flex align-items-center"
          >
            <FontAwesomeIcon icon={faUser} className="me-2" />
            {isOpen && "Profile"}
          </Link>
        </li>

         {/* Admin Dashboard Link (only for admins) */}
         {isAdmin && (
          <li className="nav-item mb-3">
            <Link
              to="/admin-dashboard"
              className="nav-link text-white d-flex align-items-center"
            >
              <FontAwesomeIcon icon={faGaugeHigh} className="me-2" />
              {isOpen && "Admin Dashboard"}
            </Link>
          </li>
        )}

        {/* Logout Button */}
        <li className="nav-item mt-auto">
          <button
            className="nav-link text-white d-flex align-items-center btn btn-link w-100 text-start"
            onClick={handleLogout}
          >
            <FontAwesomeIcon icon={faSignOutAlt} className="me-2" />
            {isOpen && "Logout"}
          </button>
        </li>

      </ul>
    </div>
  );
};

export default UserSidebar;
