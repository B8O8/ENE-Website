import React, { useState, useEffect, useRef } from "react";
import { toast } from "react-toastify";
import apiService from "../../services/apiService";
import { Modal, Button } from "react-bootstrap";
import {jwtDecode} from "jwt-decode";

const Courses = () => {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [videos, setVideos] = useState([]);
  const [loadingVideos, setLoadingVideos] = useState(false);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const videoRefs = useRef([]); // Reference to all video elements

  // Check if the user is VIP
  const token = localStorage.getItem("token");
  let isVip = false;

  if (token) {
    try {
      const decoded = jwtDecode(token);
      isVip = decoded.is_vip === 1;
      console.log("Decoded token:", decoded);
      console.log("isVip value:", isVip);
    } catch (error) {
      console.error("Failed to decode token:", error);
    }
  }

  // Fetch all categories on load
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await apiService.get("/categories");
        setCategories(response);
      } catch (error) {
        toast.error("Failed to fetch categories");
      }
    };

    fetchCategories();
  }, []);

  // Fetch videos for a specific category
  const fetchVideos = async (category) => {
    if (category.is_vip_only && !isVip) {
      setShowUpgradeModal(true);
      return;
    }

    setLoadingVideos(true);
    try {
      const response = await apiService.get(`/categories/${category.id}/videos`);
      setVideos(response);
      setSelectedCategory(category.id);
    } catch (error) {
      toast.error("Failed to fetch videos");
    } finally {
      setLoadingVideos(false);
    }
  };

  // Handle video play
  const handlePlay = (index) => {
    // Pause and reset all other videos
    videoRefs.current.forEach((video, idx) => {
      if (idx !== index && video) {
        video.pause();
        video.currentTime = 0; // Reset the video to the start
      }
    });
  };

  return (
    <div className="courses-tab p-4 text-center">
      <h3>Courses</h3>

      {/* Categories */}
      <div className="categories">
        <h4>Categories</h4>
        <ul className="list-group">
          {categories.map((category) => (
            <li
              key={category.id}
              className={`list-group-item ${
                selectedCategory === category.id ? "active" : ""
              }`}
              onClick={() => fetchVideos(category)}
            >
              {category.name}{" "}
              {category.is_vip_only && (
                <span className="badge bg-warning ms-2">VIP</span>
              )}
            </li>
          ))}
        </ul>
      </div>

      {/* Videos */}
      {selectedCategory && (
        <div className="videos mt-4">
          <h4>Videos</h4>
          {loadingVideos ? (
            <p>Loading videos...</p>
          ) : videos.length === 0 ? (
            <p>No videos available in this category.</p>
          ) : (
            <div className="row">
              {videos.map((video, index) => (
                <div key={video.id} className="col-md-4 col-sm-6 mb-4">
                  <div className="card">
                    <video
                      className="card-img-top"
                      controls
                      ref={(el) => (videoRefs.current[index] = el)} // Store ref
                      onPlay={() => handlePlay(index)} // Call handlePlay on play
                    >
                      <source src={video.url} type="video/mp4" />
                      Your browser does not support the video tag.
                    </video>
                    <div className="card-body text-center">
                      <h5 className="card-title">{video.title}</h5>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Upgrade Modal */}
      <Modal show={showUpgradeModal} onHide={() => setShowUpgradeModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Upgrade to VIP</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>
            This category is restricted to VIP members only. Upgrade your
            subscription to access this content.
          </p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowUpgradeModal(false)}>
            Close
          </Button>
          <Button
            variant="primary"
            onClick={() => {
              setShowUpgradeModal(false);
              toast.info("Redirecting to subscription page...");
            }}
          >
            Upgrade Now
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Courses;
