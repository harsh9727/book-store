import Link from "next/link";
import { CreditCard, MapPin, ArrowRight, ShieldCheck, Truck, HelpCircle } from "lucide-react";
import { FaWhatsapp } from "react-icons/fa6";
import { createPageMetadata } from "@/lib/seo";

export const metadata = createPageMetadata({
  title: "Checkout & Order Inquiry",
  description: "Complete your GTBS Book Store order securely.",
  path: "/checkout",
  noIndex: true,
});

export default function CheckoutPage() {
  const whatsappUrl = `https://wa.me/917490028867?text=${encodeURIComponent(
    "Hello GTBS! I would like to place an order or inquire about checkout."
  )}`;

  return (
    <div className="min-h-[70vh] bg-gradient-to-b from-orange-50/40 via-white to-white py-12 md:py-16">
      <div className="container mx-auto px-4 lg:px-6">
        {/* Header */}
        <div className="mb-8 text-center max-w-xl mx-auto">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-orange-100/80 px-3.5 py-1 text-xs font-semibold text-orange-700 mb-3">
            <CreditCard size={14} />
            <span>Secure Order Assistance</span>
          </div>
          <h1 className="title text-3xl font-extrabold text-gray-900 tracking-tight sm:text-4xl">
            Order Checkout & Support
          </h1>
        </div>

        {/* Card */}
        <div className="max-w-3xl mx-auto rounded-3xl border border-gray-200/80 bg-white p-8 sm:p-12 shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div>
              <h2 className="title text-2xl font-bold text-gray-900 mb-3">
                Direct Bookstore Ordering
              </h2>
              <p className="description text-sm text-gray-600 leading-relaxed mb-6">
                To guarantee availability and fast delivery for Bibles, bulk copies, and specialized literature, we process orders directly with personalized customer care.
              </p>

              <div className="space-y-3 text-sm">
                <div className="flex items-center gap-3 text-gray-700">
                  <Truck size={18} className="text-orange-600 shrink-0" />
                  <span>Statewide & National Shipping</span>
                </div>
                <div className="flex items-center gap-3 text-gray-700">
                  <ShieldCheck size={18} className="text-orange-600 shrink-0" />
                  <span>UPI, NetBanking & Bank Transfer</span>
                </div>
                <div className="flex items-center gap-3 text-gray-700">
                  <MapPin size={18} className="text-orange-600 shrink-0" />
                  <span>In-store pickup in Ahmedabad available</span>
                </div>
              </div>
            </div>

            <div className="rounded-2xl bg-orange-50/80 p-6 border border-orange-100 flex flex-col items-center text-center">
              <div className="h-14 w-14 rounded-2xl bg-[#25D366] text-white flex items-center justify-center shadow-lg shadow-emerald-500/20 mb-4">
                <FaWhatsapp size={30} />
              </div>

              <h3 className="title text-lg font-bold text-gray-900 mb-1">
                Order via WhatsApp
              </h3>
              <p className="description text-xs text-gray-600 mb-5">
                Send your book list for instant confirmation and invoice.
              </p>

              <Link
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-[#25D366] px-5 py-3 text-sm font-semibold text-white shadow-sm transition-all duration-300 hover:bg-[#20bd5a] hover:shadow-lg active:scale-95"
              >
                <span>Chat to Order</span>
                <ArrowRight size={16} />
              </Link>

              <div className="mt-4 pt-4 border-t border-orange-200/60 w-full flex items-center justify-center gap-4 text-xs text-gray-600">
                <Link href="tel:+919265429338" className="hover:text-orange-600 transition-colors">
                  +91 9265429338
                </Link>
                <span>|</span>
                <Link href="tel:+917490028867" className="hover:text-orange-600 transition-colors">
                  +91 7490028867
                </Link>
              </div>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4">
            <Link
              href="/allproducts"
              className="text-sm font-semibold text-orange-600 hover:underline inline-flex items-center gap-1.5"
            >
              <span>← Continue Shopping</span>
            </Link>

            <Link
              href="/contact"
              className="text-sm font-semibold text-gray-600 hover:text-orange-600 transition-colors inline-flex items-center gap-1.5"
            >
              <HelpCircle size={16} />
              <span>Need help? Contact Us</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
