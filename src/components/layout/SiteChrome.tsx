"use client";

import type { ReactNode } from "react";
import { usePathname } from "next/navigation";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import WhatsAppButton from "@/components/common/WhatsAppButton";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { Toaster } from "sonner";
import type { Category } from "@/types/category";

export default function SiteChrome({
  categories,
  children,
}: {
  categories: Category[];
  children: ReactNode;
}) {
  const pathname = usePathname();

  if (pathname.startsWith("/admin")) {
    return <main className="min-h-screen">{children}</main>;
  }

  return (
    <LanguageProvider>
      <a
        href="#main-content"
        className="fixed left-3 top-3 z-[200] -translate-y-24 rounded-lg bg-white px-4 py-2 font-semibold text-gray-900 shadow-lg transition-transform focus:translate-y-0"
      >
        Skip to main content
      </a>
      <Header categories={categories} />
      <main id="main-content" tabIndex={-1} className="min-h-screen">
        {children}
      </main>
      <Footer />
      <WhatsAppButton />
      <Toaster position="top-right" richColors closeButton />
    </LanguageProvider>
  );
}
