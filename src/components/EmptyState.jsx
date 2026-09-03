import React from 'react';
import { Link } from 'react-router-dom';
import { Package } from 'lucide-react';
import './EmptyState.css';

const EmptyState = ({ 
  title = "No items found", 
  description = "There's nothing here yet.", 
  action = null,
  icon = <Package size={42} strokeWidth={1.5} />
}) => {
  return (
    <div className="empty-state">
      <div className="empty-state-icon">{icon}</div>
      <h3 className="empty-state-title">{title}</h3>
      <p className="empty-state-description">{description}</p>
      {action && (
        <div className="empty-state-action">
          {typeof action === 'string' ? (
            <Link to={action} className="btn btn-primary">
              Continue Shopping
            </Link>
          ) : (
            action
          )}
        </div>
      )}
    </div>
  );
};

export default EmptyState;
