import Link from "next/link";
import { Heart, ArrowRight, Sparkles } from "lucide-react";
import { createPageMetadata } from "@/lib/seo";

export const metadata = createPageMetadata({
  title: "Wishlist",
  description: "View products saved to your GTBS Book Store wishlist.",
  path: "/wishlist",
  noIndex: true,
});

export default function WishlistPage() {
  return (
    <div className="min-h-[70vh] bg-gradient-to-b from-orange-50/40 via-white to-white py-12 md:py-16">
      <div className="container mx-auto px-4 lg:px-6">
        {/* Header */}
        <div className="mb-8 text-center max-w-xl mx-auto">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-orange-100/80 px-3.5 py-1 text-xs font-semibold text-orange-700 mb-3">
            <Heart size={14} />
            <span>Saved Titles</span>
          </div>
          <h1 className="title text-3xl font-extrabold text-gray-900 tracking-tight sm:text-4xl">
            My Wishlist
          </h1>
        </div>

        {/* Empty State Card */}
        <div className="max-w-2xl mx-auto rounded-3xl border border-gray-200/80 bg-white p-8 sm:p-12 text-center shadow-sm">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-2xl bg-orange-50 text-orange-600 mb-6">
            <Heart size={36} strokeWidth={1.75} />
          </div>

          <h2 className="title text-2xl font-bold text-gray-900 mb-3">
            Your Wishlist is Empty
          </h2>

          <p className="description text-sm sm:text-base text-gray-600 leading-relaxed max-w-md mx-auto mb-8">
            Keep track of inspiring books and study guides you want to read
            next. Click the heart icon on any book to save it here.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/allproducts"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-orange-600 px-6 py-3.5 text-sm font-semibold text-white shadow-sm transition-all duration-300 hover:bg-orange-700 hover:shadow-lg hover:shadow-orange-600/20 active:scale-95"
            >
              <span>Explore Bookstore</span>
              <ArrowRight size={16} />
            </Link>

            <Link
              href="/allproducts?collection=bestseller"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl border border-gray-300 bg-white px-6 py-3.5 text-sm font-semibold text-gray-700 transition-all duration-300 hover:border-orange-300 hover:bg-orange-50 hover:text-orange-600"
            >
              <Sparkles size={16} />
              <span>Best Sellers</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
