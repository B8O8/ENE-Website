import React, { useState, useEffect } from "react";
import { Button, Table, Modal, Form } from "react-bootstrap";
import { toast } from "react-toastify";
import apiService from "../../services/apiService";

const ManageReminders = () => {
  const [reminders, setReminders] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    reminder_date: "",
    email: "",
  });

  const fetchReminders = async () => {
    try {
      const response = await apiService.get("/admin/reminders");
      setReminders(response);
    } catch (error) {
      toast.error("Failed to fetch reminders.");
    }
  };

  const handleOpenModal = () => setShowModal(true);
  const handleCloseModal = () => {
    setShowModal(false);
    setFormData({ name: "", description: "", reminder_date: "", email: "" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await apiService.post("/admin/reminders", formData);
      toast.success("Reminder created successfully!");
      fetchReminders();
      handleCloseModal();
    } catch (error) {
      toast.error("Failed to create reminder.");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this reminder?"))
      return;
    try {
      await apiService.delete(`/admin/reminders/${id}`);
      toast.success("Reminder deleted successfully!");
      fetchReminders();
    } catch (error) {
      toast.error("Failed to delete reminder.");
    }
  };

  useEffect(() => {
    fetchReminders();
  }, []);

  return (
    <div className="container mt-4">
      <h3>Manage Reminders</h3>
      <Button className="mb-3" onClick={handleOpenModal}>
        Create Reminder
      </Button>

      <Table striped bordered hover>
        <thead>
          <tr>
            <th>#</th>
            <th>Name</th>
            <th>Description</th>
            <th>Reminder Date</th>
            <th>Email</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {reminders.map((reminder, index) => (
            <tr key={reminder.id}>
              <td>{index + 1}</td>
              <td>{reminder.name}</td>
              <td>{reminder.description}</td>
              <td>
                {new Date(reminder.reminder_date).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </td>
              <td>{reminder.email}</td>
              <td>
                <Button
                  variant="danger"
                  onClick={() => handleDelete(reminder.id)}
                >
                  Delete
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {/* Modal for Creating Reminder */}
      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Create Reminder</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group>
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                required
              />
            </Form.Group>
            <Form.Group className="mt-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                required
              />
            </Form.Group>
            <Form.Group className="mt-3">
              <Form.Label>Reminder Date</Form.Label>
              <Form.Control
                type="date"
                value={formData.reminder_date}
                onChange={(e) =>
                  setFormData({ ...formData, reminder_date: e.target.value })
                }
                required
              />
            </Form.Group>
            <Form.Group className="mt-3">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                required
              />
            </Form.Group>
            <Button className="mt-4" type="submit">
              Save Reminder
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default ManageReminders;
