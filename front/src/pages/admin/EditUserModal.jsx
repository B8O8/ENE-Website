import React, { useState, useEffect } from "react";
import { Modal, Button } from "react-bootstrap";
import { toast } from "react-toastify";
import apiService from "../../services/apiService";

const EditUserModal = ({ show, handleClose, user, onUpdate }) => {
  const [formFields, setFormFields] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
    address: user?.address || "",
    rank: user?.rank || "",
    date_of_birth: user?.date_of_birth ||  "",
    profession: user?.profession || "",
    subscription_id: user?.subscription_id || "",
    status: user?.status || "",
  });
  const [subscriptions, setSubscriptions] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch available subscriptions
  useEffect(() => {
    const fetchSubscriptions = async () => {
      try {
        const response = await apiService.get("/subscriptions");
        setSubscriptions(response);
      } catch (error) {
        toast.error("Failed to fetch subscription plans.");
      }
    };

    fetchSubscriptions();
  }, []);

  const handleInputChange = (field, value) => {
    setFormFields((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      
      const updatedFields = {
        ...formFields,
        date_of_birth: formFields.date_of_birth
          ? new Date(formFields.date_of_birth).toISOString().split("T")[0]
          : null, // Send null if the date_of_birth is empty
      };

      await apiService.put(`/admin/${user.id}`, updatedFields);
      toast.success("User updated successfully!");
      onUpdate(); // Trigger a refresh in the parent component
      handleClose();
    } catch (error) {
      
      toast.error("Failed to update user.");
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Edit User</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <form>
          <div className="row mb-3">
            <div className="col-md-6 col-sm-12">
              <label htmlFor="name" className="form-label">
                Name
              </label>
              <input
                type="text"
                id="name"
                className="form-control"
                value={formFields.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
              />
            </div>
            <div className="col-md-6 col-sm-12">
              <label htmlFor="email" className="form-label">
                Email
              </label>
              <input
                type="email"
                id="email"
                className="form-control"
                value={formFields.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
              />
            </div>
          </div>
          <div className="row mb-3">
            <div className="col-md-6 col-sm-12">
              <label htmlFor="phone" className="form-label">
                Phone
              </label>
              <input
                type="text"
                id="phone"
                className="form-control"
                value={formFields.phone}
                onChange={(e) => handleInputChange("phone", e.target.value)}
              />
            </div>
            <div className="col-md-6 col-sm-12">
              <label htmlFor="address" className="form-label">
                Address
              </label>
              <input
                type="text"
                id="address"
                className="form-control"
                value={formFields.address}
                onChange={(e) => handleInputChange("address", e.target.value)}
              />
            </div>
          </div>
          <div className="row mb-3">
            <div className="col-md-6 col-sm-12">
              <label htmlFor="rank" className="form-label">
                Rank
              </label>
              <select
                id="rank"
                className="form-select"
                value={formFields.rank}
                onChange={(e) => handleInputChange("rank", e.target.value)}
              >
                <option value="Standard User">Standard User</option>
                <option value="Ambassador">Ambassador</option>
                <option value="Board Member">Board Member</option>
                <option value="Admin">Admin</option>
              </select>
            </div>
            <div className="col-md-6 col-sm-12">
              <label htmlFor="date_of_birth" className="form-label">
                Date of Birth
              </label>
              <input
                type="date"
                id="date_of_birth"
                className="form-control"
                value={formFields.date_of_birth ? new Date(formFields.date_of_birth)
                  .toISOString()
                  .split("T")[0]
              : ""}
                onChange={(e) =>
                  handleInputChange("date_of_birth", e.target.value)
                }
              />
            </div>
          </div>
          <div className="row mb-3">
            <div className="col-md-6 col-sm-12">
              <label htmlFor="profession" className="form-label">
                Profession
              </label>
              <input
                type="text"
                id="profession"
                className="form-control"
                value={formFields.profession}
                onChange={(e) => handleInputChange("profession", e.target.value)}
              />
            </div>
            <div className="col-md-6 col-sm-12">
              <label htmlFor="subscription_id" className="form-label">
                Subscription Plan
              </label>
              <select
                id="subscription_id"
                className="form-select"
                value={formFields.subscription_id}
                onChange={(e) =>
                  handleInputChange("subscription_id", e.target.value)
                }
              >
                <option value="">Select a plan</option>
                {subscriptions.map((plan) => (
                  <option key={plan.id} value={plan.id}>
                    {plan.name} - ${plan.price} ({plan.duration} days)
                  </option>
                ))}
              </select>
            </div>
          </div>
        </form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Cancel
        </Button>
        <Button variant="primary" onClick={handleSave} disabled={loading}>
          {loading ? "Saving..." : "Save Changes"}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default EditUserModal;
