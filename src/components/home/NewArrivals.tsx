import ProductCarouselSection from "@/components/home/ProductCarouselSection";
import type { Product } from "@/types/product";

export default function NewArrivals({ products }: { products: Product[] }) {
  return <ProductCarouselSection title="New Releases" description="Explore the latest Christian books, devotionals, study guides, children’s books, and inspiring titles recently added to our collection." href="/allproducts?collection=new" products={products} />;
}
