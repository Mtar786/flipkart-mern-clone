import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { CartContext } from '../context/CartContext';

const Header = () => {
  const { userInfo, logout } = useContext(AuthContext);
  const { cartItems } = useContext(CartContext);
  const navigate = useNavigate();

  const logoutHandler = () => {
    logout();
    navigate('/login');
  };

  return (
    <header style={{ backgroundColor: '#2874f0', padding: '1rem', color: '#fff' }}>
      <nav style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Link to="/" style={{ fontWeight: 'bold', fontSize: '1.5rem', color: '#fff' }}>
          Flipkart Clone
        </Link>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <Link to="/cart" style={{ color: '#fff' }}>
            Cart ({cartItems.reduce((acc, item) => acc + item.qty, 0)})
          </Link>
          {userInfo ? (
            <>
              <span>Hi, {userInfo.name}</span>
              <button onClick={logoutHandler} style={{ background: 'transparent', border: '1px solid #fff', color: '#fff', padding: '0.2rem 0.5rem', cursor: 'pointer' }}>
                Logout
              </button>
              {userInfo.isAdmin && (
                <Link to="/admin/dashboard" style={{ color: '#fff' }}>
                  Admin
                </Link>
              )}
            </>
          ) : (
            <>
              <Link to="/login" style={{ color: '#fff' }}>
                Login
              </Link>
              <Link to="/register" style={{ color: '#fff' }}>
                Register
              </Link>
            </>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Header;