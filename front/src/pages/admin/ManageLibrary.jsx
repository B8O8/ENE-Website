import React, { useState, useEffect } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { toast } from "react-toastify";
import apiService from "../../services/apiService";

const ManageLibrary = () => {
  const [files, setFiles] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [file, setFile] = useState(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [editingFile, setEditingFile] = useState(null); // Track the file being edited
  const [loading, setLoading] = useState(false);

  // Fetch all library files
  const fetchLibraryFiles = async () => {
    try {
      const response = await apiService.get("/library/admin");
      setFiles(response);
    } catch (error) {
      toast.error("Failed to fetch library files.");
    }
  };

  useEffect(() => {
    fetchLibraryFiles();
  }, []);

  // Open the modal for adding or editing
  const openModal = (file = null) => {
    setEditingFile(file);
    if (file) {
      setTitle(file.title);
      setDescription(file.description);
    } else {
      setTitle("");
      setDescription("");
      setFile(null);
    }
    setShowModal(true);
  };

  // Handle file upload or update
  const handleFileUploadOrUpdate = async () => {
    if (!title || !description) {
      toast.error("Please provide all required fields.");
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    if (file) {
      formData.append("file", file);
    }

    try {
      if (editingFile) {
        // Update existing file
        await apiService.put(`/library/${editingFile.id}`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        toast.success("Library entry updated successfully!");
      } else {
        // Upload new file
        await apiService.post("/library/upload", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        toast.success("File uploaded successfully!");
      }

      fetchLibraryFiles();
      setShowModal(false);
    } catch (error) {
      toast.error("Failed to save library entry.");
    } finally {
      setLoading(false);
    }
  };

  // Handle file deletion
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this file?")) return;

    try {
      await apiService.delete(`/library/${id}`);
      toast.success("File deleted successfully!");
      fetchLibraryFiles();
    } catch (error) {
      toast.error("Failed to delete file.");
    }
  };

  return (
    <div className="container mt-4">
      <h3>Manage Library</h3>
      <Button variant="primary" className="mb-3" onClick={() => openModal()}>
        Upload File
      </Button>

      <table className="table table-striped">
        <thead>
          <tr>
            <th>#</th>
            <th>Title</th>
            <th>Description</th>
            <th>Uploaded At</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {files.map((file, index) => (
            <tr key={file.id}>
              <td>{index + 1}</td>
              <td>{file.title}</td>
              <td>{file.description}</td>
              <td>{new Date(file.created_at).toLocaleString()}</td>
              <td>
                <Button
                  variant="warning"
                  size="sm"
                  className="me-2"
                  onClick={() => openModal(file)}
                >
                  Edit
                </Button>
                <Button variant="danger" size="sm" onClick={() => handleDelete(file.id)}>
                  Delete
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Upload or Edit Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>{editingFile ? "Edit Library Entry" : "Upload File"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group controlId="formTitle" className="mb-3">
            <Form.Label>Title</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter file title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </Form.Group>
          <Form.Group controlId="formDescription" className="mb-3">
            <Form.Label>Description</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              placeholder="Enter file description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </Form.Group>
          <Form.Group controlId="formFile" className="mb-3">
            <Form.Label>File (Leave empty to keep the current file)</Form.Label>
            <Form.Control type="file" onChange={(e) => setFile(e.target.files[0])} />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleFileUploadOrUpdate} disabled={loading}>
            {loading ? "Saving..." : editingFile ? "Update" : "Upload"}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default ManageLibrary;
