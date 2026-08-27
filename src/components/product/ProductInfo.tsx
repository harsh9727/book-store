"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Heart,
  ShoppingCart,
  Zap,
  ShieldCheck,
  Truck,
  RotateCcw,
  Minus,
  Plus,
  Share2,
  CheckCircle2,
} from "lucide-react";
import { toast } from "sonner";
import { Product } from "@/types/product";
import ProductRating from "./ProductRating";

interface ProductInfoProps {
  product: Product;
}

export default function ProductInfo({ product }: ProductInfoProps) {
  const [selectedFormat, setSelectedFormat] = useState(
    product.format && product.format.length > 0 ? product.format[0] : "Paperback"
  );
  const [quantity, setQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);

  const handleAddToCart = () => {
    toast.success(`Added ${quantity}x "${product.title}" (${selectedFormat}) to your cart!`);
  };

  const handleBuyNow = () => {
    toast.success(`Redirecting to checkout for "${product.title}"...`);
  };

  const handleToggleWishlist = () => {
    setIsWishlisted(!isWishlisted);
    toast(isWishlisted ? "Removed from wishlist" : "Added to your wishlist!");
  };

  const handleShare = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard?.writeText(window.location.href);
      toast.success("Product link copied to clipboard!");
    }
  };

  return (
    <div className="flex flex-col">
      {/* Category & Breadcrumb link */}
      <div className="mb-2 flex items-center justify-between">
        <Link
          href={`/shop?category=${product.category}`}
          className="text-xs font-semibold uppercase tracking-wider text-orange-600 hover:underline"
        >
          {product.category}
        </Link>
        <button
          onClick={handleShare}
          type="button"
          className="flex items-center gap-1 text-xs font-medium text-gray-500 hover:text-orange-600"
        >
          <Share2 size={14} />
          <span>Share</span>
        </button>
      </div>

      {/* Book Title */}
      <h1 className="title text-2xl font-bold tracking-tight text-gray-900 md:text-3xl lg:text-4xl">
        {product.title}
      </h1>

      {/* Author */}
      <p className="mt-2 text-sm text-gray-600">
        by{" "}
        <span className="font-semibold text-gray-900 underline decoration-orange-300 decoration-2 underline-offset-2">
          {product.author}
        </span>
      </p>

      {/* Rating & Stock Status */}
      <div className="mt-4 flex flex-wrap items-center gap-4 border-b border-gray-100 pb-4">
        {product.rating && (
          <ProductRating
            rating={product.rating}
            reviewsCount={product.reviewsCount}
            size={18}
          />
        )}
        <div className="flex items-center gap-1.5 text-xs font-medium text-emerald-600">
          <CheckCircle2 size={15} />
          <span>In Stock ({product.stockCount ?? 25} available)</span>
        </div>
      </div>

      {/* Pricing */}
      <div className="mt-5 flex items-baseline gap-3">
        <span className="title text-3xl font-bold text-gray-900 md:text-4xl">
          ${product.price.toFixed(2)}
        </span>
        {product.originalPrice && (
          <span className="text-lg text-gray-400 line-through">
            ${product.originalPrice.toFixed(2)}
          </span>
        )}
        {product.discount && (
          <span className="rounded-full bg-red-50 px-2.5 py-0.5 text-xs font-bold text-red-600">
            Save {product.discount}%
          </span>
        )}
      </div>

      {/* Format Selector */}
      {product.format && product.format.length > 0 && (
        <div className="mt-6">
          <label className="text-xs font-semibold uppercase tracking-wider text-gray-500">
            Select Format
          </label>
          <div className="mt-2.5 flex flex-wrap gap-2.5">
            {product.format.map((fmt) => (
              <button
                key={fmt}
                type="button"
                onClick={() => setSelectedFormat(fmt)}
                className={`rounded-xl border px-4 py-2.5 text-sm font-medium transition-all duration-200 ${
                  selectedFormat === fmt
                    ? "border-orange-600 bg-orange-50/70 text-orange-700 shadow-sm ring-1 ring-orange-600"
                    : "border-gray-200 bg-white text-gray-700 hover:border-gray-300 hover:bg-gray-50"
                }`}
              >
                {fmt}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Description Snippet */}
      {product.description && (
        <p className="description mt-5 text-sm leading-relaxed text-gray-600 line-clamp-3">
          {product.description}
        </p>
      )}

      {/* Quantity & CTA Buttons */}
      <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center">
        {/* Quantity Stepper */}
        <div className="flex h-12 w-32 items-center justify-between rounded-xl border border-gray-200 bg-gray-50/80 px-3">
          <button
            type="button"
            onClick={() => setQuantity(Math.max(1, quantity - 1))}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-600 hover:bg-white hover:shadow-sm"
          >
            <Minus size={15} />
          </button>
          <span className="font-semibold text-gray-900">{quantity}</span>
          <button
            type="button"
            onClick={() => setQuantity(quantity + 1)}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-600 hover:bg-white hover:shadow-sm"
          >
            <Plus size={15} />
          </button>
        </div>

        {/* Add to Cart */}
        <button
          type="button"
          onClick={handleAddToCart}
          className="flex h-12 flex-1 items-center justify-center gap-2 rounded-xl bg-orange-600 px-6 font-semibold text-white shadow-md shadow-orange-600/20 transition-all duration-200 hover:bg-orange-700 hover:shadow-lg hover:shadow-orange-600/30 active:scale-[0.98]"
        >
          <ShoppingCart size={18} />
          <span>Add to Cart</span>
        </button>

        {/* Wishlist Button */}
        <button
          type="button"
          onClick={handleToggleWishlist}
          className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border transition-all duration-200 ${
            isWishlisted
              ? "border-red-200 bg-red-50 text-red-600"
              : "border-gray-200 bg-white text-gray-600 hover:border-gray-300 hover:text-red-500"
          }`}
          aria-label="Add to wishlist"
        >
          <Heart size={20} className={isWishlisted ? "fill-red-500" : ""} />
        </button>
      </div>

      {/* Buy Now Button */}
      <button
        type="button"
        onClick={handleBuyNow}
        className="mt-3 flex h-12 w-full items-center justify-center gap-2 rounded-xl border-2 border-gray-900 bg-gray-900 font-semibold text-white transition-all duration-200 hover:bg-gray-800 active:scale-[0.98]"
      >
        <Zap size={18} className="fill-white" />
        <span>Buy Now with 1-Click</span>
      </button>

      {/* Trust Badges */}
      <div className="mt-8 grid grid-cols-1 gap-3 rounded-2xl border border-gray-100 bg-gray-50/70 p-4 sm:grid-cols-3">
        <div className="flex items-center gap-3">
          <Truck size={20} className="shrink-0 text-orange-600" />
          <div className="text-xs">
            <p className="font-semibold text-gray-900">Free Express Delivery</p>
            <p className="text-gray-500">Orders over $35</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <ShieldCheck size={20} className="shrink-0 text-orange-600" />
          <div className="text-xs">
            <p className="font-semibold text-gray-900">100% Genuine Books</p>
            <p className="text-gray-500">Direct from publishers</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <RotateCcw size={20} className="shrink-0 text-orange-600" />
          <div className="text-xs">
            <p className="font-semibold text-gray-900">30-Day Easy Returns</p>
            <p className="text-gray-500">Guaranteed refund</p>
          </div>
        </div>
      </div>
    </div>
  );
}
