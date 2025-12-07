import React from 'react';
import { Routes, Route, Link, useParams } from 'react-router-dom';
import './App.css';

// Simple placeholder for Customer List Page following Ocean Professional vibe
function CustomerListPage() {
  return (
    <div className="App">
      <header className="App-header" style={{ gap: 16 }}>
        <h1 style={{ margin: 0 }}>Customers</h1>
        <p className="App-link" style={{ marginTop: 0 }}>
          Sample list page. Click a detail link below.
        </p>
        <nav style={{ display: 'flex', gap: 12 }}>
          <Link className="App-link" to="/">Home</Link>
          <Link className="App-link" to="/customers/1">Customer #1</Link>
          <Link className="App-link" to="/customers/42">Customer #42</Link>
        </nav>
      </header>
    </div>
  );
}

// Simple placeholder for Customer Detail Page
function CustomerDetailPage() {
  const { id } = useParams();
  return (
    <div className="App">
      <header className="App-header" style={{ gap: 16 }}>
        <h1 style={{ margin: 0 }}>Customer Detail</h1>
        <p className="App-link" style={{ marginTop: 0 }}>
          Viewing customer with id: <strong>{id}</strong>
        </p>
        <nav style={{ display: 'flex', gap: 12 }}>
          <Link className="App-link" to="/">← Back to List</Link>
        </nav>
      </header>
    </div>
  );
}

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
