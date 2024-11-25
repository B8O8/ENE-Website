import React, { useState, useEffect } from "react";
import { Button, Table } from "react-bootstrap";
import { toast } from "react-toastify";
import apiService from "../../services/apiService";
import './WalletRequests.css';

const WalletRequests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch wallet requests
  const fetchRequests = async () => {
    setLoading(true);
    try {
      const response = await apiService.get("/admin/wallet-requests");
      setRequests(response);
    } catch (error) {
      toast.error("Failed to fetch wallet requests.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  // Approve a wallet request
  const handleApprove = async (requestId) => {
    if (!window.confirm("Are you sure you want to approve this request?")) {
      return;
    }

    try {
      await apiService.post(`/admin/wallet-requests/${requestId}/approve`);
      toast.success("Request approved successfully!");
      fetchRequests(); // Refresh the list
    } catch (error) {
      toast.error("Failed to approve request.");
    }
  };

  // Reject a wallet request
  const handleReject = async (requestId) => {
    if (!window.confirm("Are you sure you want to reject this request?")) {
      return;
    }

    try {
      await apiService.post(`/admin/wallet-requests/${requestId}/reject`);
      toast.success("Request rejected successfully!");
      fetchRequests(); // Refresh the list
    } catch (error) {
      toast.error("Failed to reject request.");
    }
  };

  return (
    <div className="container mt-4">
      <h3>Manage Wallet Requests</h3>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>#</th>
              <th>User</th>
              <th>Email</th>
              <th>Amount</th>
              <th>Type</th>
              <th>Requested At</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {requests.map((req, index) => (
              <tr key={req.id}>
                <td>{index + 1}</td>
                <td>{req.name}</td>
                <td>{req.email}</td>
                <td>${req.amount}</td>
                <td>{req.type}</td>
                <td>{new Date(req.created_at).toLocaleString()}</td>
                <td>
                  <Button
                    variant="success"
                    size="sm"
                    className="me-2"
                    onClick={() => handleApprove(req.id)}
                  >
                    Approve
                  </Button>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => handleReject(req.id)}
                  >
                    Reject
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </div>
  );
};

export default WalletRequests;
