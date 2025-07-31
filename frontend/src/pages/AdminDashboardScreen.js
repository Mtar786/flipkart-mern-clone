import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

const AdminDashboardScreen = () => {
  const { userInfo } = useContext(AuthContext);
  const navigate = useNavigate();
  const [summary, setSummary] = useState({});
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!userInfo || !userInfo.isAdmin) {
      navigate('/');
      return;
    }
    const fetchSummary = async () => {
      try {
        const { data } = await axios.get('/api/admin/summary', {
          headers: { Authorization: `Bearer ${userInfo.token}` }
        });
        setSummary(data);
      } catch (err) {
        setError(err.response && err.response.data.message ? err.response.data.message : err.message);
      }
    };
    fetchSummary();
  }, [userInfo, navigate]);

  return (
    <div>
      <h1>Admin Dashboard</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
        <div style={{ padding: '1rem', border: '1px solid #ddd', borderRadius: '4px' }}>
          <h3>Total Users</h3>
          <p>{summary.usersCount}</p>
        </div>
        <div style={{ padding: '1rem', border: '1px solid #ddd', borderRadius: '4px' }}>
          <h3>Total Products</h3>
          <p>{summary.productsCount}</p>
        </div>
        <div style={{ padding: '1rem', border: '1px solid #ddd', borderRadius: '4px' }}>
          <h3>Total Orders</h3>
          <p>{summary.ordersCount}</p>
        </div>
        <div style={{ padding: '1rem', border: '1px solid #ddd', borderRadius: '4px' }}>
          <h3>Total Sales</h3>
          <p>${summary.totalSales && summary.totalSales.toFixed(2)}</p>
        </div>
      </div>
      <div style={{ marginTop: '2rem' }}>
        <h2>Management</h2>
        <ul style={{ listStyle: 'none', padding: 0 }}>
          <li>
            <Link to="/admin/users">Manage Users</Link>
          </li>
          <li>
            <Link to="/admin/products">Manage Products</Link>
          </li>
          <li>
            <Link to="/admin/orders">Manage Orders</Link>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default AdminDashboardScreen;