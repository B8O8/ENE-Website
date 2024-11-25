import React, { useEffect, useState } from "react";
import {jwtDecode} from "jwt-decode";
import { toast } from "react-toastify";
import apiService from "../services/apiService";
import "./UserProfile.css";
import Logo from "../assets/logo-blue-simple.png";

const UserProfile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("Token not found");

        const decodedToken = jwtDecode(token);
        const userId = decodedToken.id;

        const response = await apiService.get(`/${userId}`);
        setUser(response);
      } catch (error) {
        toast.error("Failed to fetch user profile.");
        console.error("Error fetching user profile:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, []);

  if (loading) return <div className="text-center mt-5">Loading...</div>;
  if (!user) return <div className="text-center mt-5">Failed to load user profile. Please try again later.</div>;

  return (
    <div className="container mt-5">
      <div className="card shadow-sm user-profile-card">
        <div className="card-header d-flex justify-content-between align-items-center bg-light">
          <div className="d-flex align-items-center">
            <img
              src={user.photo || Logo}
              alt="Profile"
              className="rounded-circle profile-picture"
            />
            <div className="ms-3">
              <h5 className="mb-0">{user.name}</h5>
              <a href="#view-profile" className="text-primary small">View Profile</a>
            </div>
          </div>
          <button className="btn btn-outline-primary btn-sm">Upload</button>
        </div>
        <div className="card-body">
          <h6 className="mb-3">Contact Information</h6>
          <form>
            <div className="row g-3">
              <div className="col-md-6">
                <label htmlFor="firstName" className="form-label">First Name</label>
                <input
                  type="text"
                  className="form-control"
                  id="firstName"
                  defaultValue={user.name.split(" ")[0] || ""}
                />
              </div>
              <div className="col-md-6">
                <label htmlFor="lastName" className="form-label">Last Name</label>
                <input
                  type="text"
                  className="form-control"
                  id="lastName"
                  defaultValue={user.name.split(" ")[1] || ""}
                />
              </div>
              <div className="col-md-6">
                <label htmlFor="email" className="form-label">Email</label>
                <input
                  type="email"
                  className="form-control"
                  id="email"
                  defaultValue={user.email}
                />
              </div>
              <div className="col-md-6">
                <label htmlFor="phone" className="form-label">Phone Number</label>
                <input
                  type="text"
                  className="form-control"
                  id="phone"
                  defaultValue={user.phone || ""}
                />
              </div>
              <div className="col-md-12">
                <label htmlFor="address" className="form-label">Address</label>
                <input
                  type="text"
                  className="form-control"
                  id="address"
                  defaultValue={user.address || ""}
                />
              </div>
              <div className="col-md-6">
                <label htmlFor="dateOfBirth" className="form-label">Date of Birth</label>
                <input
                  type="date"
                  className="form-control"
                  id="dateOfBirth"
                  defaultValue={user.date_of_birth || ""}
                />
              </div>
              <div className="col-md-6">
                <label htmlFor="profession" className="form-label">Profession</label>
                <input
                  type="text"
                  className="form-control"
                  id="profession"
                  defaultValue={user.profession || ""}
                />
              </div>
              <div className="col-12">
                <label htmlFor="affiliateLink" className="form-label">Affiliate Link</label>
                <input
                  type="text"
                  className="form-control"
                  id="affiliateLink"
                  defaultValue={user.affiliate_link}
                  readOnly
                />
              </div>
            </div>
            <div className="d-flex justify-content-between align-items-center mt-4">
              <button type="button" className="btn btn-secondary">Cancel</button>
              <button type="submit" className="btn btn-primary">Save</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
