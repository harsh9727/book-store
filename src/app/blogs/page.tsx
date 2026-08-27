"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  CalendarDays,
  Clock,
  ArrowRight,
  Search,
  BookOpen,
  Sparkles,
} from "lucide-react";
import { blogs } from "@/data/blogs";
import { blogsFaqs } from "@/data/faqs";
import Faq from "@/components/common/Faq";

export default function BlogsPage() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  const categories = [
    "All",
    "Book Recommendations",
    "Reading Tips",
    "New Releases",
    "Christian Books",
    "Book Guide",
  ];

  const filteredBlogs = blogs.filter((blog) => {
    const matchesCategory =
      selectedCategory === "All" || blog.category === selectedCategory;
    const matchesSearch =
      blog.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      blog.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
      blog.tags.some((tag) =>
        tag.toLowerCase().includes(searchQuery.toLowerCase())
      );
    return matchesCategory && matchesSearch;
  });

  const featuredBlog = blogs[0];

  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      {/* Header Banner */}
      <div className="mb-10 text-center max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-1.5 rounded-full bg-orange-100/80 px-3.5 py-1 text-sm font-semibold description tracking-wide text-orange-700 mb-3">
          <BookOpen size={16} />
          <span>The ProBooks Literary Journal</span>
        </div>
        <h1 className="title text-3xl font-extrabold tracking-tight text-gray-900 md:text-5xl">
          Stories, Ideas & Book Wisdom
        </h1>
        <p className="description mt-3 text-sm md:text-base text-gray-600">
          Curated reading guides, author perspectives, book reviews, and mindful reading tips.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className={`shrink-0 rounded-full px-4 py-2 text-sm font-medium description tracking-wide transition-all ${selectedCategory === cat
                ? "bg-orange-600 text-white shadow-sm "
                : "bg-gray-100 text-gray-700 hover:bg-gray-200 "
                }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative w-full md:w-72">
          <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search articles or topics..."
            className="w-full rounded-full border border-gray-200 bg-white py-2.5 pl-9 pr-4 text-sm font-medium text-gray-900 description tracking-wide focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500"
          />
        </div>
      </div>

      {/* Blog Cards Grid */}
      {filteredBlogs.length === 0 ? (
        <div className="py-16 text-center">
          <p className="text-gray-500">No blog posts found matching your search.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredBlogs.map((blog) => (
            <article
              key={blog.id}
              className="group flex flex-col overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-orange-200 hover:shadow-lg hover:shadow-orange-500/10"
            >
              {/* Cover Image */}
              <Link
                href={`/blogs/${blog.id}`}
                className="relative block aspect-[16/10] overflow-hidden bg-gray-100"
              >
                <Image
                  src={blog.image}
                  alt={blog.title}
                  fill
                  className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                />
                <span className="absolute left-3 top-3 rounded-full bg-white/95 px-3 py-1 text-sm font-semibold description tracking-wide text-orange-600 shadow-sm backdrop-blur-sm">
                  {blog.category}
                </span>
              </Link>

              {/* Card Body */}
              <div className="flex flex-1 flex-col p-5">
                <div className="mb-2.5 flex items-center gap-4 text-sm text-gray-500 description tracking-wide">
                  <div className="flex items-center gap-2">
                    <CalendarDays size={14} className="text-orange-600" />
                    <span>{blog.date}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock size={14} className="text-orange-600" />
                    <span>{blog.readTime}</span>
                  </div>
                </div>

                <Link href={`/blogs/${blog.id}`}>
                  <h3 className="line-clamp-2 title text-lg font-semibold text-gray-900 transition-colors group-hover:text-orange-600">
                    {blog.title}
                  </h3>
                </Link>

                <p className="description mt-2 text-sm tracking-wide text-gray-600 line-clamp-2">
                  {blog.summary}
                </p>

                {/* Author footer */}
                <div className=" flex items-center justify-between border-t border-gray-100 pt-3 mt-4">
                  <div className="flex items-center gap-3">
                    <img
                      src={blog.author.avatar}
                      alt={blog.author.name}
                      className="h-10 w-10 rounded-full object-cover"
                    />
                    <span className="text-sm font-semibold description tracking-wide text-gray-800">{blog.author.name}</span>
                  </div>

                  <Link
                    href={`/blogs/${blog.id}`}
                    className="flex items-center gap-1 text-sm font-semibold tracking-wide description text-orange-600 hover:text-orange-700"
                  >
                    Read
                    <ArrowRight size={16} />
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}

      {/* Blogs & Journal FAQ Section */}
      <div className="mt-20 border-t border-gray-100 pt-12">
        <div className="bg-orange-50/70 rounded-3xl p-6 sm:p-10 border border-orange-100/80 shadow-sm max-w-5xl mx-auto">
          <Faq
            faqs={blogsFaqs}
            badge="Literary Journal"
            title="Book Reviews & Blog FAQs"
            subtitle="Frequently asked questions about guest submissions, book curation, and reading lists."
          />
        </div>
      </div>
    </div>
  );
}
