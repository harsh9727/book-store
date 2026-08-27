import Link from "next/link";
import { products } from "@/data/products";
import ProductGrid from "@/components/product/ProductGrid";
import { BookOpen, Sparkles } from "lucide-react";

export default function ProductIndexPage() {
  return (
    <div className="container mx-auto px-4 py-10 md:py-14">
      {/* Header Banner */}
      <div className="mb-10 text-center max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-1.5 rounded-full bg-orange-100/80 px-3.5 py-1 text-xs font-semibold text-orange-700 mb-3">
          <Sparkles size={14} />
          <span>Curated Books Collection</span>
        </div>
        <h1 className="title text-3xl font-extrabold tracking-tight text-gray-900 md:text-4xl">
          Explore Our Book Catalog
        </h1>
        <p className="description mt-3 text-sm text-gray-600">
          Discover bestsellers, life-changing self-help guides, thrilling mysteries, and timeless classics.
        </p>
      </div>

      {/* Grid of Books */}
      <ProductGrid products={products} />
    </div>
  );
}
