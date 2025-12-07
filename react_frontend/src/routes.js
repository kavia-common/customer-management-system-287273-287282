import React from 'react';
import { Routes, Route } from 'react-router-dom';
import './App.css';
import CustomerListPage from './pages/CustomerListPage';
import CustomerDetailPage from './pages/CustomerDetailPage';

// PUBLIC_INTERFACE
/**
 * Provides the route configuration for the application.
 * - "/" -> CustomerListPage
 * - "/customers/:id" -> CustomerDetailPage
 */
export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<CustomerListPage />} />
      <Route path="/customers/:id" element={<CustomerDetailPage />} />
    </Routes>
  );
}
