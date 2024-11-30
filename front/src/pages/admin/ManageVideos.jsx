import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { Modal, Button } from "react-bootstrap";
import apiService from "../../services/apiService";

const ManageVideos = () => {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [videos, setVideos] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState("add"); // "add" or "edit"
  const [currentVideo, setCurrentVideo] = useState({
    title: "",
    description: "",
    video_order: 1,
    file: null,
  });
  const [loading, setLoading] = useState(false);

  // Fetch categories
  const fetchCategories = async () => {
    try {
      const response = await apiService.get("/categories");
      setCategories(response);
    } catch (error) {
      toast.error("Failed to fetch categories.");
    }
  };

  // Fetch videos for the selected category
  const fetchVideos = async (categoryId) => {
    try {
      const response = await apiService.get(`/categories/${categoryId}/videos`);
      setVideos(response);
    } catch (error) {
      toast.error("Failed to fetch videos.");
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // Handle category change
  const handleCategoryChange = (categoryId) => {
    console.log("Selected category ID:", categoryId); // Debugging
    setSelectedCategory(categoryId);
    fetchVideos(categoryId);
  };

  // Open modal for adding or editing a video
  const openModal = (
    mode,
    video = { title: "", description: "", video_order: 1, file: null }
  ) => {
    setModalMode(mode);
    setCurrentVideo(video);
    setShowModal(true);
  };

  // Handle saving a video (add or edit)
  const saveVideo = async () => {
    setLoading(true);

    if (!selectedCategory) {
      toast.error("Please select a category before uploading a video.");
      setLoading(false);
      return;
    }

    // Validate video file for "add" mode
    if (modalMode === "add" && !currentVideo.file) {
      toast.error("Please select a video file.");
      setLoading(false);
      return;
    }

    const formData = new FormData();
    formData.append("title", currentVideo.title);
    formData.append("description", currentVideo.description || "");
    formData.append("video_order", currentVideo.video_order || 1);
    if (currentVideo.file) formData.append("video", currentVideo.file);

    try {
      if (modalMode === "add") {
        // API call for creating a new video
        await apiService.post(
          `/categories/${selectedCategory}/videos`,
          formData
        );
        toast.success("Video added successfully.");
      } else {
        // API call for updating an existing video
        await apiService.put(
          `/categories/${selectedCategory}/videos/${currentVideo.id}`,
          formData
        );
        toast.success("Video updated successfully.");
      }
      fetchVideos(selectedCategory);
      setShowModal(false);
    } catch (error) {
      toast.error("Failed to save video.");
    } finally {
      setLoading(false);
    }
  };

  // Handle deleting a video
  const deleteVideo = async (videoId) => {
    if (!window.confirm("Are you sure you want to delete this video?")) return;

    setLoading(true);
    try {
      await apiService.delete(
        `/categories/${selectedCategory}/videos/${videoId}`
      );
      toast.success("Video deleted successfully.");
      fetchVideos(selectedCategory);
    } catch (error) {
      toast.error("Failed to delete video.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-4">
      <h3>Manage Videos</h3>
      <div className="mb-3">
        <label htmlFor="category" className="form-label">
          Select Category
        </label>
        <select
          id="category"
          className="form-select"
          onChange={(e) => handleCategoryChange(e.target.value)}
        >
          <option value="">-- Select a Category --</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
      </div>

      {selectedCategory && (
        <>
          <Button className="mb-3" onClick={() => openModal("add")}>
            Add Video
          </Button>
          <table className="table table-striped">
            <thead>
              <tr>
                <th>#</th>
                <th>Title</th>
                <th>Description</th>
                <th>Order</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {videos.map((video, index) => (
                <tr key={video.id}>
                  <td>{index + 1}</td>
                  <td>{video.title}</td>
                  <td>{video.description}</td>
                  <td>{video.video_order}</td>
                  <td>
                    <Button
                      variant="primary"
                      className="me-2"
                      onClick={() => openModal("edit", video)}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="danger"
                      onClick={() => deleteVideo(video.id)}
                    >
                      Delete
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}

      {/* Add/Edit Video Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>
            {modalMode === "add" ? "Add Video" : "Edit Video"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="mb-3">
            <label htmlFor="title" className="form-label">
              Title
            </label>
            <input
              type="text"
              id="title"
              className="form-control"
              value={currentVideo.title}
              onChange={(e) =>
                setCurrentVideo({ ...currentVideo, title: e.target.value })
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
              value={currentVideo.description}
              onChange={(e) =>
                setCurrentVideo({
                  ...currentVideo,
                  description: e.target.value,
                })
              }
            ></textarea>
          </div>
          <div className="mb-3">
            <label htmlFor="order" className="form-label">
              Order
            </label>
            <input
              type="number"
              id="order"
              className="form-control"
              value={currentVideo.video_order}
              onChange={(e) =>
                setCurrentVideo({
                  ...currentVideo,
                  video_order: e.target.value,
                })
              }
            />
          </div>
          <div className="mb-3">
            <label htmlFor="file" className="form-label">
              Video File
            </label>
            {modalMode === "edit" && currentVideo.video_url && (
              <p>
                Current File:{" "}
                <a
                  href={currentVideo.video_url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {currentVideo.video_url.split("/").pop()}
                </a>
              </p>
            )}
            <input
              type="file"
              id="file"
              className="form-control"
              onChange={(e) =>
                setCurrentVideo({ ...currentVideo, file: e.target.files[0] })
              }
            />
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={saveVideo} disabled={loading}>
            {loading ? "Saving..." : "Save"}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default ManageVideos;
