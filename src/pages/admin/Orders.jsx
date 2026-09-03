import React, { useEffect, useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import { API_BASE_URL } from '../../config';

const AdminOrders = () => {
  const { isAdmin, loading, token } = useAuth();
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isAdmin || !token) return;
    fetch(`${API_BASE_URL}/admin/orders?limit=100`, { headers: { Authorization: `Bearer ${token}` } })
      .then(async response => {
        const data = await response.json();
        if (!response.ok) throw new Error(data.message);
        setOrders(data.orders || []);
      })
      .catch(loadError => setError(loadError.message));
  }, [isAdmin, token]);

  const updateStatus = async (orderId, status) => {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/orders/${orderId}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ status })
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message);
      setOrders(current => current.map(order => order._id === orderId ? data.order : order));
    } catch (updateError) {
      setError(updateError.message);
    }
  };

  if (loading) return null;

  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }

  return (
    <div>
      <Navbar />
      <section className="section">
        <div className="container">
          <div className="section-header"><div><h1 className="page-title">Manage Orders</h1><p className="section-subtitle">Orders stored in MongoDB</p></div><Link to="/admin" className="btn btn-outline btn-sm">Dashboard</Link></div>
          {error && <div className="checkout-error">{error}</div>}
          {orders.length ? <div className="orders-list">{orders.map(order => <div className="order-card" key={order._id}>
            <div className="order-header"><div><h4>Order #{order._id.slice(-8).toUpperCase()}</h4><p className="order-date">{order.customerName} · {new Date(order.createdAt).toLocaleDateString()}</p></div><div className="order-status"><select value={order.status} onChange={event => updateStatus(order._id, event.target.value)}><option>Pending</option><option>Processing</option><option>Shipped</option><option>Delivered</option><option>Cancelled</option></select><p className="order-total">${order.totalAmount.toFixed(2)}</p></div></div>
            <div className="order-items">{order.items.map(item => <span key={item.productId}>{item.productName} × {item.quantity}</span>)}</div>
          </div>)}</div> : <div className="empty-state"><h3 className="empty-state-title">No orders yet</h3><p className="empty-state-description">Customer orders will appear here after checkout.</p></div>}
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default AdminOrders;
