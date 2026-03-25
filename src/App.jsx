import { useState, useEffect } from "react";
import Dashboard from "./pages/Dashboard";
import AddItems  from "./pages/AddItems";
import Brand     from "./pages/Brand";
import Sales     from "./pages/Sales";
import "./index.css";
import { Home, Plus, Store, GitGraph } from "lucide-react";

const NAV = [
  { id: "home",      label: "Home",      icon: <Home /> },
  { id: "add-items", label: "Add Items", icon: <Plus /> },
  { id: "brand",     label: "Brand",     icon: <Store /> },
  { id: "sales",     label: "Sales",     icon: <GitGraph /> },
];

export default function App() {
  const [page, setPage] = useState("home");

  useEffect(() => {
    const onHash = () => setPage(location.hash.replace("#", "") || "home");
    window.addEventListener("hashchange", onHash);
    onHash();
    return () => window.removeEventListener("hashchange", onHash);
  }, []);

  const navigate = (id) => { location.hash = id; setPage(id); };

  return (
    <div className="app-shell">
      {/* ── Sidebar ── */}
      <aside className="sidebar">
        <div className="sidebar-brand">
          <span className="sidebar-avatar">B</span>
          <div>
            <div className="sidebar-title">Berry's Salesbook</div>
            <div className="sidebar-sub">Inventory Manager</div>
          </div>
        </div>

        <nav className="sidebar-nav">
          {NAV.map(n => (
            <button
              key={n.id}
              className={`nav-item ${page === n.id ? "active" : ""}`}
              onClick={() => navigate(n.id)}
            >
              <span className="nav-icon">{n.icon}</span>
              {n.label}
            </button>
          ))}
        </nav>
      </aside>

      {/* ── Main content ── */}
      <main className="main-content">
        {page === "home"      && <Dashboard  onNavigate={navigate} />}
        {page === "add-items" && <AddItems   onNavigate={navigate} />}
        {page === "brand"     && <Brand      onNavigate={navigate} />}
        {page === "sales"     && <Sales      onNavigate={navigate} />}
      </main>
    </div>
  );
}