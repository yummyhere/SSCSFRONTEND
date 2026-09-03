import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { API_BASE_URL } from '../config';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState({ items: [], total: 0 });
  const [loading, setLoading] = useState(false);
  const { token } = useAuth();

  const fetchCart = async () => {
    if (!token) {
      setCart({ items: [], total: 0 });
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/cart`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (!response.ok) throw new Error('Failed to fetch cart');

      const data = await response.json();
      setCart(data.cart);
    } catch (error) {
      console.error('Error fetching cart:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchCart();
    }
  }, [token]);

  const addToCart = async (productId, quantity) => {
    if (!token) return { success: false, message: 'Please login first' };

    try {
      const response = await fetch(`${API_BASE_URL}/cart/items`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ productId, quantity })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message);
      }

      await fetchCart();
      return { success: true, message: data.message };
    } catch (error) {
      return { success: false, message: error.message };
    }
  };

  const updateCartItem = async (productId, quantity) => {
    if (!token) return { success: false };

    try {
      const response = await fetch(`${API_BASE_URL}/cart/items/${productId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ quantity })
      });

      const data = await response.json();

      if (!response.ok) throw new Error(data.message);

      await fetchCart();
      return { success: true };
    } catch (error) {
      return { success: false, message: error.message };
    }
  };

  const removeFromCart = async (productId) => {
    if (!token) return { success: false };

    try {
      const response = await fetch(`${API_BASE_URL}/cart/items/${productId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (!response.ok) throw new Error('Failed to remove item');

      await fetchCart();
      return { success: true };
    } catch (error) {
      return { success: false, message: error.message };
    }
  };

  const clearCart = async () => {
    if (!token) return { success: false };

    try {
      const response = await fetch(`${API_BASE_URL}/cart`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (!response.ok) throw new Error('Failed to clear cart');

      setCart({ items: [], total: 0 });
      return { success: true };
    } catch (error) {
      return { success: false, message: error.message };
    }
  };

  const value = {
    cart,
    loading,
    addToCart,
    updateCartItem,
    removeFromCart,
    clearCart,
    itemCount: cart.items?.length || 0,
    total: cart.total || 0
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within CartProvider');
  }
  return context;
};
