import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const AdminOrdersScreen = () => {
  const { userInfo } = useContext(AuthContext);
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!userInfo || !userInfo.isAdmin) {
      navigate('/');
      return;
    }
    const fetchOrders = async () => {
      try {
        const { data } = await axios.get('/api/admin/orders', {
          headers: { Authorization: `Bearer ${userInfo.token}` }
        });
        setOrders(data);
      } catch (err) {
        setError(err.response && err.response.data.message ? err.response.data.message : err.message);
      }
    };
    fetchOrders();
  }, [userInfo, navigate]);

  return (
    <div>
      <h1>Orders</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th style={{ border: '1px solid #ddd', padding: '0.5rem' }}>ID</th>
            <th style={{ border: '1px solid #ddd', padding: '0.5rem' }}>User</th>
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
              <td style={{ border: '1px solid #ddd', padding: '0.5rem' }}>{order.user && order.user.name}</td>
              <td style={{ border: '1px solid #ddd', padding: '0.5rem' }}>{new Date(order.createdAt).toLocaleDateString()}</td>
              <td style={{ border: '1px solid #ddd', padding: '0.5rem' }}>${order.totalPrice.toFixed(2)}</td>
              <td style={{ border: '1px solid #ddd', padding: '0.5rem' }}>{order.isPaid ? new Date(order.paidAt).toLocaleDateString() : 'No'}</td>
              <td style={{ border: '1px solid #ddd', padding: '0.5rem' }}>{order.isDelivered ? new Date(order.deliveredAt).toLocaleDateString() : 'No'}</td>
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
  );
};

export default AdminOrdersScreen;