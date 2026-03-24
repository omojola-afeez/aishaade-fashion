import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ProductCard } from "@/components/ProductCard";
import { useListProducts, useListCategories } from "@workspace/api-client-react";
import { cn } from "@/lib/utils";

const GENDER_TABS = [
  { label: "All", value: "all" },
  { label: "Men", value: "men" },
  { label: "Women", value: "women" },
  { label: "Kids", value: "kids" },
];

export default function Catalog() {
  const [activeGender, setActiveGender] = useState("all");
  const [activeCategory, setActiveCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const { data: products, isLoading } = useListProducts();
  const { data: categories } = useListCategories();

  const categoryTabs = useMemo(() => {
    const gender = activeGender === "all" ? undefined : activeGender;
    const filtered = categories?.filter(c => !gender || c.gender === gender || c.gender === "unisex") || [];
    return [{ name: "All", slug: "all" }, ...filtered];
  }, [categories, activeGender]);

  const filteredProducts = useMemo(() => {
    if (!products) return [];
    return products.filter(p => {
      if (activeGender !== "all" && p.gender !== activeGender && p.gender !== "unisex") return false;
      if (activeCategory !== "all" && p.categorySlug !== activeCategory) return false;
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        if (!p.name.toLowerCase().includes(q) && !p.description?.toLowerCase().includes(q)) return false;
      }
      return true;
    });
  }, [products, activeGender, activeCategory, searchQuery]);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-grow pt-20">
        {/* Header Banner */}
        <div className="bg-primary py-16 px-4 text-center relative overflow-hidden">
          <div className="absolute inset-0 opacity-10"
            style={{
              backgroundImage: "repeating-linear-gradient(45deg, rgba(201,146,42,1) 0px, rgba(201,146,42,1) 1px, transparent 1px, transparent 20px), repeating-linear-gradient(-45deg, rgba(201,146,42,1) 0px, rgba(201,146,42,1) 1px, transparent 1px, transparent 20px)"
            }}
          />
          <div className="relative">
            <h1 className="font-serif text-4xl md:text-5xl font-bold text-white mb-3">Our Collections</h1>
            <p className="text-white/70 text-lg">Discover our complete range of Islamic & African fashion</p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          {/* Search */}
          <div className="relative mb-8">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-12 py-4 rounded-2xl border border-border bg-card text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 shadow-sm"
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery("")} className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                <X className="w-5 h-5" />
              </button>
            )}
          </div>

          {/* Gender Filter Tabs */}
          <div className="flex gap-2 flex-wrap mb-4">
            {GENDER_TABS.map(tab => (
              <button
                key={tab.value}
                onClick={() => { setActiveGender(tab.value); setActiveCategory("all"); }}
                className={cn(
                  "px-5 py-2 rounded-full text-sm font-semibold transition-all",
                  activeGender === tab.value
                    ? "bg-primary text-white shadow-md shadow-primary/20"
                    : "bg-card border border-border text-muted-foreground hover:border-primary/50 hover:text-primary"
                )}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Category Filter Tabs */}
          <div className="flex gap-2 flex-wrap mb-8">
            {categoryTabs.map(cat => (
              <button
                key={cat.slug}
                onClick={() => setActiveCategory(cat.slug)}
                className={cn(
                  "px-4 py-1.5 rounded-full text-xs font-semibold transition-all border",
                  activeCategory === cat.slug
                    ? "bg-secondary text-secondary-foreground border-secondary shadow-sm"
                    : "bg-transparent border-border text-muted-foreground hover:border-secondary/50 hover:text-secondary"
                )}
              >
                {cat.name}
              </button>
            ))}
          </div>

          {/* Results count */}
          <div className="flex items-center justify-between mb-6">
            <p className="text-sm text-muted-foreground">
              {isLoading ? "Loading..." : `${filteredProducts.length} item${filteredProducts.length !== 1 ? 's' : ''} found`}
            </p>
            {(activeGender !== "all" || activeCategory !== "all" || searchQuery) && (
              <button
                onClick={() => { setActiveGender("all"); setActiveCategory("all"); setSearchQuery(""); }}
                className="text-sm text-primary hover:underline flex items-center gap-1"
              >
                <X className="w-3 h-3" /> Clear filters
              </button>
            )}
          </div>

          {/* Product Grid */}
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="animate-pulse bg-muted rounded-2xl aspect-[3/4]" />
              ))}
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="text-center py-24">
              <SlidersHorizontal className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="font-serif text-xl font-bold text-foreground mb-2">No products found</h3>
              <p className="text-muted-foreground">Try adjusting your filters or search terms</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredProducts.map((product, i) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <ProductCard product={product} />
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
