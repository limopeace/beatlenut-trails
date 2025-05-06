import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="navbar">
      <div className="container">
        <div className="navbar-content">
          <Link to="/" className="navbar-brand">
            BeatlenutTrails
          </Link>
          
          {/* Mobile menu button */}
          <button 
            className="navbar-toggler" 
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle navigation"
          >
            <span>?</span>
          </button>
          
          {/* Navigation links */}
          <div className={`navbar-collapse ${isOpen ? 'show' : ''}`}>
            <ul className="navbar-nav">
              <li className="nav-item">
                <Link to="/" className="nav-link" onClick={() => setIsOpen(false)}>Home</Link>
              </li>
              <li className="nav-item">
                <Link to="/services" className="nav-link" onClick={() => setIsOpen(false)}>Services</Link>
              </li>
              <li className="nav-item">
                <Link to="/about" className="nav-link" onClick={() => setIsOpen(false)}>About Us</Link>
              </li>
              <li className="nav-item">
                <Link to="/contact" className="nav-link" onClick={() => setIsOpen(false)}>Contact</Link>
              </li>
              <li className="nav-item">
                <Link to="/esm-portal" className="nav-link esm-link" onClick={() => setIsOpen(false)}>ESM Portal</Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;