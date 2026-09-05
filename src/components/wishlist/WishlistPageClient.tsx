"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Heart, ShoppingBag, Trash2 } from "lucide-react";
import { toast } from "sonner";
import {
  addCartItem,
  toggleWishlistItem,
  useWishlist,
} from "@/lib/storefrontStorage";

const formatPrice = (value: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  }).format(value);

export default function WishlistPageClient() {
  const { items, itemCount } = useWishlist();

  return (
    <div className="min-h-[70vh] bg-gradient-to-b from-orange-50/40 via-white to-white py-10 md:py-14">
      <div className="container mx-auto px-4 lg:px-6">
        <div className="mx-auto mb-8 max-w-xl text-center">
          <div className="mb-3 inline-flex items-center gap-1.5 rounded-full bg-orange-100/80 px-3.5 py-1 text-xs font-semibold text-orange-700">
            <Heart size={14} />
            <span>Saved Titles</span>
          </div>
          <h1 className="title text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">
            My Wishlist
          </h1>
          <p className="mt-2 text-sm text-gray-600" aria-live="polite">
            {itemCount === 0
              ? "No saved products yet."
              : `${itemCount} saved ${itemCount === 1 ? "product" : "products"}.`}
          </p>
        </div>

        {items.length === 0 ? (
          <div className="mx-auto max-w-2xl rounded-3xl border border-gray-200/80 bg-white p-8 text-center shadow-sm sm:p-12">
            <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-orange-50 text-orange-600">
              <Heart size={36} strokeWidth={1.75} />
            </div>
            <h2 className="title mb-3 text-2xl font-bold text-gray-900">
              Your Wishlist is Empty
            </h2>
            <p className="description mx-auto mb-8 max-w-md text-sm leading-relaxed text-gray-600 sm:text-base">
              Use the heart button on a product card or product page to save it here.
            </p>
            <Link
              href="/allproducts"
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-orange-600 px-6 py-3.5 text-sm font-semibold text-white hover:bg-orange-700 sm:w-auto"
            >
              Explore Bookstore
              <ArrowRight size={16} />
            </Link>
          </div>
        ) : (
          <div className="mx-auto grid max-w-5xl grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((item) => (
              <article
                key={item.productId}
                className="flex min-w-0 flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white p-3 shadow-sm"
              >
                <Link
                  href={`/product/${encodeURIComponent(item.productId)}`}
                  className="relative block aspect-[4/3] overflow-hidden rounded-xl bg-gray-100"
                >
                  <Image
                    src={item.image}
                    alt=""
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover"
                  />
                </Link>
                <div className="flex flex-1 flex-col p-2 pt-4">
                  <Link
                    href={`/product/${encodeURIComponent(item.productId)}`}
                    className="line-clamp-2 font-semibold text-gray-900 hover:text-orange-700"
                  >
                    {item.title}
                  </Link>
                  <p className="mt-2 font-bold text-gray-900">
                    {formatPrice(item.price)}
                  </p>
                  <div className="mt-4 flex gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        if (addCartItem(item)) {
                          toast.success(`Added "${item.title}" to your cart.`);
                        } else {
                          toast.error(
                            "Your browser could not save the cart. Check storage permissions.",
                          );
                        }
                      }}
                      className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-orange-600 px-3 py-2.5 text-sm font-semibold text-white hover:bg-orange-700"
                    >
                      <ShoppingBag size={16} />
                      Add to cart
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        const result = toggleWishlistItem(item);
                        if (!result.success) {
                          toast.error(
                            "Your browser could not update the wishlist. Check storage permissions.",
                          );
                        }
                      }}
                      aria-label={`Remove ${item.title} from wishlist`}
                      className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-gray-200 text-gray-500 hover:border-red-200 hover:bg-red-50 hover:text-red-600"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
