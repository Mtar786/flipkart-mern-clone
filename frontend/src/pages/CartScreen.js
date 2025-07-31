import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CartContext } from '../context/CartContext';

const CartScreen = () => {
  const { cartItems, addToCart, removeFromCart } = useContext(CartContext);
  const navigate = useNavigate();
  const totalPrice = cartItems.reduce((acc, item) => acc + item.price * item.qty, 0);

  const checkoutHandler = () => {
    navigate('/shipping');
  };

  return (
    <div>
      <h1>Shopping Cart</h1>
      {cartItems.length === 0 ? (
        <p>
          Your cart is empty. <Link to="/">Go Back</Link>
        </p>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem' }}>
          <div>
            {cartItems.map((item) => (
              <div
                key={item.product}
                style={{ display: 'flex', alignItems: 'center', marginBottom: '1rem', borderBottom: '1px solid #ddd', paddingBottom: '1rem' }}
              >
                <div style={{ flex: '0 0 80px' }}>
                  <img src={item.image} alt={item.name} style={{ width: '80px' }} />
                </div>
                <div style={{ flex: '1 1 auto', marginLeft: '1rem' }}>
                  <Link to={`/product/${item.product}`} style={{ fontWeight: 'bold', color: '#2874f0' }}>
                    {item.name}
                  </Link>
                </div>
                <div style={{ flex: '0 0 100px' }}>${item.price.toFixed(2)}</div>
                <div style={{ flex: '0 0 120px' }}>
                  <select
                    value={item.qty}
                    onChange={(e) =>
                      addToCart({ ...item, qty: Number(e.target.value) })
                    }
                  >
                    {[...Array(10).keys()].map((x) => (
                      <option key={x + 1} value={x + 1}>
                        {x + 1}
                      </option>
                    ))}
                  </select>
                </div>
                <div style={{ flex: '0 0 100px' }}>
                  <button
                    onClick={() => removeFromCart(item.product)}
                    style={{ background: 'transparent', border: 'none', color: '#d9534f', cursor: 'pointer' }}
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
          <div style={{ border: '1px solid #ddd', padding: '1rem', borderRadius: '4px' }}>
            <h2>
              Subtotal ({cartItems.reduce((acc, item) => acc + item.qty, 0)}) items
            </h2>
            <p>Total: ${totalPrice.toFixed(2)}</p>
            <button
              onClick={checkoutHandler}
              disabled={cartItems.length === 0}
              style={{ width: '100%', padding: '0.75rem', backgroundColor: '#2874f0', color: '#fff', border: 'none', cursor: 'pointer' }}
            >
              Proceed To Checkout
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartScreen;