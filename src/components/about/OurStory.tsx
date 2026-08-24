"use client";

import Image from "next/image";
import {
  BookOpen,
  ShieldCheck,
  Truck,
  ArrowUpRight,
  Sparkles,
} from "lucide-react";

import OurStoryImage from "../../../public/images/about/story.webp";

const OurStory = () => {
  return (
    <section className="relative overflow-hidden bg-white py-10">

      <div className="container relative px-3 lg:px-6">
        <div className="grid items-center gap-12 lg:grid-cols-[1fr_0.9fr] lg:gap-16">

          {/* ================= LEFT CONTENT ================= */}
          <div>
            {/* Label */}
            <div className="mb-5 flex items-center gap-3">
              <span className="text-xs description font-bold uppercase tracking-[0.18em] text-orange-600">
                Our Story
              </span>
            </div>

            {/* Heading */}
            <h2 className="max-w-2xl text-3xl title font-bold leading-[1.12] tracking-tight text-gray-900 sm:text-4xl md:text-[46px]">
              More Than a Bookstore,
              <br />
              <span className="text-orange-600">
                We Create Reading Experiences.
              </span>
            </h2>

            {/* Description */}
            <div className="mt-6 space-y-4">
              <p className="text-sm leading-7 text-gray-600 md:text-[16px] description">
                At ProBooks, our story began with a simple belief — every
                great book has the power to change the way we think, learn,
                and see the world.
              </p>

              <p className="text-sm leading-7 text-gray-600 md:text-[16px] description">
                What started as a passion for discovering meaningful books has
                grown into a trusted destination for readers everywhere. From
                timeless classics to modern bestsellers, we carefully bring
                together books that inspire curiosity and imagination.
              </p>
            </div>

            {/* Stats */}
            <div className="mt-8 grid max-w-xl grid-cols-3 divide-x divide-gray-200 border-y border-gray-200 py-5">
              <div className="pr-4">
                <p className="text-xl font-bold text-gray-900 md:text-2xl">
                  1K+
                </p>
                <p className="mt-1 text-[11px] text-gray-500">
                  Books Available
                </p>
              </div>

              <div className="px-4">
                <p className="text-xl font-bold text-gray-900 md:text-2xl">
                  8K+
                </p>
                <p className="mt-1 text-[11px] text-gray-500">
                  Happy Readers
                </p>
              </div>

              <div className="pl-4">
                <p className="text-xl font-bold text-gray-900 md:text-2xl">
                  4.9/5
                </p>
                <p className="mt-1 text-[11px] text-gray-500">
                  Reader Rating
                </p>
              </div>
            </div>
          </div>

          {/* ================= RIGHT IMAGE ================= */}
          <div className="relative lg:pl-4">

            {/* Image */}
            <div className="relative overflow-hidden rounded-[28px] bg-gray-100 shadow-xl">
              <div className="aspect-[1.3/1] w-full">
                <Image
                  src={OurStoryImage}
                  alt="A cozy reading space surrounded by books"
                  fill
                  priority
                  className="object-cover transition-transform duration-700 hover:scale-105"
                />
              </div>

              {/* Bottom overlay */}
              <div className="absolute bottom-5 left-5 right-5 rounded-2xl border border-white/20 bg-white/90 p-4 shadow-lg backdrop-blur-md">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-orange-600">
                      Since 2020
                    </p>

                    <p className="mt-1 text-sm font-bold text-gray-900">
                      Inspiring Readers, One Book at a Time.
                    </p>
                  </div>

                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-orange-600 text-white">
                    <BookOpen size={18} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default OurStory;