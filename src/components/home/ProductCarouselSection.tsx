"use client";

import Link from "next/link";
import { useRef } from "react";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import type { Swiper as SwiperInstance } from "swiper";

import ProductCard from "@/components/product/ProductCard";
import type { Product } from "@/types/product";
import "swiper/css";

interface ProductCarouselSectionProps {
  title: string;
  description: string;
  href: string;
  products: Product[];
  background?: string;
}

export default function ProductCarouselSection({
  title,
  description,
  href,
  products,
  background = "bg-white",
}: ProductCarouselSectionProps) {
  const swiperRef = useRef<SwiperInstance | null>(null);

  return (
    <section className={`${background} py-10`}>
      <div className="container px-3 lg:px-6">
        <div className="mb-10 flex items-end justify-between gap-6">
          <div className="max-w-2xl">
            <h2 className="title text-3xl font-semibold text-orange-600 sm:text-4xl">
              {title}
            </h2>
            <p className="description mt-3 max-w-xl text-sm leading-6 text-gray-500 sm:text-[15px]">
              {description}
            </p>
          </div>
          <Link
            href={href}
            className="description hidden shrink-0 items-center gap-2 rounded-lg border border-gray-200 bg-white px-5 py-2.5 text-sm font-medium text-gray-800 shadow-sm transition hover:border-orange-600 hover:text-orange-600 sm:flex"
          >
            View All
            <ArrowRight size={16} />
          </Link>
        </div>

        {products.length > 0 ? (
          <div className="relative">
            <Swiper
              onSwiper={(swiper) => {
                swiperRef.current = swiper;
              }}
              spaceBetween={18}
              slidesPerView={1.15}
              breakpoints={{
                480: { slidesPerView: 1.7 },
                640: { slidesPerView: 2.3, spaceBetween: 20 },
                768: { slidesPerView: 3, spaceBetween: 22 },
                1024: { slidesPerView: 4, spaceBetween: 24 },
                1280: { slidesPerView: 5, spaceBetween: 24 },
              }}
            >
              {products.map((product) => (
                <SwiperSlide key={product.id}>
                  <ProductCard product={product} />
                </SwiperSlide>
              ))}
            </Swiper>
            <button
              type="button"
              onClick={() => swiperRef.current?.slidePrev()}
              aria-label={`Previous ${title}`}
              className="absolute -left-5 top-[38%] z-20 hidden h-11 w-11 -translate-y-1/2 place-items-center rounded-full border border-gray-200 bg-white text-gray-700 shadow-lg hover:border-orange-600 hover:text-orange-600 lg:grid"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              type="button"
              onClick={() => swiperRef.current?.slideNext()}
              aria-label={`Next ${title}`}
              className="absolute -right-5 top-[38%] z-20 hidden h-11 w-11 -translate-y-1/2 place-items-center rounded-full border border-gray-200 bg-white text-gray-700 shadow-lg hover:border-orange-600 hover:text-orange-600 lg:grid"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        ) : (
          <p className="rounded-2xl border border-dashed border-gray-200 bg-white px-5 py-10 text-center text-sm text-gray-500">
            No products are currently assigned to this collection.
          </p>
        )}

        <div className="mt-10 flex justify-center sm:hidden">
          <Link
            href={href}
            className="description flex items-center gap-2 rounded-full border border-orange-600 px-6 py-2.5 text-sm font-medium text-orange-600 hover:bg-orange-600 hover:text-white"
          >
            View All
            <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </section>
  );
}
