import { useState, useEffect } from "react";
import { getProducts, getBrands, addProduct, updateProduct, deleteProduct } from "../store";

const CATEGORIES = [
  "Beads", "Crochet", "Threads & Strings",
  "Yarn", "Finished Crochet", "Finished Jewellery", "Other"
];

const EMPTY_FORM = {
  name: "", sku: "", brandId: "", category: "",
  costPrice: "", salePrice: "", stock: "", lowStockThreshold: "10",
};

function fmt(n) { return "₦" + Number(n).toFixed(2); }

export default function AddItems() {
  const [products, setProducts] = useState([]);
  const [brands,   setBrands]   = useState([]);
  const [modal,    setModal]    = useState(false);
  const [form,     setForm]     = useState(EMPTY_FORM);
  const [search,   setSearch]   = useState("");
  const [error,    setError]    = useState("");

  const reload = () => { setProducts(getProducts()); setBrands(getBrands()); };
  useEffect(reload, []);

  const openAdd  = () => { setForm(EMPTY_FORM); setError(""); setModal("add"); };
  const openEdit = (p) => {
    setForm({ ...p, costPrice: p.costPrice, salePrice: p.salePrice, stock: p.stock, lowStockThreshold: p.lowStockThreshold });
    setError(""); setModal(p);
  };

  const onChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const onSubmit = () => {
    const { name, sku, category, costPrice, salePrice, stock } = form;
    if (!name || !sku || !category || costPrice === "" || salePrice === "" || stock === "") {
      setError("Please fill in all required fields."); return;
    }
    const payload = {
      ...form,
      costPrice:         parseFloat(form.costPrice),
      salePrice:         parseFloat(form.salePrice),
      stock:             parseInt(form.stock),
      lowStockThreshold: parseInt(form.lowStockThreshold) || 10,
    };
    if (modal === "add") addProduct(payload);
    else                  updateProduct(modal.id, payload);
    reload(); setModal(false);
  };

  const onDelete = (id) => {
    if (!confirm("Delete this product?")) return;
    deleteProduct(id); reload();
  };

  const filtered = products.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.sku.toLowerCase().includes(search.toLowerCase()) ||
    p.category.toLowerCase().includes(search.toLowerCase())
  );

  const brandName = (id) => brands.find(b => b.id === id)?.name || "—";

  const stockBadge = (p) => {
    if (p.stock === 0)                     return <span className="badge badge-danger">Out of stock</span>;
    if (p.stock <= p.lowStockThreshold)    return <span className="badge badge-warn">{p.stock} left</span>;
    return <span className="badge badge-default">{p.stock}</span>;
  };

  return (
    <div className="px-3 sm:px-0">
      <div className="page-header">
        <h1>Products</h1>
        <p>Manage your inventory items</p>
      </div>

      {/* Search + Add button — stack on mobile */}
      <div className="flex-between flex-wrap gap-3 mb-4">
        <input
          type="text" placeholder="Search by name, SKU or category…" className="text-black"
          value={search} onChange={e => setSearch(e.target.value)}
          style={{ padding: "8px 14px", borderRadius: 8, border: "1px solid var(--border)", fontSize: 13, width: "100%", maxWidth: 280, fontFamily: "inherit" }}
        />
        <button className="btn btn-primary w-full sm:w-auto" onClick={openAdd}>+ Add Product</button>
      </div>

      {/* ── Desktop table (hidden on mobile) ── */}
      <div className="card hidden sm:block" style={{ padding: 0 }}>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>SKU</th>
                <th>Category</th>
                <th>Brand</th>
                <th>Cost</th>
                <th>Price</th>
                <th>Stock</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 && (
                <tr><td colSpan={8} style={{ textAlign: "center", padding: 40, color: "var(--muted)" }}>No products found</td></tr>
              )}
              {filtered.map(p => (
                <tr key={p.id}>
                  <td style={{ fontWeight: 500 }}>{p.name}</td>
                  <td className="mono">{p.sku}</td>
                  <td className="text-muted">{p.category}</td>
                  <td className="text-muted">{brandName(p.brandId)}</td>
                  <td>{fmt(p.costPrice)}</td>
                  <td style={{ fontWeight: 500 }}>{fmt(p.salePrice)}</td>
                  <td>{stockBadge(p)}</td>
                  <td>
                    <div style={{ display: "flex", gap: 8 }}>
                      <button className="btn btn-outline" style={{ padding: "5px 12px" }} onClick={() => openEdit(p)}>Edit</button>
                      <button className="btn btn-danger"  style={{ padding: "5px 12px" }} onClick={() => onDelete(p.id)}>Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Mobile card list (visible only on mobile) ── */}
      <div className="flex flex-col gap-3 sm:hidden">
        {filtered.length === 0 && (
          <div className="card" style={{ textAlign: "center", padding: 40, color: "var(--muted)" }}>No products found</div>
        )}
        {filtered.map(p => (
          <div className="card" key={p.id} style={{ padding: "14px 16px" }}>
            {/* Top row: name + stock badge */}
            <div className="flex items-start justify-between gap-2 mb-2">
              <div>
                <div style={{ fontWeight: 600, fontSize: 14 }}>{p.name}</div>
                <div className="mono text-muted" style={{ fontSize: 12, marginTop: 2 }}>{p.sku}</div>
              </div>
              <div className="shrink-0">{stockBadge(p)}</div>
            </div>

            {/* Meta row */}
            <div className="flex flex-wrap gap-x-4 gap-y-1 mb-3" style={{ fontSize: 12, color: "var(--muted)" }}>
              <span>{p.category}</span>
              {brandName(p.brandId) !== "—" && <span>{brandName(p.brandId)}</span>}
            </div>

            {/* Price row */}
            <div className="flex gap-4 mb-3" style={{ fontSize: 13 }}>
              <div>
                <div style={{ fontSize: 11, color: "var(--muted)", marginBottom: 1 }}>Cost</div>
                <div>{fmt(p.costPrice)}</div>
              </div>
              <div>
                <div style={{ fontSize: 11, color: "var(--muted)", marginBottom: 1 }}>Price</div>
                <div style={{ fontWeight: 600 }}>{fmt(p.salePrice)}</div>
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex gap-2">
              <button className="btn btn-outline flex-1 justify-center" style={{ padding: "6px 12px" }} onClick={() => openEdit(p)}>Edit</button>
              <button className="btn btn-danger flex-1 justify-center"  style={{ padding: "6px 12px" }} onClick={() => onDelete(p.id)}>Delete</button>
            </div>
          </div>
        ))}
      </div>

      {/* ── Modal ── */}
      {modal && (
        <div className="modal-overlay" onClick={e => e.target === e.currentTarget && setModal(false)}>
          <div className="modal" style={{ width: "min(95vw, 560px)", maxHeight: "90dvh", overflowY: "auto" }}>
            <div className="modal-header">
              <h2>{modal === "add" ? "Add Product" : "Edit Product"}</h2>
              <button className="modal-close" onClick={() => setModal(false)}>×</button>
            </div>

            <div className="form-grid">
              <div className="form-group full">
                <label>Product Name *</label>
                <input name="name" value={form.name} onChange={onChange} placeholder="e.g. Swarovski Crystal Beads 6mm" />
              </div>
              <div className="form-group">
                <label>SKU *</label>
                <input name="sku" value={form.sku} onChange={onChange} placeholder="e.g. SCB-006" />
              </div>
              <div className="form-group">
                <label>Category *</label>
                <select name="category" value={form.category} onChange={onChange}>
                  <option value="">Select category</option>
                  {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label>Brand</label>
                <select name="brandId" value={form.brandId} onChange={onChange}>
                  <option value="">No brand</option>
                  {brands.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label>Cost Price (₦) *</label>
                <input name="costPrice" type="number" min="0" step="0.01" value={form.costPrice} onChange={onChange} placeholder="0.00" />
              </div>
              <div className="form-group">
                <label>Sale Price (₦) *</label>
                <input name="salePrice" type="number" min="0" step="0.01" value={form.salePrice} onChange={onChange} placeholder="0.00" />
              </div>
              <div className="form-group">
                <label>Current Stock *</label>
                <input name="stock" type="number" min="0" step="1" value={form.stock} onChange={onChange} placeholder="0" />
              </div>
              <div className="form-group">
                <label>Low Stock Alert At</label>
                <input name="lowStockThreshold" type="number" min="1" step="1" value={form.lowStockThreshold} onChange={onChange} placeholder="10" />
              </div>
            </div>

            {error && <p style={{ color: "var(--danger)", fontSize: 12, marginTop: 12 }}>{error}</p>}

            <div className="btn-row flex-wrap gap-2">
              <button className="btn btn-primary flex-1" onClick={onSubmit}>{modal === "add" ? "Add Product" : "Save Changes"}</button>
              <button className="btn btn-outline flex-1" onClick={() => setModal(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}