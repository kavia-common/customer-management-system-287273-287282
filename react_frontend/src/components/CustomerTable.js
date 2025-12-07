import React from "react";

// PUBLIC_INTERFACE
/**
 * CustomerTable renders a table of customers with actions.
 * Props:
 * - customers: array of { id, name, email, phone }
 * - onEdit: (customer) => void
 * - onDelete: (customer) => void
 * - loading: boolean
 * - error: Error | null
 */
export default function CustomerTable({ customers, onEdit, onDelete, loading, error }) {
  if (loading) {
    return (
      <div className="empty" role="status" aria-live="polite">
        <div className="spinner" style={{ margin: "0 auto 10px" }} />
        <div className="helper">Loading customers…</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert" role="alert">
        Failed to load customers: {error.message}
      </div>
    );
  }

  if (!customers || customers.length === 0) {
    return (
      <div className="empty">
        <div style={{ fontWeight: 600, marginBottom: 6 }}>No customers found</div>
        <div className="helper">Use the “New Customer” button to add your first one.</div>
      </div>
    );
  }

  return (
    <div className="card">
      <div className="card-content" style={{ paddingTop: 0 }}>
        <table className="table" aria-label="Customers table">
          <thead>
            <tr>
              <th style={{ width: 64 }}>ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th style={{ width: 160, textAlign: "right" }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {customers.map((c) => (
              <tr key={c.id}>
                <td>#{c.id}</td>
                <td>{c.name || "-"}</td>
                <td>{c.email || "-"}</td>
                <td>{c.phone || "-"}</td>
                <td>
                  <div className="row-actions" style={{ justifyContent: "flex-end" }}>
                    <button className="btn ghost" onClick={() => onEdit(c)} aria-label={`Edit ${c.name || c.id}`}>
                      Edit
                    </button>
                    <button
                      className="btn danger"
                      onClick={() => onDelete(c)}
                      aria-label={`Delete ${c.name || c.id}`}
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
