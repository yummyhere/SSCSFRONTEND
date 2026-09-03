import React from 'react';
import './Loading.css';

const Loading = ({ message = 'Loading...' }) => {
  return (
    <div className="loading-container">
      <div className="spinner"></div>
      <p className="loading-text">{message}</p>
    </div>
  );
};

const ProductSkeleton = () => {
  return (
    <div className="product-skeleton">
      <div className="skeleton skeleton-image"></div>
      <div className="skeleton-content">
        <div className="skeleton skeleton-title"></div>
        <div className="skeleton skeleton-category"></div>
        <div className="skeleton skeleton-price"></div>
        <div className="skeleton skeleton-button"></div>
      </div>
    </div>
  );
};

export { Loading, ProductSkeleton };
export default Loading;
