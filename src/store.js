const KEYS = {
  products: "bc_products",
  brands:   "bc_brands",
  sales:    "bc_sales",
  expenses: "bc_expenses",
};

// ── Seed data (only written once) ───────────────────────────
const SEED_PRODUCTS = [
];

const SEED_BRANDS = [
  
];

const SEED_SALES = [
 
];

const SEED_EXPENSES = [
  
];

function seed() {
  if (!localStorage.getItem(KEYS.products)) localStorage.setItem(KEYS.products, JSON.stringify(SEED_PRODUCTS));
  if (!localStorage.getItem(KEYS.brands))   localStorage.setItem(KEYS.brands,   JSON.stringify(SEED_BRANDS));
  if (!localStorage.getItem(KEYS.sales))    localStorage.setItem(KEYS.sales,    JSON.stringify(SEED_SALES));
  if (!localStorage.getItem(KEYS.expenses)) localStorage.setItem(KEYS.expenses, JSON.stringify(SEED_EXPENSES));
}

// ── Generic helpers ──────────────────────────────────────────
function getAll(key)        { return JSON.parse(localStorage.getItem(key) || "[]"); }
function saveAll(key, data) { localStorage.setItem(key, JSON.stringify(data)); }
function uid()              { return "_" + Math.random().toString(36).slice(2, 10); }

// ── Products ─────────────────────────────────────────────────
export function getProducts()          { return getAll(KEYS.products); }
export function addProduct(p)          { const all = getProducts(); const item = { ...p, id: uid() }; saveAll(KEYS.products, [...all, item]); return item; }
export function updateProduct(id, p)   { saveAll(KEYS.products, getProducts().map(x => x.id === id ? { ...x, ...p } : x)); }
export function deleteProduct(id)      { saveAll(KEYS.products, getProducts().filter(x => x.id !== id)); }

// ── Brands ───────────────────────────────────────────────────
export function getBrands()            { return getAll(KEYS.brands); }
export function addBrand(b)            { const all = getBrands(); const item = { ...b, id: uid() }; saveAll(KEYS.brands, [...all, item]); return item; }
export function updateBrand(id, b)     { saveAll(KEYS.brands, getBrands().map(x => x.id === id ? { ...x, ...b } : x)); }
export function deleteBrand(id)        { saveAll(KEYS.brands, getBrands().filter(x => x.id !== id)); }

// ── Sales ─────────────────────────────────────────────────────
export function getSales()             { return getAll(KEYS.sales); }
export function recordSale(s)          {
  const products = getProducts();
  const product  = products.find(p => p.id === s.productId);
  if (!product) throw new Error("Product not found");
  if (product.stock < s.qty) throw new Error("Not enough stock");
  updateProduct(s.productId, { stock: product.stock - s.qty });
  const item = { ...s, id: uid(), productName: product.name, costPrice: product.costPrice, date: new Date().toISOString().slice(0, 10) };
  saveAll(KEYS.sales, [item, ...getSales()]);
  return item;
}

// ── Expenses ──────────────────────────────────────────────────
export function getExpenses()          { return getAll(KEYS.expenses); }
export function addExpense(e)          { const all = getExpenses(); const item = { ...e, id: uid() }; saveAll(KEYS.expenses, [item, ...all]); return item; }
export function deleteExpense(id)      { saveAll(KEYS.expenses, getExpenses().filter(x => x.id !== id)); }

// ── Dashboard stats ───────────────────────────────────────────
export function getDashboardStats() {
  const products = getProducts();
  const sales    = getSales();
  const expenses = getExpenses();

  const totalProducts  = products.length;
  const outOfStock     = products.filter(p => p.stock === 0).length;
  const lowStock       = products.filter(p => p.stock > 0 && p.stock <= p.lowStockThreshold).length;
  const inventoryValue = products.reduce((sum, p) => sum + p.costPrice * p.stock, 0);
  const stockAlerts    = products.filter(p => p.stock <= p.lowStockThreshold).sort((a, b) => a.stock - b.stock);
  const recentSales    = sales.slice(0, 5).map(s => ({
    ...s,
    revenue: s.qty * s.salePrice,
    profit:  s.qty * (s.salePrice - s.costPrice),
  }));

  // Financial summary
  const totalRevenue  = sales.reduce((sum, s) => sum + s.qty * s.salePrice, 0);
  const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);
  const netProfit     = totalRevenue - totalExpenses;

  // Breakdown by expense category
  const CATEGORIES = ["Supplies & Materials", "Shipping & Delivery", "Operations & Rent", "Other"];
  const expenseByCategory = CATEGORIES.map(cat => ({
    category: cat,
    amount: expenses.filter(e => e.category === cat).reduce((sum, e) => sum + e.amount, 0),
  })).filter(c => c.amount > 0);

  // Revenue by month (last 6 months)
  const recentExpenses = expenses.slice(0, 5);

  return {
    totalProducts, outOfStock, lowStock, inventoryValue,
    stockAlerts, recentSales,
    totalRevenue, totalExpenses, netProfit,
    expenseByCategory, recentExpenses,
  };
}

seed();