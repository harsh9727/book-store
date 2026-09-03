import Link from "next/link";
import {
  ShoppingBag,
  ArrowRight,
  BookOpen,
  Heart,
  ShieldCheck,
  Truck,
} from "lucide-react";
import { createPageMetadata } from "@/lib/seo";

export const metadata = createPageMetadata({
  title: "Shopping Cart",
  description: "Review the books and products in your GTBS Book Store cart.",
  path: "/cart",
  noIndex: true,
});

export default function CartPage() {
  return (
    <div className="min-h-[70vh] bg-gradient-to-b from-orange-50/40 via-white to-white py-12 md:py-16">
      <div className="container mx-auto px-4 lg:px-6">
        {/* Header */}
        <div className="mb-8 text-center max-w-xl mx-auto">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-orange-100/80 px-3.5 py-1 text-xs font-semibold text-orange-700 mb-3">
            <ShoppingBag size={14} />
            <span>Your Reading Bag</span>
          </div>
          <h1 className="title text-3xl font-extrabold text-gray-900 tracking-tight sm:text-4xl">
            Shopping Cart
          </h1>
        </div>

        {/* Empty State Card */}
        <div className="max-w-2xl mx-auto rounded-3xl border border-gray-200/80 bg-white p-8 sm:p-12 text-center shadow-sm">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-2xl bg-orange-50 text-orange-600 mb-6">
            <ShoppingBag size={36} strokeWidth={1.75} />
          </div>

          <h2 className="title text-2xl font-bold text-gray-900 mb-3">
            Your Cart is Currently Empty
          </h2>

          <p className="description text-sm sm:text-base text-gray-600 leading-relaxed max-w-md mx-auto mb-8">
            Looks like you haven&apos;t added any books or resources yet.
            Explore our curated Christian literature, Bibles, and devotionals to
            get started.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/allproducts"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-orange-600 px-6 py-3.5 text-sm font-semibold text-white shadow-sm transition-all duration-300 hover:bg-orange-700 hover:shadow-lg hover:shadow-orange-600/20 active:scale-95"
            >
              <span>Browse All Books</span>
              <ArrowRight size={16} />
            </Link>

            <Link
              href="/wishlist"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl border border-gray-300 bg-white px-6 py-3.5 text-sm font-semibold text-gray-700 transition-all duration-300 hover:border-orange-300 hover:bg-orange-50 hover:text-orange-600"
            >
              <Heart size={16} />
              <span>View Wishlist</span>
            </Link>
          </div>

          {/* Value Props */}
          <div className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-4 border-t border-gray-100 pt-8 text-left">
            <div className="flex items-start gap-3">
              <Truck size={18} className="text-orange-600 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-xs font-bold text-gray-900">
                  Doorstep Delivery
                </h4>
                <p className="text-[11px] text-gray-500 mt-0.5">
                  Reliable shipping across Gujarat & India
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <ShieldCheck
                size={18}
                className="text-orange-600 shrink-0 mt-0.5"
              />
              <div>
                <h4 className="text-xs font-bold text-gray-900">
                  100% Authentic
                </h4>
                <p className="text-[11px] text-gray-500 mt-0.5">
                  Direct from certified Christian publishers
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <BookOpen size={18} className="text-orange-600 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-xs font-bold text-gray-900">
                  Curated Faith Books
                </h4>
                <p className="text-[11px] text-gray-500 mt-0.5">
                  Bibles, study guides & devotionals
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
