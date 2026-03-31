import { useState, useEffect } from "react";
import Dashboard from "./pages/Dashboard";
import AddItems  from "./pages/AddItems";
import Brand     from "./pages/Brand";
import Sales     from "./pages/Sales";
import Expenses  from "./pages/Expenses";
import { Home, Plus, House, BadgeCent, BanknoteArrowDown, Menu, X } from "lucide-react";
import "./index.css";

const NAV = [
  { id: "home",      label: "Home",      icon: <Home /> },
  { id: "add-items", label: "Add Items", icon: <Plus /> },
  { id: "brand",     label: "Brand",     icon: <House /> },
  { id: "sales",     label: "Sales",     icon: <BadgeCent /> },
  { id: "expenses",  label: "Expenses",  icon: <BanknoteArrowDown /> },
];

export default function App() {
  const [page, setPage]           = useState("home");
  const [sidebarOpen, setSidebar] = useState(false);

  useEffect(() => {
    const onHash = () => setPage(location.hash.replace("#", "") || "home");
    window.addEventListener("hashchange", onHash);
    onHash();
    return () => window.removeEventListener("hashchange", onHash);
  }, []);

  // Close drawer when route changes
  useEffect(() => { setSidebar(false); }, [page]);

  // Lock body scroll while mobile drawer is open
  useEffect(() => {
    document.body.style.overflow = sidebarOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [sidebarOpen]);

  const navigate = (id) => { location.hash = id; setPage(id); };

return (
  <div className="app-shell">

    {/* Mobile top bar */}
    <div className="mobile-topbar">
      <button className="hamburger" onClick={() => setSidebarOpen(o => !o)}>
        
      </button>
      <span className="mobile-topbar-title">Inventory Manager</span>
      <span style={{ width: 32 }} />
    </div>

    {/* Backdrop */}
    {sidebarOpen && (
      <div className="sidebar-backdrop" onClick={() => setSidebarOpen(false)} />
    )}

    {/* Sidebar */}
    <aside className={`sidebar ${sidebarOpen ? "sidebar--open" : ""}`}>
      <div className="sidebar-brand">
        <span className="sidebar-avatar">B</span>
        <div>
          <div className="sidebar-title">Bead &amp; Crochet</div>
          <div className="sidebar-sub">Inventory Manager</div>
        </div>
      </div>
      <nav className="sidebar-nav">
        <div className="sidebar-nav-label">Navigation</div>
        {NAV.map(n => (
          <button
            key={n.id}
            className={`nav-item ${page === n.id ? "active" : ""}`}
            onClick={() => { navigate(n.id); setSidebarOpen(false); }}
          >
            <span className="nav-icon">{n.icon}</span>
            {n.label}
          </button>
        ))}
      </nav>
    </aside>

    {/* Main content */}
    <main className="main-content">
      {page === "home"      && <Dashboard  onNavigate={navigate} />}
      {page === "add-items" && <AddItems   onNavigate={navigate} />}
      {page === "brand"     && <Brand      onNavigate={navigate} />}
      {page === "sales"     && <Sales      onNavigate={navigate} />}
      {page === "expenses"  && <Expenses   onNavigate={navigate} />}
    </main>

    {/* Bottom nav (mobile only) */}
    <nav className="bottom-nav">
      {NAV.map(n => (
        <button
          key={n.id}
          className={`bottom-nav-item ${page === n.id ? "active" : ""}`}
          onClick={() => navigate(n.id)}
        >
          <span className="bottom-nav-icon">{n.icon}</span>
          <span className="bottom-nav-label">{n.label}</span>
        </button>
      ))}
    </nav>

  </div>
);
}