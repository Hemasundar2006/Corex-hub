'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

const CART_STORAGE_KEY = 'corex_cart_items';
const CUSTOMER_STORAGE_KEY = 'corex_customer_details';

export function CartProvider({ children }) {
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [customerDetails, setCustomerDetails] = useState({
    fullName: '',
    phone: '',
    address: '',
    city: '',
    pincode: '',
    notes: '',
  });
  const [isInitialized, setIsInitialized] = useState(false);

  // Load cart and customer details from localStorage
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem(CART_STORAGE_KEY);
      if (savedCart) {
        setCart(JSON.parse(savedCart));
      }

      const savedCustomer = localStorage.getItem(CUSTOMER_STORAGE_KEY);
      if (savedCustomer) {
        setCustomerDetails(JSON.parse(savedCustomer));
      }
    } catch (err) {
      console.warn('Could not read cart from localStorage:', err);
    } finally {
      setIsInitialized(true);
    }
  }, []);

  // Save cart to localStorage whenever it updates
  useEffect(() => {
    if (!isInitialized) return;
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
    } catch (err) {
      console.warn('Could not save cart to localStorage:', err);
    }
  }, [cart, isInitialized]);

  // Save customer details to localStorage
  useEffect(() => {
    if (!isInitialized) return;
    try {
      localStorage.setItem(CUSTOMER_STORAGE_KEY, JSON.stringify(customerDetails));
    } catch (err) {
      console.warn('Could not save customer details to localStorage:', err);
    }
  }, [customerDetails, isInitialized]);

  const addToCart = (product, quantity = 1, isCombo = false) => {
    const id = product._id || product.id;
    if (!id) return;

    setCart((prevCart) => {
      const existingIdx = prevCart.findIndex((item) => item.id === id);

      if (existingIdx > -1) {
        const updated = [...prevCart];
        updated[existingIdx] = {
          ...updated[existingIdx],
          quantity: updated[existingIdx].quantity + quantity,
        };
        return updated;
      }

      const fallbackImage = 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&auto=format&fit=crop&q=80';
      const newItem = {
        id,
        name: product.name || product.title,
        price: product.price,
        imageUrl: product.imageUrl || fallbackImage,
        category: product.category?.name || (isCombo ? 'Combo Deal' : 'Components'),
        quantity: Math.max(1, quantity),
        isCombo,
      };

      return [...prevCart, newItem];
    });
  };

  const updateQuantity = (id, quantity) => {
    if (quantity <= 0) {
      removeFromCart(id);
      return;
    }

    setCart((prevCart) =>
      prevCart.map((item) =>
        item.id === id ? { ...item, quantity } : item
      )
    );
  };

  const removeFromCart = (id) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== id));
  };

  const clearCart = () => {
    setCart([]);
  };

  const updateCustomerDetails = (fields) => {
    setCustomerDetails((prev) => ({
      ...prev,
      ...fields,
    }));
  };

  const totalItemsCount = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);
  const subtotal = cart.reduce((sum, item) => sum + item.price * (item.quantity || 1), 0);

  const openCart = () => setIsCartOpen(true);
  const closeCart = () => setIsCartOpen(false);

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        totalItemsCount,
        subtotal,
        isCartOpen,
        setIsCartOpen,
        openCart,
        closeCart,
        customerDetails,
        updateCustomerDetails,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
