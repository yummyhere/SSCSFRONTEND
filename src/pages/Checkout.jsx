import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import EmptyState from '../components/EmptyState';
import './Checkout.css';
import { API_BASE_URL } from '../config';

const Checkout = () => {
  const { cart, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    customerName: user?.fullName || '',
    customerEmail: user?.email || '',
    customerPhone: '',
    shippingAddress: '',
    city: '',
    postalCode: '',
    paymentMethod: 'Credit Card'
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!cart.items || cart.items.length === 0) {
    return (
      <div className="checkout-page">
        <Navbar />
        <section className="section">
          <div className="container">
            <EmptyState
              title="Cart is empty"
              description="You need to add items to your cart before checking out"
              action="/products"
            />
          </div>
        </section>
        <Footer />
      </div>
    );
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch(`${API_BASE_URL}/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message);
      }

      // Clear cart on successful checkout
      await clearCart();

      // Show success and redirect
      alert('Order placed successfully! Order ID: ' + data.order.orderId);
      navigate('/orders');
    } catch (error) {
      setError(error.message || 'Failed to place order');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="checkout-page">
      <Navbar />

      <section className="section">
        <div className="container">
          <h1 className="page-title">Checkout</h1>

          <div className="checkout-layout">
            {/* Checkout Form */}
            <form onSubmit={handleSubmit} className="checkout-form">
              {error && <div className="checkout-error">{error}</div>}

              <fieldset className="form-section">
                <legend>Shipping Information</legend>

                <div className="form-group">
                  <label htmlFor="customerName">Full Name *</label>
                  <input
                    type="text"
                    id="customerName"
                    name="customerName"
                    value={formData.customerName}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="customerEmail">Email Address *</label>
                  <input
                    type="email"
                    id="customerEmail"
                    name="customerEmail"
                    value={formData.customerEmail}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="customerPhone">Phone Number *</label>
                  <input
                    type="tel"
                    id="customerPhone"
                    name="customerPhone"
                    value={formData.customerPhone}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="shippingAddress">Street Address *</label>
                  <input
                    type="text"
                    id="shippingAddress"
                    name="shippingAddress"
                    value={formData.shippingAddress}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="city">City *</label>
                    <input
                      type="text"
                      id="city"
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="postalCode">Postal Code *</label>
                    <input
                      type="text"
                      id="postalCode"
                      name="postalCode"
                      value={formData.postalCode}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>
              </fieldset>

              <fieldset className="form-section">
                <legend>Payment Method</legend>
                <div className="form-group">
                  <label htmlFor="paymentMethod">Payment Method *</label>
                  <select
                    id="paymentMethod"
                    name="paymentMethod"
                    value={formData.paymentMethod}
                    onChange={handleChange}
                    required
                  >
                    <option value="Credit Card">Credit Card</option>
                    <option value="Debit Card">Debit Card</option>
                    <option value="PayPal">PayPal</option>
                    <option value="Apple Pay">Apple Pay</option>
                  </select>
                </div>

                <div className="payment-info">
                  <p>💳 This is a demo checkout. No real payment information is collected.</p>
                </div>
              </fieldset>

              <button
                type="submit"
                className="btn btn-primary"
                disabled={loading}
                style={{ width: '100%', marginTop: 'var(--spacing-6)' }}
              >
                {loading ? 'Processing...' : 'Place Order'}
              </button>
            </form>

            {/* Order Summary */}
            <aside className="order-summary-checkout">
              <h3>Order Summary</h3>

              <div className="summary-items">
                {cart.items.map((item) => (
                  <div key={item.productId} className="summary-item">
                    <div>
                      <p className="item-name">{item.productName}</p>
                      <p className="item-qty">Qty: {item.quantity}</p>
                      {item.discount > 0 && (
                        <p className="item-discount">{item.discount}% off</p>
                      )}
                    </div>
                    <p className="item-price">${item.subtotal.toFixed(2)}</p>
                  </div>
                ))}
              </div>

              <div className="summary-divider"></div>

              <div className="summary-breakdown">
                <div className="breakdown-item">
                  <span>Subtotal:</span>
                  <span>${cart.total.toFixed(2)}</span>
                </div>
                <div className="breakdown-item">
                  <span>Shipping:</span>
                  <span>Free</span>
                </div>
                <div className="breakdown-item">
                  <span>Tax:</span>
                  <span>${(cart.total * 0.1).toFixed(2)}</span>
                </div>
              </div>

              <div className="summary-divider"></div>

              <div className="summary-total">
                <span>Total:</span>
                <span>${(cart.total * 1.1).toFixed(2)}</span>
              </div>

              <button
                type="button"
                className="btn btn-outline"
                onClick={() => navigate('/cart')}
                style={{ width: '100%', marginTop: 'var(--spacing-4)' }}
              >
                Back to Cart
              </button>
            </aside>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Checkout;
