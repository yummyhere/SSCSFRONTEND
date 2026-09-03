import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Activity, ArrowRight, Box, CircleDollarSign, ClipboardList, Users } from 'lucide-react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import { API_BASE_URL } from '../../config';

const AdminDashboard = () => {
  const { isAdmin, loading, token } = useAuth();
  const [dashboard, setDashboard] = useState(null);
  const [orders, setOrders] = useState([]);
  const [users, setUsers] = useState([]);
  const [error, setError] = useState('');
  const [dataLoading, setDataLoading] = useState(true);

  useEffect(() => {
    if (!isAdmin || !token) return;

    const loadDashboard = async () => {
      try {
        const headers = { Authorization: `Bearer ${token}` };
        const [dashboardResponse, ordersResponse, usersResponse] = await Promise.all([
          fetch(`${API_BASE_URL}/admin/dashboard`, { headers }),
          fetch(`${API_BASE_URL}/admin/orders?limit=5`, { headers }),
          fetch(`${API_BASE_URL}/admin/users`, { headers })
        ]);
        const dashboardData = await dashboardResponse.json();
        const ordersData = await ordersResponse.json();
        const usersData = await usersResponse.json();

        if (!dashboardResponse.ok) throw new Error(dashboardData.message || 'Failed to load dashboard');
        if (!ordersResponse.ok) throw new Error(ordersData.message || 'Failed to load recent orders');
        if (!usersResponse.ok) throw new Error(usersData.message || 'Failed to load customers');

        setDashboard(dashboardData.statistics);
        setOrders(ordersData.orders || []);
        setUsers(usersData.users || []);
      } catch (loadError) {
        setError(loadError.message);
      } finally {
        setDataLoading(false);
      }
    };

    loadDashboard();
  }, [isAdmin, token]);

  if (loading) {
    return null;
  }

  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }

  if (dataLoading) {
    return <div><Navbar /><section className="section"><div className="container"><p>Loading dashboard...</p></div></section><Footer /></div>;
  }

  return (
    <div>
      <Navbar />
      <section className="section">
        <div className="container">
          <div className="section-header">
            <div>
              <h1 className="page-title">Admin Dashboard</h1>
              <p className="section-subtitle">Live overview from your MongoDB data</p>
            </div>
            <Link to="/products" className="btn btn-outline btn-sm">View storefront <ArrowRight size={16} /></Link>
          </div>

          {error && <div className="checkout-error">{error}</div>}

          {dashboard && <div className="grid grid-4">
            <div className="value-prop-card"><Users className="value-icon" /><h4>Total Users</h4><p>{dashboard.totalUsers}</p></div>
            <div className="value-prop-card"><Box className="value-icon" /><h4>Total Products</h4><p>{dashboard.totalProducts}</p></div>
            <div className="value-prop-card"><ClipboardList className="value-icon" /><h4>Total Orders</h4><p>{dashboard.totalOrders}</p></div>
            <div className="value-prop-card"><CircleDollarSign className="value-icon" /><h4>Revenue</h4><p>${dashboard.totalRevenue}</p></div>
          </div>}

          <div className="section-header" style={{ marginTop: 'var(--spacing-12)' }}>
            <div><h2 className="section-title">Recent Orders</h2><p className="section-subtitle">Orders recorded in MongoDB</p></div>
            <Link to="/admin/orders" className="btn btn-outline btn-sm">All orders <ArrowRight size={16} /></Link>
          </div>
          {orders.length > 0 ? <div className="orders-list">
            {orders.map((order) => <div key={order._id} className="order-card">
              <div className="order-header"><div><h4>Order #{order._id.slice(-8).toUpperCase()}</h4><p className="order-date">{new Date(order.createdAt).toLocaleDateString()}</p></div><div className="order-status"><span className={`status-badge status-${order.status.toLowerCase()}`}>{order.status}</span><p className="order-total">${order.totalAmount.toFixed(2)}</p></div></div>
              <div className="order-items"><span>{order.customerName || 'Customer'}</span><span>{order.items.length} item{order.items.length === 1 ? '' : 's'}</span></div>
            </div>)}
          </div> : <div className="empty-state"><Activity size={42} /><h3 className="empty-state-title">No orders yet</h3><p className="empty-state-description">Orders will appear here after customers complete checkout.</p></div>}

          <div className="section-header" style={{ marginTop: 'var(--spacing-12)' }}><div><h2 className="section-title">Customers</h2><p className="section-subtitle">Registered users from MongoDB</p></div></div>
          {users.length > 0 ? <div className="orders-list">{users.map(customer => <div className="order-item" key={customer._id}><span>{customer.fullName} · {customer.email}</span><span>{customer.orderCount} order{customer.orderCount === 1 ? '' : 's'}</span></div>)}</div> : <div className="empty-state"><h3 className="empty-state-title">No customers yet</h3><p className="empty-state-description">Registered users will appear here.</p></div>}

          {dashboard?.lowStockProducts?.length > 0 && <><h2 className="section-title" style={{ marginTop: 'var(--spacing-12)' }}>Low Stock</h2><div className="orders-list">{dashboard.lowStockProducts.map((product) => <div key={product.id} className="order-item"><span>{product.name}</span><span>{product.stock} remaining</span></div>)}</div></>}
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default AdminDashboard;
