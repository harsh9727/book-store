"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import {
  Heart,
  ChevronLeft,
  ChevronRight,
  ArrowRight,
} from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import ProductImg from "../../../public/images/products/atomic-habits.jpg"

import "swiper/css";
import "swiper/css/navigation";

type Product = {
  id: number;
  title: string;
  author: string;
  description: string;
  price: number;
  badge: string | null;
  cover: typeof ProductImg;
  cta: string;
};

type BadgeTagProps = {
  label: string;
};

type ProductCardProps = {
  product: Product;
  isLiked: boolean;
  onToggleLike: (id: number) => void;
};

const products: Product[] = [
  {
    id: 1,
    title: "The Silent Forest",
    author: "John William",
    description:
      "A powerful Christian story about faith, courage, and finding hope during life's darkest moments.",
    price: 120,
    badge: null,
    cover: ProductImg,
    cta: "Add to Cart",
  },
  {
    id: 2,
    title: "Tekriono Sad",
    author: "David Thomas",
    description:
      "An inspiring devotional book filled with thoughtful messages to strengthen your faith every day.",
    price: 250,
    badge: "New",
    cover: ProductImg,
    cta: "Add to Cart",
  },
  {
    id: 3,
    title: "ABC of Faith",
    author: "Sarah Johnson",
    description:
      "A simple and engaging Christian book introducing young readers to faith, kindness, prayer, and God's love.",
    price: 270,
    badge: "Sale",
    cover: ProductImg,
    cta: "Add to Cart",
  },
  {
    id: 4,
    title: "Walking With God",
    author: "Michael James",
    description:
      "A practical guide to developing a deeper relationship with God through prayer, faith, and daily reflection.",
    price: 320,
    badge: "Best Seller",
    cover: ProductImg,
    cta: "Add to Cart",
  },
  {
    id: 5,
    title: "Grace for Every Day",
    author: "Emily Grace",
    description:
      "A collection of encouraging reflections designed to bring peace, strength, and hope into everyday life.",
    price: 220,
    badge: null,
    cover: ProductImg,
    cta: "Add to Cart",
  },
  {
    id: 6,
    title: "The Power of Prayer",
    author: "Daniel Smith",
    description:
      "Discover the importance of prayer and learn how faith can bring comfort, wisdom, and strength in difficult times.",
    price: 350,
    badge: "Pre-Order",
    cover: ProductImg,
    cta: "Pre-Order",
  },
  {
    id: 7,
    title: "A Journey of Faith",
    author: "Rachel Adams",
    description:
      "A heartfelt inspirational story about faith, relationships, forgiveness, and discovering purpose in life.",
    price: 275,
    badge: null,
    cover: ProductImg,
    cta: "Add to Cart",
  },
  {
    id: 8,
    title: "Hope in the Darkness",
    author: "James Anderson",
    description:
      "An uplifting Christian story that reminds us that hope and faith can guide us through life's greatest challenges.",
    price: 299,
    badge: "New",
    cover: ProductImg,
    cta: "Add to Cart",
  },
  {
    id: 9,
    title: "Living by Faith",
    author: "Rebecca Martin",
    description:
      "Practical lessons and inspiring stories to help readers build stronger faith and live with greater purpose.",
    price: 240,
    badge: null,
    cover: ProductImg,
    cta: "Add to Cart",
  },
  {
    id: 10,
    title: "The Gift of Grace",
    author: "Andrew Wilson",
    description:
      "A meaningful exploration of grace, forgiveness, and God's unconditional love for every believer.",
    price: 280,
    badge: "Best Seller",
    cover: ProductImg,
    cta: "Add to Cart",
  },
  {
    id: 11,
    title: "Faith Over Fear",
    author: "Daniel Brooks",
    description:
      "An encouraging book that helps readers face uncertainty with confidence, prayer, courage, and faith.",
    price: 310,
    badge: "Popular",
    cover: ProductImg,
    cta: "Add to Cart",
  },
  {
    id: 12,
    title: "Morning Devotions",
    author: "Sophia Taylor",
    description:
      "Start each morning with short devotional thoughts, encouraging prayers, and meaningful reflections.",
    price: 199,
    badge: "New",
    cover: ProductImg,
    cta: "Add to Cart",
  },
];

function BadgeTag({ label }: BadgeTagProps) {
  const styles: Record<string, string> = {
    New: "bg-orange-600",
    Sale: "bg-orange-600",
    "Best Seller": "bg-orange-600",
  };

  return (
    <span
      className={`absolute left-4 top-4 z-10 rounded-lg px-3 py-1.5 text-[11px] font-semibold tracking-wide text-white ${
        styles[label] || "bg-orange-600"
      }`}
    >
      {label}
    </span>
  );
}

