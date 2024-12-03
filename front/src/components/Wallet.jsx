import React, { useEffect, useState } from "react";
import { FaWallet } from "react-icons/fa";
import apiService from "../services/apiService";
import { Modal, Button, Form } from "react-bootstrap";
import { toast } from "react-toastify";
import './Wallet.css';


const Wallet = () => {
  const [balance, setBalance] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [deductAmount, setDeductAmount] = useState("");

  useEffect(() => {
    const fetchWalletBalance = async () => {
      try {
        const response = await apiService.get("/wallet");
        setBalance(parseFloat(response.wallet_balance));
      } catch (error) {
        toast.error("Failed to fetch wallet balance.");
      }
    };

    fetchWalletBalance();
  }, []);

  const handleRequest = async (amount, type) => {
    if (!amount || isNaN(amount) || parseFloat(amount) <= 0) {
      toast.error("Please enter a valid amount.");
      return;
    }

    if (type === "deduct" && parseFloat(amount) > balance) {
      toast.error("You cannot deduct more than your wallet balance.");
      return;
    }

    try {
      await apiService.post("/wallet/request", { amount: parseFloat(amount), type });
      toast.success(`${type === "deduct" ? "Deduction" : "Withdrawal"} request submitted successfully.`);
      setShowModal(false); // Close the modal
    } catch (error) {
      toast.error(`Failed to submit ${type} request. Please try again.`);
    }
  };

  return (
    <div className="wallet d-flex align-items-center">
      <FaWallet
        style={{ fontSize: "1.5rem", marginRight: "0.5rem", color: "black", cursor: "pointer" }}
        onClick={() => setShowModal(true)}
      />
      
      {/* Wallet Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Wallet Management</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <h5>Your Current Balance: ${balance?.toFixed(2)}</h5>
          <Form.Group className="mt-3">
            <Form.Label>Enter Amount to Deduct</Form.Label>
            <Form.Control
              type="number"
              placeholder="Enter amount"
              value={deductAmount}
              onChange={(e) => setDeductAmount(e.target.value)}
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Close
          </Button>
          <Button
            variant="primary"
            onClick={() => handleRequest(deductAmount, "deduct")}
          >
            Deduct Amount
          </Button>
          <Button
            variant="success"
            onClick={() => handleRequest(balance, "withdraw")}
          >
            Withdraw Full Balance
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Wallet;
