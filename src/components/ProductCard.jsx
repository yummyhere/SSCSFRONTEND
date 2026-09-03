import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import './ProductCard.css';

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [isAdding, setIsAdding] = useState(false);

  const finalPrice = product.discountPercentage
    ? product.price * (1 - product.discountPercentage / 100)
    : product.price;

  const handleAddToCart = async () => {
    setIsAdding(true);
    await addToCart(product._id, quantity);
    setIsAdding(false);
    setQuantity(1);
  };

  const isOutOfStock = product.stockQuantity === 0;

  return (
    <div className="product-card">
      <Link to={`/product/${product._id}`} className="product-image-wrapper">
        {product.image ? (
          <img src={product.image} alt={product.name} className="product-image" />
        ) : (
          <div className="product-image-placeholder">
            <span>No Image</span>
          </div>
        )}
        {product.discountPercentage > 0 && (
          <span className="product-badge">{product.discountPercentage}% OFF</span>
        )}
        {isOutOfStock && <span className="product-badge badge-stock">OUT OF STOCK</span>}
      </Link>

      <div className="product-info">
        <Link to={`/product/${product._id}`} className="product-name">
          {product.name}
        </Link>

        {product.category && (
          <p className="product-category text-muted">{product.category}</p>
        )}

        <div className="product-pricing">
          {product.discountPercentage > 0 ? (
            <>
              <span className="product-original-price">${product.price.toFixed(2)}</span>
              <span className="product-final-price">${finalPrice.toFixed(2)}</span>
            </>
          ) : (
            <span className="product-final-price">${product.price.toFixed(2)}</span>
          )}
        </div>

        {product.rating && (
          <div className="product-rating">
            <span className="stars">★</span>
            <span className="rating-value">{product.rating.toFixed(1)}</span>
          </div>
        )}

        {!isOutOfStock && (
          <div className="product-actions">
            <div className="quantity-selector">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                disabled={quantity === 1}
                className="qty-btn"
              >
                −
              </button>
              <input
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                max={product.stockQuantity}
                className="qty-input"
              />
              <button
                onClick={() => setQuantity(Math.min(product.stockQuantity, quantity + 1))}
                disabled={quantity >= product.stockQuantity}
                className="qty-btn"
              >
                +
              </button>
            </div>
            <button
              className="btn btn-accent btn-sm"
              onClick={handleAddToCart}
              disabled={isAdding}
            >
              {isAdding ? 'Adding...' : 'Add'}
            </button>
          </div>
        )}

        {isOutOfStock && (
          <button className="btn btn-outline btn-sm" disabled>
            Out of Stock
          </button>
        )}

        <p className="product-stock text-sm text-muted">
          {product.stockQuantity === 0
            ? 'No stock available'
            : `${product.stockQuantity} in stock`}
        </p>
      </div>
    </div>
  );
};

export default ProductCard;
