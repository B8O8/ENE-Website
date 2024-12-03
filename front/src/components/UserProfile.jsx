import React, { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import { toast } from "react-toastify";
import apiService from "../services/apiService";
import "./UserProfile.css";
import Logo from "../assets/logo-blue-simple.png";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";

const UserProfile = () => {
  const [user, setUser] = useState(null); // Original user data
  const [editedUser, setEditedUser] = useState(null); // Temporary edited data
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false); // Edit mode toggle

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("Token not found");

        const decodedToken = jwtDecode(token);
        const userId = decodedToken.id;

        const response = await apiService.get(`/${userId}`);
        setUser(response);
        setEditedUser(response); // Initialize edited user
        
      } catch (error) {
        toast.error("Failed to fetch user profile.");
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, []);

  const handleEdit = () => {
    setIsEditing(true); // Enable editing mode
  };

  const handleCancel = () => {
    setEditedUser(user); // Reset to original user data
    setIsEditing(false); // Disable editing mode
  };

  const handleSave = async () => {
    try {
      const { name, phone, date_of_birth, address, profession } = editedUser; // Fields to update
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Token not found");

      const decodedToken = jwtDecode(token);
      const userId = decodedToken.id;

      // Send only editable fields to the API
      const updatedData = { name, phone, date_of_birth, address, profession };

      await apiService.put(`/${userId}`, updatedData);
      setUser(editedUser); // Update original user state
      setIsEditing(false); // Disable editing mode
      toast.success("Profile updated successfully.");
    } catch (error) {
      toast.error("Failed to update profile.");
    }
  };

  const handleChange = (field, value) => {
    setEditedUser({ ...editedUser, [field]: value });
  };

  const handlePhotoUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) {
      toast.error("No file selected.");
      return;
    }

    const formData = new FormData();
    formData.append("photo", file);

    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Token not found");

      const response = await apiService.post("/upload-photo", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      const updatedPhotoPath = response.data.photo; // Example: "uploads/new-photo.jpg"
      setUser({ ...user, photo: updatedPhotoPath }); // Update state to show new photo
      toast.success("Photo uploaded successfully.");
    } catch (error) {
      toast.error("Failed to upload photo.");
    }
  };

  if (loading) return <div className="text-center mt-5">Loading...</div>;
  if (!user)
    return (
      <div className="text-center mt-5">
        Failed to load user profile. Please try again later.
      </div>
    );

  return (
    <div className="container mt-5">
      <div className="card shadow-sm user-profile-card">
        <div className="card-header d-flex justify-content-between align-items-center bg-light">
          <div className="d-flex align-items-center">
          <img
  src={
    user?.photo
      ? `${new URL(user.photo.trim(), import.meta.env.VITE_API_BASE_URL)}`
      : Logo
  }
  alt="Profile"
  className="rounded-circle profile-picture"
/>

            <div className="ms-3">
              <h5 className="mb-0">{user.name}</h5>
            </div>
          </div>
          <div>
            <label
              htmlFor="photoUpload"
              className="btn btn-outline-primary btn-sm"
            >
              Upload Photo
            </label>
            <input
              type="file"
              id="photoUpload"
              accept="image/*"
              onChange={handlePhotoUpload}
              style={{ display: "none" }}
            />
          </div>
        </div>
        <div className="card-body">
          <h6 className="mb-3">Contact Information</h6>
          <form>
            <div className="row g-3">
              <div className="col-md-6">
                <label htmlFor="name" className="form-label">
                  Full Name
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="name"
                  value={editedUser.name || ""}
                  onChange={(e) => handleChange("name", e.target.value)}
                  disabled={!isEditing}
                />
              </div>
              <div className="col-md-6">
                <label htmlFor="phone" className="form-label">
                  Phone Number
                </label>
                <PhoneInput
                  country={"us"}
                  value={editedUser.phone || ""}
                  onChange={(value) => handleChange("phone", value)}
                  disabled={!isEditing}
                  inputStyle={{
                    fontSize: "1rem",
                    height: "38px",
                    width: "100%",
                    paddingLeft: "40px",
                  }}
                  containerStyle={{
                    width: "100%",
                  }}
                  excludeCountries={["il"]}
                />
              </div>
              <div className="col-md-12">
                <label htmlFor="address" className="form-label">
                  Address
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="address"
                  value={editedUser.address || ""}
                  onChange={(e) => handleChange("address", e.target.value)}
                  disabled={!isEditing}
                />
              </div>
              <div className="col-md-6">
                <label htmlFor="dateOfBirth" className="form-label">
                  Date of Birth
                </label>
                <input
                  type="date"
                  className="form-control"
                  id="dateOfBirth"
                  value={
                    editedUser.date_of_birth
                      ? new Date(editedUser.date_of_birth)
                          .toISOString()
                          .split("T")[0]
                      : ""
                  }
                  onChange={(e) =>
                    handleChange("date_of_birth", e.target.value)
                  }
                  disabled={!isEditing}
                />
              </div>
              <div className="col-md-6">
                <label htmlFor="profession" className="form-label">
                  Profession
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="profession"
                  value={editedUser.profession || ""}
                  onChange={(e) => handleChange("profession", e.target.value)}
                  disabled={!isEditing}
                />
              </div>
              <div className="col-12">
                <label htmlFor="affiliateLink" className="form-label">
                  Affiliate Link
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="affiliateLink"
                  value={user.affiliate_link}
                  readOnly
                  disabled
                />
              </div>
              <div className="col-md-6">
                <label htmlFor="email" className="form-label">
                  Email
                </label>
                <input
                  type="email"
                  className="form-control"
                  id="email"
                  value={user.email}
                  readOnly
                  disabled
                />
              </div>
            </div>
          </form>
          <div className="d-flex justify-content-between align-items-center mt-4">
            {isEditing ? (
              <>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={handleCancel}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={handleSave}
                >
                  Save
                </button>
              </>
            ) : (
              <button
                type="button"
                className="btn btn-primary"
                onClick={handleEdit}
              >
                Edit
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
