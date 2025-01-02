import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCartShopping,
  faNetworkWired,
  faFilm,
  faSignal,
  faUser,
  faGaugeHigh,
  faSignOutAlt,
  faFile,
} from "@fortawesome/free-solid-svg-icons";
import {jwtDecode} from "jwt-decode";
import { Modal, Button } from "react-bootstrap";

const UserSidebar = ({ isOpen, setIsOpen }) => {
  const navigate = useNavigate();
  const [showUpgradeModal, setShowUpgradeModal] = React.useState(false);

  // Decode the token to check for VIP status
  const token = localStorage.getItem("token");
  let isVip = false;
  let isAdmin = false;
  
  if (token) {
    try {
      const decoded = jwtDecode(token);
      isVip = decoded.is_vip === 1; // Check if the user is a VIP
      isAdmin = decoded.rank === "Admin"; // Check if the user is an admin
    } catch (error) {
      console.error("Failed to decode token:", error);
    }
  }
  

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const handleLibraryClick = (e) => {
    if (!isVip) {
      e.preventDefault(); // Prevent navigation
      setShowUpgradeModal(true); // Show the upgrade modal
    }
  };

  return (
    <div
      className="sidebar bg-dark text-white vh-100 position-fixed top-0 start-0"
      style={{
        width: isOpen ? "250px" : "60px",
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
            display: isOpen ? "block" : "none",
          }}
        >
          <Link
            to="/user-dashboard"
            style={{ textDecoration: "none", color: "inherit" }}
          >
            User Dashboard
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
            <FontAwesomeIcon icon={faNetworkWired} className="me-2" />
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
            to="/user-dashboard/signal"
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
        {/* Library Link */}
        <li className="nav-item mb-3">
          <Link
            to="/user-dashboard/library"
            className="nav-link text-white d-flex align-items-center"
            onClick={handleLibraryClick}
          >
            <FontAwesomeIcon icon={faFile} className="me-2" />
            {isOpen && "Library"}
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

      {/* Upgrade to VIP Modal */}
      <Modal
        show={showUpgradeModal}
        onHide={() => setShowUpgradeModal(false)}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Upgrade to VIP</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>You need to upgrade to a VIP plan to access the Library.</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowUpgradeModal(false)}>
            Close
          </Button>
          <Button
            variant="primary"
            onClick={() => {
              setShowUpgradeModal(false);
              navigate("/user-dashboard/subscriptions");
            }}
          >
            Upgrade Now
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default UserSidebar;
