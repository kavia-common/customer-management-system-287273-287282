import React from "react";
import { NavLink } from "react-router-dom";

// PUBLIC_INTERFACE
/**
 * Responsive top navigation bar styled with Ocean Professional theme.
 * Shows brand, navigation links, and slot for right-side controls if needed.
 */
export default function Navbar() {
  return (
    <div className="navbar">
      <div className="navbar-inner">
        <div className="brand" aria-label="App brand">
          <div className="brand-badge">🌊</div>
          <span>Customer Manager</span>
          <span className="badge" style={{ marginLeft: 8 }}>
            <span style={{ width: 8, height: 8, background: "var(--success)", borderRadius: 999 }} />
            <span>Ocean Professional</span>
          </span>
        </div>

        <nav className="nav-links" aria-label="Primary">
          <NavLink to="/" className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}>
            Customers
          </NavLink>
        </nav>
      </div>
    </div>
  );
}
