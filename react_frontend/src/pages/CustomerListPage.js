import React, { useEffect, useMemo, useState } from "react";
import {
  listCustomers,
  createCustomer,
  updateCustomer,
  deleteCustomer,
  getApiBaseUrl,
} from "../api/client";
import CustomerTable from "../components/CustomerTable";
import CustomerFormModal from "../components/CustomerFormModal";
import Navbar from "../components/Navbar";

// PUBLIC_INTERFACE
/**
 * CustomerListPage renders the main customer management interface:
 * - Navbar
 * - Status banner with API base url
 * - Table listing with Edit/Delete
 * - Modal for Create/Edit
 * - Handles loading, empty, and error states
 */
export default function CustomerListPage() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("create"); // 'create' | 'edit'
  const [editing, setEditing] = useState(null);
  const apiBase = useMemo(() => getApiBaseUrl(), []);

  async function refresh() {
    setLoading(true);
    setLoadError(null);
    const { data, error } = await listCustomers();
    if (error) {
      setLoadError(error);
      setCustomers([]);
    } else {
      setCustomers(Array.isArray(data) ? data : (data?.items ?? []));
    }
    setLoading(false);
  }

  useEffect(() => {
    refresh();
  }, []);

  function openCreate() {
    setEditing(null);
    setModalMode("create");
    setModalOpen(true);
  }

  function openEdit(customer) {
    setEditing(customer);
    setModalMode("edit");
    setModalOpen(true);
  }

  function closeModal() {
    setModalOpen(false);
  }

  async function handleSubmit(payload) {
    if (modalMode === "edit" && editing) {
      const { error } = await updateCustomer(editing.id, payload);
      if (error) throw error;
    } else {
      const { error } = await createCustomer(payload);
      if (error) throw error;
    }
    setModalOpen(false);
    await refresh();
  }

  async function handleDelete(customer) {
    const ok = window.confirm(`Delete customer "${customer.name || customer.id}"?`);
    if (!ok) return;
    const { error } = await deleteCustomer(customer.id);
    if (error) {
      alert(`Failed to delete: ${error.message}`);
      return;
    }
    await refresh();
  }

  return (
    <div className="App">
      <Navbar />

      <main className="main">
        <div className="container">
          <div className="card" style={{ marginBottom: 16 }}>
            <div className="card-header">
              <div>
                <h1 className="page-title">Customers</h1>
                <div className="subtitle">Manage your customer records</div>
              </div>
              <div style={{ display: "flex", gap: 10 }}>
                <button className="btn secondary" onClick={openCreate}>
                  New Customer
                </button>
              </div>
            </div>
            <div className="card-content" style={{ paddingTop: 10 }}>
              <div className="badge" title="Resolved API base URL">
                <span style={{ width: 8, height: 8, background: "var(--primary)", borderRadius: 999 }} />
                API: {apiBase}
              </div>
            </div>
          </div>

          {loadError && (
            <div className="alert" role="alert" style={{ marginBottom: 16 }}>
              Could not load customers from API: {loadError.message}
            </div>
          )}

          <CustomerTable
            customers={customers}
            loading={loading}
            error={loadError}
            onEdit={openEdit}
            onDelete={handleDelete}
          />
        </div>
      </main>

      <CustomerFormModal
        open={modalOpen}
        mode={modalMode}
        initialData={editing || undefined}
        onCancel={closeModal}
        onSubmit={handleSubmit}
      />
    </div>
  );
}
