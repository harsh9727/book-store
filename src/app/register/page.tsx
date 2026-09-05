import Link from "next/link";
import { ArrowRight, MessageCircle, UserPlus } from "lucide-react";
import { createPageMetadata } from "@/lib/seo";

export const metadata = createPageMetadata({
  title: "Customer Registration",
  description: "Customer registration availability and GTBS ordering options.",
  path: "/register",
  noIndex: true,
});

const whatsappUrl = `https://wa.me/917490028867?text=${encodeURIComponent(
  "Hello GTBS! Please help me place a book order.",
)}`;

export default function RegisterPage() {
  return (
    <div className="min-h-[70vh] bg-gradient-to-b from-orange-50/40 via-white to-white py-12 md:py-16">
      <div className="container mx-auto px-4 lg:px-6">
        <div className="mx-auto max-w-md rounded-3xl border border-gray-200 bg-white p-7 text-center shadow-sm sm:p-9">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-orange-50 text-orange-600">
            <UserPlus size={26} />
          </div>
          <h1 className="title mt-5 text-3xl font-extrabold tracking-tight text-gray-900">
            Registration Is Not Open Yet
          </h1>
          <p className="description mt-3 text-sm leading-6 text-gray-600">
            GTBS currently accepts direct order requests without customer accounts. Your cart and wishlist are stored only in this browser.
          </p>
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-7 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#25D366] px-5 py-3 text-sm font-semibold text-white hover:bg-[#20bd5a]"
          >
            <MessageCircle size={17} />
            Order without an account
            <ArrowRight size={16} />
          </a>
          <Link
            href="/login"
            className="mt-5 inline-block text-xs font-semibold text-orange-700 hover:underline"
          >
            View account status
          </Link>
        </div>
      </div>
    </div>
  );
}
