import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';

// Layouts
import UserLayout from './layouts/UserLayout';
import AdminLayout from './layouts/AdminLayout';

// Components
import ProtectedRoute from './components/ProtectedRoute';

// Auth Pages
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';

// User Pages
import UserDashboard from './pages/user/Dashboard';
import UserProducts from './pages/user/Products';
import UserProductDetail from './pages/user/ProductDetail';
import UserCart from './pages/user/Cart';
import UserCheckout from './pages/user/Checkout';
import UserOrders from './pages/user/Orders';
import UserOrderDetail from './pages/user/OrderDetail';
import UserProfile from './pages/user/Profile';

// Admin Pages
import AdminDashboard from './pages/admin/Dashboard';
import AdminProducts from './pages/admin/Products';
import AdminProductCreate from './pages/admin/ProductCreate';
import AdminProductEdit from './pages/admin/ProductEdit';
import AdminCategories from './pages/admin/Categories';
import AdminOrders from './pages/admin/Orders';
import AdminOrderDetail from './pages/admin/OrderDetail';
import AdminUsers from './pages/admin/Users';
import AdminProfile from './pages/admin/Profile';

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <Routes>
            {/* Public Auth Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* User Customer Routes */}
            <Route path="/" element={<Navigate to="/user/dashboard" replace />} />
            <Route path="/user" element={<UserLayout />}>
              <Route index element={<Navigate to="/user/dashboard" replace />} />
              <Route path="dashboard" element={<UserDashboard />} />
              <Route path="products" element={<UserProducts />} />
              <Route path="products/:id" element={<UserProductDetail />} />
              <Route path="cart" element={<UserCart />} />
              <Route path="checkout" element={<UserCheckout />} />
              <Route path="orders" element={<UserOrders />} />
              <Route path="orders/:id" element={<UserOrderDetail />} />
              <Route path="profile" element={<UserProfile />} />
            </Route>

            {/* Direct convenience aliases for user routes */}
            <Route path="/produk" element={<Navigate to="/user/products" replace />} />
            <Route path="/keranjang" element={<Navigate to="/user/cart" replace />} />
            <Route path="/pesanan" element={<Navigate to="/user/orders" replace />} />

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
              <Route path="users" element={<AdminUsers />} />
              <Route path="profile" element={<AdminProfile />} />
            </Route>

            {/* Fallback Redirect */}
            <Route path="*" element={<Navigate to="/user/dashboard" replace />} />
          </Routes>
        </Router>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
