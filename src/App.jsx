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

      {/* ── Mobile top bar ── */}
      <header className="mobile-topbar">
        <div className="sidebar-brand" style={{ padding: 0 }}>
          <span className="sidebar-avatar">B</span>
          <div>
            <div className="sidebar-title">Berry's Salesbook</div>
            <div className="sidebar-sub">Inventory Manager</div>
          </div>
        </div>
        <button
          className="hamburger"
          onClick={() => setSidebar(o => !o)}
          aria-label="Toggle menu"
        >
          {sidebarOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </header>

      {/* ── Backdrop (mobile) ── */}
      {sidebarOpen && (
        <div className="sidebar-backdrop" onClick={() => setSidebar(false)} />
      )}

      {/* ── Sidebar ── */}
      <aside className={`sidebar ${sidebarOpen ? "sidebar--open" : ""}`}>
        <div className="sidebar-brand">
          <span className="sidebar-avatar">B</span>
          <div>
            <div className="sidebar-title"> Salesbook</div>
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
<main className="flex-1 flex justify-center p-8  overflow-x-hidden">
  <div className="w-full  max-w-[1440px]">
    {page === "home"      && <Dashboard  onNavigate={navigate} />}
    {page === "add-items" && <AddItems   onNavigate={navigate} />}
    {page === "brand"     && <Brand      onNavigate={navigate} />}
    {page === "sales"     && <Sales      onNavigate={navigate} />}
    {page === "expenses"  && <Expenses   onNavigate={navigate} />}
  </div>
</main>

      {/* ── Mobile bottom nav ── */}
      {/* <nav className="bottom-nav">
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
      </nav> */}

    </div>
  );
}