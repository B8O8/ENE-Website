import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { Modal, Button } from "react-bootstrap";
import apiService from "../../services/apiService";

const ManageCategories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState("add"); // "add" or "edit"
  const [currentCategory, setCurrentCategory] = useState({ name: "", description: "" });

  // Fetch all categories
  const fetchCategories = async () => {
    setLoading(true);
    try {
      const response = await apiService.get("/categories");
      setCategories(response);
    } catch (error) {
      toast.error("Failed to fetch categories");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // Handle opening the modal
  const openModal = (mode, category = { name: "", description: "" }) => {
    setModalMode(mode);
    setCurrentCategory(category);
    setShowModal(true);
  };

  // Handle saving category (add or edit)
  const saveCategory = async () => {
    setLoading(true);
    try {
      if (modalMode === "add") {
        await apiService.post("/categories", currentCategory);
        toast.success("Category added successfully");
      } else {
        await apiService.put(`/categories/${currentCategory.id}`, currentCategory);
        toast.success("Category updated successfully");
      }
      fetchCategories();
      setShowModal(false);
    } catch (error) {
      toast.error("Failed to save category");
    } finally {
      setLoading(false);
    }
  };

  // Handle deleting a category
  const deleteCategory = async (id) => {
    if (!window.confirm("Are you sure you want to delete this category?")) return;

    setLoading(true);
    try {
      await apiService.delete(`/categories/${id}`);
      toast.success("Category deleted successfully");
      fetchCategories();
    } catch (error) {
      toast.error("Failed to delete category");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-4">
      <h3>Manage Categories</h3>
      <Button
        className="mb-3"
        onClick={() => openModal("add")}
      >
        Add Category
      </Button>
      <table className="table table-striped">
        <thead>
          <tr>
            <th>#</th>
            <th>Name</th>
            <th>Description</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {categories.map((category, index) => (
            <tr key={category.id}>
              <td>{index + 1}</td>
              <td>{category.name}</td>
              <td>{category.description}</td>
              <td>
                <Button
                  variant="primary"
                  className="me-2"
                  onClick={() => openModal("edit", category)}
                >
                  Edit
                </Button>
                <Button
                  variant="danger"
                  onClick={() => deleteCategory(category.id)}
                >
                  Delete
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Add/Edit Category Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>
            {modalMode === "add" ? "Add Category" : "Edit Category"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="mb-3">
            <label htmlFor="name" className="form-label">
              Name
            </label>
            <input
              type="text"
              id="name"
              className="form-control"
              value={currentCategory.name}
              onChange={(e) =>
                setCurrentCategory({ ...currentCategory, name: e.target.value })
              }
            />
          </div>
          <div className="mb-3">
            <label htmlFor="description" className="form-label">
              Description
            </label>
            <textarea
              id="description"
              className="form-control"
              value={currentCategory.description}
              onChange={(e) =>
                setCurrentCategory({ ...currentCategory, description: e.target.value })
              }
            ></textarea>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={saveCategory} disabled={loading}>
            {loading ? "Saving..." : "Save"}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default ManageCategories;
