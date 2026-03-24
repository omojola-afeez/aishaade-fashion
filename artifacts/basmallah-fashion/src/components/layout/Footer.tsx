import { Link } from "wouter";
import { ShoppingBag, Instagram, Facebook, Twitter, Phone, MapPin } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-primary text-primary-foreground pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2">
              <ShoppingBag className="w-6 h-6 text-secondary" />
              <span className="font-serif text-2xl font-bold text-white tracking-wide">
                Basmallah
              </span>
            </Link>
            <p className="text-primary-foreground/80 leading-relaxed text-sm">
              Discover the true essence of elegant Islamic and African fashion. We provide premium quality Abayas, Jalabias, caps, and materials for the whole family.
            </p>
            <div className="flex gap-4 pt-2">
              <a href="#" className="text-secondary hover:text-white transition-colors"><Instagram className="w-5 h-5" /></a>
              <a href="#" className="text-secondary hover:text-white transition-colors"><Facebook className="w-5 h-5" /></a>
              <a href="#" className="text-secondary hover:text-white transition-colors"><Twitter className="w-5 h-5" /></a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-serif text-lg font-bold text-white mb-4">Shop</h3>
            <ul className="space-y-3">
              <li><Link href="/catalog" className="text-primary-foreground/80 hover:text-secondary transition-colors">All Collections</Link></li>
              <li><Link href="/catalog?category=Men" className="text-primary-foreground/80 hover:text-secondary transition-colors">Men's Jalabia</Link></li>
              <li><Link href="/catalog?category=Women" className="text-primary-foreground/80 hover:text-secondary transition-colors">Women's Abaya</Link></li>
              <li><Link href="/catalog?category=Kids" className="text-primary-foreground/80 hover:text-secondary transition-colors">Kids' Wear</Link></li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h3 className="font-serif text-lg font-bold text-white mb-4">Support</h3>
            <ul className="space-y-3">
              <li><a href="#" className="text-primary-foreground/80 hover:text-secondary transition-colors">Sizing Guide</a></li>
              <li><a href="#" className="text-primary-foreground/80 hover:text-secondary transition-colors">Shipping & Returns</a></li>
              <li><a href="#" className="text-primary-foreground/80 hover:text-secondary transition-colors">FAQ</a></li>
              <li><a href="#" className="text-primary-foreground/80 hover:text-secondary transition-colors">Contact Us</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-serif text-lg font-bold text-white mb-4">Contact Info</h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3 text-primary-foreground/80">
                <MapPin className="w-5 h-5 text-secondary shrink-0 mt-0.5" />
                <span>123 Fashion Avenue, Lagos, Nigeria</span>
              </li>
              <li className="flex items-center gap-3 text-primary-foreground/80">
                <Phone className="w-5 h-5 text-secondary shrink-0" />
                <span>+234 801 234 5678</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-primary-foreground/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-primary-foreground/60">
            &copy; {new Date().getFullYear()} Basmallah Fashion. All rights reserved.
          </p>
          <Link href="/admin/login" className="text-xs text-primary-foreground/40 hover:text-secondary transition-colors">
            Admin Portal
          </Link>
        </div>
      </div>
    </footer>
  );
}
