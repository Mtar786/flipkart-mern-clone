import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

const AdminProductsScreen = () => {
  const { userInfo } = useContext(AuthContext);
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [error, setError] = useState(null);
  const [successDelete, setSuccessDelete] = useState(false);

  useEffect(() => {
    if (!userInfo || !userInfo.isAdmin) {
      navigate('/');
      return;
    }
    const fetchProducts = async () => {
      try {
        const { data } = await axios.get('/api/products');
        setProducts(data.products);
      } catch (err) {
        setError(err.response && err.response.data.message ? err.response.data.message : err.message);
      }
    };
    fetchProducts();
  }, [userInfo, navigate, successDelete]);

  const deleteHandler = async (id) => {
    if (window.confirm('Are you sure?')) {
      try {
        await axios.delete(`/api/products/${id}`, {
          headers: { Authorization: `Bearer ${userInfo.token}` }
        });
        setSuccessDelete(!successDelete);
      } catch (err) {
        setError(err.response && err.response.data.message ? err.response.data.message : err.message);
      }
    }
  };

  const createProductHandler = async () => {
    try {
      // Create a sample product
      const { data } = await axios.post(
        '/api/products',
        {
          name: 'Sample Product',
          price: 0,
          description: 'Sample description',
          image: '/images/sample.jpg',
          brand: 'Sample brand',
          category: 'Sample category',
          countInStock: 0
        },
        { headers: { Authorization: `Bearer ${userInfo.token}` } }
      );
      navigate(`/product/${data._id}`);
    } catch (err) {
      setError(err.response && err.response.data.message ? err.response.data.message : err.message);
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1>Products</h1>
        <button
          onClick={createProductHandler}
          style={{ padding: '0.5rem 1rem', backgroundColor: '#2874f0', color: '#fff', border: 'none', cursor: 'pointer' }}
        >
          <span style={{ fontSize: '1rem' }}>+ Create Product</span>
        </button>
      </div>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th style={{ border: '1px solid #ddd', padding: '0.5rem' }}>ID</th>
            <th style={{ border: '1px solid #ddd', padding: '0.5rem' }}>Name</th>
            <th style={{ border: '1px solid #ddd', padding: '0.5rem' }}>Price</th>
            <th style={{ border: '1px solid #ddd', padding: '0.5rem' }}>Category</th>
            <th style={{ border: '1px solid #ddd', padding: '0.5rem' }}>Brand</th>
            <th style={{ border: '1px solid #ddd', padding: '0.5rem' }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product._id}>
              <td style={{ border: '1px solid #ddd', padding: '0.5rem' }}>{product._id.substring(product._id.length - 6)}</td>
              <td style={{ border: '1px solid #ddd', padding: '0.5rem' }}>{product.name}</td>
              <td style={{ border: '1px solid #ddd', padding: '0.5rem' }}>${product.price.toFixed(2)}</td>
              <td style={{ border: '1px solid #ddd', padding: '0.5rem' }}>{product.category}</td>
              <td style={{ border: '1px solid #ddd', padding: '0.5rem' }}>{product.brand}</td>
              <td style={{ border: '1px solid #ddd', padding: '0.5rem' }}>
                <Link
                  to={`/product/${product._id}`}
                  style={{ marginRight: '0.5rem', color: '#0275d8' }}
                >
                  Edit
                </Link>
                <button
                  onClick={() => deleteHandler(product._id)}
                  style={{ padding: '0.25rem 0.5rem', backgroundColor: '#d9534f', color: '#fff', border: 'none', cursor: 'pointer' }}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminProductsScreen;