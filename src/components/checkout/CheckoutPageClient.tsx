"use client";

import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  HelpCircle,
  MessageCircle,
  ShieldCheck,
  Truck,
} from "lucide-react";
import { useCart } from "@/lib/storefrontStorage";

const formatPrice = (value: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  }).format(value);

export default function CheckoutPageClient() {
  const { items, itemCount, subtotal } = useCart();
  const orderLines = items.map(
    (item, index) =>
      `${index + 1}. ${item.title} × ${item.quantity}${item.variantSummary ? ` (${item.variantSummary})` : ""} — ${formatPrice(item.price * item.quantity)}`,
  );
  const message = items.length
    ? [
        "Hello GTBS! I would like to confirm this order:",
        "",
        ...orderLines,
        "",
        `Subtotal: ${formatPrice(subtotal)}`,
        "Please confirm availability, shipping, and payment details.",
      ].join("\n")
    : "Hello GTBS! I would like to place an order or inquire about a book.";
  const whatsappUrl = `https://wa.me/917490028867?text=${encodeURIComponent(message)}`;

  return (
    <div className="min-h-[70vh] bg-gradient-to-b from-orange-50/40 via-white to-white py-10 md:py-14">
      <div className="container mx-auto px-4 lg:px-6">
        <div className="mx-auto mb-8 max-w-xl text-center">
          <div className="mb-3 inline-flex items-center gap-1.5 rounded-full bg-orange-100/80 px-3.5 py-1 text-xs font-semibold text-orange-700">
            <ShieldCheck size={14} />
            <span>Direct bookstore ordering</span>
          </div>
          <h1 className="title text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">
            Confirm Your Order
          </h1>
          <p className="description mt-2 text-sm text-gray-600">
            Send the prepared order to GTBS for availability and delivery confirmation.
          </p>
        </div>

        <div className="mx-auto grid max-w-4xl gap-6 rounded-3xl border border-gray-200 bg-white p-5 shadow-sm md:grid-cols-[minmax(0,1fr)_320px] md:p-8">
          <section aria-labelledby="checkout-summary-heading">
            <h2 id="checkout-summary-heading" className="title text-xl font-bold text-gray-900">
              {items.length ? `Order summary (${itemCount})` : "Start an order"}
            </h2>
            {items.length ? (
              <ul className="mt-4 divide-y divide-gray-100 rounded-2xl border border-gray-100">
                {items.map((item) => (
                  <li key={item.key} className="flex min-w-0 justify-between gap-4 p-3 text-sm">
                    <div className="min-w-0">
                      <p className="truncate font-semibold text-gray-900">
                        {item.title}
                      </p>
                      <p className="mt-0.5 text-xs text-gray-500">
                        Qty {item.quantity}
                        {item.variantSummary ? ` · ${item.variantSummary}` : ""}
                      </p>
                    </div>
                    <strong className="shrink-0 text-gray-900">
                      {formatPrice(item.price * item.quantity)}
                    </strong>
                  </li>
                ))}
                <li className="flex justify-between gap-4 bg-orange-50 p-3 text-sm">
                  <span>Subtotal</span>
                  <strong>{formatPrice(subtotal)}</strong>
                </li>
              </ul>
            ) : (
              <div className="mt-4 rounded-2xl border border-dashed border-gray-200 p-5 text-sm text-gray-600">
                Your cart is empty. You can still ask about a book, or browse the catalog first.
              </div>
            )}
            <div className="mt-5 space-y-2 text-xs text-gray-600">
              <p className="flex items-center gap-2">
                <Truck size={15} className="text-orange-600" />
                Shipping cost and delivery date are confirmed by GTBS.
              </p>
              <p className="flex items-center gap-2">
                <ShieldCheck size={15} className="text-orange-600" />
                Do not send payment until the bookstore confirms the order.
              </p>
            </div>
          </section>

          <aside className="flex flex-col items-center justify-center rounded-2xl border border-orange-100 bg-orange-50/80 p-6 text-center">
            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#25D366] text-white shadow-lg shadow-emerald-500/20">
              <MessageCircle size={30} />
            </div>
            <h2 className="title text-lg font-bold text-gray-900">Send via WhatsApp</h2>
            <p className="description mt-1 text-xs leading-5 text-gray-600">
              Your order details are included automatically. Review the message before sending.
            </p>
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#25D366] px-5 py-3 text-sm font-semibold text-white hover:bg-[#20bd5a]"
            >
              {items.length ? "Send order request" : "Ask on WhatsApp"}
              <ArrowRight size={16} />
            </a>
          </aside>

          <div className="flex flex-col gap-3 border-t border-gray-100 pt-5 sm:flex-row sm:items-center sm:justify-between md:col-span-2">
            <Link
              href={items.length ? "/cart" : "/allproducts"}
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-orange-700 hover:underline"
            >
              <ArrowLeft size={16} />
              {items.length ? "Back to cart" : "Browse products"}
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-gray-600 hover:text-orange-700"
            >
              <HelpCircle size={16} />
              Need help? Contact us
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
