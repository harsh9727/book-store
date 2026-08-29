import { createPageMetadata } from "@/lib/seo";

export const metadata = createPageMetadata({
  title: "Wishlist",
  description: "View products saved to your GTBS Book Store wishlist.",
  path: "/wishlist",
  noIndex: true,
});

export default function Wishlist() {
  return (
    <div className="py-12">
      <h1 className="text-4xl font-bold text-gray-900">Wishlist</h1>
      <p className="mt-4 text-gray-600">Your wishlist is empty</p>
    </div>
  );
}
