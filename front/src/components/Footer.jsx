import React from "react";
import "./Footer.css";
import {
  FaFacebookF,
  FaTwitter,
  FaSkype,
  FaYoutube,
  FaLinkedinIn,
} from "react-icons/fa";
import logo from "../assets/Artboard-10-copylogo.png";

const Footer = () => {
  return (
    <footer className="footer-section py-5">
      <div className="container">
        <div className="row">
          {/* Logo and Contact Info */}
          <div className="col-12 col-md-4 mb-4">
            <img src={logo} alt="ENE Logo" width="50" className="footer-logo mb-3" />
            <p>
              <strong>Contact us</strong>
              <br />
              
            </p>
            <p>Hazmieh Street #2 Baabda, Lebanon</p>
            <p>
              <a href="mailto:hello@ene.ac" className="footer-link">
                hello@ene.ac
              </a>
            </p>
            <div className="social-icons d-flex gap-3">
              <a href="#" className="social-icon">
                <FaTwitter />
              </a>
              <a href="#" className="social-icon">
                <FaFacebookF />
              </a>
              <a href="#" className="social-icon">
                <FaSkype />
              </a>
              <a href="#" className="social-icon">
                <FaYoutube />
              </a>
              <a href="#" className="social-icon">
                <FaLinkedinIn />
              </a>
            </div>
          </div>

          {/* About */}
          <div className="col-6 col-md-2 mb-4">
            <h5 className="mb-3">About</h5>
            <ul className="list-unstyled">
              <li>
                <a href="#" className="footer-link">
                  About Us
                </a>
              </li>
              <li>
               
              </li>
              <li>
                
              </li>
              <li>
                
              </li>
            </ul>
          </div>

          {/* Links */}
          <div className="col-6 col-md-2 mb-4">
            
          </div>

          {/* Support */}
          <div className="col-6 col-md-2 mb-4">
            <h5 className="mb-3">Support</h5>
            <ul className="list-unstyled">
              <li>
                <a href="#" className="footer-link">
                  Documentation
                </a>
              </li>
              <li>
                <a href="#" className="footer-link">
                  FAQs
                </a>
              </li>
              <li>
                <a href="#" className="footer-link">
                  Forum
                </a>
              </li>
              <li>
                <a href="#" className="footer-link">
                  Sitemap
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="row mt-4">
          <div className="col-12 d-flex justify-content-between align-items-center">
            <div>
              <a href="#" className="footer-link">
                Terms of Use
              </a>
              <span className="mx-2">|</span>
              <a href="#" className="footer-link">
                Privacy Policy
              </a>
            </div>
            <p className="m-0 text-muted">
              &copy; 2024 ENE. All Rights Reserved
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
