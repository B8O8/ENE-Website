import React, { useEffect, useState } from "react";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import apiService from "../../services/apiService";
import "./UserDashboardReports.css";

// Register Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend);

const UserDashboardReports = () => {
  const [walletTotals, setWalletTotals] = useState({});
  const [commissionTotals, setCommissionTotals] = useState({});
  const [walletLogs, setWalletLogs] = useState([]);
  const [commissionLogs, setCommissionLogs] = useState([]);

  // Pagination states
  const [currentWalletPage, setCurrentWalletPage] = useState(1);
  const [currentCommissionPage, setCurrentCommissionPage] = useState(1);
  const logsPerPage = 5;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const walletTotalsResponse = await apiService.get("/dashboard/wallet");
        setWalletTotals(walletTotalsResponse);

        const walletLogsResponse = await apiService.get("/wallet/logs");
        setWalletLogs(walletLogsResponse);

        const commissionLogsResponse = await apiService.get(
          "/commissions/user/logs"
        );
        setCommissionLogs(commissionLogsResponse);

        // Calculate total pending commissions
        const totalPending = commissionLogsResponse.reduce((acc, log) => {
          return log.status === "pending" ? acc + parseFloat(log.amount) : acc;
        }, 0);

        setCommissionTotals({ totalPending });
      } catch (error) {
        console.error("Error fetching user dashboard data:", error);
      }
    };

    fetchData();
  }, []);

  // Pagination calculations
  const indexOfLastWalletLog = currentWalletPage * logsPerPage;
  const indexOfFirstWalletLog = indexOfLastWalletLog - logsPerPage;
  const currentWalletLogs = walletLogs.slice(
    indexOfFirstWalletLog,
    indexOfLastWalletLog
  );

  const indexOfLastCommissionLog = currentCommissionPage * logsPerPage;
  const indexOfFirstCommissionLog = indexOfLastCommissionLog - logsPerPage;
  const currentCommissionLogs = commissionLogs.slice(
    indexOfFirstCommissionLog,
    indexOfLastCommissionLog
  );

  // Pagination handlers
  const handleWalletPageChange = (pageNumber) =>
    setCurrentWalletPage(pageNumber);
  const handleCommissionPageChange = (pageNumber) =>
    setCurrentCommissionPage(pageNumber);

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
    labels: ["Total Pending"],
    datasets: [
      {
        data: [commissionTotals.totalPending || 0],
        backgroundColor: ["#ff9800"],
        hoverBackgroundColor: ["#ffb74d"],
      },
    ],
  };

  return (
    <div className="user-dashboard-reports">
      

      {/* Metrics Section */}
      <div className="user-metrics-section">
        <div className="user-chart-container card p-3 shadow">
          <h4>Wallet Totals</h4>
          <Pie data={walletData} />
        </div>
        <div className="user-chart-container card p-3 shadow">
          <h4>Commission Totals</h4>
          <Pie data={commissionData} />
        </div>
      </div>

      {/* Wallet Logs */}
      <div className="user-logs-section mt-4">
        <h4>Recent Wallet Activity</h4>
        <table className="table table-striped table-bordered">
          <thead>
            <tr>
              <th>Date</th>
              <th>Type</th>
              <th>Amount</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {currentWalletLogs.map((log) => (
              <tr key={log.id}>
                <td>{new Date(log.created_at).toLocaleDateString()}</td>
                <td>{log.activity_type}</td>
                <td>${parseFloat(log.amount).toFixed(2)}</td>
                <td>{log.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {/* Wallet Pagination */}
        <div className="user-pagination mt-3">
          {Array.from(
            { length: Math.ceil(walletLogs.length / logsPerPage) },
            (_, i) => (
              <button
                key={i}
                className={`btn ${
                  currentWalletPage === i + 1 ? "btn-primary" : "btn-light"
                } mx-1`}
                onClick={() => handleWalletPageChange(i + 1)}
              >
                {i + 1}
              </button>
            )
          )}
        </div>
      </div>

      {/* Commission Logs */}
      <div className="user-logs-section mt-4">
        <h4>Recent Commission Logs</h4>
        <table className="table table-striped table-bordered">
          <thead>
            <tr>
              <th>Date</th>
              <th>Type</th>
              <th>Amount</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {currentCommissionLogs.map((log) => (
              <tr key={log.id}>
                <td>{new Date(log.date).toLocaleDateString()}</td>
                <td>{log.type || "N/A"}</td>
                <td>${parseFloat(log.amount).toFixed(2)}</td>
                <td>{log.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {/* Commission Pagination */}
        <div className="user-pagination mt-3">
          {Array.from(
            { length: Math.ceil(commissionLogs.length / logsPerPage) },
            (_, i) => (
              <button
                key={i}
                className={`btn ${
                  currentCommissionPage === i + 1 ? "btn-primary" : "btn-light"
                } mx-1`}
                onClick={() => handleCommissionPageChange(i + 1)}
              >
                {i + 1}
              </button>
            )
          )}
        </div>
      </div>
    </div>
  );
};

export default UserDashboardReports;
