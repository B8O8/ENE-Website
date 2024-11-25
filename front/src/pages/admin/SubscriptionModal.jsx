import React, { useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";

const SubscriptionModal = ({ show, handleClose, onSubmit, subscription }) => {
  const [formFields, setFormFields] = useState({
    name: subscription?.name || "",
    description: subscription?.description || "",
    price: subscription?.price || "",
    duration: subscription?.duration || "",
  });

  const handleInputChange = (field, value) => {
    setFormFields((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    onSubmit(formFields);
  };

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>
          {subscription ? "Edit Subscription" : "Add Subscription"}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group className="mb-3">
            <Form.Label>Name</Form.Label>
            <Form.Control
              type="text"
              value={formFields.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
              placeholder="Enter subscription name"
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Description</Form.Label>
            <Form.Control
              as="textarea"
              value={formFields.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
              placeholder="Enter subscription description"
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Price</Form.Label>
            <Form.Control
              type="number"
              value={formFields.price}
              onChange={(e) => handleInputChange("price", e.target.value)}
              placeholder="Enter subscription price"
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Duration (Days)</Form.Label>
            <Form.Control
              type="number"
              value={formFields.duration}
              onChange={(e) => handleInputChange("duration", e.target.value)}
              placeholder="Enter subscription duration in days"
            />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Cancel
        </Button>
        <Button variant="primary" onClick={handleSave}>
          Save Changes
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default SubscriptionModal;
