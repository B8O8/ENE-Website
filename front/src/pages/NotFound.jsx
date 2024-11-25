import React from "react";
import { Link } from "react-router-dom";
import "./NotFound.css"; // Custom styles
import ufoImage from "../assets/page-404-image.png"; // Replace with your UFO image path

const NotFound = () => {
  return (
    <div className="not-found">
      <img src={ufoImage} alt="UFO" className="ufo-image" />
      <h1>Oops! That page can't be found.</h1>
      <p>
        It looks like nothing was found at this location. Maybe try one of the links below or a search?
      </p>
      <Link to="/" className="btn btn-primary">
        <i className="fa fa-home"></i> Go back to homepage
      </Link>
    </div>
  );
};

export default NotFound;
