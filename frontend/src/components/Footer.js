import React from 'react';

const Footer = () => {
  return (
    <footer style={{ backgroundColor: '#282c34', color: '#fff', padding: '1rem', textAlign: 'center' }}>
      <p>Flipkart Clone © {new Date().getFullYear()}</p>
    </footer>
  );
};

export default Footer;