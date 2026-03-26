const KEYS = {
  products: "bc_products",
  brands:   "bc_brands",
  sales:    "bc_sales",
  expenses: "bc_expenses",
};

// ── Seed data (only written once) ───────────────────────────
const SEED_PRODUCTS = [
  { id: "p1", name: "Swarovski Crystal Beads (6mm)", sku: "SCB-006", brandId: "b1", category: "Beads", costPrice: 1.2, salePrice: 2.5, stock: 120, lowStockThreshold: 20 },
  { id: "p2", name: "Acrylic Beads (10mm)", sku: "AB-010", brandId: "b2", category: "Beads", costPrice: 0.3, salePrice: 0.6, stock: 30, lowStockThreshold: 50 },
  { id: "p3", name: "Plastic Crochet Hook Set", sku: "PCH-SET", brandId: "b3", category: "Crochet Hooks", costPrice: 5, salePrice: 12, stock: 0, lowStockThreshold: 5 },
  { id: "p4", name: "Elastic Cord (1mm)", sku: "EC-001", brandId: "b2", category: "Threads & Strings", costPrice: 2, salePrice: 4.5, stock: 8, lowStockThreshold: 15 },
  { id: "p5", name: "Crochet Tote Bag", sku: "CTB-001", brandId: "b3", category: "Finished Crochet", costPrice: 8, salePrice: 22, stock: 3, lowStockThreshold: 5 },
  { id: "p6", name: "Cotton Yarn (100g)", sku: "CY-100", brandId: "b4", category: "Yarn", costPrice: 3, salePrice: 7.99, stock: 55, lowStockThreshold: 10 },
  { id: "p7", name: "Seed Beads Mix", sku: "SBM-001", brandId: "b1", category: "Beads", costPrice: 1.5, salePrice: 3.5, stock: 200, lowStockThreshold: 30 },
  { id: "p8", name: "Steel Crochet Hook 1.5mm", sku: "SCH-015", brandId: "b3", category: "Crochet Hooks", costPrice: 2, salePrice: 5.5, stock: 18, lowStockThreshold: 5 },
  { id: "p9", name: "Beaded Bracelet - Ocean", sku: "BBO-001", brandId: "b1", category: "Finished Jewellery", costPrice: 5, salePrice: 24.99, stock: 12, lowStockThreshold: 3 },
  { id: "p10", name: "Nylon Thread 0.5mm", sku: "NT-005", brandId: "b2", category: "Threads & Strings", costPrice: 1.8, salePrice: 3.99, stock: 40, lowStockThreshold: 10 },
];

const SEED_BRANDS = [
  { id: "b1", name: "Swarovski", country: "Austria", contact: "info@swarovski.com", notes: "Premium crystal supplier" },
  { id: "b2", name: "ArtCord", country: "China", contact: "sales@artcord.cn", notes: "Affordable threads & beads" },
  { id: "b3", name: "Clover", country: "Japan", contact: "support@clover.jp", notes: "Quality crochet tools" },
  { id: "b4", name: "Paintbox Yarns", country: "UK", contact: "hello@paintbox.com", notes: "Vibrant cotton yarn range" },
];

const SEED_SALES = [
  { id: "s1", productId: "p1", productName: "Swarovski Crystal Beads (6mm)", qty: 50, salePrice: 2.5, costPrice: 1.2, date: "2026-03-24" },
  { id: "s2", productId: "p9", productName: "Beaded Bracelet - Ocean", qty: 3, salePrice: 24.99, costPrice: 5, date: "2026-03-23" },
  { id: "s3", productId: "p6", productName: "Cotton Yarn (100g)", qty: 10, salePrice: 7.99, costPrice: 3, date: "2026-03-22" },
  { id: "s4", productId: "p7", productName: "Seed Beads Mix", qty: 20, salePrice: 3.5, costPrice: 1.5, date: "2026-03-20" },
  { id: "s5", productId: "p2", productName: "Acrylic Beads (10mm)", qty: 100, salePrice: 0.6, costPrice: 0.3, date: "2026-03-18" },
];

const SEED_EXPENSES = [
  { id: "e1", description: "Bead restock from supplier", amount: 15000, category: "Supplies & Materials", date: "2026-03-20", notes: "Swarovski & acrylic beads bulk order" },
  { id: "e2", description: "DHL shipping to customer",   amount: 3500,  category: "Shipping & Delivery",  date: "2026-03-22", notes: "" },
  { id: "e3", description: "Workshop rent - March",      amount: 25000, category: "Operations & Rent",    date: "2026-03-01", notes: "Monthly studio rent" },
  { id: "e4", description: "Crochet hooks bulk buy",     amount: 8000,  category: "Supplies & Materials", date: "2026-03-15", notes: "" },
  { id: "e5", description: "Packaging materials",        amount: 4200,  category: "Shipping & Delivery",  date: "2026-03-18", notes: "Boxes, tissue, ribbon" },
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