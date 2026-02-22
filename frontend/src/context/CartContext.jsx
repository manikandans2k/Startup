// ========================================
// CART CONTEXT
// src/context/CartContext.jsx
// ========================================

import React, { createContext, useState, useContext, useEffect } from "react";
import { cartService } from "../services/api";
import { useAuth } from "./AuthContext";
import { toast } from "react-toastify";

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within CartProvider");
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    if (user && user.role === "user") {
      loadCart();
    } else {
      setCartItems([]);
    }
  }, [user]);

  const loadCart = async () => {
    try {
      setLoading(true);
      const response = await cartService.getCart();
      setCartItems(response.items || []);
    } catch (error) {
      console.error("Failed to load cart:", error);
    } finally {
      setLoading(false);
    }
  };

  const addToCart = async (productId, quantity = 1) => {
    if (!user) {
      toast.error("Please login to add items to cart");
      return;
    }

    if (user.role !== "user") {
      toast.error("Only users can add items to cart");
      return;
    }

    try {
      await cartService.addToCart(productId, quantity);
      await loadCart();
      toast.success("Added to cart!");
    } catch (error) {
      const message = error.response?.data?.message || "Failed to add to cart";
      toast.error(message);
    }
  };

  const updateQuantity = async (cartItemId, quantity) => {
    if (quantity < 1) {
      return removeFromCart(cartItemId);
    }

    try {
      await cartService.updateCartItem(cartItemId, quantity);
      await loadCart();
    } catch (error) {
      const message = error.response?.data?.message || "Failed to update cart";
      toast.error(message);
    }
  };

  const removeFromCart = async (cartItemId) => {
    try {
      await cartService.removeFromCart(cartItemId);
      await loadCart();
      toast.info("Item removed from cart");
    } catch (error) {
      const message = error.response?.data?.message || "Failed to remove item";
      toast.error(message);
    }
  };

  const clearCart = async () => {
    try {
      await cartService.clearCart();
      setCartItems([]);
      toast.info("Cart cleared");
    } catch (error) {
      const message = error.response?.data?.message || "Failed to clear cart";
      toast.error(message);
    }
  };

  const getCartCount = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  const getCartTotal = () => {
    return cartItems.reduce((total, item) => {
      return total + parseFloat(item.price) * item.quantity;
    }, 0);
  };

  const value = {
    cartItems,
    loading,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    loadCart,
    getCartCount,
    getCartTotal,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export default CartContext;
