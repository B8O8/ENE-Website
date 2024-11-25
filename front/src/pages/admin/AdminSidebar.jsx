import React from "react";
import { Link } from "react-router-dom";

const AdminSidebar = () => {
  return (
    <div className="sidebar bg-dark text-white vh-100 p-3">
      <h3 className="text-center mb-4">Admin Dashboard</h3>
      <ul className="nav flex-column">
        <li className="nav-item mb-3">
          <Link to="/admin-dashboard/users" className="nav-link text-white">
            Manage Users
          </Link>
        </li>
        <li className="nav-item mb-3">
          <Link
            to="/admin-dashboard/subscriptions"
            className="nav-link text-white"
          >
            Manage Subscriptions
          </Link>
        </li>
        <li className="nav-item mb-3">
          <Link
            to="/admin-dashboard/wallet-requests"
            className="nav-link text-white"
          >
            Wallet Requests
          </Link>
        </li>
        <li className="nav-item mb-3">
          <Link
            to="/admin-dashboard/categories"
            className="nav-link text-white"
          >
            Manage Categories
          </Link>
        </li>
        <li className="nav-item mb-3">
          <Link to="/admin-dashboard/videos" className="nav-link text-white">
            Manage Videos
          </Link>
        </li>
      </ul>
    </div>
  );
};

export default AdminSidebar;
