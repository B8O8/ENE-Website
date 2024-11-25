import React from "react";
import "./HeroSection.css";
import heroImage from "../assets/hero-image.jpg"; // Replace with your image path

const HeroSection = () => {
  return (
    <div
      className="hero-section d-flex align-items-center"
      style={{ backgroundImage: `url(${heroImage})` }}
    >
      <div className="container">
        <div className="row align-items-center">
          {/* Left Text Section */}
          <div className="col-12 col-md-6 text-white text-center text-md-start mb-4 mb-md-0">
            <h4 className="hero-subtitle">For A Better Future</h4>
            <h1 className="hero-title">
              Build An <span className="text-warning">Incredible</span> Learning
              Experience
            </h1>
            {/* <button className="btn btn-primary btn-lg mt-3">
              About Us
            </button> */}
          </div>

          {/* Right Registration Section */}
          <div className="col-12 col-md-5 offset-md-1 bg-white p-4 rounded shadow">
            <h3 className="fw-bold text-center mb-3">Schedule a Meeting</h3>
            <p className="text-center mb-4">
                Unlock the potential of <span className="text-primary">what we offer</span>
            </p>
            <form>
              <div className="form-group mb-3">
                <input
                  type="text"
                  className="form-control rounded-pill"
                  placeholder="Username"
                />
              </div>
              <div className="form-group mb-3">
                <input
                  type="email"
                  className="form-control rounded-pill"
                  placeholder="Your Email"
                />
              </div>
              <div className="form-group mb-3">
                <input
                  type="password"
                  className="form-control rounded-pill"
                  placeholder="Password"
                />
              </div>
              <button
                type="submit"
                className="btn btn-primary btn-lg rounded-pill w-100"
              >
                Sign Up
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
