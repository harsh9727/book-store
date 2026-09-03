import Link from "next/link";
import { User, ShoppingBag, Heart, HelpCircle, ArrowRight } from "lucide-react";
import { createPageMetadata } from "@/lib/seo";

export const metadata = createPageMetadata({
  title: "Customer Profile",
  description: "Manage your GTBS Book Store customer account.",
  path: "/profile",
  noIndex: true,
});

export default function ProfilePage() {
  return (
    <div className="min-h-[75vh] bg-gradient-to-b from-orange-50/40 via-white to-white py-12 md:py-16">
      <div className="container mx-auto px-4 lg:px-6">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="mb-8 text-center">
            <div className="inline-flex items-center gap-1.5 rounded-full bg-orange-100/80 px-3.5 py-1 text-xs font-semibold text-orange-700 mb-3">
              <User size={14} />
              <span>Reader Account</span>
            </div>
            <h1 className="title text-3xl font-extrabold text-gray-900 tracking-tight">
              My Profile
            </h1>
          </div>

          {/* Profile Card */}
          <div className="rounded-3xl border border-gray-200/80 bg-white p-7 sm:p-9 shadow-sm">
            <div className="flex items-center gap-4 border-b border-gray-100 pb-6">
              <div className="h-16 w-16 rounded-2xl bg-orange-100 text-orange-600 flex items-center justify-center font-bold text-2xl">
                <User size={30} />
              </div>
              <div>
                <h3 className="title text-xl font-bold text-gray-900">Guest Reader</h3>
                <p className="text-xs text-gray-500 mt-0.5">Welcome to Gujarat Tract & Book Society</p>
              </div>
            </div>

            {/* Quick Links */}
            <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Link
                href="/wishlist"
                className="group flex items-center justify-between rounded-2xl border border-gray-200/80 p-4 transition-all hover:border-orange-300 hover:bg-orange-50/50"
              >
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center group-hover:bg-orange-600 group-hover:text-white transition-colors">
                    <Heart size={18} />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-gray-900">Saved Wishlist</h4>
                    <p className="text-xs text-gray-500">Books to read</p>
                  </div>
                </div>
                <ArrowRight size={16} className="text-gray-400 group-hover:text-orange-600 transition-colors" />
              </Link>

              <Link
                href="/cart"
                className="group flex items-center justify-between rounded-2xl border border-gray-200/80 p-4 transition-all hover:border-orange-300 hover:bg-orange-50/50"
              >
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center group-hover:bg-orange-600 group-hover:text-white transition-colors">
                    <ShoppingBag size={18} />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-gray-900">Reading Bag</h4>
                    <p className="text-xs text-gray-500">Cart items</p>
                  </div>
                </div>
                <ArrowRight size={16} className="text-gray-400 group-hover:text-orange-600 transition-colors" />
              </Link>
            </div>

            <div className="mt-6 pt-6 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4">
              <Link
                href="/allproducts"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-orange-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-orange-700"
              >
                <span>Browse Bookstore</span>
                <ArrowRight size={15} />
              </Link>

              <Link
                href="/contact"
                className="text-xs text-gray-600 hover:text-orange-600 transition-colors inline-flex items-center gap-1.5"
              >
                <HelpCircle size={14} />
                <span>Customer Support</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
