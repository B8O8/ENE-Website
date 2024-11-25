import React from "react";
import { Modal, Button } from "react-bootstrap";

const SignalModal = ({ show, onClose }) => {
  return (
    <Modal show={show} onHide={onClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Signal Access</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>Please contact the system administrator or the person who registered you to access this page.</p>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onClose}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default SignalModal;
