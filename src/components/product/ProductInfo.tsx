"use client";

import { useState } from "react";
import Link from "next/link";
import { Heart, ShoppingCart, Minus, Plus, Share2 } from "lucide-react";
import { toast } from "sonner";
import { Product } from "@/types/product";
import { useLanguage } from "@/contexts/LanguageContext";
import { localizeProduct } from "@/lib/localizedProduct";
import {
  addCartItem,
  toggleWishlistItem,
  useWishlist,
} from "@/lib/storefrontStorage";

interface ProductInfoProps {
  product: Product;
}

export default function ProductInfo({ product }: ProductInfoProps) {
  const { language } = useLanguage();
  const { items: wishlistItems } = useWishlist();
  const localizedProduct = localizeProduct(product, language);
  const usesStoredGujarati = language === "gu" && Boolean(product.gujarati);
  const variantGroups = usesStoredGujarati
    ? localizedProduct.variants || []
    : localizedProduct.variants?.length
      ? localizedProduct.variants
      : product.format?.length
        ? [{ name: "Format", options: product.format }]
        : [];
  const [selectedVariantIndexes, setSelectedVariantIndexes] = useState<
    number[]
  >(() => variantGroups.map(() => 0));
  const [quantity, setQuantity] = useState(1);
  const isWishlisted = wishlistItems.some(
    (item) => item.productId === product.id,
  );

  const productSnapshot = {
    productId: product.id,
    title: localizedProduct.title,
    price: product.price,
    image: product.image,
  };

  const handleAddToCart = () => {
    const variantSummary = variantGroups
      .map((variant, index) =>
        variant.options[selectedVariantIndexes[index] ?? 0]
          ? `${variant.name}: ${variant.options[selectedVariantIndexes[index] ?? 0]}`
          : "",
      )
      .filter(Boolean)
      .join(", ");
    if (!addCartItem(productSnapshot, quantity, variantSummary)) {
      toast.error("Your browser could not save the cart. Check storage permissions.");
      return;
    }
    toast.success(
      `Added ${quantity}x "${localizedProduct.title}"${variantSummary ? ` (${variantSummary})` : ""} to your cart!`,
    );
  };

  const handleWishlist = () => {
    const result = toggleWishlistItem(productSnapshot);
    if (!result.success) {
      toast.error(
        "Your browser could not save the wishlist. Check storage permissions.",
      );
      return;
    }
    toast.success(
      result.isWishlisted
        ? `Saved "${localizedProduct.title}" to your wishlist.`
        : `Removed "${localizedProduct.title}" from your wishlist.`,
    );
  };

  const copyProductLink = async (url: string) => {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(url);
      return;
    }

    const textArea = document.createElement("textarea");
    textArea.value = url;
    textArea.style.position = "fixed";
    textArea.style.opacity = "0";
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    const copied = document.execCommand("copy");
    textArea.remove();

    if (!copied) {
      throw new Error("Unable to copy product link");
    }
  };

  const handleShare = async () => {
    const url = window.location.href;

    if (navigator.share) {
      try {
        await navigator.share({
          title: localizedProduct.title,
          text: `View ${localizedProduct.title} at GTBS Book Store`,
          url,
        });
        return;
      } catch (error) {
        if (error instanceof DOMException && error.name === "AbortError") {
          return;
        }
      }
    }

    try {
      await copyProductLink(url);
      toast.success("Product link copied to clipboard!");
    } catch {
      toast.error("Unable to share this product. Please copy the page URL.");
    }
  };

  return (
    <div className="flex flex-col">
      {/* Category & Breadcrumb link */}
      <div className="mb-2 flex items-center justify-between">
        <Link
          href={`/allproducts?category=${product.category}`}
          className="text-xs font-semibold uppercase tracking-wider text-orange-600 hover:underline"
        >
          {product.category}
        </Link>
        <button
          onClick={handleShare}
          type="button"
          className="flex items-center gap-1 text-xs font-medium text-gray-500 hover:text-orange-600"
          aria-label={`Share ${localizedProduct.title}`}
        >
          <Share2 size={14} />
          <span>Share</span>
        </button>
      </div>

      {/* Product Title */}
      <h1
        className={`title text-2xl font-bold tracking-tight text-gray-900 md:text-3xl lg:text-4xl ${usesStoredGujarati ? "notranslate" : ""}`}
        translate={usesStoredGujarati ? "no" : undefined}
        lang={usesStoredGujarati ? "gu" : undefined}
      >
        {localizedProduct.title}
      </h1>

      {/* Pricing */}
      <div className="mt-5">
        <span className="title text-3xl font-bold text-gray-900 md:text-4xl">
          &#8377;{product.price.toFixed(2)}
        </span>
      </div>

      {/* Dynamic Variant Selectors */}
      {variantGroups.map((variant, variantIndex) => (
        <div
          key={`${variant.name}-${variantIndex}`}
          className={`mt-6 ${usesStoredGujarati ? "notranslate" : ""}`}
          translate={usesStoredGujarati ? "no" : undefined}
          lang={usesStoredGujarati ? "gu" : undefined}
        >
          <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">
            {usesStoredGujarati
              ? `${variant.name} પસંદ કરો`
              : `Select ${variant.name}`}
          </p>
          <div className="mt-2.5 flex flex-wrap gap-2.5">
            {variant.options.map((option, optionIndex) => (
              <button
                key={option}
                type="button"
                onClick={() =>
                  setSelectedVariantIndexes((current) =>
                    Array.from({ length: variantGroups.length }, (_, index) =>
                      index === variantIndex
                        ? optionIndex
                        : (current[index] ?? 0),
                    ),
                  )
                }
                className={`rounded-xl border px-4 py-2.5 text-sm font-medium transition-all duration-200 ${
                  (selectedVariantIndexes[variantIndex] ?? 0) === optionIndex
                    ? "border-orange-600 bg-orange-50/70 text-orange-700 shadow-sm ring-1 ring-orange-600"
                    : "border-gray-200 bg-white text-gray-700 hover:border-gray-300 hover:bg-gray-50"
                }`}
              >
                {option}
              </button>
            ))}
          </div>
        </div>
      ))}

      {/* Description Snippet */}
      {localizedProduct.description && (
        <p
          className={`description mt-5 text-sm leading-relaxed text-gray-600 line-clamp-3 ${usesStoredGujarati ? "notranslate" : ""}`}
          translate={usesStoredGujarati ? "no" : undefined}
          lang={usesStoredGujarati ? "gu" : undefined}
        >
          {localizedProduct.description}
        </p>
      )}

      {/* Quantity & CTA Buttons */}
      <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center">
        {/* Quantity Stepper */}
        <div className="flex h-12 w-32 items-center justify-between rounded-xl border border-gray-200 bg-gray-50/80 px-3">
          <button
            type="button"
            onClick={() => setQuantity(Math.max(1, quantity - 1))}
            aria-label="Decrease quantity"
            className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-600 hover:bg-white hover:shadow-sm"
          >
            <Minus size={15} />
          </button>
          <span className="font-semibold text-gray-900">{quantity}</span>
          <button
            type="button"
            onClick={() => setQuantity(Math.min(99, quantity + 1))}
            aria-label="Increase quantity"
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
        <button
          type="button"
          onClick={handleWishlist}
          aria-pressed={isWishlisted}
          className={`flex h-12 items-center justify-center gap-2 rounded-xl border px-5 font-semibold transition-colors ${
            isWishlisted
              ? "border-orange-600 bg-orange-50 text-orange-700"
              : "border-gray-200 bg-white text-gray-700 hover:border-orange-300 hover:text-orange-700"
          }`}
        >
          <Heart size={18} className={isWishlisted ? "fill-current" : ""} />
          <span className="sm:sr-only">
            {isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
          </span>
        </button>
      </div>
    </div>
  );
}
