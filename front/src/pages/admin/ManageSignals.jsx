import React, { useEffect, useState } from "react";
import { Button, Table } from "react-bootstrap";
import { toast } from "react-toastify";
import apiService from "../../services/apiService";

const ManageSignals = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch all signal logs
  const fetchLogs = async () => {
    setLoading(true);
    try {
      const response = await apiService.get("/signals/admin/logs");
      setLogs(response);
    } catch (error) {
      toast.error("Failed to fetch signal logs.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  // Reset invite link for a user
  const handleResetInvite = async (userId) => {
    if (
      !window.confirm(
        "Are you sure you want to reset the invite link for this user?"
      )
    ) {
      return;
    }

    try {
      await apiService.post("/signals/reset-invite", { userId });
      toast.success("Invite link reset successfully!");
      fetchLogs(); // Refresh the logs
    } catch (error) {
      toast.error("Failed to reset invite link.");
    }
  };

  return (
    <div className="container mt-4">
      <h3>Manage Signals</h3>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>#</th>
              <th>User</th>
              <th>Action</th>
              <th>Details</th>
              <th>Invite Link</th>
              <th>Retry Count</th>
              <th>Last Retry</th>
              <th>Created At</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {logs.map((log, index) => (
              <tr key={log.id}>
                <td>{index + 1}</td>
                <td>
                  {log.user_name
                    ? `${log.user_name} (${log.user_email})`
                    : "N/A"}
                </td>
                {/* Display user name */}
                <td>{log.action}</td>
                <td>{log.details}</td>
                <td>
                  {log.invite_link ? (
                    <a
                      href={log.invite_link}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Invite Link
                    </a>
                  ) : (
                    "N/A"
                  )}
                </td>
                <td>{log.retry_count}</td>
                <td>
                  {log.last_retry_at
                    ? new Date(log.last_retry_at).toLocaleString()
                    : "N/A"}
                </td>
                <td>{new Date(log.created_at).toLocaleString()}</td>
                <td>
                  {log.action === "add_to_channel" && (
                    <Button
                      variant="warning"
                      size="sm"
                      onClick={() => handleResetInvite(log.user_id)}
                    >
                      Reset Invite
                    </Button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </div>
  );
};

export default ManageSignals;
