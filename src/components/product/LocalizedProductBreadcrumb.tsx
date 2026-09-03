"use client";

import Breadcrumb from "@/components/common/Breadcrumb";
import { useLanguage } from "@/contexts/LanguageContext";
import { localizeProduct } from "@/lib/localizedProduct";
import type { Product } from "@/types/product";

export default function LocalizedProductBreadcrumb({ product }: { product: Product }) {
  const { language } = useLanguage();
  const localizedProduct = localizeProduct(product, language);
  const usesStoredGujarati = language === "gu" && Boolean(product.gujarati);

  return (
    <div lang={usesStoredGujarati ? "gu" : undefined}>
      <Breadcrumb
        items={[
          { label: usesStoredGujarati ? "મુખ્ય પૃષ્ઠ" : "Home", href: "/", skipTranslation: usesStoredGujarati },
          { label: usesStoredGujarati ? "ઉત્પાદનો" : "Shop", href: "/shop", skipTranslation: usesStoredGujarati },
          { label: product.category, href: `/shop?category=${product.category}` },
          { label: localizedProduct.title, skipTranslation: usesStoredGujarati },
        ]}
      />
    </div>
  );
}
