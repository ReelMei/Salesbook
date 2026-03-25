import { useState, useEffect } from "react";
import { getDashboardStats } from "../store";
import { ShoppingCart, TriangleAlert, X, TrendingUp } from "lucide-react";

function fmt(n) { return "₦" + Number(n).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ","); }
function fmtN(n)  { return n.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ","); }

export default function Dashboard({ onNavigate }) {
  const [stats, setStats] = useState(null);

  useEffect(() => { setStats(getDashboardStats()); }, []);

  if (!stats) return null;
  const { totalProducts, outOfStock, lowStock, inventoryValue, stockAlerts, recentSales } = stats;

  return (
    <div>
      <div className="page-header">
        <h1>Dashboard</h1>
        <p>Overview of your bead &amp; crochet business</p>
      </div>

      {/* ── Stat cards ── */}
      <div className="stat-grid">
        <div className="stat-card">
          <div>
            <div className="stat-label">Total Products</div>
            <div className="stat-value">{totalProducts}</div>
          </div>
          < ShoppingCart className="text-green-800"/>
        </div>

        <div className="stat-card warn">
          <div>
            <div className="stat-label">Low Stock</div>
            <div className="stat-value">{lowStock}</div>
          </div>
          <TriangleAlert className="text-red-800"/>
        </div>
        <div className="stat-card danger">
          <div>
            <div className="stat-label">Out of Stock</div>
            <div className="stat-value">{outOfStock}</div>
          </div>
            <X className="text-red-800"/>
        </div>

        <div className="stat-card green">
          <div>
            <div className="stat-label">Inventory Value</div>
            <div className="stat-value" style={{ fontSize: 20 }}>{fmt(inventoryValue)}</div>
          </div>
          <div className="stat-icon green">₦</div>
        </div>
      </div>

      {/* ── Two columns ── */}
      <div className="two-col">
        {/* Stock Alerts */}
        <div className="card">
          <div className="card-title"> <TriangleAlert size={16} className="text-red-700"/> Stock Alerts</div>
          {stockAlerts.length === 0 ? (
            <div className="empty"><div className="empty-icon">✓</div>All products well stocked</div>
          ) : stockAlerts.map(p => (
            <div className="alert-row" key={p.id}>
              <div>
                <div className="alert-name">{p.name}</div>
                <div className="alert-meta">{p.category} · {p.sku}</div>
              </div>
              {p.stock === 0
                ? <span className="badge badge-danger">0 left</span>
                : <span className={`badge ${p.stock <= 10 ? "badge-warn" : "badge-default"}`}>{p.stock} left</span>
              }
            </div>
          ))}
          <button className="btn btn-outline mt-4" style={{ width: "100%", justifyContent: "center" }} onClick={() => onNavigate("add-items")}>
            + Restock Items
          </button>
        </div>

        {/* Recent Sales */}
        <div className="card">
          <div className="card-title"> <TrendingUp size={16} className="text-green-700"/> Recent Sales</div>
          {recentSales.length === 0 ? (
            <div className="empty"><div className="empty-icon">📦</div>No sales recorded yet</div>
          ) : recentSales.map(s => (
            <div className="sale-row" key={s.id}>
              <div>
                <div className="sale-name">{s.productName}</div>
                <div className="sale-meta">{s.date} · Qty: {s.qty}</div>
              </div>
              <div className="sale-amt">
                <div className="sale-price">{fmt(s.revenue)}</div>
                <div className="sale-profit">+{fmt(s.profit)} profit</div>
              </div>
            </div>
          ))}
          <button className="btn btn-outline mt-4" style={{ width: "100%", justifyContent: "center" }} onClick={() => onNavigate("sales")}>
            View All Sales →
          </button>
        </div>
      </div>
    </div>
  );
}