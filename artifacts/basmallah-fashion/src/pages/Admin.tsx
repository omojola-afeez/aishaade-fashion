import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  LogOut, Plus, Edit2, Trash2, AlertTriangle, Package, Tag, BarChart3,
  Upload, X, Save, Eye, EyeOff
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth, getAdminHeaders } from "@/hooks/use-admin";
import { formatCurrency } from "@/lib/utils";
import { AishaAdeLogo } from "@/components/AishaAdeLogo";

const BASE = "/api";

type Product = {
  id: number; name: string; description?: string; price: number;
  categoryId: number; categoryName?: string; gender: string; ageGroup: string;
  sizes: string[]; colors: string[]; material?: string; imageUrls: string[];
  stockQuantity: number; lowStockThreshold: number; isAvailable: boolean;
  isFeatured: boolean; badge?: string; createdAt?: string;
};

type Category = { id: number; name: string; slug: string; gender: string; section: string };

const EMPTY_FORM = {
  name: "", description: "", price: 0, categoryId: 0, gender: "unisex", ageGroup: "all",
  sizes: [] as string[], colors: [] as string[], material: "",
  imageUrls: [] as string[], stockQuantity: 0, lowStockThreshold: 5,
  isAvailable: true, isFeatured: false, badge: "" as string,
};

