import React from "react";
import { Link, useNavigate } from "react-router-dom";
import {jwtDecode} from "jwt-decode";
import "./Navbar.css";
import logo from "../assets/Artboard-10-copylogo.png";

const Navbar = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  let isAuthenticated = false;
  let userRole = null;

  if (token) {
    try {
      const decodedToken = jwtDecode(token);
      const currentTime = Math.floor(Date.now() / 1000);
      if (decodedToken.exp > currentTime) {
        isAuthenticated = true;
        userRole = decodedToken.rank; // Assuming `rank` contains the role ("Admin" or "User")
      }
    } catch (error) {
      console.error("Error decoding token:", error);
      localStorage.removeItem("token"); // Clear invalid token
    }
  }

  const handleDashboardRedirect = () => {
    if (userRole === "Admin") {
      navigate("/admin-dashboard");
    } else {
      navigate("/user-dashboard");
    }
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-white shadow-sm">
      <div className="container">
        <Link to="/" className="navbar-brand">
          <img src={logo} alt="ENE Logo" className="me-2" />
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav me-auto">
            {/* Add other links if necessary */}
          </ul>
          <ul className="navbar-nav">
            {isAuthenticated ? (
              <>
                <li className="nav-item me-3">
                  <button
                    className="btn btn-primary"
                    onClick={handleDashboardRedirect}
                  >
                    Dashboard
                  </button>
                </li>
                <li className="nav-item">
                  <button
                    className="btn btn-outline-danger"
                    onClick={() => {
                      localStorage.removeItem("token");
                      navigate("/login");
                    }}
                  >
                    Log Out
                  </button>
                </li>
              </>
            ) : (
              <>
                <li className="nav-item me-3">
                  <Link to="/login" className="btn btn-outline-primary">
                    Log In
                  </Link>
                </li>
                <li className="nav-item">
                  <Link to="/register" className="btn btn-primary">
                    Sign Up
                  </Link>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
