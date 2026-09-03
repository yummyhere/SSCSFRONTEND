import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import './Auth.css';

const Auth = ({ mode = 'login' }) => {
  const [isLogin, setIsLogin] = useState(mode === 'login');
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const { login, signup } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      if (isLogin) {
        const result = await login(formData.email, formData.password);
        if (result.success) {
          setSuccess('Login successful! Redirecting...');
          setTimeout(() => navigate(result.user?.role === 'admin' ? '/admin' : '/orders'), 700);
        } else {
          setError(result.message);
        }
      } else {
        if (formData.password !== formData.confirmPassword) {
          setError('Passwords do not match');
          setLoading(false);
          return;
        }

        const result = await signup(formData.fullName, formData.email, formData.password);
        if (result.success) {
          setSuccess('Account created! Redirecting...');
          setTimeout(() => navigate('/orders'), 700);
        } else {
          setError(result.message);
        }
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <Navbar />

      <section className="auth-section">
        <div className="auth-container">
          <div className="auth-box">
            <div className="auth-header">
              <h1>{isLogin ? 'Welcome Back' : 'Create Account'}</h1>
              <p>
                {isLogin ? 'Sign in to your account' : 'Join us today'}
              </p>
            </div>

            {error && <div className="auth-message error">{error}</div>}
            {success && <div className="auth-message success">{success}</div>}

            <form onSubmit={handleSubmit} className="auth-form">
              {!isLogin && (
                <div className="form-group">
                  <label htmlFor="fullName">Full Name</label>
                  <input
                    type="text"
                    id="fullName"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    required
                    placeholder="Your full name"
                  />
                </div>
              )}

              <div className="form-group">
                <label htmlFor="email">Email Address</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder="your@email.com"
                />
              </div>

              <div className="form-group">
                <label htmlFor="password">Password</label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  placeholder="••••••••"
                />
              </div>

              {!isLogin && (
                <div className="form-group">
                  <label htmlFor="confirmPassword">Confirm Password</label>
                  <input
                    type="password"
                    id="confirmPassword"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                    placeholder="••••••••"
                  />
                </div>
              )}

              <button
                type="submit"
                className="btn btn-primary"
                disabled={loading}
                style={{ width: '100%' }}
              >
                {loading ? (isLogin ? 'Signing in...' : 'Creating account...') : (isLogin ? 'Sign In' : 'Create Account')}
              </button>
            </form>

            <div className="auth-toggle">
              <span>
                {isLogin ? "Don't have an account?" : 'Already have an account?'}
              </span>
              <button
                onClick={() => {
                  setIsLogin(!isLogin);
                  setFormData({ fullName: '', email: '', password: '', confirmPassword: '' });
                  setError('');
                  setSuccess('');
                }}
                className="toggle-link"
              >
                {isLogin ? 'Sign Up' : 'Sign In'}
              </button>
            </div>

            <Link to="/" className="back-link">← Back to home</Link>
          </div>

          <div className="auth-illustration hide-mobile">
            <div className="illustration-content">
              <div className="illustration-icon">◆</div>
              <h2>Nexus Shopping</h2>
              <p>Your destination for premium products and exceptional experiences</p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Auth;
