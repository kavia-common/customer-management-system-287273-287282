import React from 'react';
import { Routes, Route } from 'react-router-dom';
import './App.css';
import CustomerListPage from './pages/CustomerListPage';

// PUBLIC_INTERFACE
/**
 * Provides the route configuration for the application.
 * - "/" -> CustomerListPage
 */
export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<CustomerListPage />} />
    </Routes>
  );
}
