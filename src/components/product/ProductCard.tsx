"use client";

import Link from "next/link";
import Image from "next/image";
import type { ImageProps } from "next/image";
import { ShoppingBag, Eye } from "lucide-react";
import { FaWhatsapp } from "react-icons/fa6";
import { toast } from "sonner";
import { Product } from "@/types/product";

export interface ProductCardProps {
  product: Product | {
    id: string | number;
    title: string;
    author: string;
    price: number;
    originalPrice?: number;
    image?: ImageProps["src"];
    cover?: ImageProps["src"];
    category?: string;
    badge?: string | null;
  };
}

export default function ProductCard({ product }: ProductCardProps) {
  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toast.success(`Added "${product.title}" to your cart!`);
  };

  const coverSrc = "image" in product && product.image ? product.image : "cover" in product ? product.cover : null;
  const productId =
    typeof product.id === "string" && isNaN(Number(product.id))
      ? product.id
      : undefined;
  const productHref = productId ? `/product/${productId}` : "/allproducts";

  const handleWhatsApp = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const productUrl = new URL(productHref, window.location.origin).toString();
    const message = encodeURIComponent(
      `Hello GTBS Book Store, I am interested in "${product.title}". Product link: ${productUrl}`
    );
    window.open(
      `https://wa.me/917490028867?text=${message}`,
      "_blank",
      "noopener,noreferrer"
    );
  };

  return (
    <div className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition-all duration-300 p-1 hover:-translate-y-1 hover:border-orange-200 hover:shadow-lg hover:shadow-orange-500/10">
      {/* Cover Image Container */}
      <div className="relative aspect-[4/4] w-full overflow-hidden rounded-xl bg-gray-50">
        {/* Badge */}
        {product.badge && (
          <span className="absolute left-2.5 top-2.5 z-10 rounded-full bg-orange-600 px-2.5 py-1 text-xs description tracking-wide font-semibold text-white shadow-sm">
            {product.badge}
          </span>
        )}

        {/* Link / Image */}
        <Link href={productHref} className="relative block h-full w-full">
          {coverSrc && (
            <Image
              src={coverSrc}
              alt={product.title}
              fill
              className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 25vw"
            />
          )}
        </Link>

      </div>

      {/* Book Metadata */}
      <div className="flex flex-1 flex-col p-3.5">
        <span className="text-[13px] description tracking-wide font-semibold text-orange-600">
          {product.category || "Christian Books"}
        </span>

        <Link href={productHref}>
          <h3 className="line-clamp-2 mt-1 text-md title font-semibold text-gray-900 transition-colors hover:text-orange-600">
            {product.title}
          </h3>
        </Link>

        <p className="mt-1 text-sm text-gray-600">by {product.author}</p>

        {/* Price & Product Actions */}
        <div className="mt-auto flex items-center justify-between pt-3.5">
          <div className="flex items-baseline gap-1.5">
            <span className="text-base font-bold text-gray-900">
              ₹{product.price.toFixed(2)}
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <Link
              href={productHref}
              className="flex h-8 w-8 items-center justify-center rounded-lg bg-gray-100 text-gray-700 transition-colors hover:bg-gray-900 hover:text-white"
              aria-label={`View details for ${product.title}`}
              title="View details"
            >
              <Eye size={15} />
            </Link>
            <button
              type="button"
              onClick={handleWhatsApp}
              className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600 transition-colors hover:bg-emerald-600 hover:text-white"
              aria-label={`Ask about ${product.title} on WhatsApp`}
              title="Ask on WhatsApp"
            >
              <FaWhatsapp size={16} />
            </button>
            <button
              type="button"
              onClick={handleAddToCart}
              className="flex h-8 w-8 items-center justify-center rounded-lg bg-orange-50 text-orange-600 transition-colors hover:bg-orange-600 hover:text-white"
              aria-label={`Add ${product.title} to cart`}
              title="Add to cart"
            >
              <ShoppingBag size={15} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
