import React, { useState, useEffect } from "react";
import { Modal, Button, Table, Form } from "react-bootstrap";
import { toast } from "react-toastify";
import apiService from "../../services/apiService";
import SubscriptionModal from "./SubscriptionModal";

const ManageSubscriptions = () => {
  const [subscriptions, setSubscriptions] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [currentSubscription, setCurrentSubscription] = useState(null); // To store data for editing
  const [loading, setLoading] = useState(false);

  // Fetch all subscriptions
  const fetchSubscriptions = async () => {
    try {
      const response = await apiService.get("/subscriptions");
      setSubscriptions(response);
    } catch (error) {
      toast.error("Failed to fetch subscriptions.");
    }
  };

  useEffect(() => {
    fetchSubscriptions();
  }, []);

  // Handle create or edit submission
  const handleSubmit = async (subscriptionData) => {
    setLoading(true);
    try {
      if (currentSubscription) {
        // Update existing subscription
        await apiService.put(`/subscriptions/${currentSubscription.id}`, subscriptionData);
        toast.success("Subscription updated successfully!");
      } else {
        // Create a new subscription
        await apiService.post("/subscriptions", subscriptionData);
        toast.success("Subscription created successfully!");
      }
      fetchSubscriptions();
      setShowModal(false);
    } catch (error) {
      toast.error("Failed to save subscription.");
    } finally {
      setLoading(false);
    }
  };

  // Handle delete
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this subscription?")) {
      try {
        await apiService.delete(`/subscriptions/${id}`);
        toast.success("Subscription deleted successfully!");
        fetchSubscriptions();
      } catch (error) {
        toast.error("Failed to delete subscription.");
      }
    }
  };

  return (
    <div className="container mt-4">
      <h3>Manage Subscriptions</h3>
      <Button
        variant="primary"
        className="mb-3"
        onClick={() => {
          setCurrentSubscription(null);
          setShowModal(true);
        }}
      >
        Add Subscription
      </Button>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>#</th>
            <th>Name</th>
            <th>Description</th>
            <th>Price</th>
            <th>Duration (Days)</th>
            <th>VIP</th>
            <th>Visible</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {subscriptions.map((sub, index) => (
            <tr key={sub.id}>
              <td>{index + 1}</td>
              <td>{sub.name}</td>
              <td>{sub.description}</td>
              <td>${sub.price}</td>
              <td>{sub.duration}</td>
              <td>{sub.is_vip ? "Yes" : "No"}</td>
              <td>{sub.is_hide ? "No" : "Yes"}</td>
              <td>
                <Button
                  variant="warning"
                  size="sm"
                  className="me-2"
                  onClick={() => {
                    setCurrentSubscription(sub);
                    setShowModal(true);
                  }}
                >
                  Edit
                </Button>
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => handleDelete(sub.id)}
                >
                  Delete
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {showModal && (
        <SubscriptionModal
          show={showModal}
          handleClose={() => setShowModal(false)}
          onSubmit={handleSubmit}
          subscription={currentSubscription}
        />
      )}
    </div>
  );
};

export default ManageSubscriptions;
