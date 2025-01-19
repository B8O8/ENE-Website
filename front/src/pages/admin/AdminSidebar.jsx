import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUsers,
  faWallet,
  faFilm,
  faTags,
  faList,
  faUser,
  faSignOutAlt,
  faSignal,
  faFile,
  faStopwatch,
} from "@fortawesome/free-solid-svg-icons";

const AdminSidebar = ({ isOpen, setIsOpen }) => {
  const navigate = useNavigate();

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const handleLogout = () => {
    localStorage.removeItem("token"); // Remove the token from local storage
    navigate("/login"); // Redirect to login page
  };

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
          <Link
            to="/admin-dashboard"
            style={{ textDecoration: "none", color: "inherit" }}
          >
            Admin Dashboard
          </Link>
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
            to="/admin-dashboard/users"
            className="nav-link text-white d-flex align-items-center"
          >
            <FontAwesomeIcon icon={faUsers} className="me-2" />
            {isOpen && "Manage Users"}
          </Link>
        </li>

        <li className="nav-item mb-3">
          <Link
            to="/admin-dashboard/signals"
            className="nav-link text-white d-flex align-items-center"
          >
            <FontAwesomeIcon icon={faSignal} className="me-2" />
            {isOpen && "Manage Signals"}
          </Link>
        </li>
        <li className="nav-item mb-3">
          <Link
            to="/admin-dashboard/subscriptions"
            className="nav-link text-white d-flex align-items-center"
          >
            <FontAwesomeIcon icon={faList} className="me-2" />
            {isOpen && "Manage Subscriptions"}
          </Link>
        </li>
        <li className="nav-item mb-3">
          <Link
            to="/admin-dashboard/wallet-requests"
            className="nav-link text-white d-flex align-items-center"
          >
            <FontAwesomeIcon icon={faWallet} className="me-2" />
            {isOpen && "Wallet Requests"}
          </Link>
        </li>
        <li className="nav-item mb-3">
          <Link
            to="/admin-dashboard/categories"
            className="nav-link text-white d-flex align-items-center"
          >
            <FontAwesomeIcon icon={faTags} className="me-2" />
            {isOpen && "Manage Categories"}
          </Link>
        </li>
        <li className="nav-item mb-3">
          <Link
            to="/admin-dashboard/videos"
            className="nav-link text-white d-flex align-items-center"
          >
            <FontAwesomeIcon icon={faFilm} className="me-2" />
            {isOpen && "Manage Videos"}
          </Link>
        </li>
        <li className="nav-item mb-3">
          <Link
            to="/admin-dashboard/library"
            className="nav-link text-white d-flex align-items-center"
          >
            <FontAwesomeIcon icon={faFile} className="me-2" />
            {isOpen && "Manage Library"}
          </Link>
        </li>
        <li className="nav-item mb-3">
          <Link
            to="/admin-dashboard/reminders"
            className="nav-link text-white d-flex align-items-center"
            >
            <FontAwesomeIcon icon={faStopwatch} className="me-2" />
            {isOpen && "Manage Reminders"}
            </Link>
        </li>


        {/* User Dashboard Link */}
        <li className="nav-item mb-3">
          <Link
            to="/user-dashboard"
            className="nav-link text-white d-flex align-items-center"
          >
            <FontAwesomeIcon icon={faUser} className="me-2" />
            {isOpen && "User Dashboard"}
          </Link>
        </li>

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

export default AdminSidebar;
