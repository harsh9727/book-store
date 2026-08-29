import { createPageMetadata } from "@/lib/seo";

export const metadata = createPageMetadata({
  title: "Checkout",
  description: "Complete your GTBS Book Store order securely.",
  path: "/checkout",
  noIndex: true,
});

export default function Checkout() {
  return (
    <div className="py-12">
      <h1 className="text-4xl font-bold text-gray-900">Checkout</h1>
      <p className="mt-4 text-gray-600">Complete your order</p>
    </div>
  );
}
