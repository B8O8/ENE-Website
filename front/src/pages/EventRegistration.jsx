import React, { useState } from "react";
import Select from "react-select";
import countries from "world-countries";
import apiService from "../services/apiService";
import { toast } from "react-toastify";

const EventRegistration = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    country_of_residence: null,
  });

  // Convert countries to options for react-select
  // Filter out Israel from the countries array
  const countryOptions = countries
    .filter((country) => country.name.common !== "Israel")
    .map((country) => ({
      value: country.cca2,
      label: country.name.common,
    }));

  const customStyles = {
    control: (provided) => ({
      ...provided,
      backgroundColor: "#1c1c1c",
      borderColor: "#6c757d", // Matches Bootstrap's secondary color
      color: "#ffffff",
      boxShadow: "none",
      "&:hover": {
        borderColor: "#6c757d",
      },
    }),
    menu: (provided) => ({
      ...provided,
      backgroundColor: "#1c1c1c",
      color: "#ffffff",
    }),
    singleValue: (provided) => ({
      ...provided,
      color: "#ffffff",
    }),
    placeholder: (provided) => ({
      ...provided,
      color: "#6c757d",
    }),
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isFocused ? "#343a40" : "#1c1c1c",
      color: "#ffffff",
    }),
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleCountryChange = (selectedOption) => {
    setFormData({ ...formData, country_of_residence: selectedOption });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast.error("Please enter a valid email address.");
      return;
    }

    if (!formData.country_of_residence) {
      toast.error("Please select a country.");
      return;
    }

    try {
      await apiService.post("/events/register", {
        first_name: formData.firstName,
        last_name: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        country_of_residence: formData.country_of_residence.label, // Send selected country
      });
      toast.success("Event registered successfully! Check your inbox");
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        country_of_residence: null,
      });
    } catch (error) {
      toast.error("Registration failed. Please try again.");
    }
  };

  return (
    <div className="bg-dark d-flex align-items-center justify-content-center text-light">
      <div className="container bg-dark">
        <div className="row justify-content-center">
          {/* Event Image */}
          <div className="col-lg-6 col-sm-6 mb-4 text-center">
            <img
              src="/HassanEvent.jpeg"
              alt="Event Poster"
              className="img-fluid rounded shadow-lg"
            />
          </div>

          {/* Registration Form */}
          <div className="col-lg-6 col-sm-6 align-self-center">
            <form
              onSubmit={handleSubmit}
              className="p-4 rounded shadow-lg text-light"
              style={{
                backgroundColor: "rgba(0, 0, 0, 0.12)", // Semi-transparent black
              }}
            >
              <h2 className="text-center mb-5">Event Registration</h2>
              <div className="row g-3">
                <div className="col-12 col-md-12 mb-4">
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    placeholder="First Name"
                    className="form-control text-center bg-dark text-light border-secondary"
                    required
                  />
                </div>
                <div className="col-12 col-md-12 mb-4">
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    placeholder="Last Name"
                    className="form-control text-center bg-dark text-light border-secondary"
                    required
                  />
                </div>
                <div className="col-12 col-md-12 mb-4">
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Email"
                    className="form-control text-center bg-dark text-light border-secondary"
                    required
                  />
                </div>
                <div className="col-12 col-md-12 mb-4">
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="Phone Number"
                    className="form-control text-center bg-dark text-light border-secondary"
                    required
                  />
                </div>
                <div className="col-12 col-md-12 mb-4">
                  <Select
                    options={countryOptions}
                    value={formData.country_of_residence}
                    onChange={handleCountryChange}
                    placeholder="Select Country"
                    styles={customStyles}
                    classNamePrefix="react-select"
                  />
                </div>
                <div className="col-12 col-md-12 text-center">
                  <button type="submit" className="btn btn-primary w-100">
                    Register
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventRegistration;
