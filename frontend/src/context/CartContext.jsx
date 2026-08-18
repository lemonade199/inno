import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(() => {
    const saved = localStorage.getItem('berkah_cart');
    return saved ? JSON.parse(saved) : [];
  });

  const [checkoutPayload, setCheckoutPayload] = useState([]);

  useEffect(() => {
    localStorage.setItem('berkah_cart', JSON.stringify(cart));
  }, [cart]);

  const addToCart = (product, quantity = 1) => {
    setCart((prevCart) => {
      const existingIndex = prevCart.findIndex((item) => item.product.id === product.id);
      if (existingIndex > -1) {
        const newCart = [...prevCart];
        newCart[existingIndex].qty += quantity;
        return newCart;
      }
      return [...prevCart, { product, qty: quantity }];
    });
  };

  const removeFromCart = (productId) => {
    setCart((prevCart) => prevCart.filter((item) => item.product.id !== productId));
  };

  const updateQuantity = (productId, qty) => {
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
  };

  const getCartTotal = (items = cart) => {
    return items.reduce((total, item) => total + item.product.price * item.qty, 0);
  };

  const getCartCount = () => {
    return cart.reduce((count, item) => count + item.qty, 0);
  };

  // Set items for direct checkout (Buy Now or Cart Selection)
  const setCheckoutItems = (items) => {
    setCheckoutPayload(items);
  };

  // Finish checkout: remove purchased items from main cart and clear checkout payload
  const commitCheckout = () => {
    const purchasedIds = checkoutPayload.map(item => item.product.id);
    setCart(prev => prev.filter(item => !purchasedIds.includes(item.product.id)));
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
