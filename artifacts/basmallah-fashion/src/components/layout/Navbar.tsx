import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { Menu, X, ChevronDown, Shirt, Smartphone } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { AishaAdeLogo } from "@/components/AishaAdeLogo";

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [fashionOpen, setFashionOpen] = useState(false);
  const [gadgetsOpen, setGadgetsOpen] = useState(false);
  const [location] = useLocation();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const fashionLinks = [
    { name: "All Fashion", href: "/catalog?section=fashion" },
    { name: "Women's Collection", href: "/catalog?category=women" },
    { name: "Men's Collection", href: "/catalog?category=men" },
    { name: "Kids' Wear", href: "/catalog?category=kids" },
    { name: "Abayas", href: "/catalog?category=abaya" },
    { name: "Jalabias", href: "/catalog?category=jalabia" },
    { name: "Kaftans", href: "/catalog?category=kaftan" },
    { name: "Hijab & Accessories", href: "/catalog?category=hijab" },
  ];

  const gadgetLinks = [
    { name: "All Gadgets", href: "/catalog?section=gadgets" },
    { name: "Phones & Accessories", href: "/catalog?category=phones" },
    { name: "Laptops & Computers", href: "/catalog?category=laptops" },
    { name: "Smart Watches", href: "/catalog?category=smart-watches" },
    { name: "Audio & Earphones", href: "/catalog?category=audio" },
    { name: "Power Banks", href: "/catalog?category=power-banks" },
  ];

  const linkClass = (scrolled: boolean) =>
    cn(
      "flex items-center gap-1 px-4 py-2 rounded-lg text-sm font-medium transition-all",
      scrolled
        ? "hover:bg-muted text-foreground/80 hover:text-foreground"
        : "hover:bg-white/10 text-white/80 hover:text-white"
    );

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        isScrolled ? "bg-background/95 backdrop-blur-md shadow-md py-3" : "bg-primary py-4"
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          <Link href="/">
            <AishaAdeLogo size={40} variant="full" light={!isScrolled} />
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">
            <Link href="/" className={linkClass(isScrolled)}>Home</Link>

            {/* Fashion Dropdown */}
            <div className="relative" onMouseEnter={() => setFashionOpen(true)} onMouseLeave={() => setFashionOpen(false)}>
              <button className={cn(linkClass(isScrolled), "flex items-center gap-1")}>
                <Shirt className="w-4 h-4" /> Fashion <ChevronDown className={cn("w-3.5 h-3.5 transition-transform", fashionOpen && "rotate-180")} />
              </button>
              <AnimatePresence>
                {fashionOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 8 }}
                    className="absolute top-full left-0 mt-1 w-52 bg-white rounded-2xl shadow-xl border border-border/20 py-2 z-50"
                  >
                    {fashionLinks.map(l => (
                      <Link key={l.name} href={l.href} className="block px-4 py-2.5 text-sm text-foreground hover:bg-primary/5 hover:text-primary transition-colors">
                        {l.name}
                      </Link>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Gadgets Dropdown */}
            <div className="relative" onMouseEnter={() => setGadgetsOpen(true)} onMouseLeave={() => setGadgetsOpen(false)}>
              <button className={cn(linkClass(isScrolled), "flex items-center gap-1")}>
                <Smartphone className="w-4 h-4" /> Gadgets <ChevronDown className={cn("w-3.5 h-3.5 transition-transform", gadgetsOpen && "rotate-180")} />
              </button>
              <AnimatePresence>
                {gadgetsOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 8 }}
                    className="absolute top-full left-0 mt-1 w-52 bg-white rounded-2xl shadow-xl border border-border/20 py-2 z-50"
                  >
                    {gadgetLinks.map(l => (
                      <Link key={l.name} href={l.href} className="block px-4 py-2.5 text-sm text-foreground hover:bg-secondary/10 hover:text-secondary transition-colors">
                        {l.name}
                      </Link>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <a
              href="https://wa.me/2347062921566"
              target="_blank"
              rel="noopener noreferrer"
              className="ml-3 bg-secondary hover:bg-secondary/90 text-secondary-foreground font-bold rounded-full px-5 py-2 text-sm shadow-lg transition-all hover:-translate-y-0.5 flex items-center gap-2"
            >
              Order on WhatsApp
            </a>
          </nav>

          <button
            className={cn("md:hidden p-2", isScrolled ? "text-foreground" : "text-white")}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="md:hidden bg-primary border-t border-white/10 overflow-hidden"
          >
            <div className="px-4 py-6 flex flex-col gap-1">
              <Link href="/" onClick={() => setMobileMenuOpen(false)} className="text-white/80 py-2.5 px-4 font-medium">Home</Link>

              <div className="py-1 px-4 text-xs font-bold text-secondary/70 uppercase tracking-widest mt-2">Fashion</div>
              {fashionLinks.map(l => (
                <Link key={l.name} href={l.href} onClick={() => setMobileMenuOpen(false)} className="text-white/80 py-2.5 px-6 text-sm hover:text-white">
                  {l.name}
                </Link>
              ))}

              <div className="py-1 px-4 text-xs font-bold text-secondary/70 uppercase tracking-widest mt-2">Gadgets</div>
              {gadgetLinks.map(l => (
                <Link key={l.name} href={l.href} onClick={() => setMobileMenuOpen(false)} className="text-white/80 py-2.5 px-6 text-sm hover:text-white">
                  {l.name}
                </Link>
              ))}

              <a
                href="https://wa.me/2347062921566"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 bg-secondary text-secondary-foreground font-bold rounded-full px-5 py-3 text-center shadow-lg"
                onClick={() => setMobileMenuOpen(false)}
              >
                Order on WhatsApp
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
