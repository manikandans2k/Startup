// ========================================
// API SERVICE - Axios Configuration
// src/services/api.js
// ========================================

import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor - Add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// Response interceptor - Handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/";
    }
    return Promise.reject(error);
  },
);

export default api;

// ========================================
// AUTH SERVICE
// ========================================

export const authService = {
  register: async (userData) => {
    const response = await api.post("/auth/register", userData);
    if (response.data.token) {
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));
    }
    return response.data;
  },

  login: async (credentials) => {
    const response = await api.post("/auth/login", credentials);
    if (response.data.token) {
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));
    }
    return response.data;
  },

  logout: () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  },

  getCurrentUser: () => {
    const userStr = localStorage.getItem("user");
    return userStr ? JSON.parse(userStr) : null;
  },

  getProfile: async () => {
    const response = await api.get("/auth/profile");
    return response.data;
  },
};

// ========================================
// PRODUCT SERVICE
// ========================================

export const productService = {
  getAll: async (params = {}) => {
    const response = await api.get("/products", { params });
    return response.data;
  },

  getById: async (id) => {
    const response = await api.get(`/products/${id}`);
    return response.data;
  },

  create: async (productData) => {
    const response = await api.post("/products", productData);
    return response.data;
  },

  update: async (id, productData) => {
    const response = await api.put(`/products/${id}`, productData);
    return response.data;
  },

  delete: async (id) => {
    const response = await api.delete(`/products/${id}`);
    return response.data;
  },
};

// ========================================
// CART SERVICE
// ========================================

export const cartService = {
  getCart: async () => {
    const response = await api.get("/users/cart");
    return response.data;
  },

  addToCart: async (productId, quantity = 1) => {
    const response = await api.post("/users/cart", { productId, quantity });
    return response.data;
  },

  updateCartItem: async (id, quantity) => {
    const response = await api.put(`/users/cart/${id}`, { quantity });
    return response.data;
  },

  removeFromCart: async (id) => {
    const response = await api.delete(`/users/cart/${id}`);
    return response.data;
  },

  clearCart: async () => {
    const response = await api.delete("/users/cart");
    return response.data;
  },
};

// ========================================
// ORDER SERVICE
// ========================================

export const orderService = {
  getOrders: async () => {
    const response = await api.get("/orders");
    return response.data;
  },

  getById: async (id) => {
    const response = await api.get(`/orders/${id}`);
    return response.data;
  },

  createOrder: async () => {
    const response = await api.post("/orders");
    return response.data;
  },

  updateStatus: async (id, status) => {
    const response = await api.put(`/orders/${id}`, { status });
    return response.data;
  },

  getDashboardStats: async () => {
    const response = await api.get("/orders/stats/dashboard");
    return response.data;
  },
};

// ========================================
// USER SERVICE
// ========================================

export const userService = {
  getAll: async () => {
    const response = await api.get("/users");
    return response.data;
  },

  getById: async (id) => {
    const response = await api.get(`/users/${id}`);
    return response.data;
  },

  update: async (id, userData) => {
    const response = await api.put(`/users/${id}`, userData);
    return response.data;
  },

  delete: async (id) => {
    const response = await api.delete(`/users/${id}`);
    return response.data;
  },
};

// ========================================
// WHATSAPP SERVICE
// ========================================

export const whatsappService = {
  generateOrderMessage: (user, cartItems, total) => {
    let message = `🛒 New Order from ${user.name}\n\n`;
    message += `📧 Email: ${user.email}\n`;
    message += `📞 Phone: ${user.phone}\n\n`;
    message += `🛍️ Order Details:\n`;

    cartItems.forEach((item) => {
      message += `\n• ${item.name}\n`;
      message += `  Quantity: ${item.quantity}\n`;
      message += `  Price: ₹${(item.price * item.quantity).toLocaleString("en-IN")}\n`;
    });

    message += `\n💰 Total: ₹${total.toLocaleString("en-IN")}`;
    return message;
  },

  generateProductMessage: (product) => {
    return `Hello! I'm interested in:\n\n🪨 Product: ${product.name}\n💰 Price: ₹${product.price.toLocaleString("en-IN")}\n📏 Specs: ${product.specs}\n\nPlease share more details!`;
  },

  generateContactMessage: (name, phone, interest, message) => {
    return `Hello! I'm ${name}\n\n📞 Phone: ${phone}\n🛍️ Interested in: ${interest}\n\nMessage: ${message}`;
  },

  openWhatsApp: (
    message,
    number = import.meta.env.VITE_WHATSAPP_NUMBER || "919876543210",
  ) => {
    const url = `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
    window.open(url, "_blank");
  },

  shareProduct: (product) => {
    const message = `Check out this amazing stone product!\n\n${product.name}\n₹${product.price.toLocaleString("en-IN")}\n\n${product.description}\n\nOrder now: https://wa.me/${import.meta.env.VITE_WHATSAPP_NUMBER || "919025153037"}`;
    const url = `https://wa.me/?text=${encodeURIComponent(message)}`;
    window.open(url, "_blank");
  },
};
