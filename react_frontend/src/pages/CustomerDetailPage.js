import React, { useEffect, useMemo, useState, useCallback } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import CustomerFormModal from "../components/CustomerFormModal";
import { getCustomer, updateCustomer, getApiBaseUrl } from "../api/client";

// PUBLIC_INTERFACE
/**
 * CustomerDetailPage displays details of a single customer and allows editing via modal.
 * Route: /customers/:id
 * - Fetches customer by id
 * - Shows loading and error states
 * - Provides Back to list navigation
 * - Edit button opens CustomerFormModal and updates via API
 */
export default function CustomerDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const apiBase = useMemo(() => getApiBaseUrl(), []);
  const [customer, setCustomer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(null);

  const [modalOpen, setModalOpen] = useState(false);

  const refresh = useCallback(async () => {
    setLoading(true);
    setLoadError(null);
    const { data, error } = await getCustomer(id);
    if (error) {
      setLoadError(error);
      setCustomer(null);
    } else {
      setCustomer(data || null);
    }
    setLoading(false);
  }, [id]);

  useEffect(() => {
    if (!id) return;
    refresh();
  }, [id, refresh]);

  function openEdit() {
    setModalOpen(true);
  }

  function closeModal() {
    setModalOpen(false);
  }

  async function handleSubmit(payload) {
    if (!customer) return;
    const { error } = await updateCustomer(customer.id, payload);
    if (error) throw error;
    setModalOpen(false);
    await refresh();
  }

  const title = customer ? (customer.name || `Customer #${customer.id}`) : "Customer";

  return (
    <div className="App">
      <Navbar />

      <main className="main">
        <div className="container">
          <div className="card" style={{ marginBottom: 16 }}>
            <div className="card-header">
              <div>
                <h1 className="page-title">{title}</h1>
                <div className="subtitle">Customer details and actions</div>
              </div>
              <div style={{ display: "flex", gap: 10 }}>
                <Link to="/" className="btn ghost" aria-label="Back to customers list">
                  ← Back to list
                </Link>
                {customer && (
                  <button className="btn secondary" onClick={openEdit} aria-label="Edit customer">
                    Edit
                  </button>
                )}
              </div>
            </div>
            <div className="card-content" style={{ paddingTop: 10 }}>
              <div className="badge" title="Resolved API base URL">
                <span style={{ width: 8, height: 8, background: "var(--primary)", borderRadius: 999 }} />
                API: {apiBase}
              </div>
            </div>
          </div>

          {loading && (
            <div className="card">
              <div className="card-content">
                <div className="empty" role="status" aria-live="polite">
                  <div className="spinner" style={{ margin: "0 auto 10px" }} />
                  <div className="helper">Loading customer…</div>
                </div>
              </div>
            </div>
          )}

          {loadError && !loading && (
            <div className="alert" role="alert" style={{ marginBottom: 16 }}>
              Could not load customer: {loadError.message}
            </div>
          )}

          {!loading && !loadError && !customer && (
            <div className="card">
              <div className="card-content">
                <div className="empty">
                  <div style={{ fontWeight: 600, marginBottom: 6 }}>Customer not found</div>
                  <div className="helper">The requested customer does not exist.</div>
                </div>
              </div>
            </div>
          )}

          {!loading && !loadError && customer && (
            <div className="card">
              <div className="card-content">
                <div className="form-row" style={{ marginBottom: 18 }}>
                  <span className="label">ID</span>
                  <div className="badge">#{customer.id}</div>
                </div>

                <div className="form-row">
                  <span className="label">Name</span>
                  <div>{customer.name || "-"}</div>
                </div>

                <div className="form-row">
                  <span className="label">Email</span>
                  <div>{customer.email || "-"}</div>
                </div>

                <div className="form-row" style={{ marginBottom: 0 }}>
                  <span className="label">Phone</span>
                  <div>{customer.phone || "-"}</div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      <CustomerFormModal
        open={modalOpen}
        mode="edit"
        initialData={customer || undefined}
        onCancel={closeModal}
        onSubmit={handleSubmit}
      />
    </div>
  );
}
