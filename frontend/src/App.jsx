import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

// Layout
import DashboardLayout from "./components/layout/DashboardLayout";

// Auth pages
import Login from "./pages/auth/Login";

// Dashboard pages
import Dashboard from "./pages/dashboard/Dashboard";
import Products from "./pages/products/ProductManagement";
import Inventory from "./pages/inventory/Inventory";
import Billing from "./pages/invoices/InvoiceCreate";
import Customers from "./pages/customers/CustomerPage";
import Reports from "./pages/reports/Reports";
import UserManagement from "./pages/users/UserManagement"
import CategoryManagement from "./pages/category/Category";

// Auth guard
import ProtectedRoute from "./components/common/ProtectedRoute";

const App = () => {
  return (
  
      <Routes>
        {/* ---------- AUTH ---------- */}
        <Route path="/login" element={<Login />} />

        {/* ---------- PROTECTED DASHBOARD LAYOUT ---------- */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          {/* Default redirect to dashboard */}
          <Route index element={<Navigate to="dashboard" replace />} />

          {/* Modules */}
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="products" element={<Products />} />
          <Route path="category" element={<CategoryManagement/>} />
          <Route path="inventory" element={<Inventory />} />
          <Route path="billing" element={<Billing />} />
          <Route path="customers" element={<Customers />} />
          <Route path="reports" element={<Reports />} />
          <Route path="users" element={<UserManagement />} /> 
        </Route>

        {/* ---------- FALLBACK ---------- */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
   
  );
};

export default App;
