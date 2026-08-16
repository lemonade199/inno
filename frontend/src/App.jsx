import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';

// Layouts
import UserLayout from './layouts/UserLayout';
import AdminLayout from './layouts/AdminLayout';

// Components
import ProtectedRoute from './components/ProtectedRoute';

import ErrorBoundary from './components/ErrorBoundary';

// Auth Pages
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';

// User Pages
import Home from './pages/Home';
import UserDashboard from './pages/Dashboard';
import UserProducts from './pages/Products';
import UserProductDetail from './pages/ProductDetail';
import UserCart from './pages/Cart';
import UserCheckout from './pages/Checkout';
import UserOrders from './pages/Orders';
import UserOrderDetail from './pages/OrderDetail';
import UserProfile from './pages/Profile';

// Admin Pages
import AdminDashboard from './pages/admin/Dashboard';
import AdminProducts from './pages/admin/Products';
import AdminProductCreate from './pages/admin/ProductCreate';
import AdminProductEdit from './pages/admin/ProductEdit';
import AdminCategories from './pages/admin/Categories';
import AdminOrders from './pages/admin/Orders';
import AdminOrderDetail from './pages/admin/OrderDetail';
import AdminProfile from './pages/admin/Profile';

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <ErrorBoundary>
            <Routes>
            {/* Public Auth Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* User Customer Routes */}
            <Route path="/" element={<UserLayout />}>
              <Route index element={<Home />} />
              <Route path="products" element={<UserProducts />} />
              <Route path="products/:id" element={<UserProductDetail />} />
              <Route path="cart" element={<UserCart />} />
              <Route path="checkout" element={<UserCheckout />} />
              <Route path="orders" element={<UserOrders />} />
              <Route path="orders/:id" element={<UserOrderDetail />} />
              <Route path="profile" element={<UserProfile />} />

              {/* Backward compatibility redirects */}
              <Route path="user/dashboard" element={<Navigate to="/" replace />} />
              <Route path="user" element={<Navigate to="/" replace />} />
              <Route path="user/products" element={<Navigate to="/products" replace />} />
              <Route path="user/products/:id" element={<Navigate to="/products/:id" replace />} />
              <Route path="user/cart" element={<Navigate to="/cart" replace />} />
              <Route path="user/checkout" element={<Navigate to="/checkout" replace />} />
              <Route path="user/orders" element={<Navigate to="/orders" replace />} />
              <Route path="user/orders/:id" element={<Navigate to="/orders/:id" replace />} />
              <Route path="user/profile" element={<Navigate to="/profile" replace />} />
            </Route>

            {/* Direct convenience aliases for user routes */}
            <Route path="/produk" element={<Navigate to="/products" replace />} />
            <Route path="/keranjang" element={<Navigate to="/cart" replace />} />
            <Route path="/pesanan" element={<Navigate to="/orders" replace />} />

            {/* Admin Routes */}
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<Navigate to="/admin/dashboard" replace />} />
              <Route path="dashboard" element={<AdminDashboard />} />
              <Route path="products" element={<AdminProducts />} />
              <Route path="products/create" element={<AdminProductCreate />} />
              <Route path="products/edit/:id" element={<AdminProductEdit />} />
              <Route path="categories" element={<AdminCategories />} />
              <Route path="orders" element={<AdminOrders />} />
              <Route path="orders/:id" element={<AdminOrderDetail />} />
              <Route path="profile" element={<AdminProfile />} />
            </Route>

            {/* Fallback Redirect */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
          </ErrorBoundary>
        </Router>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
