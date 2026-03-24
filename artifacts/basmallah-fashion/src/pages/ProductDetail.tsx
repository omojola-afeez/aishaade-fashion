import { useState } from "react";
import { useParams, Link } from "wouter";
import { motion } from "framer-motion";
import { ArrowLeft, ShoppingBag, CheckCircle, AlertTriangle, ChevronLeft, ChevronRight, Package } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useGetProduct } from "@workspace/api-client-react";
import { formatCurrency } from "@/lib/utils";

const WHATSAPP_NUMBER = "2348012345678";

export default function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const [activeImage, setActiveImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);

  const { data: product, isLoading } = useGetProduct(Number(id));

  const images = product?.imageUrls?.length
    ? product.imageUrls
    : ["https://images.unsplash.com/photo-1589902860314-e910cb06d503?w=800&h=1100&fit=crop"];

  const isLowStock = product && product.stockQuantity <= product.lowStockThreshold && product.stockQuantity > 0;
  const isOutOfStock = product && product.stockQuantity === 0;

  const handleWhatsApp = () => {
    if (!product) return;
    const size = selectedSize ? ` - Size: ${selectedSize}` : '';
    const color = selectedColor ? ` - Color: ${selectedColor}` : '';
    const msg = `Hello! I'd like to order:\n\n*${product.name}*${size}${color}\nPrice: ${formatCurrency(product.price)}\n\nPlease confirm availability. Thank you!`;
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`, "_blank");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow pt-20 flex items-center justify-center">
          <div className="animate-pulse space-y-4 w-full max-w-5xl px-4 pt-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="aspect-[3/4] bg-muted rounded-3xl" />
              <div className="space-y-4">
                <div className="h-8 bg-muted rounded w-3/4" />
                <div className="h-6 bg-muted rounded w-1/3" />
                <div className="h-24 bg-muted rounded" />
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow pt-20 flex items-center justify-center">
          <div className="text-center">
            <Package className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h2 className="font-serif text-2xl font-bold mb-2">Product Not Found</h2>
            <Link href="/catalog">
              <Button>Back to Catalog</Button>
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-grow pt-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          {/* Breadcrumb */}
          <Link href="/catalog" className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary mb-8 text-sm">
            <ArrowLeft className="w-4 h-4" /> Back to Catalog
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Images */}
            <div className="space-y-4">
              <div className="aspect-[3/4] rounded-3xl overflow-hidden bg-muted relative group">
                <motion.img
                  key={activeImage}
                  src={images[activeImage]}
                  alt={product.name}
                  className="w-full h-full object-cover"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                />
                {images.length > 1 && (
                  <>
                    <button
                      onClick={() => setActiveImage(i => (i - 1 + images.length) % images.length)}
                      className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 rounded-full flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <ChevronLeft className="w-5 h-5 text-primary" />
                    </button>
                    <button
                      onClick={() => setActiveImage(i => (i + 1) % images.length)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 rounded-full flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <ChevronRight className="w-5 h-5 text-primary" />
                    </button>
                  </>
                )}
                {product.badge && (
                  <div className="absolute top-4 left-4">
                    <Badge className="bg-secondary text-secondary-foreground uppercase tracking-wider text-xs font-bold px-3 py-1 shadow">
                      {product.badge}
                    </Badge>
                  </div>
                )}
              </div>
              {images.length > 1 && (
                <div className="flex gap-3 overflow-x-auto pb-2">
                  {images.map((img, i) => (
                    <button
                      key={i}
                      onClick={() => setActiveImage(i)}
                      className={`w-20 h-20 rounded-xl overflow-hidden flex-shrink-0 border-2 transition-all ${activeImage === i ? "border-secondary" : "border-transparent opacity-60"}`}
                    >
                      <img src={img} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Details */}
            <div className="space-y-6">
              <div>
                <div className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-2">
                  {product.categoryName || product.gender || "Apparel"}
                </div>
                <h1 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-4 leading-tight">
                  {product.name}
                </h1>
                <div className="text-3xl font-bold text-secondary font-serif">
                  {formatCurrency(product.price)}
                </div>
              </div>

              {/* Stock Status */}
              {isOutOfStock ? (
                <div className="flex items-center gap-2 text-destructive bg-destructive/10 rounded-xl p-3">
                  <AlertTriangle className="w-4 h-4" />
                  <span className="text-sm font-medium">Out of Stock</span>
                </div>
              ) : isLowStock ? (
                <div className="flex items-center gap-2 text-amber-600 bg-amber-50 rounded-xl p-3">
                  <AlertTriangle className="w-4 h-4" />
                  <span className="text-sm font-medium">Only {product.stockQuantity} left — Order soon!</span>
                </div>
              ) : (
                <div className="flex items-center gap-2 text-emerald-600 bg-emerald-50 rounded-xl p-3">
                  <CheckCircle className="w-4 h-4" />
                  <span className="text-sm font-medium">In Stock ({product.stockQuantity} available)</span>
                </div>
              )}

              {/* Description */}
              {product.description && (
                <p className="text-muted-foreground leading-relaxed">{product.description}</p>
              )}

              {/* Sizes */}
              {product.sizes && product.sizes.length > 0 && (
                <div>
                  <h3 className="text-sm font-bold text-foreground uppercase tracking-wider mb-3">Size</h3>
                  <div className="flex flex-wrap gap-2">
                    {product.sizes.map(size => (
                      <button
                        key={size}
                        onClick={() => setSelectedSize(size === selectedSize ? null : size)}
                        className={`px-4 py-2 rounded-xl text-sm font-medium border-2 transition-all ${
                          selectedSize === size
                            ? "border-secondary bg-secondary text-secondary-foreground"
                            : "border-border text-foreground hover:border-secondary/50"
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Colors */}
              {product.colors && product.colors.length > 0 && (
                <div>
                  <h3 className="text-sm font-bold text-foreground uppercase tracking-wider mb-3">Color</h3>
                  <div className="flex flex-wrap gap-2">
                    {product.colors.map(color => (
                      <button
                        key={color}
                        onClick={() => setSelectedColor(color === selectedColor ? null : color)}
                        className={`px-4 py-2 rounded-xl text-sm font-medium border-2 transition-all ${
                          selectedColor === color
                            ? "border-secondary bg-secondary text-secondary-foreground"
                            : "border-border text-foreground hover:border-secondary/50"
                        }`}
                      >
                        {color}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Material */}
              {product.material && (
                <div className="flex gap-4 text-sm">
                  <span className="text-muted-foreground">Material:</span>
                  <span className="font-medium text-foreground">{product.material}</span>
                </div>
              )}

              {/* Order Button */}
              <Button
                onClick={handleWhatsApp}
                disabled={isOutOfStock}
                className="w-full bg-green-600 hover:bg-green-700 text-white font-bold rounded-2xl py-6 text-lg shadow-lg shadow-green-600/20 transition-all hover:-translate-y-1 flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
              >
                <svg viewBox="0 0 24 24" className="w-6 h-6 fill-current"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                {isOutOfStock ? "Out of Stock" : "Order via WhatsApp"}
              </Button>

              <p className="text-xs text-center text-muted-foreground">
                Click to open WhatsApp and send your order directly
              </p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
