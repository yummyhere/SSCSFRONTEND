import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ProductCard from '../components/ProductCard';
import { Loading, ProductSkeleton } from '../components/Loading';
import EmptyState from '../components/EmptyState';
import {
  ArrowRight,
  Box,
  LockKeyhole,
  MessageCircle,
  Package,
  RotateCcw,
  Sparkles,
  Truck
} from 'lucide-react';
import './Home.css';
import { API_BASE_URL } from '../config';

const Home = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    fetchFeaturedProducts();
    fetchCategories();
  }, []);

  const fetchFeaturedProducts = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/products?limit=8&sort=createdAt`);
      const data = await response.json();
      setProducts(data.products || []);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/products/categories/all`);
      const data = await response.json();
      setCategories(data.categories?.slice(0, 6) || []);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  return (
    <div className="home-page">
      <Navbar />

      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content container">
          <div className="hero-copy">
            <div className="hero-eyebrow"><Sparkles size={15} /> Curated for modern living</div>
            <h1 className="hero-title">Objects with a little more <em>intention.</em></h1>
            <p className="hero-subtitle">
              Discover considered essentials, standout pieces, and everyday upgrades selected for the way you live now.
            </p>
            <div className="hero-actions">
              <Link to="/products" className="btn btn-accent hero-cta">
                Explore collection <ArrowRight size={18} />
              </Link>
              <span className="hero-note">New arrivals, thoughtfully chosen</span>
            </div>
          </div>
          <div className="hero-showcase" aria-label="Featured collection preview">
            <div className="showcase-orbit orbit-one"></div>
            <div className="showcase-orbit orbit-two"></div>
            <div className="showcase-card showcase-card-main">
              <div className="showcase-card-top"><span>01 / 04</span><Box size={18} /></div>
              <div className="showcase-product"><Package size={84} strokeWidth={1} /></div>
              <div className="showcase-card-bottom"><span>Daily essentials</span><strong>Selected</strong></div>
            </div>
            <div className="showcase-tag">NEXUS<br /><span>EDITIONS</span></div>
          </div>
        </div>
        <div className="hero-background"></div>
      </section>

      {/* Featured Categories */}
      {categories.length > 0 && (
        <section className="section">
          <div className="container">
            <h2 className="section-title">Shop by Category</h2>
            <div className="categories-grid">
              {categories.map((category, idx) => (
                <Link
                  key={idx}
                  to={`/products?category=${encodeURIComponent(category)}`}
                  className="category-card"
                >
                  <span className="category-icon"><Package size={30} strokeWidth={1.5} /></span>
                  <span className="category-name">{category}</span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Featured Products */}
      <section className="section">
        <div className="container">
          <div className="section-header">
            <div>
              <h2 className="section-title">Featured Products</h2>
              <p className="section-subtitle">Hand-picked selections for you</p>
            </div>
            <Link to="/products" className="btn btn-outline btn-sm">
              View All
            </Link>
          </div>

          {loading ? (
            <div className="grid grid-4">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                <ProductSkeleton key={i} />
              ))}
            </div>
          ) : products.length > 0 ? (
            <div className="grid grid-4">
              {products.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          ) : (
            <EmptyState
              title="No products available"
              description="Our catalog is currently being updated. Please check back soon."
              icon={<Package size={42} strokeWidth={1.5} />}
            />
          )}
        </div>
      </section>

      {/* Promotional Banner */}
      <section className="promo-banner">
        <div className="container">
          <div className="promo-content">
            <h3>Special Offer</h3>
            <p>Save up to 40% on selected items</p>
            <Link to="/products" className="btn btn-outline">
              Shop Now
            </Link>
          </div>
        </div>
      </section>

      {/* Value Propositions */}
      <section className="section">
        <div className="container">
          <div className="value-props">
            <div className="value-prop-card">
              <span className="value-icon"><Truck size={30} strokeWidth={1.6} /></span>
              <h4>Fast Shipping</h4>
              <p>Quick delivery to your doorstep</p>
            </div>
            <div className="value-prop-card">
              <span className="value-icon"><LockKeyhole size={30} strokeWidth={1.6} /></span>
              <h4>Secure Payment</h4>
              <p>Your payment information is protected</p>
            </div>
            <div className="value-prop-card">
              <span className="value-icon"><RotateCcw size={30} strokeWidth={1.6} /></span>
              <h4>Easy Returns</h4>
              <p>30-day return policy on all items</p>
            </div>
            <div className="value-prop-card">
              <span className="value-icon"><MessageCircle size={30} strokeWidth={1.6} /></span>
              <h4>24/7 Support</h4>
              <p>Our team is here to help anytime</p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Home;
