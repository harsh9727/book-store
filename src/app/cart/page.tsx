import { createPageMetadata } from "@/lib/seo";

export const metadata = createPageMetadata({
  title: "Shopping Cart",
  description: "Review the books and products in your GTBS Book Store cart.",
  path: "/cart",
  noIndex: true,
});

export default function Cart() {
  return (
    <div className="py-12">
      <h1 className="text-4xl font-bold text-gray-900">Shopping Cart</h1>
      <p className="mt-4 text-gray-600">Your cart is empty</p>
    </div>
  );
}
