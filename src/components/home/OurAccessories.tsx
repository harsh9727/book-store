import ProductCarouselSection from "@/components/home/ProductCarouselSection";
import type { Product } from "@/types/product";

export default function OurAccessories({ products }: { products: Product[] }) {
  return <ProductCarouselSection title="Our Accessories" description="Thoughtful essentials for readers, gifting, and creating a peaceful study space with comfort and style." href="/allproducts?collection=accessories" products={products} background="bg-[#fffaf5]" />;
}
