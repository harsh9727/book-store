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
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {magazines.map((magazine, index) => (
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
                  <div className="mb-3 flex items-center justify-between">
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-orange-50 px-2.5 py-0.5 text-xs font-semibold text-orange-600">
                      <BookOpen size={13} className="text-orange-600" />
                      Magazine 0{magazine.id}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="title text-lg font-bold text-gray-900 transition-colors duration-300 group-hover:text-orange-600 sm:text-xl">
                    {magazine.title}
                  </h3>

                  {/* Description */}
                  <p className="description mt-2 line-clamp-3 text-xs leading-relaxed text-gray-500 sm:text-[13px]">
                    {magazine.description}
                  </p>
                </div>

                {/* Bottom CTA */}
                <div className="mt-4 flex items-center text-xs font-semibold text-orange-600 transition-all duration-300 group-hover:text-orange-700 sm:text-sm">
                  <span>Explore Magazine</span>
                  <ArrowRight
                    size={15}
                    className="ml-1.5 transition-transform duration-300 group-hover:translate-x-1.5"
                  />
                </div>
              </div>

              {/* Right Side: Magazine Image */}
              <div className="relative w-[38%] min-w-[120px] shrink-0 overflow-hidden bg-gray-100 sm:w-[42%] sm:min-w-[150px]">
                <Image
                  src={magazine.image}
                  alt={magazine.title}
                  fill
                  priority={index === 0}
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-108"
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