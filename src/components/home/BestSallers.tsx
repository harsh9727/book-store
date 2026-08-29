"use client";

import Link from "next/link";
import { useRef, useState } from "react";
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

const products: ProductItem[] = [
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

const BestSellers = () => {
  const [likedIds, setLikedIds] = useState<number[]>([]);

  const prevRef = useRef<HTMLButtonElement>(null);
  const nextRef = useRef<HTMLButtonElement>(null);

  const toggleLike = (id: any) => {
    setLikedIds((prev) =>
      prev.includes(id)
        ? prev.filter((x) => x !== id)
        : [...prev, id]
    );
  };

  return (
    <section className="bg-white py-10">
      <div className="container px-3 lg:px-6">

        {/* Header */}
        <div className="mb-10 flex items-end justify-between gap-6">
          <div className="max-w-2xl">

            {/* Main Heading */}
            <h2 className="title text-3xl font-semibold text-orange-600 sm:text-4xl">
              Best Sellers
            </h2>

            {/* Section Description */}
            <p className="description mt-3 max-w-xl text-sm leading-6 text-gray-500 sm:text-[15px]">
              Explore our most-loved Christian books, BestSellers Bibles, devotionals, and inspirational titles trusted by readers, families, churches, and ministries.
            </p>
          </div>

          {/* Desktop View All */}
          <Link
            href="/allproducts?collection=bestseller"
            className="description hidden shrink-0 items-center gap-2 rounded-lg border border-gray-200 bg-white px-5 py-2.5 text-sm font-medium text-gray-800 shadow-sm transition-all duration-300 hover:border-orange-600 hover:text-orange-600 sm:flex"
          >
            View All
            <ArrowRight size={16} />
          </Link>
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
          <Link
            href="/allproducts?collection=bestseller"
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

export default BestSellers;