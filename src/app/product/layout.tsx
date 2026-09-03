import type { ReactNode } from "react";
import { createPageMetadata } from "@/lib/seo";

export const metadata = createPageMetadata({
  title: "Shop Products",
  description:
    "Discover books, gifts, accessories, and other products available from GTBS Book Store.",
  path: "/shop",
});

export default function ProductLayout({ children }: { children: ReactNode }) {
  return children;
}
