import type { ReactNode } from "react";
import { createPageMetadata } from "@/lib/seo";

export const metadata = createPageMetadata({
  title: "Shop Christian Books & Bibles",
  description:
    "Discover Christian books, Bibles, devotionals, and faith resources available from GTBS Book Store.",
  path: "/shop",
});

export default function ProductLayout({ children }: { children: ReactNode }) {
  return children;
}
