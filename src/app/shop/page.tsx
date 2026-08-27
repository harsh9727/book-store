import { products } from "@/data/products";
import { shopFaqs } from "@/data/faqs";
import ProductGrid from "@/components/product/ProductGrid";
import Faq from "@/components/common/Faq";
import { Sparkles, ShoppingBag } from "lucide-react";

export default function Shop() {
  return (
    <div className="container mx-auto px-4 py-10 md:py-14">
      {/* Header Banner */}
      <div className="mb-10 text-center max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-1.5 rounded-full bg-orange-100/80 px-3.5 py-1 text-sm font-semibold description tracking-wide text-orange-700 mb-3">
          <Sparkles size={15} />
          <span>Complete Bookstore Catalog</span>
        </div>
        <h1 className="title text-3xl font-extrabold tracking-tight text-gray-900 md:text-5xl">
          Explore All Books
        </h1>
        <p className="description mt-3 text-sm md:text-base text-gray-600">
          Browse our curated catalog across fiction, self-help, business, Christian devotionals, and new releases.
        </p>
      </div>

      {/* Grid of Books */}
      <ProductGrid products={products} />

      {/* Shop FAQ Section */}
      <div className="mt-20 border-t border-gray-100 pt-12">
        <div className="bg-orange-50/70 rounded-3xl p-6 sm:p-10 border border-orange-100/80 shadow-sm max-w-5xl mx-auto">
          <Faq
            faqs={shopFaqs}
            badge="Shopping Guide"
            title="Bookstore & Ordering FAQs"
            subtitle="Everything you need to know about formats, shipping methods, and ordering policies."
          />
        </div>
      </div>
    </div>
  );
}
