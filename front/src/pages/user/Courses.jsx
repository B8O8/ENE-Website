import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import apiService from "../../services/apiService";
import VideoPlayerModal from "./VideoPlayerModal";

const Courses = () => {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [videos, setVideos] = useState([]);
  const [loadingVideos, setLoadingVideos] = useState(false);
  const [showPlayer, setShowPlayer] = useState(false);
  const [videoUrl, setVideoUrl] = useState("");

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
  const fetchVideos = async (categoryId) => {
    setLoadingVideos(true);
    try {
      const response = await apiService.get(`/categories/${categoryId}/videos`);
      setVideos(response);
      setSelectedCategory(categoryId);
    } catch (error) {
      toast.error("Failed to fetch videos");
    } finally {
      setLoadingVideos(false);
    }
  };

  const handleVideoPlay = (url) => {
    setVideoUrl(url);
    setShowPlayer(true);
  };

  return (
    <div className="courses-tab p-4">
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
              onClick={() => fetchVideos(category.id)}
            >
              {category.name}
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
        {videos.map((video) => (
          <div key={video.id} className="col-md-4 col-sm-6 mb-4">
            <div className="card">
              <video className="card-img-top" controls>
                <source src={video.url} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
              <div className="card-body text-center">
                <h5 className="card-title">{video.title}</h5>
                <button
                  className="btn btn-primary btn-sm mt-2"
                  onClick={() => handleVideoPlay(video.url)}
                >
                  Play
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    )}
  </div>
)}

      {/* Video Player Modal */}
      <VideoPlayerModal
        show={showPlayer}
        videoUrl={videoUrl}
        onClose={() => setShowPlayer(false)}
      />
    </div>
  );
};

export default Courses;
