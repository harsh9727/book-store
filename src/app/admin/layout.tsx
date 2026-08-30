import type { Metadata } from "next";
import type { ReactNode } from "react";
import { siteConfig } from "@/lib/seo";

export const metadata: Metadata = {
  title: { absolute: `Admin | ${siteConfig.name}` },
  description: "Secure administration access for Gujarat Tract Book Store.",
  robots: {
    index: false,
    follow: false,
    nocache: true,
  },
};

export default function AdminLayout({ children }: { children: ReactNode }) {
  return children;
}
