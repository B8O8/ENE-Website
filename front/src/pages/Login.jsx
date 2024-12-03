import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { jwtDecode } from "jwt-decode";

import apiService from "../services/apiService";
import "./Login.css";
import Logo from "../assets/logo-blue-simple.png";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      toast.error("Please fill in all fields!");
      return;
    }

    setLoading(true);

    try {
      const response = await apiService.post("/login", { email, password });

      // Extract the token from the response
      const { token } = response;

      // Decode the token to get the rank/role
      const decoded = jwtDecode(token);
      const { rank, name } = decoded;

      // Store the token in localStorage
      localStorage.setItem("token", token);

      // Redirect based on the rank
      if (rank === "Admin") {
        toast.success(`Welcome, ${name}!`);
        navigate("/admin-dashboard");
      } else {
        toast.success(`Welcome, ${name}!`);
        navigate("/user-dashboard");
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Login failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container d-flex flex-column justify-content-top align-items-center vh-100">
      <img src={Logo} alt="Logo" className="rotating-logo mb-4" />
      <div className="login-card shadow p-4 bg-white rounded">
        <h3 className="text-center mb-4">Welcome Back</h3>
        <form onSubmit={handleLogin}>
          <div className="mb-3">
            <label htmlFor="email" className="form-label">Email</label>
            <input
              type="email"
              id="email"
              className="form-control"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="mb-3">
            <label htmlFor="password" className="form-label">Password</label>
            <input
              type="password"
              id="password"
              className="form-control"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div className="d-flex justify-content-between mb-3">
            <Link to="/forgot-password" className="text-decoration-none">Forgot Password?</Link>
            <Link to="/register" className="text-decoration-none">Register Now</Link>
          </div>
          <button
            type="submit"
            className="btn btn-primary w-100"
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
