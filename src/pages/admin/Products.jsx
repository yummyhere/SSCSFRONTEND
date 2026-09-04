import React, { useEffect, useState } from 'react';
import { Link, Navigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import { API_BASE_URL } from '../../config';
import { ArrowLeft, CheckCircle2, Image as ImageIcon, Plus, Trash2, X } from 'lucide-react';
import './Products.css';

const AdminProducts = () => {
  const { isAdmin, loading, token } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [showForm, setShowForm] = useState(searchParams.get('new') === 'true');
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    stockQuantity: '',
    category: '',
    image: '',
    discountPercentage: '0'
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

  // If URL has ?new=true, ensure form is opened
  useEffect(() => {
    if (searchParams.get('new') === 'true') {
      setShowForm(true);
    }
  }, [searchParams]);

  const deleteProduct = async (productId, productName) => {
    if (!window.confirm(`Are you sure you want to delete "${productName}"?`)) {
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/products/${productId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message);
      setProducts(current => current.filter(product => product._id !== productId));
      setSuccessMsg(`✓ Product "${productName}" deleted successfully.`);
      setTimeout(() => setSuccessMsg(''), 4000);
    } catch (deleteError) {
      setError(deleteError.message);
    }
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData(current => ({ ...current, [name]: value }));
    setError('');
  };

  const toggleForm = () => {
    const nextState = !showForm;
    setShowForm(nextState);
    if (!nextState && searchParams.get('new')) {
      setSearchParams({});
    }
  };

  const addProduct = async (event) => {
    event.preventDefault();
    setSaving(true);
    setError('');
    setSuccessMsg('');

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
      setFormData({
        name: '',
        description: '',
        price: '',
        stockQuantity: '',
        category: '',
        image: '',
        discountPercentage: '0'
      });
      setShowForm(false);
      if (searchParams.get('new')) {
        setSearchParams({});
      }
      setSuccessMsg(`✓ Product "${data.product.name}" added successfully to MongoDB!`);
      setTimeout(() => setSuccessMsg(''), 5000);
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
          <div className="section-header">
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                <Link to="/admin" className="btn btn-outline btn-sm" style={{ padding: '4px 10px' }}>
                  <ArrowLeft size={14} /> Dashboard
                </Link>
              </div>
              <h1 className="page-title">Manage Products</h1>
              <p className="section-subtitle">Add new inventory and manage products stored in MongoDB</p>
            </div>
            <div className="admin-page-actions">
              <button
                className={`btn ${showForm ? 'btn-outline' : 'btn-primary'} btn-sm`}
                onClick={toggleForm}
              >
                {showForm ? <X size={16} /> : <Plus size={16} />}
                {showForm ? 'Cancel' : 'Add New Product'}
              </button>
            </div>
          </div>

          {error && <div className="checkout-error" style={{ marginBottom: 'var(--spacing-6)' }}>{error}</div>}

          {successMsg && (
            <div className="admin-success-alert">
              <CheckCircle2 size={18} />
              <span>{successMsg}</span>
            </div>
          )}

          {showForm && (
            <form className="admin-product-form" onSubmit={addProduct}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--spacing-6)' }}>
                <h2 style={{ margin: 0 }}>Add New Product</h2>
                <button type="button" className="btn btn-outline btn-sm" onClick={toggleForm}>
                  <X size={14} /> Close
                </button>
              </div>

              <div className="admin-form-grid">
                <div className="form-group">
                  <label htmlFor="name">Product Name *</label>
                  <input
                    id="name"
                    name="name"
                    placeholder="e.g. Wireless Noise-Canceling Headphones"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="category">Category</label>
                  <input
                    id="category"
                    name="category"
                    list="category-suggestions"
                    placeholder="e.g. Electronics, Audio, Wearables"
                    value={formData.category}
                    onChange={handleChange}
                  />
                  <datalist id="category-suggestions">
                    <option value="Electronics" />
                    <option value="Audio" />
                    <option value="Wearables" />
                    <option value="Accessories" />
                    <option value="Home & Living" />
                    <option value="Fashion" />
                  </datalist>
                </div>

                <div className="form-group">
                  <label htmlFor="price">Price ($) *</label>
                  <input
                    id="price"
                    name="price"
                    type="number"
                    min="0"
                    step="0.01"
                    placeholder="29.99"
                    value={formData.price}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="stockQuantity">Stock Quantity *</label>
                  <input
                    id="stockQuantity"
                    name="stockQuantity"
                    type="number"
                    min="0"
                    step="1"
                    placeholder="50"
                    value={formData.stockQuantity}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="discountPercentage">Discount Percentage (%)</label>
                  <input
                    id="discountPercentage"
                    name="discountPercentage"
                    type="number"
                    min="0"
                    max="100"
                    step="1"
                    placeholder="0"
                    value={formData.discountPercentage}
                    onChange={handleChange}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="image">Image URL</label>
                  <input
                    id="image"
                    name="image"
                    type="url"
                    placeholder="https://images.unsplash.com/..."
                    value={formData.image}
                    onChange={handleChange}
                  />
                  {formData.image && (
                    <div className="admin-image-preview">
                      <img
                        src={formData.image}
                        alt="Preview"
                        onError={(e) => { e.target.style.display = 'none'; }}
                        onLoad={(e) => { e.target.style.display = 'block'; }}
                      />
                      <span style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)' }}>Image Preview</span>
                    </div>
                  )}
                </div>

                <div className="form-group admin-form-wide">
                  <label htmlFor="description">Description</label>
                  <textarea
                    id="description"
                    name="description"
                    rows="3"
                    placeholder="Enter full product details, specs, and features..."
                    value={formData.description}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', gap: 'var(--spacing-3)' }}>
                <button className="btn btn-primary" type="submit" disabled={saving}>
                  {saving ? 'Saving to Database...' : 'Save Product'}
                </button>
                <button type="button" className="btn btn-outline" onClick={toggleForm}>
                  Cancel
                </button>
              </div>
            </form>
          )}

          <div className="admin-products-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--spacing-6)' }}>
            <h2 className="section-title" style={{ margin: 0, fontSize: '1.25rem' }}>
              All Products ({products.length})
            </h2>
            {!showForm && (
              <button className="btn btn-primary btn-sm" onClick={toggleForm}>
                <Plus size={16} /> Add Product
              </button>
            )}
          </div>

          {products.length ? (
            <div className="grid grid-3">
              {products.map(product => {
                const finalPrice = product.discountPercentage > 0
                  ? product.price * (1 - product.discountPercentage / 100)
                  : product.price;

                return (
                  <div className="admin-product-card" key={product._id}>
                    <div className="admin-product-thumb">
                      {product.image ? (
                        <img
                          src={product.image}
                          alt={product.name}
                          onError={(e) => {
                            e.target.style.display = 'none';
                            e.target.nextSibling.style.display = 'flex';
                          }}
                        />
                      ) : null}
                      <div
                        className="admin-thumb-fallback"
                        style={{ display: product.image ? 'none' : 'flex' }}
                      >
                        <ImageIcon size={32} strokeWidth={1.5} color="var(--color-text-muted)" />
                      </div>
                      {product.discountPercentage > 0 && (
                        <span className="admin-discount-tag">-{product.discountPercentage}%</span>
                      )}
                    </div>

                    <div className="admin-product-info">
                      {product.category && (
                        <span className="admin-category-badge">{product.category}</span>
                      )}
                      <h4 className="admin-product-name">{product.name}</h4>
                      
                      <div className="admin-price-row">
                        <span className="admin-price-final">${finalPrice.toFixed(2)}</span>
                        {product.discountPercentage > 0 && (
                          <span className="admin-price-orig">${product.price.toFixed(2)}</span>
                        )}
                      </div>

                      <div className="admin-stock-row">
                        <span className={`admin-stock-badge ${product.stockQuantity < 5 ? 'stock-low' : 'stock-ok'}`}>
                          {product.stockQuantity} in stock
                        </span>
                      </div>

                      <div className="admin-card-actions">
                        <button
                          className="btn btn-outline btn-sm delete-btn"
                          onClick={() => deleteProduct(product._id, product.name)}
                          title="Delete product"
                        >
                          <Trash2 size={14} /> Delete
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="empty-state">
              <h3 className="empty-state-title">No products yet</h3>
              <p className="empty-state-description">Click "Add New Product" above to create your first product.</p>
              <button className="btn btn-primary" onClick={toggleForm} style={{ marginTop: 'var(--spacing-4)' }}>
                <Plus size={16} /> Add Product Now
              </button>
            </div>
          )}
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default AdminProducts;
