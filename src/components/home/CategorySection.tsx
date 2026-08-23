"use client";

import Link from "next/link";
import {
  BookOpen,
  Cross,
  Heart,
  Baby,
  GraduationCap,
  Users,
  BookMarked,
  Gift,
  ArrowRight,
} from "lucide-react";

const categories = [
  {
    id: 1,
    title: "Holy Bibles",
    icon: BookOpen,
    href: "/categories/holy-bibles",
  },
  {
    id: 2,
    title: "Christian Living",
    icon: Cross,
    href: "/categories/christian-living",
  },
  {
    id: 3,
    title: "Devotionals",
    icon: Heart,
    href: "/categories/devotionals",
  },
  {
    id: 4,
    title: "Children's Books",
    icon: Baby,
    href: "/categories/childrens-books",
  },
  {
    id: 5,
    title: "Study Guides",
    icon: GraduationCap,
    href: "/categories/study-guides",
  },
  {
    id: 6,
    title: "Inspirational",
    icon: Users,
    href: "/categories/inspirational",
  },
  {
    id: 7,
    title: "Christian Literature",
    icon: BookMarked,
    href: "/categories/christian-literature",
  },
  {
    id: 8,
    title: "Faith Gifts",
    icon: Gift,
    href: "/categories/faith-gifts",
  },
];

const CategorySection = () => {
  return (
    <section className="bg-[#fffaf0] py-12">
      <div className="container px-5 lg:px-8">

        {/* Header */}
        <div className="mb-10 text-center">

          <h2 className="title mt-2 text-3xl font-semibold text-gray-900 sm:text-4xl">
            Explore Categories
          </h2>

          <p className="description mx-auto mt-3 max-w-2xl text-sm leading-6 text-gray-500 sm:text-[15px]">
            Find the right books, resources, and faith-inspired
            products from our carefully organized collections.
          </p>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {categories.map((category) => {
            const Icon = category.icon;

            return (
              <Link
                key={category.id}
                href={category.href}
                className="group relative overflow-hidden rounded-2xl border border-gray-200 bg-white p-6 transition-all duration-300 hover:-translate-y-1 hover:border-orange-200 hover:shadow-xl hover:shadow-orange-600/10"
              >
                {/* Orange background decoration */}
                <div className="absolute -right-10 -top-10 h-28 w-28 rounded-full bg-orange-600/5 transition-all duration-500 group-hover:scale-[2.5] group-hover:bg-orange-600/10" />

                {/* Icon */}
                <div className="relative mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-orange-600/10 text-orange-600 transition-all duration-300 group-hover:bg-orange-600 group-hover:text-white group-hover:shadow-lg group-hover:shadow-orange-600/20">
                  <Icon
                    size={22}
                    strokeWidth={1.8}
                    className="transition-transform duration-300 group-hover:scale-110"
                  />
                </div>

                <div className="relative mt-5 flex items-center justify-between">
                  {/* Category Name */}
                  <h3 className="title relative text-xl font-semibold text-gray-900 transition-colors duration-300 group-hover:text-orange-600">
                    {category.title}
                  </h3>
                  <span className="flex h-8 w-8 items-center justify-center rounded-full border border-gray-200 text-gray-500 transition-all duration-300 group-hover:border-orange-600 group-hover:bg-orange-600 group-hover:text-white">
                    <ArrowRight
                      size={15}
                      className="transition-transform duration-300 group-hover:translate-x-0.5"
                    />
                  </span>
                </div>

                {/* Bottom Orange Line */}
                <span className="absolute bottom-0 left-0 h-[3px] w-0 bg-orange-600 transition-all duration-500 group-hover:w-full" />
              </Link>
            );
          })}
        </div>

        {/* View All */}
        <div className="mt-9 flex justify-center">
          <Link
            href="/categories"
            className="description flex items-center gap-2 rounded-lg border border-orange-600 px-6 py-2.5 text-sm font-medium text-orange-600 transition-all duration-300 hover:bg-orange-600 hover:text-white"
          >
            View All Categories
            <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default CategorySection;