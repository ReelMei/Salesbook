import { useState, useEffect } from "react";
import { getBrands, addBrand, updateBrand, deleteBrand, getProducts } from "../store";

const EMPTY = { name: "", country: "", contact: "", notes: "" };

export default function Brand() {
  const [brands,   setBrands]   = useState([]);
  const [products, setProducts] = useState([]);
  const [modal,    setModal]    = useState(false);
  const [form,     setForm]     = useState(EMPTY);
  const [error,    setError]    = useState("");

  const reload = () => { setBrands(getBrands()); setProducts(getProducts()); };
  useEffect(reload, []);

  const openAdd  = () => { setForm(EMPTY);    setError(""); setModal("add"); };
  const openEdit = (b) => { setForm({ ...b }); setError(""); setModal(b);   };

  const onChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const onSubmit = () => {
    if (!form.name.trim()) { setError("Brand name is required."); return; }
    if (modal === "add") addBrand(form);
    else                  updateBrand(modal.id, form);
    reload(); setModal(false);
  };

  const onDelete = (id) => {
    const linked = products.filter(p => p.brandId === id).length;
    if (linked > 0 && !confirm(`This brand has ${linked} product(s). Delete anyway?`)) return;
    deleteBrand(id); reload();
  };

  const productCount = (id) => products.filter(p => p.brandId === id).length;

  return (
    <div>
      <div className="page-header">
        <h1>Brands</h1>
        <p>Manage your suppliers and brands</p>
      </div>

      <div className="flex-between">
        <span className="text-muted" style={{ fontSize: 13 }}>{brands.length} brand{brands.length !== 1 ? "s" : ""}</span>
        <button className="btn btn-primary" onClick={openAdd}>+ Add Brand</button>
      </div>

      {brands.length === 0 ? (
        <div className="card">
          <div className="empty"><div className="empty-icon">◈</div>No brands yet. Add your first supplier.</div>
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 16 }}>
          {brands.map(b => (
            <div className="card" key={b.id} style={{ padding: "18px 20px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
                <div>
                  <div style={{ fontWeight: 600, fontSize: 15 }}>{b.name}</div>
                  {b.country && <div className="text-muted" style={{ fontSize: 12, marginTop: 2 }}>📍 {b.country}</div>}
                </div>
                <span className="badge badge-default">{productCount(b.id)} product{productCount(b.id) !== 1 ? "s" : ""}</span>
              </div>
              {b.contact && (
                <div style={{ fontSize: 12, color: "var(--muted)", marginBottom: 4 }}>
                  ✉ {b.contact}
                </div>
              )}
              {b.notes && (
                <div style={{ fontSize: 12, color: "var(--muted)", marginTop: 4, fontStyle: "italic" }}>
                  {b.notes}
                </div>
              )}
              <div style={{ display: "flex", gap: 8, marginTop: 14 }}>
                <button className="btn btn-outline" style={{ flex: 1, justifyContent: "center", padding: "6px" }} onClick={() => openEdit(b)}>Edit</button>
                <button className="btn btn-danger"  style={{ padding: "6px 14px" }} onClick={() => onDelete(b.id)}>Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── Modal ── */}
      {modal && (
        <div className="modal-overlay" onClick={e => e.target === e.currentTarget && setModal(false)}>
          <div className="modal">
            <div className="modal-header">
              <h2>{modal === "add" ? "Add Brand" : "Edit Brand"}</h2>
              <button className="modal-close" onClick={() => setModal(false)}>×</button>
            </div>
            <div className="form-grid">
              <div className="form-group full">
                <label>Brand Name *</label>
                <input name="name" value={form.name} onChange={onChange} placeholder="e.g. Swarovski" />
              </div>
              <div className="form-group full">
                <label>Notes</label>
                <textarea name="notes" value={form.notes} onChange={onChange} placeholder="Any notes about this supplier…" />
              </div>
            </div>
            {error && <p style={{ color: "var(--danger)", fontSize: 12, marginTop: 12 }}>{error}</p>}
            <div className="btn-row">
              <button className="btn btn-primary" onClick={onSubmit}>{modal === "add" ? "Add Brand" : "Save Changes"}</button>
              <button className="btn btn-outline" onClick={() => setModal(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}