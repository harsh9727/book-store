"use client";

import Image from "next/image";
import type { ImageProps } from "next/image";
import Link from "next/link";
import { ListPlus } from "lucide-react";
import { toast } from "sonner";
import { useLanguage } from "@/contexts/LanguageContext";
import { localizeProduct } from "@/lib/localizedProduct";
import { addCartItem } from "@/lib/storefrontStorage";
import { createWhatsAppOrderUrl } from "@/lib/whatsappOrder";
import type { Product } from "@/types/product";

interface ProductCardProps {
  product:
    | Product
    | {
        id: string | number;
        title: string;
        price: number;
        originalPrice?: number;
        image?: ImageProps["src"];
        cover?: ImageProps["src"];
        category?: string;
        badge?: string | null;
      };
}

export default function ProductCard({ product }: ProductCardProps) {
  const { language } = useLanguage();
  const localizedProduct = localizeProduct(product as Product, language);
  const usesStoredGujarati =
    language === "gu" && "gujarati" in product && Boolean(product.gujarati);
  const coverSrc =
    "image" in product && product.image
      ? product.image
      : "cover" in product
        ? product.cover
        : null;
  const productId =
    typeof product.id === "string" && isNaN(Number(product.id))
      ? product.id
      : undefined;
  const productHref = productId ? `/product/${productId}` : "/allproducts";
  const storageProduct = {
    productId: String(product.id),
    title: localizedProduct.title,
    price: product.price,
    image:
      typeof coverSrc === "string"
        ? coverSrc
        : coverSrc
          ? "src" in coverSrc
            ? coverSrc.src
            : coverSrc.default.src
          : "/images/products/book-placeholder.svg",
  };

  const handleAddToCart = (event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
    if (addCartItem(storageProduct)) {
      toast.success(`Added "${localizedProduct.title}" to your cart.`);
    } else {
      toast.error("Your browser could not save the cart. Check storage permissions.");
    }
  };

  const handleBuyNow = (event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
    const productUrl = new URL(productHref, window.location.origin).toString();
    const whatsappUrl = createWhatsAppOrderUrl([
      {
        title: localizedProduct.title,
        quantity: 1,
        unitPrice: product.price,
        productUrl,
      },
    ]);
    window.open(whatsappUrl, "_blank", "noopener,noreferrer");
  };

  return (
    <article className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-gray-100 bg-white p-1 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-orange-200 hover:shadow-lg hover:shadow-orange-500/10">
      <div className="relative aspect-square w-full overflow-hidden rounded-xl bg-gray-50">
        {product.badge && (
          <span className="description absolute left-2.5 top-2.5 z-10 rounded-full bg-orange-600 px-2.5 py-1 text-xs font-semibold tracking-wide text-white shadow-sm">
            {product.badge}
          </span>
        )}

        <Link
          href={productHref}
          className="relative block h-full w-full"
          aria-label={`View details for ${localizedProduct.title}`}
        >
          {coverSrc && (
            <Image
              src={coverSrc}
              alt={localizedProduct.title}
              fill
              className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 25vw"
            />
          )}
        </Link>
      </div>

      <div className="flex flex-1 flex-col p-3.5">
        <span className="description text-[13px] font-semibold tracking-wide text-orange-600">
          {product.category || "Products"}
        </span>

        <Link href={productHref}>
          <h3
            className={`title mt-1 line-clamp-2 text-md font-semibold text-gray-900 transition-colors hover:text-orange-600 ${usesStoredGujarati ? "notranslate" : ""}`}
            translate={usesStoredGujarati ? "no" : undefined}
            lang={usesStoredGujarati ? "gu" : undefined}
          >
            {localizedProduct.title}
          </h3>
        </Link>

        <p className="mt-auto pt-4 text-base font-bold text-gray-900">
          &#8377;{product.price.toFixed(2)}
        </p>

        <div className="mt-3 grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={handleBuyNow}
            className="flex min-h-10 items-center justify-center rounded-xl bg-gray-900 px-2 py-2.5 text-xs font-semibold text-white transition-colors hover:bg-orange-600 sm:text-sm"
            aria-label={`Buy ${localizedProduct.title} now on WhatsApp`}
          >
            <span>Buy Now</span>
          </button>
          <button
            type="button"
            onClick={handleAddToCart}
            className="flex min-h-10 items-center justify-center gap-1.5 rounded-xl border border-orange-600 bg-white px-2 py-2.5 text-xs font-semibold text-orange-700 transition-colors hover:bg-orange-50 sm:text-sm"
            aria-label={`Add ${localizedProduct.title} to cart`}
          >
            <ListPlus size={17} />
            <span>Add to Cart</span>
          </button>
        </div>
      </div>
    </article>
  );
}
