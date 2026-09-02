import ProductCarouselSection from "@/components/home/ProductCarouselSection";
import type { Product } from "@/types/product";

export default function Trendings({ products }: { products: Product[] }) {
  return <ProductCarouselSection title="Trending Products" description="Explore popular books, Bibles, devotionals, and inspirational titles currently attracting readers." href="/allproducts?collection=trending" products={products} />;
}
