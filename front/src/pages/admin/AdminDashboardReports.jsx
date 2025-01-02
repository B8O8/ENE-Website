import React, { useEffect, useState } from "react";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import apiService from "../../services/apiService";
import "./AdminDashboard.css";

// Register Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend);

const AdminDashboardReports = () => {
  const [walletTotals, setWalletTotals] = useState({});
  const [commissionTotals, setCommissionTotals] = useState({});
  const [walletLogs, setWalletLogs] = useState([]);
  const [commissionLogs, setCommissionLogs] = useState([]);
  const [filteredWalletLogs, setFilteredWalletLogs] = useState([]);
  const [filteredCommissionLogs, setFilteredCommissionLogs] = useState([]);

  // Pagination states
  const [walletCurrentPage, setWalletCurrentPage] = useState(1);
  const [commissionCurrentPage, setCommissionCurrentPage] = useState(1);
  const walletLogsPerPage = 5;
  const commissionLogsPerPage = 5;

  // Filter states
  const [walletFilters, setWalletFilters] = useState({
    name: "",
    status: "",
    startDate: "",
    endDate: "",
  });
  const [commissionFilters, setCommissionFilters] = useState({
    name: "",
    status: "",
    startDate: "",
    endDate: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const walletTotalsResponse = await apiService.get("/admin/wallet/totals");
        setWalletTotals(walletTotalsResponse);

        const walletLogsResponse = await apiService.get("/admin/wallet/activity");
        setWalletLogs(walletLogsResponse);
        setFilteredWalletLogs(walletLogsResponse);

        const commissionTotalsResponse = await apiService.get("/commissions/admin/totals");
        setCommissionTotals(commissionTotalsResponse);

        const commissionLogsResponse = await apiService.get("/commissions/admin/logs");
        setCommissionLogs(commissionLogsResponse);
        setFilteredCommissionLogs(commissionLogsResponse);
      } catch (error) {
        console.error("Error fetching admin reports data:", error);
      }
    };

    fetchData();
  }, []);

  // Handle filter changes
  const handleWalletFilterChange = (e) => {
    const { name, value } = e.target;
    setWalletFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleCommissionFilterChange = (e) => {
    const { name, value } = e.target;
    setCommissionFilters((prev) => ({ ...prev, [name]: value }));
  };

  // Apply filters to wallet logs
  useEffect(() => {
    const { name, status, startDate, endDate } = walletFilters;
    let filtered = walletLogs;

    if (name) {
      filtered = filtered.filter((log) =>
        log.user_name.toLowerCase().includes(name.toLowerCase())
      );
    }
    if (status) {
      filtered = filtered.filter((log) => log.status === status);
    }
    if (startDate && endDate) {
      filtered = filtered.filter(
        (log) =>
          new Date(log.created_at) >= new Date(startDate) &&
          new Date(log.created_at) <= new Date(endDate)
      );
    }

    setFilteredWalletLogs(filtered);
  }, [walletFilters, walletLogs]);

  // Apply filters to commission logs
  useEffect(() => {
    const { name, status, startDate, endDate } = commissionFilters;
    let filtered = commissionLogs;

    if (name) {
      filtered = filtered.filter((log) =>
        log.user_name.toLowerCase().includes(name.toLowerCase())
      );
    }
    if (status) {
      filtered = filtered.filter((log) => log.status === status);
    }
    if (startDate && endDate) {
      filtered = filtered.filter(
        (log) =>
          new Date(log.earned_at) >= new Date(startDate) &&
          new Date(log.earned_at) <= new Date(endDate)
      );
    }

    setFilteredCommissionLogs(filtered);
  }, [commissionFilters, commissionLogs]);

  const walletData = {
    labels: ["Total Added", "Total Deducted", "Total Withdrawn"],
    datasets: [
      {
        data: [
          walletTotals.total_added || 0,
          walletTotals.total_deducted || 0,
          walletTotals.total_withdrawn || 0,
        ],
        backgroundColor: ["#4caf50", "#f44336", "#2196f3"],
        hoverBackgroundColor: ["#66bb6a", "#ef5350", "#42a5f5"],
      },
    ],
  };

  const commissionData = {
    labels: ["Total Pending", "Total Transferred"],
    datasets: [
      {
        data: [
          commissionTotals.total_pending_commissions || 0,
          commissionTotals.total_transferred_commissions || 0,
        ],
        backgroundColor: ["#ff9800", "#9c27b0"],
        hoverBackgroundColor: ["#ffb74d", "#ba68c8"],
      },
    ],
  };

  // Pagination helpers
  const paginateLogs = (logs, currentPage, logsPerPage) => {
    const startIndex = (currentPage - 1) * logsPerPage;
    return logs.slice(startIndex, startIndex + logsPerPage);
  };

  const walletPaginatedLogs = paginateLogs(
    filteredWalletLogs,
    walletCurrentPage,
    walletLogsPerPage
  );

  const commissionPaginatedLogs = paginateLogs(
    filteredCommissionLogs,
    commissionCurrentPage,
    commissionLogsPerPage
  );

  const renderPagination = (currentPage, totalLogs, logsPerPage, setPage) => {
    const totalPages = Math.ceil(totalLogs / logsPerPage);
    const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

    return (
      <nav>
        <ul className="pagination">
          {pages.map((page) => (
            <li
              key={page}
              className={`page-item ${page === currentPage ? "active" : ""}`}
              onClick={() => setPage(page)}
            >
              <button className="page-link">{page}</button>
            </li>
          ))}
        </ul>
      </nav>
    );
  };

  return (
    <div className="admin-dashboard-reports">
      <h2>Admin Dashboard Reports</h2>

      {/* Metrics Section */}
      <div className="metrics-section d-flex flex-wrap gap-4">
        <div className="chart-container card p-3 shadow">
          <h4>Wallet Totals</h4>
          <Pie data={walletData} />
        </div>
        <div className="chart-container card p-3 shadow">
          <h4>Commission Totals</h4>
          <Pie data={commissionData} />
        </div>
      </div>

      {/* Logs Section */}
      <div className="logs-section mt-4">
        {/* Wallet Logs */}
        <h4>Recent Wallet Activity</h4>
        <div className="filters mb-3 d-flex flex-wrap align-items-center gap-2">
          <input
            type="text"
            name="name"
            className="form-control"
            placeholder="Filter by User"
            value={walletFilters.name}
            onChange={handleWalletFilterChange}
            style={{ maxWidth: "200px" }}
          />
          <select
            name="status"
            className="form-select"
            value={walletFilters.status}
            onChange={handleWalletFilterChange}
            style={{ maxWidth: "150px" }}
          >
            <option value="">All Status</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
          <input
            type="date"
            name="startDate"
            className="form-control"
            placeholder="Start Date"
            value={walletFilters.startDate}
            onChange={handleWalletFilterChange}
            style={{ maxWidth: "180px" }}
          />
          <input
            type="date"
            name="endDate"
            className="form-control"
            placeholder="End Date"
            value={walletFilters.endDate}
            onChange={handleWalletFilterChange}
            style={{ maxWidth: "180px" }}
          />
          <button className="btn btn-secondary" onClick={() => setWalletFilters({ name: "", status: "", startDate: "", endDate: "" })}>Clear Filters</button>
        </div>
        <table className="table table-striped table-bordered">
          <thead className="table-light">
            <tr>
              <th>Date</th>
              <th>Type</th>
              <th>User</th>
              <th>Amount</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {walletPaginatedLogs.map((log) => (
              <tr key={log.id}>
                <td>{new Date(log.created_at).toLocaleDateString()}</td>
                <td>{log.activity_type}</td>
                <td>{log.user_name}</td>
                <td>${log.amount}</td>
                <td>{log.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {renderPagination(walletCurrentPage, filteredWalletLogs.length, walletLogsPerPage, setWalletCurrentPage)}

        {/* Commission Logs */}
        <h4>Recent Commission Logs</h4>
        <div className="filters mb-3 d-flex flex-wrap align-items-center gap-2">
          <input
            type="text"
            name="name"
            className="form-control"
            placeholder="Filter by User"
            value={commissionFilters.name}
            onChange={handleCommissionFilterChange}
            style={{ maxWidth: "200px" }}
          />
          <select
            name="status"
            className="form-select"
            value={commissionFilters.status}
            onChange={handleCommissionFilterChange}
            style={{ maxWidth: "150px" }}
          >
            <option value="">All Status</option>
            <option value="pending">Pending</option>
            <option value="transferred">Transferred</option>
          </select>
          <input
            type="date"
            name="startDate"
            className="form-control"
            placeholder="Start Date"
            value={commissionFilters.startDate}
            onChange={handleCommissionFilterChange}
            style={{ maxWidth: "180px" }}
          />
          <input
            type="date"
            name="endDate"
            className="form-control"
            placeholder="End Date"
            value={commissionFilters.endDate}
            onChange={handleCommissionFilterChange}
            style={{ maxWidth: "180px" }}
          />
          <button className="btn btn-secondary" onClick={() => setCommissionFilters({ name: "", status: "", startDate: "", endDate: "" })}>Clear Filters</button>
        </div>
        <table className="table table-striped table-bordered">
          <thead className="table-light">
            <tr>
              <th>Date</th>
              <th>User</th>
              <th>Type</th>
              <th>Amount</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {commissionPaginatedLogs.map((log) => (
              <tr key={log.id}>
                <td>{new Date(log.earned_at).toLocaleDateString()}</td>
                <td>{log.user_name}</td>
                <td>{log.commission_type}</td>
                <td>${log.amount}</td>
                <td>{log.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {renderPagination(commissionCurrentPage, filteredCommissionLogs.length, commissionLogsPerPage, setCommissionCurrentPage)}
      </div>
    </div>
  );
};

export default AdminDashboardReports;