function ProductCard({
  product,
  isLiked,
  onToggleLike,
}: ProductCardProps) {
  return (
    <article className="group h-full">
      {/* Product Image */}
      <div
        className="relative aspect-[3/3] w-full overflow-hidden rounded-2xl bg-gray-100"
      >
        <Image
          src={product.cover}
          alt={product.title}
          fill
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-105  border border-gray-200 overflow-hidden rounded-2xl"
          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />

        {product.badge && <BadgeTag label={product.badge} />}

        {/* Wishlist */}
        <button
          type="button"
          onClick={() => onToggleLike(product.id)}
          aria-label={
            isLiked ? "Remove from wishlist" : "Add to wishlist"
          }
          className="absolute right-4 top-4 z-10 grid h-10 w-10 place-items-center rounded-full bg-white text-gray-700 shadow-sm transition-all duration-300 hover:scale-105 hover:text-orange-600"
        >
          <Heart
            size={17}
            strokeWidth={1.8}
            className={
              isLiked
                ? "fill-orange-600 text-orange-600"
                : ""
            }
          />
        </button>

        {/* Hover Overlay */}
        <div className="absolute inset-0 bg-black/0 transition-all duration-300 group-hover:bg-black/[0.04]" />
      </div>

      {/* Product Details */}
      <div className="pt-4">
        {/* Title */}
        <h3 className="line-clamp-2 min-h-[48px] text-[16px] title font-semibold leading-6 text-gray-900 transition-colors duration-200 group-hover:text-orange-600">
          {product.title}
        </h3>

        {/* Author */}
        <p className="mt-1 text-sm text-gray-500">
          By{" "}
          <span className="font-medium text-gray-700">
            {product.author}
          </span>
        </p>

        {/* Description */}
        <p className="mt-2 line-clamp-2 min-h-[40px] text-[14px] leading-5 text-gray-500">
          {product.description}
        </p>

        {/* Price */}
        <div className="mt-3 flex items-center justify-between gap-3">
          <p className="text-[17px] font-bold text-orange-600">
            ₹{product.price.toFixed(2)}
          </p>

          {product.badge === "Sale" && (
            <span className="text-xs text-gray-400 line-through">
              ₹{(product.price + 50).toFixed(2)}
            </span>
          )}
        </div>

        {/* Add to Cart */}
        <button
          type="button"
          className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg bg-orange-600 px-4 py-2.5 text-sm font-medium text-white transition-all duration-300 hover:bg-orange-700"
        >
          {product.cta}
          <ArrowRight size={15} />
        </button>
      </div>
    </article>
  );
}

const Trendings = () => {
  const [likedIds, setLikedIds] = useState<number[]>([]);

  const prevRef = useRef<HTMLButtonElement>(null);
  const nextRef = useRef<HTMLButtonElement>(null);

  const toggleLike = (id: number) => {
    setLikedIds((prev) =>
      prev.includes(id)
        ? prev.filter((x) => x !== id)
        : [...prev, id]
    );
  };

  return (
    <section className="bg-white py-10">
      <div className="container px-5 lg:px-8">

        {/* Header */}
        <div className="mb-10 flex items-end justify-between gap-6">
          <div className="max-w-2xl">

            {/* Main Heading */}
            <h2 className="title text-3xl font-semibold text-orange-600 sm:text-4xl">
              Trendings Books
            </h2>

            {/* Section Description */}
            <p className="description mt-3 max-w-xl text-sm leading-6 text-gray-500 sm:text-[15px]">
              Explore our most-loved Christian books, Trendings Bibles, devotionals, and inspirational titles trusted by readers, families, churches, and ministries.
            </p>
          </div>

          {/* Desktop View All */}
          <a
            href="/new-releases"
            className="description hidden shrink-0 items-center gap-2 rounded-lg border border-gray-200 bg-white px-5 py-2.5 text-sm font-medium text-gray-800 shadow-sm transition-all duration-300 hover:border-orange-600 hover:text-orange-600 sm:flex"
          >
            View All
            <ArrowRight size={16} />
          </a>
        </div>

        {/* Carousel */}
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
                swiper.params.navigation.prevEl =
                  prevRef.current;

                swiper.params.navigation.nextEl =
                  nextRef.current;
              }
            }}
            breakpoints={{
              480: {
                slidesPerView: 1.7,
                spaceBetween: 18,
              },
              640: {
                slidesPerView: 2.3,
                spaceBetween: 20,
              },
              768: {
                slidesPerView: 3,
                spaceBetween: 22,
              },
              1024: {
                slidesPerView: 4,
                spaceBetween: 24,
              },
              1280: {
                slidesPerView: 5,
                spaceBetween: 24,
              },
            }}
          >
            {products.map((product) => (
              <SwiperSlide key={product.id}>
                <ProductCard
                  product={product}
                  isLiked={likedIds.includes(product.id)}
                  onToggleLike={toggleLike}
                />
              </SwiperSlide>
            ))}
          </Swiper>

          {/* Previous */}
          <button
            ref={prevRef}
            type="button"
            aria-label="Previous products"
            className="absolute -left-5 top-[38%] z-20 hidden h-11 w-11 -translate-y-1/2 place-items-center rounded-full border border-gray-200 bg-white text-gray-700 shadow-lg transition-all duration-300 hover:border-orange-600 hover:text-orange-600 lg:grid"
          >
            <ChevronLeft size={20} />
          </button>

          {/* Next */}
          <button
            ref={nextRef}
            type="button"
            aria-label="Next products"
            className="absolute -right-5 top-[38%] z-20 hidden h-11 w-11 -translate-y-1/2 place-items-center rounded-full border border-gray-200 bg-white text-gray-700 shadow-lg transition-all duration-300 hover:border-orange-600 hover:text-orange-600 lg:grid"
          >
            <ChevronRight size={20} />
          </button>
        </div>

        {/* Mobile View All */}
        <div className="mt-10 flex justify-center sm:hidden">
          <a
            href="/new-releases"
            className="description flex items-center gap-2 rounded-full border border-orange-600 px-6 py-2.5 text-sm font-medium text-orange-600 transition-colors hover:bg-orange-600 hover:text-white"
          >
            View All
            <ArrowRight size={16} />
          </a>
        </div>
      </div>
    </section>
  );
};

export default Trendings;