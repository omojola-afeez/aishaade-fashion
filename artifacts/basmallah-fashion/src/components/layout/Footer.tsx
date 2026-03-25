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
              Your one-stop hub for premium Islamic & African fashion — Abayas, Kaftans, Jalabias — and the latest gadgets. For the whole family.
            </p>
            <div className="flex gap-4 pt-2">
              <a href="#" className="text-secondary hover:text-white transition-colors"><Instagram className="w-5 h-5" /></a>
              <a href="#" className="text-secondary hover:text-white transition-colors"><Facebook className="w-5 h-5" /></a>
              <a href="#" className="text-secondary hover:text-white transition-colors"><Twitter className="w-5 h-5" /></a>
            </div>
          </div>

          {/* Fashion Links */}
          <div>
            <h3 className="font-serif text-lg font-bold text-white mb-4">👗 Fashion</h3>
            <ul className="space-y-3">
              <li><Link href="/catalog?category=women" className="text-primary-foreground/70 hover:text-secondary transition-colors">Women's Collection</Link></li>
              <li><Link href="/catalog?category=men" className="text-primary-foreground/70 hover:text-secondary transition-colors">Men's Collection</Link></li>
              <li><Link href="/catalog?category=kids" className="text-primary-foreground/70 hover:text-secondary transition-colors">Kids' Wear</Link></li>
              <li><Link href="/catalog?category=hijab" className="text-primary-foreground/70 hover:text-secondary transition-colors">Hijab & Accessories</Link></li>
              <li><Link href="/catalog?section=fashion" className="text-primary-foreground/70 hover:text-secondary transition-colors">All Fashion</Link></li>
            </ul>
          </div>

          {/* Gadgets Links */}
          <div>
            <h3 className="font-serif text-lg font-bold text-white mb-4">📱 Gadgets</h3>
            <ul className="space-y-3">
              <li><Link href="/catalog?category=phones" className="text-primary-foreground/70 hover:text-secondary transition-colors">Phones & Accessories</Link></li>
              <li><Link href="/catalog?category=laptops" className="text-primary-foreground/70 hover:text-secondary transition-colors">Laptops & Computers</Link></li>
              <li><Link href="/catalog?category=smart-watches" className="text-primary-foreground/70 hover:text-secondary transition-colors">Smart Watches</Link></li>
              <li><Link href="/catalog?category=audio" className="text-primary-foreground/70 hover:text-secondary transition-colors">Audio & Earphones</Link></li>
              <li><Link href="/catalog?section=gadgets" className="text-primary-foreground/70 hover:text-secondary transition-colors">All Gadgets</Link></li>
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
            &copy; {new Date().getFullYear()} AishaADe Fashion & Gadgets Hub. All rights reserved.
          </p>
          <Link href="/admin" className="text-xs text-primary-foreground/30 hover:text-secondary transition-colors">
            Admin Portal
          </Link>
        </div>
      </div>
    </footer>
  );
}
