import React from "react";
import { Link, useLocation } from "react-router-dom";
import "./UserDashboard.css";

const UserSidebar = ({ onSignalClick }) => {
  const location = useLocation();

  return (
    <div className="sidebar bg-dark text-white vh-100 p-3">
      <h3 className="text-center mb-4">User Dashboard</h3>
      <ul className="nav flex-column">
        <li className="nav-item mb-3">
          <Link to="/user-dashboard/commissions" className="nav-link text-white">
            Pending Commissions
          </Link>
        </li>
        <li className="nav-item mb-3">
          <Link to="/user-dashboard/referrals" className="nav-link text-white">
            Referral Tree
          </Link>
        </li>
        <li className="nav-item mb-3">
          <Link to="/user-dashboard/courses" className="nav-link text-white">
            Courses
          </Link>
        </li>
        <li className="nav-item mb-3 ms-3">
          {/* Signal button calls onSignalClick */}
          <button
            className="nav-link btn btn-link text-white p-0"
            onClick={onSignalClick}
          >
            Signal
          </button>
        </li>
        <li className={`nav-item mb-3 ${location.pathname === "/user-dashboard/profile" ? "active" : ""}`}>
          <Link to="/user-dashboard/profile" className="nav-link text-white">
            Profile
          </Link>
        </li>
      </ul>
    </div>
  );
};

export default UserSidebar;
