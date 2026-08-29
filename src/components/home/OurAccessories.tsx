"use client";

import Link from "next/link";
import { useRef } from "react";
import { ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import ProductImg from "../../../public/images/products/atomic-habits.jpg";
import ProductCard from "@/components/product/ProductCard";

import "swiper/css";
import "swiper/css/navigation";

type ProductItem = {
  id: number;
  title: string;
  author: string;
  description: string;
  price: number;
  badge: string | null;
  cover: typeof ProductImg;
  cta: string;
};

const accessories: ProductItem[] = [
  {
    id: 1,
    title: "Classic Leather Journal",
    author: "ProBooks Studio",
    description:
      "A premium journal for reflections, planning, and daily inspiration.",
    price: 149,
    badge: "New",
    cover: ProductImg,
    cta: "Add to Cart",
  },
  {
    id: 2,
    title: "Faith & Grace Mug",
    author: "Grace House",
    description:
      "A cozy ceramic mug designed for quiet mornings and thoughtful prayers.",
    price: 89,
    badge: "Best Seller",
    cover: ProductImg,
    cta: "Add to Cart",
  },
  {
    id: 3,
    title: "Minimal Desk Lamp",
    author: "Light & Co.",
    description:
      "Warm lighting to create a peaceful reading corner at home or in the study.",
    price: 219,
    badge: "Popular",
    cover: ProductImg,
    cta: "Add to Cart",
  },
  {
    id: 4,
    title: "Premium Book Sleeve",
    author: "BookNest",
    description:
      "Protective, elegant, and built for readers who carry their favorite titles.",
    price: 199,
    badge: "Trending",
    cover: ProductImg,
    cta: "Add to Cart",
  },
  {
    id: 5,
    title: "Prayer Notebook Set",
    author: "Grace & Bloom",
    description:
      "Beautifully designed prayer journals for devotional writing and reflection.",
    price: 179,
    badge: null,
    cover: ProductImg,
    cta: "Add to Cart",
  },
  {
    id: 6,
    title: "Reading Light Stand",
    author: "Eden Essentials",
    description:
      "A soft and focused light for evening reading and peaceful study sessions.",
    price: 259,
    badge: "New",
    cover: ProductImg,
    cta: "Add to Cart",
  },
  {
    id: 7,
    title: "Canvas Book Tote",
    author: "The Daily Shelf",
    description:
      "A roomy, stylish tote for books, journals, and everyday essentials.",
    price: 169,
    badge: null,
    cover: ProductImg,
    cta: "Add to Cart",
  },
  {
    id: 8,
    title: "Reading Glasses Case",
    author: "Kindred Living",
    description:
      "Compact, polished, and practical for readers who carry their essentials daily.",
    price: 129,
    badge: "Sale",
    cover: ProductImg,
    cta: "Add to Cart",
  },
];

const OurAccessories = () => {
  const prevRef = useRef<HTMLButtonElement>(null);
  const nextRef = useRef<HTMLButtonElement>(null);

  return (
    <section className="bg-[#fffaf5] py-10">
      <div className="container px-3 lg:px-6">
        <div className="mb-10 flex items-end justify-between gap-6">
          <div className="max-w-2xl">
            <h2 className="title text-3xl font-semibold text-orange-600 sm:text-4xl">
              Our Accessories
            </h2>
            <p className="description mt-3 max-w-xl text-sm leading-6 text-gray-500 sm:text-[15px]">
              Thoughtful essentials for readers, gifting, and creating a peaceful study space with comfort and style.
            </p>
          </div>

          <Link
            href="/allproducts?category=accessories"
            className="description hidden shrink-0 items-center gap-2 rounded-lg border border-gray-200 bg-white px-5 py-2.5 text-sm font-medium text-gray-800 shadow-sm transition-all duration-300 hover:border-orange-600 hover:text-orange-600 sm:flex"
          >
            View All
            <ArrowRight size={16} />
          </Link>
        </div>

        <div className="relative">
          <Swiper
            modules={[Navigation]}
            spaceBetween={18}
            slidesPerView={1.15}
            navigation={{
              prevEl: prevRef.current,
              nextEl: nextRef.current,
            }}
            onBeforeInit={(swiper) => {
              if (
                swiper.params.navigation &&
                typeof swiper.params.navigation !== "boolean"
              ) {
                swiper.params.navigation.prevEl = prevRef.current;
                swiper.params.navigation.nextEl = nextRef.current;
              }
            }}
            breakpoints={{
              480: { slidesPerView: 1.7, spaceBetween: 18 },
              640: { slidesPerView: 2.3, spaceBetween: 20 },
              768: { slidesPerView: 3, spaceBetween: 22 },
              1024: { slidesPerView: 4, spaceBetween: 24 },
              1280: { slidesPerView: 5, spaceBetween: 24 },
            }}
          >
            {accessories.map((product) => (
              <SwiperSlide key={product.id}>
                <ProductCard product={product} />
              </SwiperSlide>
            ))}
          </Swiper>

          <button
            ref={prevRef}
            type="button"
            aria-label="Previous accessories"
            className="absolute -left-5 top-[38%] z-20 hidden h-11 w-11 -translate-y-1/2 place-items-center rounded-full border border-gray-200 bg-white text-gray-700 shadow-lg transition-all duration-300 hover:border-orange-600 hover:text-orange-600 lg:grid"
          >
            <ChevronLeft size={20} />
          </button>

          <button
            ref={nextRef}
            type="button"
            aria-label="Next accessories"
            className="absolute -right-5 top-[38%] z-20 hidden h-11 w-11 -translate-y-1/2 place-items-center rounded-full border border-gray-200 bg-white text-gray-700 shadow-lg transition-all duration-300 hover:border-orange-600 hover:text-orange-600 lg:grid"
          >
            <ChevronRight size={20} />
          </button>
        </div>

        <div className="mt-10 flex justify-center sm:hidden">
          <Link
            href="/allproducts?category=accessories"
            className="description flex items-center gap-2 rounded-full border border-orange-600 px-6 py-2.5 text-sm font-medium text-orange-600 transition-colors hover:bg-orange-600 hover:text-white"
          >
            View All
            <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default OurAccessories;
