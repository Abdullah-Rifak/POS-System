/**
 * API Configuration for Desktop Tauri App
 * Ensures all backend calls use the correct local server endpoint
 */

const API_BASE_URL = process.env.REACT_APP_API_URL || "http://127.0.0.1:5000";

// Centralized API endpoints
export const API_ENDPOINTS = {
  // Auth
  LOGIN: "/auth/login",
  LOGOUT: "/auth/logout",

  // Items
  GET_ITEMS: "/item",
  CREATE_ITEM: "/item/create",
  UPDATE_ITEM: (id) => `/item/update/${id}`,
  DELETE_ITEM: (id) => `/item/delete/${id}`,

  // Stock
  GET_STOCK: "/stock/combined",
  CREATE_STOCK: "/stock/create",
  UPDATE_STOCK: (id) => `/stock/update/${id}`,
  UPDATE_STOCK_ITEM: (id) => `/stock/updateStock/${id}`,
  DELETE_STOCK: (id) => `/stock/delete/${id}`,

  // Returns
  GET_RETURNS: "/return",
  CREATE_RETURN: "/return/create",

  // Suppliers
  GET_SUPPLIERS: "/supplier",
  GET_SUPPLIERS_PAYMENT: "/supplier/get",
  CREATE_SUPPLIER: "/supplier/create",
  UPDATE_SUPPLIER: (id) => `/supplier/update/${id}`,
  DELETE_SUPPLIER: (id) => `/supplier/delete/${id}`,
  TOGGLE_SUPPLIER_PAYMENT: (id) => `/supplier/${id}/toggle`,

  // Borrowals
  GET_BORROWALS: "/borrow",
  CREATE_BORROWAL: "/borrow/create",
  UPDATE_BORROWAL: (id) => `/borrow/update/${id}`,
  DELETE_BORROWAL: (id) => `/borrow/delete/${id}`,
  TOGGLE_BORROWER_PAYMENT: (id) => `/borrow/${id}/toggle`,

  // Additional Expenses
  GET_ADDITIONAL: "/additional",
  DELETE_ADDITIONAL: (id) => `/additional/delete/${id}`,

  // String Hoppers
  GET_HOPPERS: "/hoppers",
  UPDATE_HOPPERS: (id) => `/hoppers/update/${id}`,
  DELETE_HOPPERS: (id) => `/hoppers/delete/${id}`,

  // Salesman
  GET_SALESMAN: "/salesman/",
  CREATE_SALESMAN: "/salesman/create",
  UPDATE_SALESMAN: (id) => `/salesman/update/${id}`,
  DELETE_SALESMAN: (id) => `/salesman/delete/${id}`,

  // Health check
  HEALTH: "/health",
};

/**
 * Build full API URL
 * @param {string} endpoint - API endpoint path
 * @returns {string} - Full API URL
 */
export const getApiUrl = (endpoint) => {
  if (typeof endpoint === "function") {
    throw new Error("Use endpoint(id) syntax for dynamic endpoints");
  }
  return `${API_BASE_URL}${endpoint}`;
};

export default API_BASE_URL;
