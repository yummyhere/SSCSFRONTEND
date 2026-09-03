import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';

// Pages
import Home from './pages/Home';
import Products from './pages/Products';
import Cart from './pages/Cart';
import Auth from './pages/Auth';
import Checkout from './pages/Checkout';
import AdminDashboard from './pages/admin/Dashboard';
import AdminProducts from './pages/admin/Products';
import AdminOrders from './pages/admin/Orders';
import Orders from './pages/Orders';

// Styles
import './styles/globals.css';

function App() {
  return (
    <Router>
      <AuthProvider>
        <CartProvider>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/products" element={<Products />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/login" element={<Auth mode="login" />} />
            <Route path="/signup" element={<Auth mode="signup" />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/orders" element={<Orders />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/products" element={<AdminProducts />} />
            <Route path="/admin/orders" element={<AdminOrders />} />

            {/* Catch-all - redirect to home */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </CartProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
