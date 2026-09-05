import { createPageMetadata } from "@/lib/seo";
import WishlistPageClient from "@/components/wishlist/WishlistPageClient";

export const metadata = createPageMetadata({
  title: "Wishlist",
  description: "View products saved to your GTBS Book Store wishlist.",
  path: "/wishlist",
  noIndex: true,
});

export default function WishlistPage() {
  return <WishlistPageClient />;
}
