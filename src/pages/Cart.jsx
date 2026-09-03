import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useCart } from '../context/CartContext';
import { Package } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import EmptyState from '../components/EmptyState';
import './Cart.css';

const Cart = () => {
  const { cart, updateCartItem, removeFromCart, clearCart, loading } = useCart();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  if (!isAuthenticated) {
    return (
      <div className="cart-page">
        <Navbar />
        <section className="section">
          <div className="container">
            <EmptyState
              title="Please sign in"
              description="You need to be logged in to view your cart"
              action={
                <Link to="/login" className="btn btn-primary">
                  Sign In
                </Link>
              }
            />
          </div>
        </section>
        <Footer />
      </div>
    );
  }

  if (loading) {
    return (
      <div className="cart-page">
        <Navbar />
        <section className="section">
          <div className="container">
            <p style={{ textAlign: 'center' }}>Loading cart...</p>
          </div>
        </section>
        <Footer />
      </div>
    );
  }

  if (!cart.items || cart.items.length === 0) {
    return (
      <div className="cart-page">
        <Navbar />
        <section className="section">
          <div className="container">
            <EmptyState
              title="Your cart is empty"
              description="Looks like you haven't added any items yet. Explore our products and find something you love!"
              action="/products"
            />
          </div>
        </section>
        <Footer />
      </div>
    );
  }

  const handleCheckout = () => {
    navigate('/checkout');
  };

  return (
    <div className="cart-page">
      <Navbar />

      <section className="section">
        <div className="container">
          <h1 className="page-title">Shopping Cart</h1>

          <div className="cart-layout">
            {/* Cart Items */}
            <div className="cart-items">
              <div className="cart-header">
                <span>Product</span>
                <span>Price</span>
                <span>Quantity</span>
                <span>Total</span>
                <span></span>
              </div>

              {cart.items.map((item) => (
                <div key={item.productId} className="cart-item">
                  <div className="item-product">
                    <div className="item-image">
                      {item.image ? (
                        <img src={item.image} alt={item.productName} />
                      ) : (
                        <div className="item-image-placeholder"><Package size={28} strokeWidth={1.5} /></div>
                      )}
                    </div>
                    <div className="item-info">
                      <h4>{item.productName}</h4>
                      {item.discount > 0 && (
                        <p className="item-discount">{item.discount}% discount applied</p>
                      )}
                    </div>
                  </div>

                  <div className="item-price">
                    <div>
                      ${item.unitPrice.toFixed(2)}
                      {item.discount > 0 && (
                        <span className="original-price">
                          ${item.unitPrice.toFixed(2)}
                        </span>
                      )}
                    </div>
                    <span className="final-price">
                      ${item.finalPrice.toFixed(2)}
                    </span>
                  </div>

                  <div className="item-quantity">
                    <div className="quantity-selector">
                      <button
                        onClick={() => updateCartItem(item.productId, item.quantity - 1)}
                        disabled={item.quantity === 1}
                      >
                        −
                      </button>
                      <input
                        type="number"
                        value={item.quantity}
                        onChange={(e) => updateCartItem(item.productId, parseInt(e.target.value) || 1)}
                        min="1"
                      />
                      <button
                        onClick={() => updateCartItem(item.productId, item.quantity + 1)}
                      >
                        +
                      </button>
                    </div>
                  </div>

                  <div className="item-total">
                    ${item.subtotal.toFixed(2)}
                  </div>

                  <button
                    className="item-remove"
                    onClick={() => removeFromCart(item.productId)}
                    title="Remove from cart"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>

            {/* Order Summary */}
            <aside className="order-summary">
              <h3>Order Summary</h3>

              <div className="summary-items">
                {cart.items.map((item) => (
                  <div key={item.productId} className="summary-item">
                    <span>{item.productName} × {item.quantity}</span>
                    <span>${item.subtotal.toFixed(2)}</span>
                  </div>
                ))}
              </div>

              <div className="summary-divider"></div>

              <div className="summary-total">
                <span>Total:</span>
                <span className="total-amount">${cart.total.toFixed(2)}</span>
              </div>

              <button
                className="btn btn-primary"
                onClick={handleCheckout}
                style={{ width: '100%' }}
              >
                Proceed to Checkout
              </button>

              <Link
                to="/products"
                className="btn btn-outline"
                style={{ width: '100%' }}
              >
                Continue Shopping
              </Link>
            </aside>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Cart;
