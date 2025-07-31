import React, { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

const OrderScreen = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { userInfo } = useContext(AuthContext);
  const [order, setOrder] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [successDeliver, setSuccessDeliver] = useState(false);

  useEffect(() => {
    if (!userInfo) {
      navigate('/login');
      return;
    }
    const fetchOrder = async () => {
      try {
        setLoading(true);
        const { data } = await axios.get(`/api/orders/${id}`, {
          headers: { Authorization: `Bearer ${userInfo.token}` }
        });
        setOrder(data);
        setLoading(false);
      } catch (err) {
        setError(err.response && err.response.data.message ? err.response.data.message : err.message);
        setLoading(false);
      }
    };
    fetchOrder();
  }, [id, userInfo, navigate, successDeliver]);

  const deliverHandler = async () => {
    try {
      await axios.put(
        `/api/orders/${id}/deliver`,
        {},
        { headers: { Authorization: `Bearer ${userInfo.token}` } }
      );
      setSuccessDeliver(true);
      setTimeout(() => setSuccessDeliver(false), 3000);
    } catch (err) {
      setError(err.response && err.response.data.message ? err.response.data.message : err.message);
    }
  };

  return (
    <div>
      <h1>Order {id}</h1>
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p style={{ color: 'red' }}>{error}</p>
      ) : order ? (
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem' }}>
          <div>
            <h2>Shipping</h2>
            <p>
              <strong>Name: </strong>
              {order.user.name}
            </p>
            <p>
              <strong>Email: </strong>
              {order.user.email}
            </p>
            <p>
              <strong>Address: </strong>
              {order.shippingAddress.address}, {order.shippingAddress.city}, {order.shippingAddress.postalCode},{' '}
              {order.shippingAddress.country}
            </p>
            <p>
              {order.isDelivered ? (
                <span style={{ color: 'green' }}>Delivered on {new Date(order.deliveredAt).toLocaleDateString()}</span>
              ) : (
                <span style={{ color: 'red' }}>Not Delivered</span>
              )}
            </p>
            <h2>Payment Method</h2>
            <p>
              <strong>Method: </strong>
              {order.paymentMethod}
            </p>
            <p>
              {order.isPaid ? (
                <span style={{ color: 'green' }}>Paid on {new Date(order.paidAt).toLocaleDateString()}</span>
              ) : (
                <span style={{ color: 'red' }}>Not Paid</span>
              )}
            </p>
            <h2>Order Items</h2>
            {order.orderItems.length === 0 ? (
              <p>Order is empty</p>
            ) : (
              <ul style={{ listStyle: 'none', padding: 0 }}>
                {order.orderItems.map((item) => (
                  <li key={item.product} style={{ marginBottom: '1rem' }}>
                    {item.name} x {item.qty} = ${ (item.price * item.qty).toFixed(2) }
                  </li>
                ))}
              </ul>
            )}
          </div>
          <div style={{ border: '1px solid #ddd', padding: '1rem', borderRadius: '4px' }}>
            <h2>Order Summary</h2>
            <p>
              <strong>Items:</strong> ${order.itemsPrice.toFixed(2)}
            </p>
            <p>
              <strong>Shipping:</strong> ${order.shippingPrice.toFixed(2)}
            </p>
            <p>
              <strong>Tax:</strong> ${order.taxPrice.toFixed(2)}
            </p>
            <p>
              <strong>Total:</strong> ${order.totalPrice.toFixed(2)}
            </p>
            {userInfo.isAdmin && !order.isDelivered && (
              <button
                onClick={deliverHandler}
                style={{ width: '100%', padding: '0.75rem', backgroundColor: '#2874f0', color: '#fff', border: 'none', cursor: 'pointer' }}
              >
                Mark As Delivered
              </button>
            )}
            {successDeliver && <p style={{ color: 'green', marginTop: '0.5rem' }}>Order delivered</p>}
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default OrderScreen;