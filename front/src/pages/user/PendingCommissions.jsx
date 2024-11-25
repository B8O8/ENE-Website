import React, { useEffect, useState } from "react";
import apiService from "../../services/apiService";
import "./PendingCommissions.css";

const PendingCommissions = () => {
  const [commissions, setCommissions] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchCommissions = async () => {
      setLoading(true);
      try {
        const userId = localStorage.getItem("userId"); // Assuming userId is stored in localStorage
        const response = await apiService.get("/dashboard/commissions", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          params: { userId }, // Include user ID in the body
        });

        setCommissions(response);
      } catch (error) {
        console.error("Error fetching commissions:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCommissions();
  }, []);

  return (
    <div className="pending-commissions">
      <h3 className="mb-4">Pending Commissions</h3>
      {loading ? (
        <p>Loading commissions...</p>
      ) : commissions.length > 0 ? (
        <table className="table table-striped">
          <thead>
            <tr>
              <th>#</th>
              <th>Date Earned</th>
              <th>Amount</th>
              <th>Type</th>
              <th>Level</th>
              <th>Transfer Date</th>
            </tr>
          </thead>
          <tbody>
            {commissions.map((commission, index) => (
              <tr key={commission.id}>
                <td>{index + 1}</td>
                <td>{new Date(commission.earned_at).toLocaleDateString()}</td>
                <td>${parseFloat(commission.amount).toFixed(2)}</td>
                <td>{commission.commission_type || "N/A"}</td>
                <td>
                  <span
                    className={`badge ${
                      commission.status === "pending"
                        ? "bg-warning"
                        : "bg-success"
                    }`}
                  >
                    {commission.status}
                  </span>
                </td>
                <td>
                  {commission.transfer_date
                    ? new Date(commission.transfer_date).toLocaleDateString()
                    : "Pending"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No pending commissions found.</p>
      )}
    </div>
  );
};

export default PendingCommissions;
