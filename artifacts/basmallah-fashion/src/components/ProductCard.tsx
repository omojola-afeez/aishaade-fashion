import { Link } from "wouter";
import { formatCurrency } from "@/lib/utils";
import type { Product } from "@workspace/api-client-react";
import { Badge } from "@/components/ui/badge";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const mainImage = product.imageUrls?.[0] || "https://images.unsplash.com/photo-1589902860314-e910cb06d503?w=500&h=750&fit=crop";

  return (
    <Link href={`/product/${product.id}`}>
      <div className="group relative bg-card rounded-2xl overflow-hidden border border-border/50 shadow-sm hover:shadow-xl hover:border-secondary/40 transition-all duration-300 hover:-translate-y-1 cursor-pointer flex flex-col h-full">
        {/* Image Container */}
        <div className="aspect-[3/4] overflow-hidden bg-muted relative">
          <img 
            src={mainImage} 
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
          
          {/* Overlays */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          
          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-2">
            {product.badge && (
              <Badge className="bg-secondary text-secondary-foreground uppercase tracking-wider text-[10px] font-bold px-2 py-0.5 shadow-sm">
                {product.badge}
              </Badge>
            )}
            {!product.isAvailable && (
              <Badge variant="destructive" className="uppercase tracking-wider text-[10px] font-bold px-2 py-0.5 shadow-sm">
                Out of Stock
              </Badge>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="p-5 flex flex-col flex-grow">
          <div className="mb-1 text-xs font-medium text-muted-foreground uppercase tracking-wider">
            {product.categoryName || product.gender || 'Apparel'}
          </div>
          <h3 className="font-serif text-lg font-bold text-foreground leading-tight mb-2 line-clamp-2 group-hover:text-primary transition-colors">
            {product.name}
          </h3>
          <div className="mt-auto pt-4 flex items-end justify-between">
            <span className="text-secondary font-bold text-lg">
              {formatCurrency(product.price)}
            </span>
            <span className="text-sm text-primary font-medium opacity-0 group-hover:opacity-100 transition-opacity transform translate-x-2 group-hover:translate-x-0 duration-300">
              View Details →
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
