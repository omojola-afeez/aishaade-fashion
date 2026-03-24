import { Link } from "wouter";
import { Instagram, Facebook, Twitter, Phone, MapPin } from "lucide-react";
import { AishaAdeLogo } from "@/components/AishaAdeLogo";

export function Footer() {
  return (
    <footer className="bg-primary text-primary-foreground pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <div className="space-y-4">
            <Link href="/">
              <AishaAdeLogo size={38} variant="full" light={true} />
            </Link>
            <p className="text-primary-foreground/70 leading-relaxed text-sm mt-4">
              Discover the true essence of elegant Islamic and African fashion. Premium Abayas, Jalabias, caps, and materials for the whole family.
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
              <li><Link href="/catalog" className="text-primary-foreground/70 hover:text-secondary transition-colors">All Collections</Link></li>
              <li><Link href="/catalog?category=men" className="text-primary-foreground/70 hover:text-secondary transition-colors">Men's Jalabia</Link></li>
              <li><Link href="/catalog?category=women" className="text-primary-foreground/70 hover:text-secondary transition-colors">Women's Abaya</Link></li>
              <li><Link href="/catalog?category=kids" className="text-primary-foreground/70 hover:text-secondary transition-colors">Kids' Wear</Link></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="font-serif text-lg font-bold text-white mb-4">Support</h3>
            <ul className="space-y-3">
              <li><a href="#" className="text-primary-foreground/70 hover:text-secondary transition-colors">Sizing Guide</a></li>
              <li><a href="#" className="text-primary-foreground/70 hover:text-secondary transition-colors">Shipping & Returns</a></li>
              <li><a href="#" className="text-primary-foreground/70 hover:text-secondary transition-colors">FAQ</a></li>
              <li><a href="#" className="text-primary-foreground/70 hover:text-secondary transition-colors">Contact Us</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-serif text-lg font-bold text-white mb-4">Contact Info</h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3 text-primary-foreground/70">
                <MapPin className="w-5 h-5 text-secondary shrink-0 mt-0.5" />
                <span>20 Akinyemi Street, Ayegbami, Giwa Junction, Iju Ishaga, Lagos</span>
              </li>
              <li className="flex items-start gap-3 text-primary-foreground/70">
                <MapPin className="w-5 h-5 text-secondary shrink-0 mt-0.5" />
                <span>Shop 2, Adjacent Alhikmah University, Mandate, Ilorin</span>
              </li>
              <li className="flex items-center gap-3 text-primary-foreground/70">
                <Phone className="w-5 h-5 text-secondary shrink-0" />
                <a href="https://wa.me/2347062921566" className="hover:text-secondary transition-colors">+234 706 292 1566</a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-primary-foreground/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-primary-foreground/50">
            &copy; {new Date().getFullYear()} AishaADe Fashion. All rights reserved.
          </p>
          <Link href="/admin" className="text-xs text-primary-foreground/30 hover:text-secondary transition-colors">
            Admin Portal
          </Link>
        </div>
      </div>
    </footer>
  );
}
