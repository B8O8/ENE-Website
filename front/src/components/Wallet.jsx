import React, { useEffect, useState } from "react";
import { FaWallet } from "react-icons/fa";

import apiService from "../services/apiService";
import { Modal, Button, Form } from "react-bootstrap";
import { toast } from "react-toastify";
import "./Wallet.css";

const Wallet = () => {
  const [balance, setBalance] = useState(null);
  const [showOTPModal, setShowOTPModal] = useState(false); // OTP modal
  const [otp, setOtp] = useState(""); // OTP input
  const [isVerified, setIsVerified] = useState(false); // OTP verification status
  const [showWalletModal, setShowWalletModal] = useState(false); // Wallet management modal
  const [deductAmount, setDeductAmount] = useState("");
  const [withdrawMethod, setWithdrawMethod] = useState(null); // Withdraw method
  const [phoneNumber, setPhoneNumber] = useState(""); // For Wish
  const [walletAddress, setWalletAddress] = useState(""); // For USDT

  useEffect(() => {
    if (isVerified) fetchWalletBalance();
  }, [isVerified]);

  const fetchWalletBalance = async () => {
    try {
      const response = await apiService.get("/wallet");
      setBalance(parseFloat(response.wallet_balance));
    } catch (error) {
      toast.error("Failed to fetch wallet balance.");
    }
  };

  const requestOTP = async () => {
    try {
      await apiService.post("/wallet/otp");
      toast.success("OTP sent to your email.");
      setShowOTPModal(true);
    } catch (error) {
      toast.error("Failed to send OTP. Please try again.");
    }
  };

  const verifyOTP = async () => {
    if (!otp) {
      toast.error("Please enter the OTP.");
      return;
    }

    try {
      await apiService.post("/wallet/otp/validate", { otp });
      toast.success("OTP verified successfully.");
      setIsVerified(true);
      setShowOTPModal(false);
      setShowWalletModal(true);
    } catch (error) {
      toast.error("Invalid or expired OTP.");
    }
  };

  const handleRequest = async () => {
    if (!deductAmount || isNaN(deductAmount) || parseFloat(deductAmount) <= 0) {
      toast.error("Please enter a valid amount.");
      return;
    }

    if (withdrawMethod === "Wish" && !phoneNumber) {
      toast.error("Please enter your phone number.");
      return;
    }

    if (withdrawMethod === "USDT" && !walletAddress) {
      toast.error("Please enter your wallet address.");
      return;
    }

    if (withdrawMethod === "USDT") {
      const fee = parseFloat(deductAmount) * 0.05;
      const finalAmount = parseFloat(deductAmount) - fee;
      toast.info(
        `A 5% fee will be deducted. Final amount: $${finalAmount.toFixed(2)}`
      );
    }

    try {
      await apiService.post("/wallet/request", {
        amount: parseFloat(deductAmount),
        type: "withdraw",
        method: withdrawMethod,
        details: withdrawMethod === "Wish" ? phoneNumber : walletAddress,
      });
      toast.success("Withdrawal request submitted successfully.");
      setShowWalletModal(false); // Close the modal
    } catch (error) {
      toast.error("Failed to submit withdrawal request. Please try again.");
    }
  };

  return (
    <div className="wallet d-flex align-items-center">
      <FaWallet
        style={{
          fontSize: "1.5rem",
          marginRight: "0.5rem",
          color: "black",
          cursor: "pointer",
        }}
        onClick={requestOTP}
      />

      {/* OTP Modal */}
      <Modal show={showOTPModal} onHide={() => setShowOTPModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Enter OTP</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group>
            <Form.Label>OTP</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowOTPModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={verifyOTP}>
            Verify OTP
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Wallet Modal */}
      <Modal
        show={showWalletModal}
        onHide={() => setShowWalletModal(false)}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Wallet Management</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <h5>Your Current Balance: ${balance?.toFixed(2)}</h5>
          <Form.Group className="mt-3">
            <Form.Label>Enter Amount to Withdraw</Form.Label>
            <Form.Control
              type="number"
              placeholder="Enter amount"
              value={deductAmount}
              onChange={(e) => setDeductAmount(e.target.value)}
            />
          </Form.Group>
          <div className="withdraw-methods mt-4">
            <h5>Choose Withdrawal Method:</h5>
            <div className="d-flex justify-content-around align-items-center">
              {/* Wish Method */}
              <div
                className={`method-option ${
                  withdrawMethod === "Wish" ? "selected" : ""
                }`}
                onClick={() => setWithdrawMethod("Wish")}
                style={{ cursor: "pointer", textAlign: "center" }}
              >
                <img
                  src="/wish.png" // Reference to the public folder image
                  alt="Wish"
                  style={{ width: "50px", height: "50px" }}
                />
                <p>Wish</p>
              </div>

              {/* USDT Method */}
              <div
                className={`method-option ${
                  withdrawMethod === "USDT" ? "selected" : ""
                }`}
                onClick={() => setWithdrawMethod("USDT")}
                style={{ cursor: "pointer", textAlign: "center" }}
              >
                <img
                  src="/Binance.png" // Reference to the public folder image
                  alt="Binance"
                  style={{ width: "50px", height: "50px" }}
                />
                <p>USDT</p>
              </div>
            </div>
          </div>

          {withdrawMethod === "Wish" && (
            <Form.Group className="mt-3">
              <Form.Label>Phone Number</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter phone number"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
              />
            </Form.Group>
          )}
          {withdrawMethod === "USDT" && (
            <Form.Group className="mt-3">
              <Form.Label>Wallet Address</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter wallet address"
                value={walletAddress}
                onChange={(e) => setWalletAddress(e.target.value)}
              />
              <p className="text-muted mt-2">
                Note: A 5% fee will be deducted for USDT withdrawals.
              </p>
            </Form.Group>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowWalletModal(false)}>
            Close
          </Button>
          <Button variant="primary" onClick={handleRequest}>
            Submit Withdrawal Request
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Wallet;
