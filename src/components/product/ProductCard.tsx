"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { Heart, ShoppingBag, Eye } from "lucide-react";
import { toast } from "sonner";
import { Product } from "@/types/product";

export interface ProductCardProps {
  product: Product | {
    id: string | number;
    title: string;
    author: string;
    price: number;
    originalPrice?: number;
    image?: any;
    cover?: any;
    category?: string;
    badge?: string | null;
  };
  isLiked?: boolean;
  onToggleLike?: (id: any) => void;
}

export default function ProductCard({
  product,
  isLiked: controlledIsLiked,
  onToggleLike,
}: ProductCardProps) {
  const [internalIsLiked, setInternalIsLiked] = useState(false);

  const isLiked =
    controlledIsLiked !== undefined ? controlledIsLiked : internalIsLiked;

  const handleToggleLike = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (onToggleLike) {
      onToggleLike(product.id);
    } else {
      setInternalIsLiked(!internalIsLiked);
      toast(
        internalIsLiked
          ? "Removed from wishlist"
          : "Added to your wishlist!"
      );
    }
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toast.success(`Added "${product.title}" to your cart!`);
  };

  const coverSrc = "image" in product && product.image ? product.image : "cover" in product ? product.cover : null;
  const productHref =
    typeof product.id === "string" && isNaN(Number(product.id))
      ? `/product/${product.id}`
      : "/allproducts";

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

        {/* Wishlist Button */}
        <button
          type="button"
          onClick={handleToggleLike}
          className={`absolute right-2.5 top-2.5 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 border border-gray-200 shadow-sm backdrop-blur-sm transition-all duration-200 hover:scale-110 ${
            isLiked ? "text-red-500" : "text-gray-500 hover:text-red-500"
          }`}
          aria-label="Add to wishlist"
        >
          <Heart size={16} className={isLiked ? "fill-red-500 text-red-500" : ""} />
        </button>

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

        {/* Quick View Hover Action */}
        <div className="absolute inset-x-2 bottom-2 z-10 translate-y-12 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
          <Link
            href={productHref}
            className="flex w-full items-center justify-center gap-1.5 rounded-lg description tracking-wide bg-white/95 py-2 text-xs font-semibold text-gray-900 shadow-md backdrop-blur-sm transition-colors hover:bg-orange-600 hover:text-white"
          >
            <Eye size={14} />
            <span>View Details</span>
          </Link>
        </div>
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

        {/* Price & Add to Cart button */}
        <div className="mt-auto flex items-center justify-between pt-3.5">
          <div className="flex items-baseline gap-1.5">
            <span className="text-base font-bold text-gray-900">
              ₹{product.price.toFixed(2)}
            </span>
            {product.originalPrice ? (
              <span className="text-xs text-gray-400 line-through">
                ₹{product.originalPrice.toFixed(2)}
              </span>
            ) : product.badge === "Sale" ? (
              <span className="text-xs text-gray-400 line-through">
                ₹{(product.price + 50).toFixed(2)}
              </span>
            ) : null}
          </div>

          <button
            type="button"
            onClick={handleAddToCart}
            className="flex h-8 w-8 items-center justify-center rounded-lg bg-orange-50 text-orange-600 transition-all duration-200 hover:bg-orange-600 hover:text-white"
            aria-label="Add to cart"
          >
            <ShoppingBag size={15} />
          </button>
        </div>
      </div>
    </div>
  );
}
