import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const ProfileScreen = () => {
  const { userInfo, login } = useContext(AuthContext);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [orders, setOrders] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (!userInfo) {
      navigate('/login');
      return;
    }
    const fetchProfile = async () => {
      try {
        const { data } = await axios.get('/api/users/profile', {
          headers: { Authorization: `Bearer ${userInfo.token}` }
        });
        setName(data.name);
        setEmail(data.email);
      } catch (err) {
        setError(err.response && err.response.data.message ? err.response.data.message : err.message);
      }
    };
    const fetchOrders = async () => {
      try {
        const { data } = await axios.get('/api/orders/myorders', {
          headers: { Authorization: `Bearer ${userInfo.token}` }
        });
        setOrders(data);
      } catch (err) {
        // ignore
      }
    };
    fetchProfile();
    fetchOrders();
  }, [navigate, userInfo]);

  const submitHandler = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    try {
      const { data } = await axios.put(
        '/api/users/profile',
        { name, email, password },
        { headers: { Authorization: `Bearer ${userInfo.token}` } }
      );
      login(data);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError(err.response && err.response.data.message ? err.response.data.message : err.message);
    }
  };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '2rem' }}>
      <div>
        <h2>User Profile</h2>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        {success && <p style={{ color: 'green' }}>Profile Updated</p>}
        <form onSubmit={submitHandler}>
          <div style={{ marginBottom: '1rem' }}>
            <label htmlFor="name">Name</label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              style={{ width: '100%', padding: '0.5rem', marginTop: '0.25rem' }}
            />
          </div>
          <div style={{ marginBottom: '1rem' }}>
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={{ width: '100%', padding: '0.5rem', marginTop: '0.25rem' }}
            />
          </div>
          <div style={{ marginBottom: '1rem' }}>
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter new password"
              style={{ width: '100%', padding: '0.5rem', marginTop: '0.25rem' }}
            />
          </div>
          <div style={{ marginBottom: '1rem' }}>
            <label htmlFor="confirmPassword">Confirm Password</label>
            <input
              type="password"
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm password"
              style={{ width: '100%', padding: '0.5rem', marginTop: '0.25rem' }}
            />
          </div>
          <button type="submit" style={{ padding: '0.5rem 1rem', backgroundColor: '#2874f0', color: '#fff', border: 'none', cursor: 'pointer' }}>
            Update
          </button>
        </form>
      </div>
      <div>
        <h2>My Orders</h2>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th style={{ border: '1px solid #ddd', padding: '0.5rem' }}>ID</th>
              <th style={{ border: '1px solid #ddd', padding: '0.5rem' }}>Date</th>
              <th style={{ border: '1px solid #ddd', padding: '0.5rem' }}>Total</th>
              <th style={{ border: '1px solid #ddd', padding: '0.5rem' }}>Paid</th>
              <th style={{ border: '1px solid #ddd', padding: '0.5rem' }}>Delivered</th>
              <th style={{ border: '1px solid #ddd', padding: '0.5rem' }}>Details</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order._id}>
                <td style={{ border: '1px solid #ddd', padding: '0.5rem' }}>{order._id.substring(order._id.length - 6)}</td>
                <td style={{ border: '1px solid #ddd', padding: '0.5rem' }}>{new Date(order.createdAt).toLocaleDateString()}</td>
                <td style={{ border: '1px solid #ddd', padding: '0.5rem' }}>${order.totalPrice.toFixed(2)}</td>
                <td style={{ border: '1px solid #ddd', padding: '0.5rem' }}>{order.isPaid ? 'Yes' : 'No'}</td>
                <td style={{ border: '1px solid #ddd', padding: '0.5rem' }}>{order.isDelivered ? 'Yes' : 'No'}</td>
                <td style={{ border: '1px solid #ddd', padding: '0.5rem' }}>
                  <button
                    onClick={() => navigate(`/order/${order._id}`)}
                    style={{ padding: '0.25rem 0.5rem', backgroundColor: '#2874f0', color: '#fff', border: 'none', cursor: 'pointer' }}
                  >
                    Details
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProfileScreen;