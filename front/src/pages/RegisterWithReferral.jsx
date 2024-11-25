import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import apiService from "../services/apiService";
import "./Register.css";
import Logo from "../assets/logo-blue-simple.png"; // Default logo
import Modal from "react-bootstrap/Modal";

const RegisterWithReferral = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const ref = new URLSearchParams(location.search).get("ref"); // Extract the `ref` query parameter

  const [referrerDetails, setReferrerDetails] = useState(null);
  const [formFields, setFormFields] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    dateOfBirth: "",
    address: "",
    profession: "",
    password: "",
    subscriptionPlan: "",
  });

  const [fieldErrors, setFieldErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [plans, setPlans] = useState([]);
  const [showModal, setShowModal] = useState(false);

  // Fetch referrer details
  useEffect(() => {
    const fetchReferrerDetails = async () => {
      try {
        if (ref) {
          const response = await apiService.get(`/referrer-details?ref=${ref}`);
          setReferrerDetails(response); // Assume API returns { name, photoUrl, rank }
        } else {
          toast.error("Invalid referral link.");
        }
      } catch (error) {
        toast.error("Failed to fetch referrer details. Referral may be invalid.");
      }
    };

    fetchReferrerDetails();
  }, [ref]);

  // Fetch subscription plans
  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const response = await apiService.get("/subscriptions");
        setPlans(response); // Assuming the API returns an array of plans
      } catch (error) {
        toast.error("Failed to fetch subscription plans.");
      }
    };

    fetchPlans();
  }, []);

  const handleInputChange = (field, value) => {
    setFormFields((prev) => ({ ...prev, [field]: value }));
    if (value) {
      setFieldErrors((prev) => ({ ...prev, [field]: false }));
    }
  };

  const validateFields = () => {
    const errors = {};
    Object.keys(formFields).forEach((field) => {
      if (!formFields[field]) {
        errors[field] = true;
      }
    });

    // Check if subscriptionPlan is selected
    if (!formFields.subscriptionPlan) {
      errors.subscriptionPlan = true;
      toast.error("Please select a subscription plan.");
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    // Validate fields
    if (!validateFields()) {
      toast.error("Please fill in all fields!");
      return;
    }

    // Combine first and last name
    const fullName = `${formFields.firstName} ${formFields.lastName}`;

    // Create the payload
    const payload = {
      name: fullName,
      email: formFields.email,
      phone: formFields.phone,
      date_of_birth: formFields.dateOfBirth,
      address: formFields.address,
      profession: formFields.profession,
      password: formFields.password,
      subscription_id: formFields.subscriptionPlan,
      ref, // Pass the referral code to the backend
    };

    

    setLoading(true);

    try {
      const response = await apiService.post("/register", payload);

      toast.success("Registration successful! Wait for admin approval.");
      navigate("/");
      
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Registration failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handlePlanSelection = (planId) => {
    setFormFields((prev) => ({ ...prev, subscriptionPlan: planId }));
    setShowModal(false); // Close modal
  };

  return (
    <div className="register-container d-flex flex-column justify-content-top align-items-center vh-100">
      {/* Profile photo or logo */}
      <div className="referrer-info text-center mt-2 mb-4">
        <img
          src={referrerDetails?.photoUrl || Logo}
          alt="Referrer or Logo"
          className="referrer-photo mb-2"
          style={{ width: "80px", height: "80px", borderRadius: "50%" }}
        />
        {referrerDetails?.name && (
          <h5 className="mb-1">{referrerDetails.name}</h5>
        )}
        {referrerDetails?.rank && <p className="text-muted">{referrerDetails.rank}</p>}
      </div>

      <div className="container register-card shadow p-4 bg-white rounded">
        <h3 className="text-center mb-2">Create an Account</h3>
        <form onSubmit={handleRegister}>
          {/* First and last name */}
          <div className="row mb-2">
            <div className="col-md-6 col-sm-12">
              <label htmlFor="firstName" className="form-label">
                First Name
              </label>
              <input
                type="text"
                id="firstName"
                className={`form-control ${
                  fieldErrors.firstName ? "is-invalid" : ""
                }`}
                placeholder="Enter your first name"
                value={formFields.firstName}
                onChange={(e) => handleInputChange("firstName", e.target.value)}
              />
            </div>
            <div className="col-md-6 col-sm-12">
              <label htmlFor="lastName" className="form-label">
                Last Name
              </label>
              <input
                type="text"
                id="lastName"
                className={`form-control ${
                  fieldErrors.lastName ? "is-invalid" : ""
                }`}
                placeholder="Enter your last name"
                value={formFields.lastName}
                onChange={(e) => handleInputChange("lastName", e.target.value)}
              />
            </div>
          </div>

          {/* Email and Phone */}
          <div className="row mb-2">
            <div className="col-md-6 col-sm-12">
              <label htmlFor="email" className="form-label">
                Email
              </label>
              <input
                type="email"
                id="email"
                className={`form-control ${
                  fieldErrors.email ? "is-invalid" : ""
                }`}
                placeholder="Enter your email"
                value={formFields.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
              />
            </div>
            <div className="col-md-6 col-sm-12">
              <label htmlFor="phone" className="form-label">
                Phone Number
              </label>
              <PhoneInput
                country={"lb"}
                value={formFields.phone}
                onChange={(value) => handleInputChange("phone", value)}
                inputStyle={{
                  fontSize: "1rem",
                  height: "38px",
                  width: "100%",
                  paddingLeft: "40px",
                  borderColor: fieldErrors.phone ? "red" : "#ced4da",
                }}
                containerStyle={{
                  width: "100%",
                }}
              />
            </div>
          </div>
          <div className="row mb-2">
            <div className="col-md-6 col-sm-12">
              <label htmlFor="dateOfBirth" className="form-label">
                Date of Birth
              </label>
              <input
                type="date"
                id="dateOfBirth"
                className={`form-control ${
                  fieldErrors.dateOfBirth ? "is-invalid" : ""
                }`}
                value={formFields.dateOfBirth}
                onChange={(e) =>
                  handleInputChange("dateOfBirth", e.target.value)
                }
              />
            </div>
            <div className="col-md-6 col-sm-12">
              <label htmlFor="address" className="form-label">
                Address
              </label>
              <input
                type="text"
                id="address"
                className={`form-control ${
                  fieldErrors.address ? "is-invalid" : ""
                }`}
                placeholder="Enter your address"
                value={formFields.address}
                onChange={(e) => handleInputChange("address", e.target.value)}
              />
            </div>
          </div>
          <div className="row mb-2">
            <div className="col-md-6 col-sm-12">
              <label htmlFor="profession" className="form-label">
                Profession
              </label>
              <input
                type="text"
                id="profession"
                className={`form-control ${
                  fieldErrors.profession ? "is-invalid" : ""
                }`}
                placeholder="Enter your profession"
                value={formFields.profession}
                onChange={(e) =>
                  handleInputChange("profession", e.target.value)
                }
              />
            </div>
            <div className="col-md-6 col-sm-12 ">
              <label htmlFor="password" className="form-label">
                Password
              </label>
              <input
                type="password"
                id="password"
                className={`form-control ${
                  fieldErrors.password ? "is-invalid" : ""
                }`}
                placeholder="Enter your password"
                value={formFields.password}
                onChange={(e) => handleInputChange("password", e.target.value)}
              />
            </div>
          </div>
          <div className="row mb-2">
            <div className="col-md-6 col-sm-12">
              <label className="form-label">Subscription Plan</label>
              <button
                type="button"
                className="btn btn-outline-primary w-100"
                onClick={() => setShowModal(true)}
              >
                {formFields.subscriptionPlan
                  ? `Selected Plan: ${
                      plans.find(
                        (plan) => plan.id === formFields.subscriptionPlan
                      )?.name
                    }`
                  : "Select Subscription Plan"}
              </button>
            </div>
            <div className="col-md-6 col-sm-12 justify-content-end align-items-end d-flex">
              <Link to="/login" className="text-decoration-none">
                Already have an account? Login
              </Link>
            </div>
          </div>
          <button
            type="submit"
            className="btn btn-primary w-100 mt-3"
            disabled={loading}
          >
            {loading ? "Registering..." : "Sign Up"}
          </button>
        </form>
      </div>

      {/* Subscription Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Select Subscription Plan</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="row">
            {plans.map((plan) => (
              <div className="col-12 mb-3" key={plan.id}>
                <div className="card">
                  <div className="card-body">
                    <h5 className="card-title">{plan.name}</h5>
                    <p className="card-text">{plan.description}</p>
                    <p className="card-text">
                      <strong>Price:</strong> ${plan.price}
                    </p>
                    <p className="card-text">
                      <strong>Duration:</strong> {plan.duration} days
                    </p>
                    <button
                      className="btn btn-primary w-100"
                      onClick={() => handlePlanSelection(plan.id)}
                    >
                      Select
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default RegisterWithReferral;
