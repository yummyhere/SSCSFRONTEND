import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { ShoppingBag } from 'lucide-react';
import './Navbar.css';

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const { itemCount } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    setMobileMenuOpen(false);
  };

  return (
    <nav className="navbar">
      <div className="navbar-container container">
        <Link to="/" className="navbar-logo">
          <span className="logo-mark">◆</span>
          <span className="logo-text">NEXUS</span>
        </Link>

        <button
          className="navbar-toggle hide-desktop"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          <span></span>
          <span></span>
          <span></span>
        </button>

        <div className={`navbar-menu ${mobileMenuOpen ? 'active' : ''}`}>
          <Link to="/" className="navbar-link" onClick={() => setMobileMenuOpen(false)}>
            Home
          </Link>
          <Link to="/products" className="navbar-link" onClick={() => setMobileMenuOpen(false)}>
            Products
          </Link>
          {isAuthenticated && !user?.role?.includes('admin') && (
            <Link to="/orders" className="navbar-link" onClick={() => setMobileMenuOpen(false)}>
              Orders
            </Link>
          )}
          {isAuthenticated && user?.role === 'admin' && (
            <Link to="/admin" className="navbar-link" onClick={() => setMobileMenuOpen(false)}>
              Admin
            </Link>
          )}
        </div>

        <div className="navbar-actions">
          <Link to="/cart" className="navbar-cart">
            <ShoppingBag className="cart-icon" size={21} strokeWidth={1.8} aria-label="Shopping cart" />
            {itemCount > 0 && <span className="cart-badge">{itemCount}</span>}
          </Link>

          {isAuthenticated ? (
            <div className="navbar-user">
              <span className="user-name hide-mobile">{user?.fullName?.split(' ')[0]}</span>
              <button className="btn btn-primary btn-sm" onClick={handleLogout}>
                Logout
              </button>
            </div>
          ) : (
            <Link to="/login" className="btn btn-primary btn-sm">
              Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
