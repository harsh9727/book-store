"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, BookOpen } from "lucide-react";
import type { Product } from "@/types/product";
import { useLanguage } from "@/contexts/LanguageContext";
import { localizeProduct } from "@/lib/localizedProduct";
import DefaultMagazineCover from "../../../public/images/products/magazines/magazine.jpg";

interface MagazinesProps {
  products?: Product[];
}

const fallbackMagazines = [
  {
    id: "mag-faith-life",
    title: "Faith & Life Magazine",
    description:
      "Discover inspiring stories, faith-filled articles, and meaningful reflections for daily Christian life.",
    image: DefaultMagazineCover.src,
    price: 120,
    badge: "Quarterly Issue",
    href: "/allproducts?category=magazines",
  },
  {
    id: "mag-christian-living",
    title: "Christian Living Digest",
    description:
      "Explore practical guidance, inspiring stories, and ideas for everyday Christian fellowship and family living.",
    image: DefaultMagazineCover.src,
    price: 150,
    badge: "Monthly Edition",
    href: "/allproducts?category=magazines",
  },
  {
    id: "mag-good-news",
    title: "The Good News Monthly",
    description:
      "Read encouraging articles, spiritual insights, testimonies, and stories that inspire lasting hope.",
    image: DefaultMagazineCover.src,
    price: 99,
    badge: "Special Edition",
    href: "/allproducts?category=magazines",
  },
];

const Magazines = ({ products = [] }: MagazinesProps) => {
  const { language } = useLanguage();

  const magazineItems =
    products.length > 0
      ? products.slice(0, 3).map((prod) => {
          const localized = localizeProduct(prod, language);
          return {
            id: prod.id,
            title: localized.title,
            description:
              localized.description ||
              localized.synopsis ||
              "Inspiring Christian periodical filled with faith, stories, and spiritual insights.",
            image: prod.image || DefaultMagazineCover.src,
            price: prod.price,
            originalPrice: prod.originalPrice,
            badge: prod.badge || "Magazine",
            href: `/product/${prod.id}`,
          };
        })
      : fallbackMagazines;

  return (
    <section className="bg-white py-10">
      <div className="container px-3 lg:px-6">
        {/* Section Header */}
        <div className="mb-10 flex items-end justify-between gap-6">
          <div className="max-w-2xl text-center mx-auto">
            {/* Heading */}
            <h2 className="title text-3xl font-semibold text-orange-600 sm:text-4xl">
              Our Magazines
            </h2>

            {/* Description */}
            <p className="description mt-3 max-w-xl text-sm leading-6 text-gray-500 sm:text-[15px]">
              Discover inspiring Christian magazines filled with faith, stories,
              spiritual insights, and meaningful content for everyday life.
            </p>
          </div>
        </div>

        {/* Magazine Cards */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {magazineItems.map((magazine, index) => (
            <Link
              href={magazine.href}
              key={magazine.id}
              className="group relative flex flex-row items-stretch overflow-hidden rounded-2xl border border-gray-300 bg-white shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] transition-all duration-300 hover:border-orange-200 hover:shadow-[0_12px_28px_-6px_rgba(234,88,12,0.12)]"
              style={{
                animationDelay: `${index * 120}ms`,
              }}
            >
              {/* Left Side: White BG & Content */}
              <div className="flex flex-1 flex-col justify-between bg-white p-5 sm:p-6">
                <div>
                  {/* Top Badge & Number */}
                  <div className="mb-3 flex items-center justify-between gap-2">
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-orange-50 px-2.5 py-0.5 text-xs font-semibold text-orange-600">
                      <BookOpen size={13} className="text-orange-600" />
                      {magazine.badge || `Magazine 0${index + 1}`}
                    </span>

                    {typeof magazine.price === "number" && magazine.price > 0 && (
                      <span className="text-xs font-bold text-gray-900 bg-gray-100 px-2 py-0.5 rounded-md">
                        ₹{magazine.price}
                      </span>
                    )}
                  </div>

                  {/* Title */}
                  <h3 className="title text-lg font-bold text-gray-900 transition-colors duration-300 group-hover:text-orange-600 sm:text-xl line-clamp-2">
                    {magazine.title}
                  </h3>

                  {/* Description */}
                  <p className="description mt-2 line-clamp-3 text-xs leading-relaxed text-gray-500 sm:text-[13px]">
                    {magazine.description}
                  </p>
                </div>

                {/* Bottom CTA */}
                <div className="mt-4 flex items-center justify-between pt-3 border-t border-gray-100">
                  <div className="flex items-center text-xs font-semibold text-orange-600 transition-all duration-300 group-hover:text-orange-700 sm:text-sm">
                    <span>View Product Details</span>
                    <ArrowRight
                      size={15}
                      className="ml-1.5 transition-transform duration-300 group-hover:translate-x-1.5"
                    />
                  </div>
                </div>
              </div>

              {/* Right Side: Magazine Image */}
              <div className="relative w-[38%] min-w-[120px] shrink-0 overflow-hidden bg-gray-100 sm:w-[42%] sm:min-w-[150px]">
                <Image
                  src={magazine.image}
                  alt={magazine.title}
                  fill
                  priority={index === 0}
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  sizes="(max-width: 640px) 40vw, (max-width: 1024px) 25vw, 18vw"
                />

                {/* Soft gradient overlay on image */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />

                {/* Hover tint */}
                <div className="absolute inset-0 bg-orange-600/0 transition-colors duration-300 group-hover:bg-orange-600/10" />
              </div>
            </Link>
          ))}
        </div>

        {/* View All */}
        <div className="mt-8 flex justify-center">
          <Link
            href="/allproducts?category=magazines"
            className="description flex items-center gap-2 rounded-full border border-orange-600 px-6 py-2.5 text-sm font-medium text-orange-600 transition-all duration-300 hover:bg-orange-600 hover:text-white"
          >
            <span>View All Magazines in Catalog</span>
            <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Magazines;