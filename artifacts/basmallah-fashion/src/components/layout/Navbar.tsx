import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { Menu, X, ShoppingBag } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [location] = useLocation();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Catalog", href: "/catalog" },
    { name: "Men", href: "/catalog?category=men" },
    { name: "Women", href: "/catalog?category=women" },
    { name: "Kids", href: "/catalog?category=kids" },
  ];

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        isScrolled
          ? "bg-background/95 backdrop-blur-md shadow-md py-3"
          : "bg-primary py-4"
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center text-secondary-foreground group-hover:scale-105 transition-transform duration-300">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <div>
              <span className={cn("font-serif text-xl font-bold block tracking-wide transition-colors", isScrolled ? "text-primary" : "text-white")}>
                Basmallah
              </span>
              <span className={cn("text-[10px] uppercase tracking-widest transition-colors", isScrolled ? "text-muted-foreground" : "text-white/60")}>
                Fashion
              </span>
            </div>
          </Link>

          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className={cn(
                  "px-4 py-2 rounded-lg text-sm font-medium transition-all",
                  isScrolled
                    ? "hover:bg-muted text-foreground/80 hover:text-foreground"
                    : "hover:bg-white/10 text-white/80 hover:text-white",
                  location === link.href && (isScrolled ? "text-primary font-bold" : "text-white font-bold bg-white/10")
                )}
              >
                {link.name}
              </Link>
            ))}
            <a
              href="https://wa.me/2348012345678"
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

      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="md:hidden bg-primary border-t border-white/10 overflow-hidden"
          >
            <div className="px-4 py-6 flex flex-col gap-2">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={cn(
                    "text-base font-medium py-3 px-4 rounded-lg",
                    location === link.href ? "bg-white/15 text-white font-bold" : "text-white/80"
                  )}
                >
                  {link.name}
                </Link>
              ))}
              <a
                href="https://wa.me/2348012345678"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 bg-secondary text-secondary-foreground font-bold rounded-full px-5 py-3 text-center shadow-lg"
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
