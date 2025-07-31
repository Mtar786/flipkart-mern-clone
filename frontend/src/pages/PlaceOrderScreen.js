import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { CartContext } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext';

const PlaceOrderScreen = () => {
  const { cartItems, shippingAddress, paymentMethod, clearCart } = useContext(CartContext);
  const { userInfo } = useContext(AuthContext);
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const itemsPrice = cartItems.reduce((acc, item) => acc + item.price * item.qty, 0);
  const shippingPrice = itemsPrice > 100 ? 0 : 10;
  const taxPrice = Number((0.15 * itemsPrice).toFixed(2));
  const totalPrice = (itemsPrice + shippingPrice + taxPrice).toFixed(2);

  useEffect(() => {
    if (!userInfo) {
      navigate('/login');
    } else if (cartItems.length === 0) {
      navigate('/');
    }
  }, [userInfo, cartItems, navigate]);

  const placeOrderHandler = async () => {
    try {
      const { data } = await axios.post(
        '/api/orders',
        {
          orderItems: cartItems,
          shippingAddress,
          paymentMethod,
          itemsPrice,
          taxPrice,
          shippingPrice,
          totalPrice
        },
        {
          headers: { Authorization: `Bearer ${userInfo.token}` }
        }
      );
      clearCart();
      navigate(`/order/${data._id}`);
    } catch (err) {
      setError(err.response && err.response.data.message ? err.response.data.message : err.message);
    }
  };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem' }}>
      <div>
        <h2>Shipping</h2>
        <p>
          <strong>Address: </strong>
          {shippingAddress.address}, {shippingAddress.city}, {shippingAddress.postalCode},{' '}
          {shippingAddress.country}
        </p>
        <h2>Payment Method</h2>
        <p>
          <strong>Method: </strong>
          {paymentMethod}
        </p>
        <h2>Order Items</h2>
        {cartItems.length === 0 ? (
          <p>Your cart is empty</p>
        ) : (
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {cartItems.map((item) => (
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
          <strong>Items:</strong> ${itemsPrice.toFixed(2)}
        </p>
        <p>
          <strong>Shipping:</strong> ${shippingPrice.toFixed(2)}
        </p>
        <p>
          <strong>Tax:</strong> ${taxPrice.toFixed(2)}
        </p>
        <p>
          <strong>Total:</strong> ${totalPrice}
        </p>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <button
          type="button"
          disabled={cartItems.length === 0}
          onClick={placeOrderHandler}
          style={{ width: '100%', padding: '0.75rem', backgroundColor: '#2874f0', color: '#fff', border: 'none', cursor: 'pointer' }}
        >
          Place Order
        </button>
      </div>
    </div>
  );
};

export default PlaceOrderScreen;