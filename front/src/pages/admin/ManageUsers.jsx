import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import apiService from "../../services/apiService";
import EditUserModal from "./EditUserModal";

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);

  // Fetch users
  const fetchUsers = async () => {
    try {
      const response = await apiService.get("/");
      setUsers(response);
    } catch (error) {
      toast.error("Failed to fetch users.");
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Approve user
  const handleApproveUser = async (userId) => {
    try {
      await apiService.post("/approve", { id: userId });
      toast.success("User approved successfully!");
      fetchUsers();
    } catch (error) {
      toast.error("Failed to approve user.");
    }
  };

  // Reject user
  const handleRejectUser = async (userId) => {
    try {
      await apiService.put(`/admin/${userId}`, { status: "Rejected" });
      toast.success("User rejected successfully!");
      fetchUsers();
    } catch (error) {
      toast.error("Failed to reject user.");
    }
  };

  // Open Edit Modal
  const handleEditClick = (user) => {
    setSelectedUser(user); // Update selected user
    setShowEditModal(true); // Open modal
  };

  // Close Edit Modal
  const handleCloseModal = () => {
    setShowEditModal(false);
    setSelectedUser(null); // Reset selected user to prevent stale data
  };

  return (
    <div>
      <h2>Manage Users</h2>
      <table className="table table-bordered">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Rank</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>{user.rank}</td>
              <td>{user.status}</td>
              <td>
                {/* Approve Button */}
                {user.status !== "Approved" && (
                  <button
                    className="btn btn-success btn-sm me-2"
                    onClick={() => handleApproveUser(user.id)}
                  >
                    Approve
                  </button>
                )}
                {/* Reject Button */}
                {user.status !== "Rejected" && (
                  <button
                    className="btn btn-danger btn-sm me-2"
                    onClick={() => handleRejectUser(user.id)}
                  >
                    Reject
                  </button>
                )}
                {/* Edit Button */}
                <button
                  className="btn btn-primary btn-sm"
                  onClick={() => handleEditClick(user)}
                >
                  Edit
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Edit User Modal */}
      {selectedUser && (
        <EditUserModal
          show={showEditModal}
          handleClose={handleCloseModal}
          user={selectedUser}
          onUpdate={fetchUsers}
        />
      )}
    </div>
  );
};

export default ManageUsers;
