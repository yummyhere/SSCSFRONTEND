import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useAuth } from '../context/AuthContext';
import { Loading } from '../components/Loading';
import EmptyState from '../components/EmptyState';
import './Orders.css';
import { API_BASE_URL } from '../config';

const Orders = () => {
  const { isAuthenticated, token } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isAuthenticated) {
      fetchOrders();
    }
  }, [isAuthenticated, token]);

  const fetchOrders = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/orders`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      const data = await response.json();
      setOrders(data.orders || []);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="orders-page">
        <Navbar />
        <section className="section">
          <div className="container">
            <EmptyState
              title="Please sign in"
              description="You need to be logged in to view your orders"
              action={<Link to="/login" className="btn btn-primary">Sign In</Link>}
            />
          </div>
        </section>
        <Footer />
      </div>
    );
  }

  if (loading) {
    return (
      <div className="orders-page">
        <Navbar />
        <section className="section">
          <div className="container">
            <Loading message="Loading your orders..." />
          </div>
        </section>
        <Footer />
      </div>
    );
  }

  return (
    <div className="orders-page">
      <Navbar />

      <section className="section">
        <div className="container">
          <h1 className="page-title">Your Orders</h1>

          {orders.length > 0 ? (
            <div className="orders-list">
              {orders.map((order) => (
                <div key={order._id} className="order-card">
                  <div className="order-header">
                    <div>
                      <h4>Order #{order._id.slice(-8).toUpperCase()}</h4>
                      <p className="order-date">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="order-status">
                      <span className={`status-badge status-${order.status.toLowerCase()}`}>
                        {order.status}
                      </span>
                      <p className="order-total">${order.totalAmount.toFixed(2)}</p>
                    </div>
                  </div>

                  <div className="order-items">
                    {order.items.map((item, idx) => (
                      <div key={idx} className="order-item">
                        <span>{item.productName}</span>
                        <span>× {item.quantity}</span>
                        <span>${item.subtotal.toFixed(2)}</span>
                      </div>
                    ))}
                  </div>

                  <div className="order-footer">
                    <button className="btn btn-outline btn-sm">
                      View Details
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <EmptyState
              title="No orders yet"
              description="Start shopping and place your first order!"
              action="/products"
            />
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Orders;
