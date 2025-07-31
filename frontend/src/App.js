import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import Header from './components/Header';
import Footer from './components/Footer';
import HomeScreen from './pages/HomeScreen';
import ProductScreen from './pages/ProductScreen';
import CartScreen from './pages/CartScreen';
import LoginScreen from './pages/LoginScreen';
import RegisterScreen from './pages/RegisterScreen';
import ProfileScreen from './pages/ProfileScreen';
import ShippingScreen from './pages/ShippingScreen';
import PaymentScreen from './pages/PaymentScreen';
import PlaceOrderScreen from './pages/PlaceOrderScreen';
import OrderScreen from './pages/OrderScreen';
import AdminDashboardScreen from './pages/AdminDashboardScreen';
import AdminUsersScreen from './pages/AdminUsersScreen';
import AdminProductsScreen from './pages/AdminProductsScreen';
import AdminOrdersScreen from './pages/AdminOrdersScreen';

const App = () => {
  return (
    <AuthProvider>
      <CartProvider>
        <Header />
        <main className="container" style={{ padding: '1rem 2rem', minHeight: '80vh' }}>
          <Routes>
            <Route path="/" element={<HomeScreen />} />
            <Route path="/product/:id" element={<ProductScreen />} />
            <Route path="/cart" element={<CartScreen />} />
            <Route path="/login" element={<LoginScreen />} />
            <Route path="/register" element={<RegisterScreen />} />
            <Route path="/profile" element={<ProfileScreen />} />
            <Route path="/shipping" element={<ShippingScreen />} />
            <Route path="/payment" element={<PaymentScreen />} />
            <Route path="/placeorder" element={<PlaceOrderScreen />} />
            <Route path="/order/:id" element={<OrderScreen />} />
            <Route path="/admin/dashboard" element={<AdminDashboardScreen />} />
            <Route path="/admin/users" element={<AdminUsersScreen />} />
            <Route path="/admin/products" element={<AdminProductsScreen />} />
            <Route path="/admin/orders" element={<AdminOrdersScreen />} />
          </Routes>
        </main>
        <Footer />
      </CartProvider>
    </AuthProvider>
  );
};

export default App;