import React from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import Home from "./pages/Home.jsx";
import NotFound from "./pages/NotFound.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminRoute from "./components/AdminRoute";
import RegisterWithReferral from "./pages/RegisterWithReferral.jsx";
import UserDashboard from "./pages/user/UserDashboard.jsx";
import AdminDashboard from "./pages/admin/AdminDashboard.jsx";
import ManageUsers from "./pages/admin/ManageUsers.jsx";
import ManageSubscriptions from "./pages/admin/ManageSubscriptions.jsx";
import WalletRequests from "./pages/admin/WalletRequests.jsx";
import ManageCategories from "./pages/admin/ManageCategories.jsx";
import ManageVideos from "./pages/admin/ManageVideos.jsx";
import PendingCommissions from "./pages/user/PendingCommissions.jsx";
import ReferralTree from "./pages/user/ReferralTree.jsx";
import Courses from "./pages/user/Courses.jsx";
import UserProfile from "./components/UserProfile.jsx";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import SignalTab from "./pages/user/SignalTab"; 
import ManageSignals from "./pages/admin/ManageSignals";
import AdminDashboardReports from "./pages/admin/AdminDashboardReports";
import UserDashboardReports from "./pages/user/UserDashboardReports.jsx";
import ManageLibrary from "./pages/admin/ManageLibrary.jsx";
import Library from "./pages/user/Library.jsx";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="*" element={<NotFound />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<ConditionalRegister />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        {/* Protected User Routes */}
        <Route
          path="/user-dashboard/*"
          element={
            <ProtectedRoute>
              <UserDashboard />
            </ProtectedRoute>
          }
        >
          <Route index element={<UserDashboardReports />} />
          <Route path="commissions" element={<PendingCommissions />} />
          <Route path="referrals" element={<ReferralTree />} />
          <Route path="courses" element={<Courses />} />
          <Route path="profile" element={<UserProfile />} />
          <Route path="signal" element={<SignalTab />} />
          <Route path="library" element={<Library />} />
        </Route>

        {/* Admin Routes */}
        <Route
          path="/admin-dashboard/*"
          element={
            <AdminRoute>
              <AdminDashboard />
            </AdminRoute>
          }
        >
          <Route index element={<AdminDashboardReports />} />
          <Route path="users" element={<ManageUsers />} />
          <Route path="subscriptions" element={<ManageSubscriptions />} />
          <Route path="wallet-requests" element={<WalletRequests />} />
          <Route path="categories" element={<ManageCategories />} />
          <Route path="videos" element={<ManageVideos />} />
          <Route path="signals" element={<ManageSignals />} />
          <Route path="library" element={<ManageLibrary />} />
        </Route>
      </Routes>
    </Router>
  );
};

const ConditionalRegister = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const ref = searchParams.get("ref");
  return ref ? <RegisterWithReferral refCode={ref} /> : <Register />;
};

export default App;
