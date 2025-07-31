import React from 'react';
import { Link } from 'react-router-dom';

const ProductCard = ({ product }) => {
  return (
    <div style={{ border: '1px solid #ddd', borderRadius: '4px', overflow: 'hidden', backgroundColor: '#fff' }}>
      <Link to={`/product/${product._id}`} style={{ display: 'block' }}>
        <img src={product.image} alt={product.name} style={{ width: '100%', height: '200px', objectFit: 'cover' }} />
      </Link>
      <div style={{ padding: '0.5rem' }}>
        <Link to={`/product/${product._id}`} style={{ fontWeight: 'bold', color: '#333', textDecoration: 'none' }}>
          {product.name}
        </Link>
        <div style={{ marginTop: '0.5rem' }}>
          <span style={{ fontWeight: 'bold' }}>${product.price.toFixed(2)}</span>
        </div>
        <div style={{ marginTop: '0.5rem', fontSize: '0.9rem', color: '#888' }}>
          {product.rating.toFixed(1)} ⭐ ({product.numReviews})
        </div>
      </div>
    </div>
  );
};

export default ProductCard;