export default function Admin() {
  const { token, login, logout, isAuthenticated } = useAuth();
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState("");
  const [loginLoading, setLoginLoading] = useState(false);

  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [alerts, setAlerts] = useState<Product[]>([]);
  const [activeTab, setActiveTab] = useState<"overview" | "products" | "add" | "inventory">("overview");
  const [editProduct, setEditProduct] = useState<Product | null>(null);
  const [form, setForm] = useState({ ...EMPTY_FORM });
  const [sizeInput, setSizeInput] = useState("");
  const [colorInput, setColorInput] = useState("");
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchData = async () => {
    const headers = getAdminHeaders() as HeadersInit;
    const safeJson = (p: Promise<Response>) =>
      p.then(r => r.json()).catch(() => null);

    const [prods, cats, alts] = await Promise.all([
      safeJson(fetch(`${BASE}/admin/products`, { headers })),
      safeJson(fetch(`${BASE}/categories`)),
      safeJson(fetch(`${BASE}/admin/inventory/alerts`, { headers })),
    ]);
    if (Array.isArray(prods)) setProducts(prods);
    if (Array.isArray(cats)) setCategories(cats);
    if (Array.isArray(alts)) setAlerts(alts);
  };

  useEffect(() => {
    fetch(`${BASE}/categories`)
      .then(r => r.json())
      .then(cats => { if (Array.isArray(cats)) setCategories(cats); })
      .catch(() => {});
  }, []);

  useEffect(() => { if (isAuthenticated) fetchData(); }, [isAuthenticated]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginLoading(true);
    setLoginError("");
    try {
      const r = await fetch(`${BASE}/admin/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      const data = await r.json();
      if (!r.ok) { setLoginError(data.error || "Invalid password"); return; }
      login(data.token);
    } catch {
      setLoginError("Connection error");
    } finally {
      setLoginLoading(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("image", file);
      const r = await fetch(`${BASE}/admin/upload`, {
        method: "POST",
        headers: getAdminHeaders() as HeadersInit,
        body: fd,
      });
      const data = await r.json();
      if (r.ok) setForm(f => ({ ...f, imageUrls: [...f.imageUrls, data.url] }));
    } catch {
      alert("Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const startEdit = (p: Product) => {
    setEditProduct(p);
    setForm({
      name: p.name, description: p.description || "", price: p.price,
      categoryId: p.categoryId, gender: p.gender, ageGroup: p.ageGroup,
      sizes: p.sizes || [], colors: p.colors || [], material: p.material || "",
      imageUrls: p.imageUrls || [], stockQuantity: p.stockQuantity,
      lowStockThreshold: p.lowStockThreshold, isAvailable: p.isAvailable,
      isFeatured: p.isFeatured, badge: p.badge || "",
    });
    setActiveTab("add");
  };

  const resetForm = () => {
    setForm({ ...EMPTY_FORM });
    setEditProduct(null);
    setSizeInput("");
    setColorInput("");
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const resolvedCategoryId = form.categoryId || (categories[0]?.id ?? 1);
      const body = { ...form, categoryId: resolvedCategoryId, badge: form.badge || null };
      const url = editProduct ? `${BASE}/admin/products/${editProduct.id}` : `${BASE}/admin/products`;
      const method = editProduct ? "PUT" : "POST";
      const r = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json", ...(getAdminHeaders() as HeadersInit) },
        body: JSON.stringify(body),
      });
      if (!r.ok) { alert("Failed to save product"); return; }
      await fetchData();
      resetForm();
      setActiveTab("products");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    await fetch(`${BASE}/admin/products/${id}`, {
      method: "DELETE",
      headers: getAdminHeaders() as HeadersInit,
    });
    setDeleteId(null);
    await fetchData();
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-primary flex items-center justify-center px-4">
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: "repeating-linear-gradient(45deg, rgba(201,146,42,1) 0px, rgba(201,146,42,1) 1px, transparent 1px, transparent 20px), repeating-linear-gradient(-45deg, rgba(201,146,42,1) 0px, rgba(201,146,42,1) 1px, transparent 1px, transparent 20px)"
          }}
        />
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative bg-white rounded-3xl p-8 w-full max-w-md shadow-2xl"
        >
          <div className="text-center mb-8">
            <div className="flex justify-center mb-2">
              <AishaAdeLogo size={56} variant="mark" />
            </div>
            <h1 className="font-serif text-2xl font-bold text-foreground">Admin Portal</h1>
            <p className="text-muted-foreground text-sm mt-1">AishaADe Fashion & Gadgets Hub — Admin</p>
          </div>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="Enter admin password"
                className="w-full px-4 py-4 pr-12 rounded-2xl border border-border bg-muted/30 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
                required
              />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground">
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
            {loginError && (
              <div className="bg-destructive/10 text-destructive rounded-xl px-4 py-3 text-sm flex items-center gap-2">
                <AlertTriangle className="w-4 h-4" /> {loginError}
              </div>
            )}
            <Button type="submit" disabled={loginLoading} className="w-full bg-primary text-white font-bold rounded-2xl py-6 text-base">
              {loginLoading ? "Signing in..." : "Sign In"}
            </Button>
          </form>
        </motion.div>
      </div>
    );
  }

  const tabs = [
    { id: "overview", label: "Overview", icon: BarChart3 },
    { id: "products", label: "Products", icon: Package },
    { id: "add", label: editProduct ? "Edit Product" : "Add Product", icon: Plus },
    { id: "inventory", label: "Inventory Alerts", icon: AlertTriangle },
  ];

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Header */}
      <header className="bg-primary shadow-lg sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <AishaAdeLogo size={36} variant="full" light={true} />
          </div>
          <div className="flex items-center gap-2">
            {alerts.length > 0 && (
              <button onClick={() => setActiveTab("inventory")} className="bg-red-500/20 text-red-200 rounded-full px-3 py-1 text-xs font-bold flex items-center gap-1">
                <AlertTriangle className="w-3 h-3" /> {alerts.length} Alert{alerts.length !== 1 ? "s" : ""}
              </button>
            )}
            <Button onClick={logout} variant="ghost" size="sm" className="text-white/70 hover:text-white hover:bg-white/10 gap-2">
              <LogOut className="w-4 h-4" /> Sign Out
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tabs */}
        <div className="flex gap-2 flex-wrap mb-8">
          {tabs.map(tab => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => { if (tab.id !== "add") { resetForm(); } setActiveTab(tab.id as any); }}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold transition-all ${
                  activeTab === tab.id
                    ? "bg-primary text-white shadow-md"
                    : "bg-white border border-border text-muted-foreground hover:border-primary/50 hover:text-primary"
                } ${tab.id === "inventory" && alerts.length > 0 ? "border-red-300 text-red-600" : ""}`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
                {tab.id === "inventory" && alerts.length > 0 && (
                  <span className="bg-red-500 text-white text-[10px] rounded-full w-4 h-4 flex items-center justify-center">{alerts.length}</span>
                )}
              </button>
            );
          })}
        </div>

        {/* Overview */}
        {activeTab === "overview" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              {[
                { label: "Total Products", value: products.length, icon: Package, color: "text-primary" },
                { label: "Available", value: products.filter(p => p.isAvailable).length, icon: Tag, color: "text-green-600" },
                { label: "Low Stock Alerts", value: alerts.length, icon: AlertTriangle, color: "text-amber-600" },
                { label: "Categories", value: categories.length, icon: BarChart3, color: "text-purple-600" },
              ].map((stat, i) => {
                const Icon = stat.icon;
                return (
                  <div key={i} className="bg-white rounded-2xl p-6 shadow-sm border border-border">
                    <Icon className={`w-8 h-8 ${stat.color} mb-3`} />
                    <div className="text-3xl font-serif font-bold text-foreground mb-1">{stat.value}</div>
                    <div className="text-sm text-muted-foreground">{stat.label}</div>
                  </div>
                );
              })}
            </div>

            {/* Recent products */}
            <div className="bg-white rounded-2xl shadow-sm border border-border p-6">
              <h2 className="font-serif text-xl font-bold mb-4">Recent Products</h2>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left py-3 font-semibold text-muted-foreground">Name</th>
                      <th className="text-left py-3 font-semibold text-muted-foreground">Category</th>
                      <th className="text-right py-3 font-semibold text-muted-foreground">Price</th>
                      <th className="text-right py-3 font-semibold text-muted-foreground">Stock</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.slice(0, 5).map(p => (
                      <tr key={p.id} className="border-b border-border/50 last:border-0">
                        <td className="py-3 font-medium">{p.name}</td>
                        <td className="py-3 text-muted-foreground">{p.categoryName}</td>
                        <td className="py-3 text-right text-secondary font-bold">{formatCurrency(p.price)}</td>
                        <td className="py-3 text-right">
                          <span className={`font-bold ${p.stockQuantity <= p.lowStockThreshold ? "text-red-500" : "text-green-600"}`}>
                            {p.stockQuantity}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </motion.div>
        )}

        {/* Products List */}
        {activeTab === "products" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div className="flex justify-between items-center mb-6">
              <h2 className="font-serif text-2xl font-bold text-foreground">All Products ({products.length})</h2>
              <Button onClick={() => { resetForm(); setActiveTab("add"); }} className="bg-primary text-white rounded-full flex items-center gap-2">
                <Plus className="w-4 h-4" /> Add Product
              </Button>
            </div>
            <div className="grid gap-4">
              {products.map(p => (
                <div key={p.id} className="bg-white rounded-2xl p-5 shadow-sm border border-border flex flex-col sm:flex-row sm:items-center gap-4">
                  <div className="w-16 h-16 rounded-xl overflow-hidden bg-muted flex-shrink-0">
                    {p.imageUrls?.[0] ? (
                      <img src={p.imageUrls[0]} alt={p.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                        <Package className="w-8 h-8" />
                      </div>
                    )}
                  </div>
                  <div className="flex-grow">
                    <h3 className="font-bold text-foreground">{p.name}</h3>
                    <div className="text-sm text-muted-foreground">{p.categoryName} · {p.gender}</div>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="text-secondary font-bold">{formatCurrency(p.price)}</span>
                      <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                        p.stockQuantity === 0 ? "bg-red-100 text-red-600" :
                        p.stockQuantity <= p.lowStockThreshold ? "bg-amber-100 text-amber-600" :
                        "bg-green-100 text-green-600"
                      }`}>
                        {p.stockQuantity === 0 ? "Out of stock" : `${p.stockQuantity} in stock`}
                      </span>
                      {!p.isAvailable && <span className="text-xs bg-muted text-muted-foreground px-2 py-0.5 rounded-full">Hidden</span>}
                    </div>
                  </div>
                  <div className="flex gap-2 flex-shrink-0">
                    <Button onClick={() => startEdit(p)} variant="outline" size="sm" className="rounded-xl gap-1.5">
                      <Edit2 className="w-3.5 h-3.5" /> Edit
                    </Button>
                    <Button onClick={() => setDeleteId(p.id)} variant="outline" size="sm" className="rounded-xl gap-1.5 text-destructive border-destructive/30 hover:bg-destructive hover:text-white">
                      <Trash2 className="w-3.5 h-3.5" /> Delete
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Add/Edit Product Form */}
        {activeTab === "add" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <h2 className="font-serif text-2xl font-bold text-foreground mb-6">
              {editProduct ? `Edit: ${editProduct.name}` : "Add New Product"}
            </h2>
            <form onSubmit={handleSave} className="bg-white rounded-2xl shadow-sm border border-border p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <label className="text-sm font-bold text-foreground block mb-2">Product Name *</label>
                  <input required value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                    placeholder="e.g. Black Chiffon Abaya" className="input-field" />
                </div>
                <div className="md:col-span-2">
                  <label className="text-sm font-bold text-foreground block mb-2">Description</label>
                  <textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                    rows={3} placeholder="Describe the product..." className="input-field resize-none" />
                </div>
                <div>
                  <label className="text-sm font-bold text-foreground block mb-2">Price (₦) *</label>
                  <input required type="number" min="0" step="0.01" value={form.price || ""}
                    onChange={e => setForm(f => ({ ...f, price: parseFloat(e.target.value) || 0 }))}
                    placeholder="0.00" className="input-field" />
                </div>
                <div>
                  <label className="text-sm font-bold text-foreground block mb-2">Category</label>
                  {(() => {
                    const gadgetCats = categories.filter(c => c.section === "gadgets");
                    const fashionCats = categories.filter(c => c.section !== "gadgets");
                    const hasGroups = gadgetCats.length > 0 || fashionCats.length > 0;
                    return (
                      <select value={form.categoryId || ""} onChange={e => setForm(f => ({ ...f, categoryId: parseInt(e.target.value) || 0 }))} className="input-field">
                        <option value="">— Select category (optional) —</option>
                        {hasGroups ? (
                          <>
                            {fashionCats.length > 0 && (
                              <optgroup label="👗 Fashion">
                                {fashionCats.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                              </optgroup>
                            )}
                            {gadgetCats.length > 0 && (
                              <optgroup label="📱 Gadgets">
                                {gadgetCats.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                              </optgroup>
                            )}
                          </>
                        ) : (
                          categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)
                        )}
                      </select>
                    );
                  })()}
                </div>
                <div>
                  <label className="text-sm font-bold text-foreground block mb-2">Gender</label>
                  <select value={form.gender} onChange={e => setForm(f => ({ ...f, gender: e.target.value }))} className="input-field">
                    <option value="men">Men</option>
                    <option value="women">Women</option>
                    <option value="kids">Kids</option>
                    <option value="unisex">Unisex</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm font-bold text-foreground block mb-2">Age Group</label>
                  <select value={form.ageGroup} onChange={e => setForm(f => ({ ...f, ageGroup: e.target.value }))} className="input-field">
                    <option value="adults">Adults</option>
                    <option value="kids">Kids</option>
                    <option value="all">All Ages</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm font-bold text-foreground block mb-2">Material</label>
                  <input value={form.material} onChange={e => setForm(f => ({ ...f, material: e.target.value }))}
                    placeholder="e.g. Chiffon, Cotton" className="input-field" />
                </div>
                <div>
                  <label className="text-sm font-bold text-foreground block mb-2">Badge</label>
                  <select value={form.badge} onChange={e => setForm(f => ({ ...f, badge: e.target.value }))} className="input-field">
                    <option value="">None</option>
                    <option value="new">New</option>
                    <option value="hot">Hot</option>
                    <option value="sale">Sale</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm font-bold text-foreground block mb-2">Stock Quantity *</label>
                  <input required type="number" min="0" value={form.stockQuantity}
                    onChange={e => setForm(f => ({ ...f, stockQuantity: parseInt(e.target.value) || 0 }))} className="input-field" />
                </div>
                <div>
                  <label className="text-sm font-bold text-foreground block mb-2">Low Stock Alert Threshold</label>
                  <input type="number" min="0" value={form.lowStockThreshold}
                    onChange={e => setForm(f => ({ ...f, lowStockThreshold: parseInt(e.target.value) || 5 }))} className="input-field" />
                </div>

                {/* Sizes */}
                <div>
                  <label className="text-sm font-bold text-foreground block mb-2">Sizes</label>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {form.sizes.map(s => (
                      <span key={s} className="inline-flex items-center gap-1 bg-primary/10 text-primary rounded-full px-3 py-1 text-sm font-medium">
                        {s}
                        <button type="button" onClick={() => setForm(f => ({ ...f, sizes: f.sizes.filter(x => x !== s) }))}>
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <input value={sizeInput} onChange={e => setSizeInput(e.target.value)}
                      placeholder="e.g. S, M, L or 2-3Y"
                      onKeyDown={e => { if (e.key === "Enter") { e.preventDefault(); if (sizeInput.trim()) { setForm(f => ({ ...f, sizes: [...f.sizes, sizeInput.trim()] })); setSizeInput(""); } } }}
                      className="input-field flex-1" />
                    <Button type="button" variant="outline" size="sm" className="rounded-xl"
                      onClick={() => { if (sizeInput.trim()) { setForm(f => ({ ...f, sizes: [...f.sizes, sizeInput.trim()] })); setSizeInput(""); } }}>
                      Add
                    </Button>
                  </div>
                </div>

                {/* Colors */}
                <div>
                  <label className="text-sm font-bold text-foreground block mb-2">Colors</label>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {form.colors.map(c => (
                      <span key={c} className="inline-flex items-center gap-1 bg-secondary/10 text-secondary rounded-full px-3 py-1 text-sm font-medium">
                        {c}
                        <button type="button" onClick={() => setForm(f => ({ ...f, colors: f.colors.filter(x => x !== c) }))}>
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <input value={colorInput} onChange={e => setColorInput(e.target.value)}
                      placeholder="e.g. Black, Gold"
                      onKeyDown={e => { if (e.key === "Enter") { e.preventDefault(); if (colorInput.trim()) { setForm(f => ({ ...f, colors: [...f.colors, colorInput.trim()] })); setColorInput(""); } } }}
                      className="input-field flex-1" />
                    <Button type="button" variant="outline" size="sm" className="rounded-xl"
                      onClick={() => { if (colorInput.trim()) { setForm(f => ({ ...f, colors: [...f.colors, colorInput.trim()] })); setColorInput(""); } }}>
                      Add
                    </Button>
                  </div>
                </div>

                {/* Image Upload */}
                <div className="md:col-span-2">
                  <label className="text-sm font-bold text-foreground block mb-2">Product Images</label>
                  <div className="flex flex-wrap gap-3 mb-3">
                    {form.imageUrls.map((url, i) => (
                      <div key={i} className="relative w-20 h-20 rounded-xl overflow-hidden border border-border">
                        <img src={url} alt="" className="w-full h-full object-cover" />
                        <button type="button"
                          onClick={() => setForm(f => ({ ...f, imageUrls: f.imageUrls.filter((_, j) => j !== i) }))}
                          className="absolute top-1 right-1 w-5 h-5 bg-black/70 rounded-full flex items-center justify-center text-white">
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                    <button type="button" onClick={() => fileInputRef.current?.click()}
                      className="w-20 h-20 rounded-xl border-2 border-dashed border-border flex items-center justify-center text-muted-foreground hover:border-primary hover:text-primary transition-colors">
                      {uploading ? <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin" /> : <Upload className="w-6 h-6" />}
                    </button>
                    <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                  </div>
                  <p className="text-xs text-muted-foreground">Upload images (max 10MB each)</p>
                </div>

                {/* Toggles */}
                <div className="flex gap-6">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={form.isAvailable} onChange={e => setForm(f => ({ ...f, isAvailable: e.target.checked }))} className="w-4 h-4 rounded" />
                    <span className="text-sm font-medium">Visible to customers</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={form.isFeatured} onChange={e => setForm(f => ({ ...f, isFeatured: e.target.checked }))} className="w-4 h-4 rounded" />
                    <span className="text-sm font-medium">Featured on homepage</span>
                  </label>
                </div>
              </div>

              <div className="flex gap-3 pt-4 border-t border-border">
                <Button type="submit" disabled={saving} className="bg-primary text-white rounded-xl px-8 flex items-center gap-2">
                  <Save className="w-4 h-4" />
                  {saving ? "Saving..." : editProduct ? "Update Product" : "Create Product"}
                </Button>
                <Button type="button" variant="outline" className="rounded-xl" onClick={() => { resetForm(); setActiveTab("products"); }}>
                  Cancel
                </Button>
              </div>
            </form>
          </motion.div>
        )}

        {/* Inventory Alerts */}
        {activeTab === "inventory" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <h2 className="font-serif text-2xl font-bold text-foreground mb-6">
              Inventory Alerts {alerts.length > 0 && <span className="text-red-500">({alerts.length})</span>}
            </h2>
            {alerts.length === 0 ? (
              <div className="bg-white rounded-2xl p-12 text-center shadow-sm border border-border">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Package className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="font-bold text-foreground text-lg mb-2">All Stock Levels OK</h3>
                <p className="text-muted-foreground">No products are running low at the moment.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {alerts.map(p => (
                  <div key={p.id} className={`bg-white rounded-2xl p-5 shadow-sm border-2 flex flex-col sm:flex-row sm:items-center gap-4 ${
                    p.stockQuantity === 0 ? "border-red-300" : "border-amber-300"
                  }`}>
                    <div className="flex-grow">
                      <div className="flex items-center gap-2 mb-1">
                        <AlertTriangle className={`w-4 h-4 ${p.stockQuantity === 0 ? "text-red-500" : "text-amber-500"}`} />
                        <h3 className="font-bold text-foreground">{p.name}</h3>
                      </div>
                      <div className="text-sm text-muted-foreground">{p.categoryName} · {formatCurrency(p.price)}</div>
                      <div className={`mt-2 text-sm font-bold ${p.stockQuantity === 0 ? "text-red-600" : "text-amber-600"}`}>
                        {p.stockQuantity === 0
                          ? "OUT OF STOCK — Restock immediately!"
                          : `Only ${p.stockQuantity} unit${p.stockQuantity !== 1 ? "s" : ""} remaining (threshold: ${p.lowStockThreshold})`}
                      </div>
                    </div>
                    <Button onClick={() => startEdit(p)} variant="outline" size="sm" className="rounded-xl flex-shrink-0">
                      Update Stock
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </div>

      {/* Delete Confirmation */}
      <AnimatePresence>
        {deleteId && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center px-4">
            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }}
              className="bg-white rounded-3xl p-8 max-w-sm w-full shadow-2xl text-center">
              <AlertTriangle className="w-12 h-12 text-destructive mx-auto mb-4" />
              <h3 className="font-serif text-xl font-bold mb-2">Delete Product?</h3>
              <p className="text-muted-foreground mb-6">This action cannot be undone.</p>
              <div className="flex gap-3">
                <Button onClick={() => handleDelete(deleteId)} className="flex-1 bg-destructive text-white rounded-xl">Delete</Button>
                <Button onClick={() => setDeleteId(null)} variant="outline" className="flex-1 rounded-xl">Cancel</Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
