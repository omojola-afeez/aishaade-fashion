import { motion } from "framer-motion";
import { Link } from "wouter";
import { ArrowRight, Star, ShoppingBag, Users, CheckCircle, Smartphone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ProductCard } from "@/components/ProductCard";
import { useListProducts, useListCategories } from "@workspace/api-client-react";
import { getAssetPath } from "@/lib/utils";

export default function Home() {
  const { data: products, isLoading: isLoadingProducts } = useListProducts();
  const { data: categories } = useListCategories();

  const featuredFashion = products?.filter(p => p.isFeatured).slice(0, 4) || products?.slice(0, 4) || [];

  const stats = [
    { label: "Premium Items", value: products?.length || 150, icon: ShoppingBag },
    { label: "Happy Customers", value: "250+", icon: Users },
    { label: "Categories", value: categories?.length || 13, icon: CheckCircle },
    { label: "Average Rating", value: "4.9/5", icon: Star },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-grow">
        {/* Hero Section */}
        <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 overflow-hidden">
          <div className="absolute inset-0 z-0">
            <img
              src={getAssetPath('images/hero-bg.png')}
              alt="Regal Pattern"
              className="w-full h-full object-cover object-center"
            />
            <div className="absolute inset-0 bg-primary/90 mix-blend-multiply" />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
          </div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="max-w-3xl mx-auto"
            >
              <span className="inline-block py-1 px-3 rounded-full bg-secondary/20 text-secondary border border-secondary/30 text-sm font-semibold tracking-widest uppercase mb-6 shadow-lg shadow-secondary/10">
                Fashion & Gadgets
              </span>
              <h1 className="font-serif text-5xl md:text-7xl font-bold text-white leading-tight mb-6 drop-shadow-lg">
                Style Meets <span className="text-secondary italic">Technology</span>
              </h1>
              <p className="text-lg md:text-xl text-primary-foreground/90 mb-10 leading-relaxed">
                Discover premium Islamic & African fashion — Abayas, Kaftans, Jalabias — and the latest gadgets, all in one place. For the whole family.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link href="/catalog?section=fashion">
                  <Button size="lg" className="w-full sm:w-auto bg-secondary hover:bg-secondary/90 text-secondary-foreground font-bold rounded-full px-8 py-6 text-lg shadow-xl shadow-secondary/20 transition-all hover:-translate-y-1">
                    Shop Fashion
                  </Button>
                </Link>
                <Link href="/catalog?section=gadgets">
                  <Button size="lg" variant="outline" className="w-full sm:w-auto border-white/30 text-white hover:bg-white/10 rounded-full px-8 py-6 text-lg backdrop-blur-sm transition-all hover:-translate-y-1">
                    Shop Gadgets
                  </Button>
                </Link>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Stats */}
        <section className="py-12 bg-background border-b border-border/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 divide-x-0 md:divide-x divide-border/50">
              {stats.map((stat, i) => {
                const Icon = stat.icon;
                return (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    className="flex flex-col items-center text-center px-4"
                  >
                    <div className="w-12 h-12 rounded-full bg-primary/5 flex items-center justify-center mb-4 text-primary">
                      <Icon className="w-6 h-6" />
                    </div>
                    <h3 className="text-3xl font-serif font-bold text-foreground mb-1">{stat.value}</h3>
                    <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider">{stat.label}</p>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Fashion Section */}
        <section className="py-24 bg-muted/30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <span className="inline-block py-1 px-3 rounded-full bg-primary/10 text-primary text-xs font-bold tracking-widest uppercase mb-3">Fashion</span>
              <h2 className="font-serif text-4xl font-bold text-foreground mb-4">Shop Clothing</h2>
              <div className="w-24 h-1 bg-secondary mx-auto rounded-full" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                { title: "Women's Collection", image: getAssetPath('images/category-women.png'), link: "/catalog?category=women" },
                { title: "Men's Collection", image: getAssetPath('images/category-men.png'), link: "/catalog?category=men" },
                { title: "Kids' Collection", image: getAssetPath('images/category-kids.png'), link: "/catalog?category=kids" },
              ].map((cat, i) => (
                <Link key={i} href={cat.link}>
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.15 }}
                    className="group relative rounded-3xl overflow-hidden aspect-[4/5] cursor-pointer shadow-lg"
                  >
                    <img src={cat.image} alt={cat.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                    <div className="absolute inset-0 bg-gradient-to-t from-primary/90 via-primary/20 to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-8 flex items-end justify-between">
                      <h3 className="font-serif text-3xl font-bold text-white">{cat.title}</h3>
                      <div className="w-12 h-12 rounded-full bg-secondary/90 flex items-center justify-center text-secondary-foreground opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300">
                        <ArrowRight className="w-6 h-6" />
                      </div>
                    </div>
                  </motion.div>
                </Link>
              ))}
            </div>

            <div className="mt-10 text-center">
              <Link href="/catalog?section=fashion">
                <Button variant="outline" className="rounded-full border-primary text-primary px-8">
                  View All Fashion <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Gadgets Section */}
        <section className="py-24 bg-background">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <span className="inline-block py-1 px-3 rounded-full bg-secondary/15 text-secondary text-xs font-bold tracking-widest uppercase mb-3">Gadgets</span>
              <h2 className="font-serif text-4xl font-bold text-foreground mb-4">Shop Electronics</h2>
              <div className="w-24 h-1 bg-secondary mx-auto rounded-full" />
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {[
                { title: "Phones & Accessories", icon: "📱", link: "/catalog?category=phones" },
                { title: "Laptops & Computers", icon: "💻", link: "/catalog?category=laptops" },
                { title: "Smart Watches", icon: "⌚", link: "/catalog?category=smart-watches" },
                { title: "Audio & Earphones", icon: "🎧", link: "/catalog?category=audio" },
                { title: "Power Banks", icon: "🔋", link: "/catalog?category=power-banks" },
                { title: "Accessories", icon: "🔌", link: "/catalog?category=gadget-accessories" },
              ].map((cat, i) => (
                <Link key={i} href={cat.link}>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.08 }}
                    className="group flex flex-col items-center justify-center p-6 rounded-2xl bg-muted/50 hover:bg-primary hover:text-white cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:shadow-lg text-center border border-border/30"
                  >
                    <span className="text-4xl mb-3">{cat.icon}</span>
                    <span className="text-sm font-semibold leading-snug group-hover:text-white text-foreground">{cat.title}</span>
                  </motion.div>
                </Link>
              ))}
            </div>

            <div className="mt-10 text-center">
              <Link href="/catalog?section=gadgets">
                <Button className="rounded-full bg-primary text-white px-8">
                  Browse All Gadgets <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Featured Fashion Products */}
        <section className="py-24 bg-muted/30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-end mb-12">
              <div>
                <h2 className="font-serif text-4xl font-bold text-foreground mb-4">Featured Attire</h2>
                <div className="w-24 h-1 bg-secondary rounded-full" />
              </div>
              <Link href="/catalog" className="hidden sm:flex items-center text-primary font-bold hover:text-secondary transition-colors group">
                View All <ArrowRight className="ml-2 w-5 h-5 transform group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

            {isLoadingProducts ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                {[1, 2, 3, 4].map(i => (
                  <div key={i} className="animate-pulse bg-muted rounded-2xl aspect-[3/4]" />
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                {featuredFashion.map((product, i) => (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                  >
                    <ProductCard product={product} />
                  </motion.div>
                ))}
              </div>
            )}

            <div className="mt-12 text-center sm:hidden">
              <Link href="/catalog">
                <Button variant="outline" className="w-full rounded-full border-primary text-primary">
                  View All Products
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
