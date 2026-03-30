import { useState, useEffect } from "react";
import { getSales, getProducts, recordSale } from "../store";

function fmt(n) { return "₦" + Number(n).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ","); }

const EMPTY = { productId: "", qty: "1" };

export default function Sales() {
  const [sales,    setSales]    = useState([]);
  const [products, setProducts] = useState([]);
  const [modal,    setModal]    = useState(false);
  const [form,     setForm]     = useState(EMPTY);
  const [error,    setError]    = useState("");
  const [tab,      setTab]      = useState("history");  // "history" | "record"

  const reload = () => { setSales(getSales()); setProducts(getProducts()); };
  useEffect(reload, []);

  const onChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const onSubmit = () => {
    if (!form.productId || !form.qty || parseInt(form.qty) < 1) {
      setError("Please select a product and enter a valid quantity."); return;
    }
    try {
      recordSale({ productId: form.productId, qty: parseInt(form.qty), salePrice: selectedProduct?.salePrice });
      reload(); setForm(EMPTY); setError(""); setTab("history");
    } catch (e) {
      setError(e.message);
    }
  };

  const selectedProduct = products.find(p => p.id === form.productId);

  const totalRevenue = sales.reduce((s, x) => s + x.qty * x.salePrice, 0);
  const totalProfit  = sales.reduce((s, x) => s + x.qty * (x.salePrice - x.costPrice), 0);
  const totalUnits   = sales.reduce((s, x) => s + x.qty, 0);

  return (
    <div className="px-3 sm:px-0">
      <div className="page-header">
        <h1>Sales</h1>
        <p>Record and track your sales</p>
      </div>

      {/* ── Summary cards ── */}
      <div className="stat-grid mb-6">
        <div className="stat-card green">
          <div>
            <div className="stat-label">Total Revenue</div>
            <div className="stat-value" style={{ fontSize: 20 }}>{fmt(totalRevenue)}</div>
          </div>
          <div className="stat-icon green">$</div>
        </div>
        <div className="stat-card">
          <div>
            <div className="stat-label">Total Profit</div>
            <div className="stat-value" style={{ fontSize: 20 }}>{fmt(totalProfit)}</div>
          </div>
          <div className="stat-icon default">↗</div>
        </div>
        <div className="stat-card">
          <div>
            <div className="stat-label">Units Sold</div>
            <div className="stat-value">{totalUnits}</div>
          </div>
          <div className="stat-icon default">⊞</div>
        </div>
      </div>

      {/* ── Tabs ── */}
      <div style={{ background: "#eeede8", borderRadius: 10, padding: 4, display: "inline-flex", marginBottom: 22, gap: 4 }}>
        {["history", "record"].map(t => (
          <button key={t} className={`tab ${tab === t ? "active" : ""}`} onClick={() => setTab(t)}>
            {t === "history" ? "📋 Sales History" : "➕ Record Sale"}
          </button>
        ))}
      </div>

      {/* ── Sales History ── */}
      {tab === "history" && (
        <>
          {/* Desktop table */}
          <div className="card hidden sm:block" style={{ padding: 0 }}>
            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Product</th>
                    <th>Qty</th>
                    <th>Sale Price</th>
                    <th>Revenue</th>
                    <th>Profit</th>
                  </tr>
                </thead>
                <tbody>
                  {sales.length === 0 && (
                    <tr><td colSpan={6} style={{ textAlign: "center", padding: 40, color: "var(--muted)" }}>No sales recorded yet</td></tr>
                  )}
                  {sales.map(s => {
                    const revenue = s.qty * s.salePrice;
                    const profit  = s.qty * (s.salePrice - s.costPrice);
                    return (
                      <tr key={s.id}>
                        <td className="text-muted mono">{s.date}</td>
                        <td style={{ fontWeight: 500 }}>{s.productName}</td>
                        <td>{s.qty}</td>
                        <td>{fmt(s.salePrice)}</td>
                        <td style={{ fontWeight: 500 }}>{fmt(revenue)}</td>
                        <td className="text-accent" style={{ fontWeight: 500 }}>+{fmt(profit)}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Mobile card list */}
          <div className="flex flex-col gap-3 sm:hidden">
            {sales.length === 0 && (
              <div className="card" style={{ textAlign: "center", padding: 40, color: "var(--muted)" }}>No sales recorded yet</div>
            )}
            {sales.map(s => {
              const revenue = s.qty * s.salePrice;
              const profit  = s.qty * (s.salePrice - s.costPrice);
              return (
                <div className="card" key={s.id} style={{ padding: "14px 16px" }}>
                  {/* Product + date */}
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div style={{ fontWeight: 600, fontSize: 14 }}>{s.productName}</div>
                    <div className="mono text-muted shrink-0" style={{ fontSize: 11 }}>{s.date}</div>
                  </div>
                  {/* Stats row */}
                  <div className="flex justify-between" style={{ fontSize: 13 }}>
                    <div>
                      <div style={{ fontSize: 11, color: "var(--muted)", marginBottom: 1 }}>Qty</div>
                      <div>{s.qty}</div>
                    </div>
                    <div>
                      <div style={{ fontSize: 11, color: "var(--muted)", marginBottom: 1 }}>Sale Price</div>
                      <div>{fmt(s.salePrice)}</div>
                    </div>
                    <div>
                      <div style={{ fontSize: 11, color: "var(--muted)", marginBottom: 1 }}>Revenue</div>
                      <div style={{ fontWeight: 600 }}>{fmt(revenue)}</div>
                    </div>
                    <div>
                      <div style={{ fontSize: 11, color: "var(--muted)", marginBottom: 1 }}>Profit</div>
                      <div className="text-accent" style={{ fontWeight: 600 }}>+{fmt(profit)}</div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}

      {/* ── Record Sale ── */}
      {tab === "record" && (
        <div className="card w-full sm:max-w-md" style={{ maxWidth: "min(100%, 480px)" }}>
          <div className="card-title">Record a Sale</div>
          <div className="form-grid" style={{ gridTemplateColumns: "1fr" }}>
            <div className="form-group">
              <label>Product *</label>
              <select name="productId" value={form.productId} onChange={onChange}>
                <option value="">Select product…</option>
                {products.filter(p => p.stock > 0).map(p => (
                  <option key={p.id} value={p.id}>{p.name} ({p.stock} in stock)</option>
                ))}
              </select>
            </div>

            {selectedProduct && (
              <div style={{ background: "#f4fbf6", border: "1px solid #c8e6d4", borderRadius: 8, padding: "12px 14px", fontSize: 13 }}>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span className="text-muted">Sale price</span>
                  <strong>{fmt(selectedProduct.salePrice)}</strong>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", marginTop: 4 }}>
                  <span className="text-muted">Cost price</span>
                  <span>{fmt(selectedProduct.costPrice)}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", marginTop: 4 }}>
                  <span className="text-muted">Stock available</span>
                  <span>{selectedProduct.stock}</span>
                </div>
              </div>
            )}

            <div className="form-group">
              <label>Quantity *</label>
              <input name="qty" type="number" min="1" value={form.qty} onChange={onChange} />
            </div>

            {selectedProduct && form.qty > 0 && (
              <div style={{ background: "#eef4ff", border: "1px solid #c0d8f5", borderRadius: 8, padding: "12px 14px", fontSize: 13 }}>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span className="text-muted">Total revenue</span>
                  <strong>{fmt(selectedProduct.salePrice * parseInt(form.qty || 0))}</strong>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", marginTop: 4 }}>
                  <span className="text-muted">Total profit</span>
                  <span className="text-accent">+{fmt((selectedProduct.salePrice - selectedProduct.costPrice) * parseInt(form.qty || 0))}</span>
                </div>
              </div>
            )}
          </div>

          {error && <p style={{ color: "var(--danger)", fontSize: 12, marginTop: 12 }}>{error}</p>}

          <div className="btn-row flex-wrap gap-2">
            <button className="btn btn-primary flex-1" onClick={onSubmit}>Record Sale</button>
            <button className="btn btn-outline flex-1" onClick={() => { setForm(EMPTY); setError(""); }}>Clear</button>
          </div>
        </div>
      )}
    </div>
  );
}