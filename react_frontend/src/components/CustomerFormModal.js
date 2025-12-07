import React, { useEffect, useState } from "react";

// PUBLIC_INTERFACE
/**
 * CustomerFormModal provides a modal dialog for creating or editing a customer.
 * Props:
 * - open: boolean
 * - mode: 'create' | 'edit'
 * - initialData: customer object (optional)
 * - onCancel: () => void
 * - onSubmit: (payload) => Promise<void> | void
 * Displays inline errors, disables while submitting.
 */
export default function CustomerFormModal({ open, mode, initialData, onCancel, onSubmit }) {
  const [form, setForm] = useState({ name: "", email: "", phone: "" });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (open) {
      setError(null);
      setSubmitting(false);
      setForm({
        name: initialData?.name || "",
        email: initialData?.email || "",
        phone: initialData?.phone || "",
      });
    }
  }, [open, initialData]);

  if (!open) return null;

  const title = mode === "edit" ? "Edit Customer" : "New Customer";

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      await onSubmit({
        name: form.name?.trim(),
        email: form.email?.trim(),
        phone: form.phone?.trim(),
      });
    } catch (err) {
      setError(err instanceof Error ? err : new Error(String(err)));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="modal-backdrop" role="dialog" aria-modal="true" aria-label={title}>
      <div className="modal">
        <div className="modal-header">
          <div>
            <h2 className="page-title" style={{ fontSize: 18, margin: 0 }}>{title}</h2>
            <div className="subtitle">Fill out the customer information below.</div>
          </div>
          <button className="btn ghost" onClick={onCancel} aria-label="Close">
            Close
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="modal-content">
            {error && (
              <div className="alert" role="alert" style={{ marginBottom: 12 }}>
                {error.message}
              </div>
            )}
            <div className="form-row">
              <label className="label" htmlFor="name">Name</label>
              <input
                id="name"
                className="input"
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                placeholder="Jane Doe"
                required
              />
            </div>
            <div className="form-row">
              <label className="label" htmlFor="email">Email</label>
              <input
                id="email"
                type="email"
                className="input"
                value={form.email}
                onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                placeholder="jane@example.com"
                required
              />
            </div>
            <div className="form-row" style={{ marginBottom: 0 }}>
              <label className="label" htmlFor="phone">Phone</label>
              <input
                id="phone"
                className="input"
                value={form.phone}
                onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
                placeholder="+1 (555) 000-0000"
              />
            </div>
          </div>
          <div className="modal-actions">
            <button type="button" className="btn ghost" onClick={onCancel}>
              Cancel
            </button>
            <button type="submit" className="btn" disabled={submitting}>
              {submitting ? "Saving…" : mode === "edit" ? "Save Changes" : "Create"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
