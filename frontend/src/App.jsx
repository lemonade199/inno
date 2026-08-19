import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { ToastProvider } from './context/ToastContext';
import { NotificationProvider } from './context/NotificationContext';

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
import UserSearch from './pages/Search';
import UserChat from './pages/Chat';

// Admin Pages
import AdminDashboard from './pages/admin/Dashboard';
import AdminProducts from './pages/admin/Products';
import AdminProductCreate from './pages/admin/ProductCreate';
import AdminProductEdit from './pages/admin/ProductEdit';
import AdminCategories from './pages/admin/Categories';
import AdminOrders from './pages/admin/Orders';
import AdminOrderDetail from './pages/admin/OrderDetail';
import AdminProfile from './pages/admin/Profile';
import AdminChat from './pages/admin/Chat';
import AdminNotifications from './pages/admin/Notifications';

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <ToastProvider>
          <NotificationProvider>
            <Router>
              <ErrorBoundary>
                <Routes>
                  {/* Public Auth Routes */}
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />

                  {/* User Customer Routes */}
                  <Route path="/" element={<UserLayout />}>
                    {/* Public Routes: Browsing products, search, and homepage */}
                    <Route index element={<Home />} />
                    <Route path="products" element={<UserProducts />} />
                    <Route path="products/:id" element={<UserProductDetail />} />
                    <Route path="search" element={<UserSearch />} />

                    {/* Protected Customer Routes */}
                    <Route element={<ProtectedRoute />}>
                      <Route path="cart" element={<UserCart />} />
                      <Route path="checkout" element={<UserCheckout />} />
                      <Route path="orders" element={<UserOrders />} />
                      <Route path="orders/:id" element={<UserOrderDetail />} />
                      <Route path="profile" element={<UserProfile />} />
                      <Route path="chat" element={<UserChat />} />
                    </Route>

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

                  {/* Admin Routes (Admin Only Protected) */}
                  <Route path="/admin" element={<ProtectedRoute adminOnly={true} />}>
                    <Route element={<AdminLayout />}>
                      <Route index element={<Navigate to="/admin/dashboard" replace />} />
                      <Route path="dashboard" element={<AdminDashboard />} />
                      <Route path="chat" element={<AdminChat />} />
                      <Route path="products" element={<AdminProducts />} />
                      <Route path="products/create" element={<AdminProductCreate />} />
                      <Route path="products/edit/:id" element={<AdminProductEdit />} />
                      <Route path="categories" element={<AdminCategories />} />
                      <Route path="orders" element={<AdminOrders />} />
                      <Route path="orders/:id" element={<AdminOrderDetail />} />
                      <Route path="profile" element={<AdminProfile />} />
                      <Route path="notifications" element={<AdminNotifications />} />
                    </Route>
                  </Route>

                  {/* Fallback Redirect */}
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
              </ErrorBoundary>
            </Router>
          </NotificationProvider>
        </ToastProvider>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
