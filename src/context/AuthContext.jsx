import React, { createContext, useContext, useState, useEffect } from 'react';
import { API_BASE_URL } from '../config';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (token) {
      localStorage.setItem('token', token);
    } else {
      localStorage.removeItem('token');
    }
  }, [token]);

  useEffect(() => {
    const loadUser = async () => {
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`${API_BASE_URL}/auth/me`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        if (!response.ok) {
          throw new Error('Session expired');
        }

        setUser(await response.json());
      } catch {
        setToken(null);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, [token]);

  const signup = async (fullName, email, password) => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fullName, email, password })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message);
      }

      setToken(data.token);
      setUser(data.user);
      return { success: true, user: data.user };
    } catch (error) {
      return {
        success: false,
        message: error instanceof TypeError
          ? 'Backend server se connection nahi ho saka. Backend aur MongoDB start karein.'
          : error.message
      };
    }
  };

  const login = async (email, password) => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message);
      }

      setToken(data.token);
      setUser(data.user);
      return { success: true, user: data.user };
    } catch (error) {
      return {
        success: false,
        message: error instanceof TypeError
          ? 'Backend server se connection nahi ho saka. Backend aur MongoDB start karein.'
          : error.message
      };
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
  };

  const value = {
    user,
    token,
    loading,
    signup,
    login,
    logout,
    isAuthenticated: !!token,
    isAdmin: user?.role === 'admin'
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
