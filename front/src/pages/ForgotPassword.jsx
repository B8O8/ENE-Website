import React, { useState } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import apiService from "../services/apiService";
import "./AuthForms.css";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate(); // Initialize useNavigate

  const handleForgotPassword = async (e) => {
    e.preventDefault();

    if (!email) {
      toast.error("Please enter your email!");
      return;
    }

    setLoading(true);
    try {
      const response = await apiService.post("/forgot-password", { email });
      toast.success(
        response?.message || "Password reset email has been sent!"
      );
      navigate("/");
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to send reset email."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <h3>Forgot Password</h3>
      <form onSubmit={handleForgotPassword}>
        <div className="mb-3">
          <label htmlFor="email" className="form-label">
            Email Address
          </label>
          <input
            type="email"
            id="email"
            className="form-control"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
          />
        </div>
        <button
          type="submit"
          className="btn btn-primary w-100"
          disabled={loading}
        >
          {loading ? "Sending..." : "Send Reset Link"}
        </button>
        <p className="mt-3">
          <a href="/login">Back to Login</a>
        </p>
      </form>
    </div>
  );
};

export default ForgotPassword;
