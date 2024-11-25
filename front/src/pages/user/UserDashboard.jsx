import React, {useState} from "react";
import { Outlet } from "react-router-dom";
import UserSidebar from "./UserSidebar";
import Wallet from "../../components/Wallet";
import SignalModal from "../../components/SignalModal";
import "./UserDashboard.css";

const UserDashboard = () => {
  const [showSignalModal, setShowSignalModal] = useState(false);

  const handleSignalClick = () => {
    setShowSignalModal(true);
  };

  const handleSignalClose = () => {
    setShowSignalModal(false);
  };

  return (
    <div className="user-dashboard d-flex">
      {/* Sidebar */}
      <UserSidebar onSignalClick={handleSignalClick}/>

      {/* Main Content */}
      <div className="main-content flex-grow-1 p-4">
        {/* Header */}
        <div className="dashboard-header d-flex justify-content-between align-items-center mb-4">
          <h2>Welcome to Your Dashboard</h2>
          <Wallet />
        </div>

        {/* Dynamic Content */}
        <div className="dashboard-content">
          <Outlet />
        </div>
      </div>
      {/* Signal Modal */}
      <SignalModal show={showSignalModal} onClose={handleSignalClose} />
    </div>
  );
};

export default UserDashboard;
