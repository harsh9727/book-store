"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { Search, Sparkles, SlidersHorizontal, BookOpen } from "lucide-react";
import { products } from "@/data/products";
import { categories } from "@/data/categories";
import { shopFaqs } from "@/data/faqs";
import ProductGrid from "@/components/product/ProductGrid";
import Breadcrumb from "@/components/common/Breadcrumb";
import Faq from "@/components/common/Faq";

export default function AllBooksPage() {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<"featured" | "price-asc" | "price-desc" | "rating">("featured");

  const categoryList = useMemo(() => {
    return [{ id: "all", name: "All Genres", slug: "all" }, ...categories];
  }, []);

  const filteredAndSortedProducts = useMemo(() => {
    let result = products.filter((p) => {
      const matchesCat =
        selectedCategory === "all" ||
        p.category.toLowerCase() === selectedCategory.toLowerCase();
      const matchesSearch =
        p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.category.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCat && matchesSearch;
    });

    if (sortBy === "price-asc") {
      result = [...result].sort((a, b) => a.price - b.price);
    } else if (sortBy === "price-desc") {
      result = [...result].sort((a, b) => b.price - a.price);
    } else if (sortBy === "rating") {
      result = [...result].sort((a, b) => (b.rating || 0) - (a.rating || 0));
    }

    return result;
  }, [selectedCategory, searchQuery, sortBy]);

  const breadcrumbItems = [
    { label: "Home", href: "/" },
    { label: "All Books" },
  ];

  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      {/* Breadcrumb */}
      <Breadcrumb items={breadcrumbItems} />

      {/* Header Banner */}
      <div className="mb-10 text-center max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-1.5 rounded-full bg-orange-100/80 px-3.5 py-1 text-sm font-semibold description tracking-wide text-orange-700 mb-3">
          <Sparkles size={15} />
          <span>Explore Complete Library</span>
        </div>
        <h1 className="title text-3xl font-extrabold tracking-tight text-gray-900 md:text-5xl">
          All Books & Literature
        </h1>
        <p className="description mt-3 text-sm md:text-base text-gray-600">
          Discover our full collection across every genre, from bestselling fiction and spiritual devotionals to personal development and finance.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0">
          {categoryList.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setSelectedCategory(cat.slug)}
              className={`shrink-0 rounded-full px-4 py-2 text-sm font-medium description tracking-wide transition-all ${selectedCategory === cat.slug
                  ? "bg-orange-600 text-white shadow-sm font-semibold"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* Search & Sort Controls */}
        <div className="flex items-center gap-3">
          {/* Search Input */}
          <div className="relative w-full md:w-64">
            <Search size={17} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by title, author..."
              className="w-full rounded-full border border-gray-200 bg-white py-2 pl-9 pr-4 text-sm font-medium text-gray-900 description tracking-wide focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500"
            />
          </div>

          {/* Sort Dropdown */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="rounded-full border border-gray-200 bg-white px-3.5 py-2 text-xs font-semibold text-gray-700 focus:border-orange-500 focus:outline-none description tracking-wide"
          >
            <option value="featured">Featured</option>
            <option value="rating">Top Rated</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
          </select>
        </div>
      </div>

      {/* Results Count */}
      <div className="mb-6 flex items-center justify-between text-xs text-gray-500">
        <span>Showing <strong className="text-gray-900">{filteredAndSortedProducts.length}</strong> books</span>
      </div>

      {/* Book Grid */}
      {filteredAndSortedProducts.length === 0 ? (
        <div className="py-20 text-center">
          <BookOpen size={40} className="mx-auto text-gray-300 mb-3" />
          <h3 className="title text-lg font-bold text-gray-800">No books found</h3>
          <p className="description text-sm text-gray-500 mt-1">Try adjusting your genre filter or search terms.</p>
        </div>
      ) : (
        <ProductGrid products={filteredAndSortedProducts} />
      )}

      {/* FAQ Section */}
      <div className="mt-20 border-t border-gray-100 pt-12">
        <div className="bg-orange-50/70 rounded-3xl p-6 sm:p-10 border border-orange-100/80 shadow-sm max-w-5xl mx-auto">
          <Faq
            faqs={shopFaqs}
            badge="Shopping Guide"
            title="Bookstore & Catalog FAQs"
            subtitle="Frequently asked questions about book editions, shipping, and ordering."
          />
        </div>
      </div>
    </div>
  );
}
