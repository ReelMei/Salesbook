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
    <div>
      <div className="page-header">
        <h1>Products</h1>
        <p>Manage your inventory items</p>
      </div>

      <div className="flex-between">
        <input
          type="text" placeholder="Search by name, SKU or category…" className="text-black"
          value={search} onChange={e => setSearch(e.target.value)}
          style={{ padding: "8px 14px", borderRadius: 8,  border: "1px solid var(--border)", fontSize: 13, width: 280, fontFamily: "inherit" }}
        />
        <button className="btn btn-primary" onClick={openAdd}>+ Add Product</button>
      </div>

      <div className="card" style={{ padding: 0 }}>
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

      {/* ── Modal ── */}
      {modal && (
        <div className="modal-overlay" onClick={e => e.target === e.currentTarget && setModal(false)}>
          <div className="modal">
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

            <div className="btn-row">
              <button className="btn btn-primary" onClick={onSubmit}>{modal === "add" ? "Add Product" : "Save Changes"}</button>
              <button className="btn btn-outline" onClick={() => setModal(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}