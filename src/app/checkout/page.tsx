import CheckoutPageClient from "@/components/checkout/CheckoutPageClient";
import { createPageMetadata } from "@/lib/seo";

export const metadata = createPageMetadata({
  title: "Checkout & Order Inquiry",
  description:
    "Send your selected GTBS Book Store products for availability, shipping, and payment confirmation.",
  path: "/checkout",
  noIndex: true,
});

export default function CheckoutPage() {
  return <CheckoutPageClient />;
}
