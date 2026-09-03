import React, { useEffect, useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import { API_BASE_URL } from '../../config';
import { Plus, X } from 'lucide-react';
import './Products.css';

const AdminProducts = () => {
  const { isAdmin, loading, token } = useAuth();
  const [products, setProducts] = useState([]);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: '', description: '', price: '', stockQuantity: '', category: '', image: '', discountPercentage: '0'
  });

  useEffect(() => {
    if (!isAdmin || !token) return;
    fetch(`${API_BASE_URL}/products?limit=100`)
      .then(async response => {
        const data = await response.json();
        if (!response.ok) throw new Error(data.message);
        setProducts(data.products || []);
      })
      .catch(loadError => setError(loadError.message));
  }, [isAdmin, token]);

  const deleteProduct = async (productId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/products/${productId}`, { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message);
      setProducts(current => current.filter(product => product._id !== productId));
    } catch (deleteError) {
      setError(deleteError.message);
    }
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData(current => ({ ...current, [name]: value }));
    setError('');
  };

  const addProduct = async (event) => {
    event.preventDefault();
    setSaving(true);
    setError('');

    try {
      const response = await fetch(`${API_BASE_URL}/products`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          ...formData,
          price: Number(formData.price),
          stockQuantity: Number(formData.stockQuantity),
          discountPercentage: Number(formData.discountPercentage)
        })
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Failed to add product');
      setProducts(current => [data.product, ...current]);
      setFormData({ name: '', description: '', price: '', stockQuantity: '', category: '', image: '', discountPercentage: '0' });
      setShowForm(false);
    } catch (saveError) {
      setError(saveError.message);
    } finally {
      setSaving(false);
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
          <div className="section-header"><div><h1 className="page-title">Manage Products</h1><p className="section-subtitle">Inventory stored in MongoDB</p></div><div className="admin-page-actions"><Link to="/admin" className="btn btn-outline btn-sm">Dashboard</Link><button className="btn btn-primary btn-sm" onClick={() => setShowForm(current => !current)}>{showForm ? <X size={16} /> : <Plus size={16} />} {showForm ? 'Close' : 'Add Product'}</button></div></div>
          {error && <div className="checkout-error">{error}</div>}
          {showForm && <form className="admin-product-form" onSubmit={addProduct}>
            <h2>Add Product</h2>
            <div className="admin-form-grid">
              <div className="form-group"><label htmlFor="name">Product name *</label><input id="name" name="name" value={formData.name} onChange={handleChange} required /></div>
              <div className="form-group"><label htmlFor="category">Category</label><input id="category" name="category" value={formData.category} onChange={handleChange} /></div>
              <div className="form-group"><label htmlFor="price">Price *</label><input id="price" name="price" type="number" min="0" step="0.01" value={formData.price} onChange={handleChange} required /></div>
              <div className="form-group"><label htmlFor="stockQuantity">Stock quantity *</label><input id="stockQuantity" name="stockQuantity" type="number" min="0" step="1" value={formData.stockQuantity} onChange={handleChange} required /></div>
              <div className="form-group"><label htmlFor="discountPercentage">Discount (%)</label><input id="discountPercentage" name="discountPercentage" type="number" min="0" max="100" step="1" value={formData.discountPercentage} onChange={handleChange} /></div>
              <div className="form-group"><label htmlFor="image">Image URL</label><input id="image" name="image" type="url" value={formData.image} onChange={handleChange} /></div>
              <div className="form-group admin-form-wide"><label htmlFor="description">Description</label><textarea id="description" name="description" value={formData.description} onChange={handleChange} rows="3" /></div>
            </div>
            <button className="btn btn-primary" type="submit" disabled={saving}>{saving ? 'Saving...' : 'Save Product'}</button>
          </form>}
          {products.length ? <div className="grid grid-4">{products.map(product => <div className="value-prop-card" key={product._id}><h4>{product.name}</h4><p>${product.price.toFixed(2)} · {product.stockQuantity} in stock</p><button className="btn btn-outline btn-sm" onClick={() => deleteProduct(product._id)}>Delete</button></div>)}</div> : <div className="empty-state"><h3 className="empty-state-title">No products yet</h3><p className="empty-state-description">Add products through the protected API to see them here.</p></div>}
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default AdminProducts;
