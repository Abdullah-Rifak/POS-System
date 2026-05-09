import React from "react";
import {BrowserRouter as Router, Routes,Route,Navigate} from "react-router-dom"
import AdminDashboard from "./pages/Admin/Dashboard";
import AddSalesman from "./pages/Admin/AddSalesman";
import AddItem from "./pages/Admin/AddItem";
import AddSupplier from "./pages/Admin/AddSupplier";
import AddStock from "./pages/salesman/addStock"
import Login from "./pages/login/login"

const ProtectedRoute = ({ children, role: allowedRole }) => {
  const userRole = localStorage.getItem("role");
  if (!userRole) {
    // Not logged in
    return <Navigate to="/login" replace />;
  }
  if (allowedRole && userRole !== allowedRole) {
    // Role mismatch
    return <Navigate to="/login" replace />;
  }
  return children;
};

export default function AppRoutes() {
  return (
    <Router>
      <Routes>
        {/* Login Route */}
        <Route path="/login" element={<Login />} />

        {/* Admin Routes */}
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute role="Admin">
              <AdminDashboard />
            </ProtectedRoute>
          }
        >
          <Route path="items" element={<AddItem />} />
          <Route path="suppliers" element={<AddSupplier />} />
          <Route path="salesmen" element={<AddSalesman />} />
        </Route>

        {/* Salesman Route */}
        <Route
          path="/salesman/stock"
          element={
            <ProtectedRoute role="Salesman">
              <AddStock />
            </ProtectedRoute>
          }
        />

        {/* Redirect unknown routes to login */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}