import ProductCarouselSection from "@/components/home/ProductCarouselSection";
import type { Product } from "@/types/product";

export default function BestSellers({ products }: { products: Product[] }) {
  return <ProductCarouselSection title="Best Sellers" description="Discover the books readers return to most, from trusted faith resources to practical guides and memorable stories." href="/allproducts?collection=bestseller" products={products} background="bg-[#fffaf5]" />;
}
