import { useState, useEffect } from "react";
import { getDashboardStats } from "../store";
import { ShoppingCart, TriangleAlert, X, CheckLine, TrendingDown, TrendingUp } from "lucide-react";

function fmt(n) { return "₦" + Number(n).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ","); }

const CATEGORY_COLORS = {
  "Supplies & Materials": { bg: "#eef4ff", color: "#3a6fa8", bar: "#3a6fa8" },
  "Shipping & Delivery":  { bg: "#fff8ec", color: "#d4820a", bar: "#d4820a" },
  "Operations & Rent":    { bg: "#fef0f0", color: "#c94040", bar: "#c94040" },
  "Other":                { bg: "#f4f4f0", color: "#666",    bar: "#aaa"    },
};

export default function Dashboard({ onNavigate }) {
  const [stats, setStats] = useState(null);

  useEffect(() => { setStats(getDashboardStats()); }, []);

  if (!stats) return null;
  const {
    totalProducts, outOfStock, lowStock, inventoryValue,
    stockAlerts, recentSales,
    totalRevenue, totalExpenses, netProfit,
    expenseByCategory, recentExpenses,
  } = stats;

  const maxExpense = Math.max(...expenseByCategory.map(c => c.amount), 1);

  return (
    <div className="px-3 sm:px-0">
      <div className="page-header">
        <h1>Dashboard</h1>
        <p>Overview of your bead &amp; crochet business</p>
      </div>

      {/* Inventory stat cards */}
      <div className="stat-grid">
        <div className="stat-card">
          <div><div className="stat-label">Total Products</div><div className="stat-value">{totalProducts}</div></div>
          <ShoppingCart className="text-green-800" />
        </div>
        <div className="stat-card warn">
          <div><div className="stat-label">Low Stock</div><div className="stat-value">{lowStock}</div></div>
          <TriangleAlert className="text-yellow-700" />
        </div>
        <div className="stat-card danger">
          <div><div className="stat-label">Out of Stock</div><div className="stat-value">{outOfStock}</div></div>
          <X className="text-red-900" />
        </div>
        <div className="stat-card green">
          <div><div className="stat-label">Inventory Value</div><div className="stat-value" style={{ fontSize: 18 }}>{fmt(inventoryValue)}</div></div>
          <div className="stat-icon green">₦</div>
        </div>
      </div>

      {/* Financial overview */}
      <div className="mb-7">
        <div className="text-sm font-semibold mb-3">Financial Overview</div>
        {/* 3-col on desktop, 1-col stacked on mobile */}
        <div className="stat-grid" style={{ gridTemplateColumns: undefined }}>
          <div className="stat-card green [grid-column:span_1]">
            <div>
              <div className="stat-label">Total Revenue</div>
              <div className="stat-value" style={{ fontSize: 18 }}>{fmt(totalRevenue)}</div>
              <div style={{ fontSize: 11, color: "var(--muted)", marginTop: 4 }}>From all sales</div>
            </div>
            <TrendingUp className="text-green-800" />
          </div>
          <div className="stat-card danger">
            <div>
              <div className="stat-label">Total Expenses</div>
              <div className="stat-value" style={{ fontSize: 18 }}>{fmt(totalExpenses)}</div>
              <div style={{ fontSize: 11, color: "var(--muted)", marginTop: 4 }}>All categories</div>
            </div>
            <TrendingDown className="text-red-900" />
          </div>
          <div className={`stat-card ${netProfit >= 0 ? "green" : "danger"}`}>
            <div>
              <div className="stat-label">Net Profit</div>
              <div className="stat-value" style={{ fontSize: 18, color: netProfit >= 0 ? "var(--accent)" : "var(--danger)" }}>
                {netProfit >= 0 ? "" : "-"}{fmt(Math.abs(netProfit))}
              </div>
              <div style={{ fontSize: 11, color: "var(--muted)", marginTop: 4 }}>Revenue − Expenses</div>
            </div>
            <div className={`stat-icon ${netProfit >= 0 ? "green" : "danger"}`}>{netProfit >= 0 ? <CheckLine /> : <X />}</div>
          </div>
        </div>
      </div>

      {/* Expense breakdown + stock alerts — stack on mobile, side-by-side on md+ */}
      <div className="two-col mb-5">
        <div className="card">
          <div className="card-title flex-wrap gap-2" style={{ justifyContent: "space-between" }}>
            <span className="flex items-center gap-1"><TrendingDown size={16} className="text-red-800" /> Expenses by Category</span>
            <button
              className="btn btn-outline"
              style={{ padding: "4px 12px", fontSize: 12 }}
              onClick={() => onNavigate("expenses")}
            >
              Manage →
            </button>
          </div>
          {expenseByCategory.length === 0 ? (
            <div className="empty"><div className="empty-icon">📊</div>No expenses recorded yet</div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {expenseByCategory.map(c => {
                const colors = CATEGORY_COLORS[c.category] || CATEGORY_COLORS["Other"];
                const pct    = Math.round((c.amount / totalExpenses) * 100);
                const barPct = Math.round((c.amount / maxExpense) * 100);
                return (
                  <div key={c.category}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <span style={{ display: "inline-block", width: 10, height: 10, borderRadius: 3, background: colors.bar }} />
                        <span style={{ fontSize: 13, fontWeight: 500 }}>{c.category}</span>
                      </div>
                      <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                        <span style={{ fontSize: 11, color: "var(--muted)" }}>{pct}%</span>
                        <span style={{ fontSize: 13, fontWeight: 600 }}>{fmt(c.amount)}</span>
                      </div>
                    </div>
                    <div style={{ height: 6, background: "#f0f0ec", borderRadius: 4, overflow: "hidden" }}>
                      <div style={{ height: "100%", width: `${barPct}%`, background: colors.bar, borderRadius: 4, transition: "width .4s ease" }} />
                    </div>
                  </div>
                );
              })}
              <div style={{ display: "flex", justifyContent: "space-between", paddingTop: 12, borderTop: "1px solid var(--border)", fontSize: 13, fontWeight: 600 }}>
                <span>Total Expenses</span>
                <span style={{ color: "var(--danger)" }}>{fmt(totalExpenses)}</span>
              </div>
            </div>
          )}
        </div>

        <div className="card mb-5">
          <div className="card-title"><TriangleAlert size={16} className="text-red-800" />Stock Alerts</div>
          {stockAlerts.length === 0 ? (
            <div className="empty"><div className="empty-icon">✓</div>All products well stocked</div>
          ) : stockAlerts.map(p => (
            <div className="alert-row" key={p.id}>
              <div className="min-w-0">
                <div className="alert-name truncate">{p.name}</div>
                <div className="alert-meta">{p.category} · {p.sku}</div>
              </div>
              {p.stock === 0
                ? <span className="badge badge-danger shrink-0">0 left</span>
                : <span className={`badge shrink-0 ${p.stock <= 10 ? "badge-warn" : "badge-default"}`}>{p.stock} left</span>
              }
            </div>
          ))}
          <button
            className="btn btn-outline mt-4 w-full justify-center"
            onClick={() => onNavigate("add-items")}
          >
            + Restock Items
          </button>
        </div>
      </div>

      {/* Recent sales + recent expenses — stack on mobile, side-by-side on md+ */}
      <div className="two-col  mt-5">
        <div className="card">
          <div className="card-title"><TrendingUp size={16} className="text-green-800" /> Recent Sales</div>
          {recentSales.length === 0 ? (
            <div className="empty"><div className="empty-icon">📦</div>No sales recorded yet</div>
          ) : recentSales.map(s => (
            <div className="sale-row" key={s.id}>
              <div className="min-w-0">
                <div className="sale-name truncate">{s.productName}</div>
                <div className="sale-meta">{s.date} · Qty: {s.qty}</div>
              </div>
              <div className="sale-amt shrink-0">
                <div className="sale-price">{fmt(s.revenue)}</div>
                <div className="sale-profit">+{fmt(s.profit)} profit</div>
              </div>
            </div>
          ))}
          <button
            className="btn btn-outline mt-4 w-full justify-center"
            onClick={() => onNavigate("sales")}
          >
            View All Sales →
          </button>
        </div>

        <div className="card">
          <div className="card-title"><TrendingDown size={16} className="text-red-800" /> Recent Expenses</div>
          {recentExpenses.length === 0 ? (
            <div className="empty"><div className="empty-icon">💸</div>No expenses recorded yet</div>
          ) : recentExpenses.map(e => {
            const colors = CATEGORY_COLORS[e.category] || CATEGORY_COLORS["Other"];
            return (
              <div className="sale-row" key={e.id}>
                <div className="min-w-0">
                  <div className="sale-name truncate">{e.description}</div>
                  <div className="sale-meta" style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 2 }}>
                    <span style={{ background: colors.bg, color: colors.color, padding: "1px 7px", borderRadius: 10, fontSize: 10, fontWeight: 600 }}>{e.category}</span>
                    <span>{e.date}</span>
                  </div>
                </div>
                <div className="sale-amt shrink-0">
                  <div className="sale-price" style={{ color: "var(--danger)" }}>-{fmt(e.amount)}</div>
                </div>
              </div>
            );
          })}
          <button
            className="btn btn-outline mt-4 w-full justify-center"
            onClick={() => onNavigate("expenses")}
          >
            View All Expenses →
          </button>
        </div>
      </div>
    </div>
  );
}