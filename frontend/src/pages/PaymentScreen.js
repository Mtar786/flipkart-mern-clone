import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext';

const PaymentScreen = () => {
  const { paymentMethod, setPaymentMethod, shippingAddress } = useContext(CartContext);
  const { userInfo } = useContext(AuthContext);
  const navigate = useNavigate();
  const [method, setMethod] = useState(paymentMethod);

  useEffect(() => {
    if (!userInfo) {
      navigate('/login?redirect=/payment');
    } else if (!shippingAddress.address) {
      navigate('/shipping');
    }
  }, [userInfo, shippingAddress, navigate]);

  const submitHandler = (e) => {
    e.preventDefault();
    setPaymentMethod(method);
    navigate('/placeorder');
  };

  return (
    <div style={{ maxWidth: '400px', margin: '0 auto' }}>
      <h1>Payment Method</h1>
      <form onSubmit={submitHandler}>
        <div style={{ marginBottom: '1rem' }}>
          <input
            type="radio"
            id="paypal"
            name="paymentMethod"
            value="PayPal"
            checked={method === 'PayPal'}
            onChange={(e) => setMethod(e.target.value)}
          />
          <label htmlFor="paypal" style={{ marginLeft: '0.5rem' }}>
            PayPal or Credit Card
          </label>
        </div>
        <div style={{ marginBottom: '1rem' }}>
          <input
            type="radio"
            id="cod"
            name="paymentMethod"
            value="COD"
            checked={method === 'COD'}
            onChange={(e) => setMethod(e.target.value)}
          />
          <label htmlFor="cod" style={{ marginLeft: '0.5rem' }}>
            Cash On Delivery
          </label>
        </div>
        <button type="submit" style={{ width: '100%', padding: '0.75rem', backgroundColor: '#2874f0', color: '#fff', border: 'none', cursor: 'pointer' }}>
          Continue
        </button>
      </form>
    </div>
  );
};

export default PaymentScreen;