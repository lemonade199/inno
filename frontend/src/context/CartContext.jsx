import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const { user, requireAuth } = useAuth();

  const [cart, setCart] = useState(() => {
    const token = localStorage.getItem('berkah_token');
    if (!token) return [];
    const saved = localStorage.getItem('berkah_cart');
    return saved ? JSON.parse(saved) : [];
  });

  const [checkoutPayload, setCheckoutPayload] = useState([]);

  // Sync cart when user authentication changes
  useEffect(() => {
    if (user) {
      const userCartKey = `berkah_cart_${user.id}`;
      const savedUserCart = localStorage.getItem(userCartKey) || localStorage.getItem('berkah_cart');
      if (savedUserCart) {
        try {
          setCart(JSON.parse(savedUserCart));
        } catch (e) {
          setCart([]);
        }
      }
    } else {
      setCart([]);
    }
  }, [user]);

  // Persist cart changes for logged-in user
  useEffect(() => {
    if (user) {
      const userCartKey = `berkah_cart_${user.id}`;
      localStorage.setItem(userCartKey, JSON.stringify(cart));
      localStorage.setItem('berkah_cart', JSON.stringify(cart));
    }
  }, [cart, user]);

  const addToCart = (product, quantity = 1) => {
    if (!user) {
      if (requireAuth) {
        requireAuth(null, 'Silakan login terlebih dahulu untuk menambahkan produk ke keranjang belanja.');
      }
      return false;
    }

    setCart((prevCart) => {
      const existingIndex = prevCart.findIndex((item) => item.product.id === product.id);
      if (existingIndex > -1) {
        const newCart = [...prevCart];
        newCart[existingIndex].qty += quantity;
        return newCart;
      }
      return [...prevCart, { product, qty: quantity }];
    });
    return true;
  };

  const removeFromCart = (productId) => {
    if (!user) return;
    setCart((prevCart) => prevCart.filter((item) => item.product.id !== productId));
  };

  const updateQuantity = (productId, qty) => {
    if (!user) return;
    if (qty <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.product.id === productId ? { ...item, qty } : item
      )
    );
  };

  const clearCart = () => {
    setCart([]);
    if (user) {
      localStorage.removeItem(`berkah_cart_${user.id}`);
      localStorage.removeItem('berkah_cart');
    }
  };

  const getCartTotal = (items = cart) => {
    if (!user && items === cart) return 0;
    return (items || []).reduce((total, item) => total + item.product.price * item.qty, 0);
  };

  const getCartCount = () => {
    if (!user) return 0;
    return cart.reduce((count, item) => count + item.qty, 0);
  };

  // Set items for direct checkout (Buy Now or Cart Selection)
  const setCheckoutItems = (items) => {
    setCheckoutPayload(items);
  };

  // Finish checkout: remove purchased items from main cart and clear checkout payload
  const commitCheckout = () => {
    if (checkoutPayload && checkoutPayload.length > 0) {
      const purchasedIds = checkoutPayload.map(item => item.product.id);
      setCart(prev => prev.filter(item => !purchasedIds.includes(item.product.id)));
    } else {
      clearCart();
    }
    setCheckoutPayload([]);
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        checkoutPayload,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getCartTotal,
        getCartCount,
        setCheckoutItems,
        commitCheckout
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
