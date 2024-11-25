import React from "react";
import { Modal, Button } from "react-bootstrap";

const VideoPlayerModal = ({ show, videoUrl, onClose }) => {
  return (
    <Modal show={show} onHide={onClose} centered size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Video Player</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <video
          controls
          autoPlay
          style={{ width: "100%", height: "auto" }}
          src={videoUrl}
        >
          Your browser does not support the video tag.
        </video>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onClose}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default VideoPlayerModal;
