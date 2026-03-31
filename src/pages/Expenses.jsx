import { useState, useEffect } from "react";
import { getExpenses, addExpense, deleteExpense } from "../store";
import { Notebook, TrendingDown, Plus } from "lucide-react";

function fmt(n) { return "₦" + Number(n).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ","); }

const CATEGORIES = [
  "Supplies & Materials",
  "Shipping & Delivery",
  "Operations & Rent",
  "Other",
];

const CATEGORY_COLORS = {
  "Supplies & Materials": { bg: "#eef4ff", color: "#3a6fa8" },
  "Shipping & Delivery":  { bg: "#fff8ec", color: "#d4820a" },
  "Operations & Rent":    { bg: "#fef0f0", color: "#c94040" },
  "Other":                { bg: "#f4f4f0", color: "#666"    },
};

const EMPTY = { description: "", amount: "", category: "", date: new Date().toISOString().slice(0, 10), notes: "" };

export default function Expenses() {
  const [expenses, setExpenses] = useState([]);
  const [form,     setForm]     = useState(EMPTY);
  const [error,    setError]    = useState("");
  const [filter,   setFilter]   = useState("All");
  const [tab,      setTab]      = useState("list"); // "list" | "add"

  const reload = () => setExpenses(getExpenses());
  useEffect(reload, []);

  const onChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const onSubmit = () => {
    if (!form.description || !form.amount || !form.category || !form.date) {
      setError("Please fill in all required fields."); return;
    }
    if (isNaN(form.amount) || parseFloat(form.amount) <= 0) {
      setError("Amount must be a positive number."); return;
    }
    addExpense({ ...form, amount: parseFloat(form.amount) });
    reload(); setForm(EMPTY); setError(""); setTab("list");
  };

  const onDelete = (id) => {
    if (!confirm("Delete this expense?")) return;
    deleteExpense(id); reload();
  };

  const filtered = filter === "All" ? expenses : expenses.filter(e => e.category === filter);

  const totalFiltered = filtered.reduce((s, e) => s + e.amount, 0);
  const totalAll      = expenses.reduce((s, e) => s + e.amount, 0);

  const categoryTotals = CATEGORIES.map(cat => ({
    cat,
    total: expenses.filter(e => e.category === cat).reduce((s, e) => s + e.amount, 0),
  }));

  return (
    <div className="px-3 sm:px-0">
      <div className="page-header">
        <h1>Expenses</h1>
        <p>Track your business costs and outgoings</p>
      </div>

      {/* Summary cards — 2-col on mobile, 4-col on desktop */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-6">
        <div className="stat-card danger">
          <div>
            <div className="stat-label">Total Expenses</div>
            <div className="stat-value" style={{ fontSize: 18 }}>{fmt(totalAll)}</div>
          </div>
          <div className="stat-icon"><TrendingDown size={20} className="text-red-800" /></div>
        </div>
        {categoryTotals.filter(c => c.total > 0).slice(0, 3).map(c => {
          const colors = CATEGORY_COLORS[c.cat];
          return (
            <div className="stat-card" key={c.cat} style={{ borderColor: colors.bg }}>
              <div>
                <div className="stat-label" style={{ fontSize: 11 }}>{c.cat}</div>
                <div className="stat-value" style={{ fontSize: 16 }}>{fmt(c.total)}</div>
              </div>
              <div className="stat-icon" style={{ background: colors.bg, color: colors.color }}>↓</div>
            </div>
          );
        })}
      </div>

      {/* Tabs */}
      <div style={{ background: "#eeede8", borderRadius: 10, padding: 4, display: "inline-flex", marginBottom: 22, gap: 4, marginTop: 15 }}>
        {["list", "add"].map(t => (
          <button key={t} className={`tab ${tab === t ? "active" : ""}`} onClick={() => setTab(t)}>
            {t === "list"
              ? <><Notebook size={16} className="text-blue-700" /> All Expenses</>
              : <><Plus size={16} className="text-green-800" /> Add Expense</>}
          </button>
        ))}
      </div>

      {/* Expense list */}
      {tab === "list" && (
        <div>
          {/* Filter pills — scroll horizontally on mobile */}
          <div className="flex gap-2 mb-4 overflow-x-auto pb-1" style={{ flexWrap: "nowrap" }}>
            {["All", ...CATEGORIES].map(cat => (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                className="shrink-0"
                style={{
                  padding: "5px 14px", borderRadius: 20, border: "1px solid var(--border)",
                  fontSize: 12, fontWeight: 500, cursor: "pointer", fontFamily: "inherit",
                  background: filter === cat ? "var(--text)" : "var(--surface)",
                  color:      filter === cat ? "#fff" : "var(--text)",
                  transition: "all .15s",
                  whiteSpace: "nowrap",
                }}
              >{cat}</button>
            ))}
          </div>

          {/* Desktop table */}
          <div className="card hidden sm:block" style={{ padding: 0 }}>
            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Description</th>
                    <th>Category</th>
                    <th>Notes</th>
                    <th>Amount</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.length === 0 && (
                    <tr><td colSpan={6} style={{ textAlign: "center", padding: 40, color: "var(--muted)" }}>No expenses found</td></tr>
                  )}
                  {filtered.map(e => {
                    const colors = CATEGORY_COLORS[e.category] || CATEGORY_COLORS["Other"];
                    return (
                      <tr key={e.id}>
                        <td className="mono text-muted">{e.date}</td>
                        <td style={{ fontWeight: 500 }}>{e.description}</td>
                        <td>
                          <span style={{
                            background: colors.bg, color: colors.color,
                            padding: "3px 10px", borderRadius: 20,
                            fontSize: 11, fontWeight: 600
                          }}>{e.category}</span>
                        </td>
                        <td className="text-muted" style={{ fontSize: 12 }}>{e.notes || "—"}</td>
                        <td style={{ fontWeight: 600, color: "var(--danger)" }}>{fmt(e.amount)}</td>
                        <td>
                          <button className="btn btn-danger" style={{ padding: "5px 12px" }} onClick={() => onDelete(e.id)}>Delete</button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
                {filtered.length > 0 && (
                  <tfoot>
                    <tr>
                      <td colSpan={4} style={{ padding: "12px", fontWeight: 600, fontSize: 13, borderTop: "2px solid var(--border)" }}>
                        {filter === "All" ? "Total" : `${filter} Total`}
                      </td>
                      <td style={{ padding: "12px", fontWeight: 700, color: "var(--danger)", borderTop: "2px solid var(--border)" }}>
                        {fmt(totalFiltered)}
                      </td>
                      <td style={{ borderTop: "2px solid var(--border)" }}></td>
                    </tr>
                  </tfoot>
                )}
              </table>
            </div>
          </div>

          {/* Mobile card list */}
          <div className="flex flex-col gap-3 sm:hidden">
            {filtered.length === 0 && (
              <div className="card" style={{ textAlign: "center", padding: 40, color: "var(--muted)" }}>No expenses found</div>
            )}
            {filtered.map(e => {
              const colors = CATEGORY_COLORS[e.category] || CATEGORY_COLORS["Other"];
              return (
                <div className="card" key={e.id} style={{ padding: "14px 16px" }}>
                  {/* Top row: description + amount */}
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div style={{ fontWeight: 600, fontSize: 14 }}>{e.description}</div>
                    <div style={{ fontWeight: 700, color: "var(--danger)", fontSize: 14, shrink: 0 }} className="shrink-0">
                      {fmt(e.amount)}
                    </div>
                  </div>
                  {/* Meta row: category pill + date */}
                  <div className="flex items-center gap-2 mb-3">
                    <span style={{
                      background: colors.bg, color: colors.color,
                      padding: "2px 9px", borderRadius: 20, fontSize: 11, fontWeight: 600
                    }}>{e.category}</span>
                    <span className="mono text-muted" style={{ fontSize: 11 }}>{e.date}</span>
                  </div>
                  {/* Notes */}
                  {e.notes && (
                    <div className="text-muted mb-3" style={{ fontSize: 12 }}>{e.notes}</div>
                  )}
                  {/* Delete button */}
                  <button className="btn btn-danger w-full justify-center" style={{ padding: "6px 12px" }} onClick={() => onDelete(e.id)}>
                    Delete
                  </button>
                </div>
              );
            })}
            {/* Mobile total */}
            {filtered.length > 0 && (
              <div className="flex justify-between items-center px-3 py-3 pb-2 bg-white" style={{ fontSize: 13, fontWeight: 700 }}>
                <span>{filter === "All" ? "Total" : `${filter} Total`}</span>
                <span style={{ color: "var(--danger)" }}>{fmt(totalFiltered)}</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Add expense form */}
      {tab === "add" && (
        <div className="card">
          <div className="card-title">Add New Expense</div>
          <div className="form-grid">
            <div className="form-group full">
              <label>Description *</label>
              <input name="description" value={form.description} onChange={onChange} placeholder="e.g. Record an expenses" />
            </div>
            <div className="form-group">
              <label>Amount (₦) *</label>
              <input name="amount" type="number" min="0" step="0.01" value={form.amount} onChange={onChange} placeholder="0.00" />
            </div>
            <div className="form-group">
              <label>Category *</label>
              <select name="category" value={form.category} onChange={onChange}>
                <option value="">Select category</option>
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label>Date *</label>
              <input name="date" type="date" value={form.date} onChange={onChange} />
            </div>
            <div className="form-group full">
              <label>Notes</label>
              <textarea name="notes" value={form.notes} onChange={onChange} placeholder="Any extra details…" />
            </div>
          </div>

          {error && <p style={{ color: "var(--danger)", fontSize: 12, marginTop: 12 }}>{error}</p>}

          <div className="btn-row flex-wrap gap-2">
            <button className="btn btn-primary flex-1" onClick={onSubmit}>Add Expense</button>
            <button className="btn btn-outline flex-1" onClick={() => { setForm(EMPTY); setError(""); }}>Clear</button>
          </div>
        </div>
      )}
    </div>
  );
}