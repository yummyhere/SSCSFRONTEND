import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer-content container">
        <div className="footer-section">
          <div className="footer-brand">
            <span className="logo-mark">◆</span>
            <span className="logo-text">NEXUS</span>
          </div>
          <p className="footer-description">
            Premium e-commerce platform delivering exceptional products and experiences.
          </p>
        </div>

        <div className="footer-section">
          <h6>Shop</h6>
          <ul className="footer-links">
            <li><Link to="/products">All Products</Link></li>
            <li><Link to="/products">New Arrivals</Link></li>
            <li><Link to="/products">Best Sellers</Link></li>
            <li><Link to="/products">Clearance</Link></li>
          </ul>
        </div>

        <div className="footer-section">
          <h6>Customer Service</h6>
          <ul className="footer-links">
            <li><a href="#contact">Contact Us</a></li>
            <li><a href="#faq">FAQ</a></li>
            <li><a href="#shipping">Shipping Info</a></li>
            <li><a href="#returns">Returns</a></li>
          </ul>
        </div>

        <div className="footer-section">
          <h6>Company</h6>
          <ul className="footer-links">
            <li><a href="#about">About</a></li>
            <li><a href="#privacy">Privacy Policy</a></li>
            <li><a href="#terms">Terms & Conditions</a></li>
            <li><a href="#careers">Careers</a></li>
          </ul>
        </div>
      </div>

      <div className="footer-bottom">
        <div className="container">
          <p>&copy; {currentYear} Nexus E-Commerce. All rights reserved.</p>
          <div className="footer-social">
            <a href="#facebook" title="Facebook">f</a>
            <a href="#twitter" title="Twitter">𝕏</a>
            <a href="#instagram" title="Instagram">📷</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
