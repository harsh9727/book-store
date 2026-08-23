"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, BookOpen } from "lucide-react";
import Magazine from "../../../public/images/products/magazines/magazine.jpg";

const magazines = [
  {
    id: 1,
    title: "Faith & Life",
    description:
      "Discover inspiring stories, faith-filled articles, and meaningful reflections.",
    image: Magazine,
    href: "/magazines/faith-life",
  },
  {
    id: 2,
    title: "Christian Living",
    description:
      "Explore practical guidance, inspiring stories, and ideas for everyday Christian living.",
    image: Magazine,
    href: "/magazines/christian-living",
  },
  {
    id: 3,
    title: "The Good News",
    description:
      "Read encouraging articles, spiritual insights, and stories that inspire hope.",
    image: Magazine,
    href: "/magazines/the-good-news",
  },
];

const Magazines = () => {
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
              Discover inspiring Christian magazines filled with
              faith, stories, spiritual insights, and meaningful
              content for everyday life.
            </p>
          </div>
        </div>

        {/* Magazine Cards */}
{/* Magazine Cards */}
<div className="grid grid-cols-1 gap-6 md:grid-cols-3">
  {magazines.map((magazine, index) => (
    <Link
      href={magazine.href}
      key={magazine.id}
      className="group relative block overflow-hidden rounded-2xl"
      style={{
        animationDelay: `${index * 120}ms`,
      }}
    >
      {/* Image */}
      <div className="relative aspect-[16/8] w-full overflow-hidden rounded-2xl bg-gray-100">

        <Image
          src={magazine.image}
          alt={magazine.title}
          fill
          priority={index === 0}
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
          sizes="(max-width: 768px) 100vw, 33vw"
        />

        {/* Strong Dark Gradient */}
        <div className="absolute inset-0 z-10 bg-gradient-to-t from-black/90 via-black/35 to-black/5" />

        {/* Hover Orange Overlay */}
        <div className="absolute inset-0 z-10 bg-orange-600/0 transition-all duration-500 group-hover:bg-orange-600/10" />

        {/* Content */}
        <div className="absolute inset-x-0 bottom-0 z-20 p-5 sm:p-6">

          <div className="transition-all duration-500 ease-out group-hover:-translate-y-1">

            {/* Icon */}
            <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-full bg-white text-orange-600 shadow-lg transition-all duration-500 group-hover:scale-110 group-hover:bg-orange-600 group-hover:text-white">
              <BookOpen size={17} />
            </div>

            {/* Title */}
            <h3 className="title text-xl font-semibold text-white drop-shadow-md sm:text-2xl">
              {magazine.title}
            </h3>

            {/* Description */}
            <p className="description mt-2 max-w-md text-xs leading-5 text-white/90 opacity-0 translate-y-3 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100 sm:text-sm">
              {magazine.description}
            </p>

            {/* Read More */}
            <div className="description mt-3 flex translate-y-3 items-center gap-2 text-sm font-semibold text-white opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
              Explore Magazine

              <ArrowRight
                size={15}
                className="transition-transform duration-300 group-hover:translate-x-1"
              />
            </div>

          </div>
        </div>

        {/* Number */}
        <span className="absolute right-4 top-4 z-30 flex h-8 w-8 items-center justify-center rounded-full bg-white text-xs font-semibold text-gray-800 shadow-md transition-all duration-300 group-hover:bg-orange-600 group-hover:text-white">
          0{magazine.id}
        </span>
      </div>
    </Link>
  ))}
</div>

        {/* Mobile View All */}
        <div className="mt-8 flex justify-center sm:hidden">
          <Link
            href="/magazines"
            className="description flex items-center gap-2 rounded-full border border-orange-600 px-6 py-2.5 text-sm font-medium text-orange-600 transition-all duration-300 hover:bg-orange-600 hover:text-white"
          >
            View All
            <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Magazines;