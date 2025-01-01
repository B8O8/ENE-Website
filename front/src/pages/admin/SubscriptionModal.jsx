import React, { useState, useEffect } from "react";
import { Modal, Button, Form } from "react-bootstrap";

const SubscriptionModal = ({ show, handleClose, onSubmit, subscription }) => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    duration: "",
    is_vip: false,
    is_hide: false,
  });

  useEffect(() => {
    if (subscription) {
      setFormData({
        name: subscription.name || "",
        description: subscription.description || "",
        price: subscription.price || "",
        duration: subscription.duration || "",
        is_vip: subscription.is_vip || false,
        is_hide: subscription.is_hide || false,
      });
    } else {
      setFormData({
        name: "",
        description: "",
        price: "",
        duration: "",
        is_vip: false,
        is_hide: false,
      });
    }
  }, [subscription]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>{subscription ? "Edit Subscription" : "Add Subscription"}</Modal.Title>
      </Modal.Header>
      <Form onSubmit={handleSubmit}>
        <Modal.Body>
          <Form.Group className="mb-3">
            <Form.Label>Name</Form.Label>
            <Form.Control
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Description</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              name="description"
              value={formData.description}
              onChange={handleChange}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Price</Form.Label>
            <Form.Control
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Duration (Days)</Form.Label>
            <Form.Control
              type="number"
              name="duration"
              value={formData.duration}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Check
              type="checkbox"
              label="VIP Subscription"
              name="is_vip"
              checked={formData.is_vip}
              onChange={handleChange}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Check
              type="checkbox"
              label="Visible to Users"
              name="is_hide"
              checked={!formData.is_hide} // Display inverse of is_hide
              onChange={(e) => {
                setFormData((prevData) => ({
                  ...prevData,
                  is_hide: !e.target.checked, // Update is_hide based on checkbox
                }));
              }}
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button type="submit" variant="primary">
            Save Changes
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default SubscriptionModal;
