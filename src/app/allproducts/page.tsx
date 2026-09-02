"use client";

import { useState, useMemo, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import {
  Sparkles,
  SlidersHorizontal,
  BookOpen,
  X,
  RotateCcw,
  ChevronDown,
  Filter,
} from "lucide-react";
import type { Product } from "@/types/product";
import type { Category } from "@/types/category";
import { shopFaqs } from "@/data/faqs";
import ProductGrid from "@/components/product/ProductGrid";
import Breadcrumb from "@/components/common/Breadcrumb";
import Faq from "@/components/common/Faq";
import SearchBar from "@/components/common/SearchBar";

type SortOption = "featured" | "price-asc" | "price-desc" | "rating";

interface AllProductsContentProps {
  initialCategory: string;
  initialCollection: string;
  initialSearch: string;
}

function AllProductsContent({
  initialCategory,
  initialCollection,
  initialSearch,
}: AllProductsContentProps) {
  // Filters: Category, Price Range, Collections
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [priceRange, setPriceRange] = useState("all");
  const [selectedCollection, setSelectedCollection] = useState(initialCollection);
  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [sortBy, setSortBy] = useState<SortOption>("featured");
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [catalogError, setCatalogError] = useState("");
  const [catalogLoading, setCatalogLoading] = useState(true);

  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const [visibleCount, setVisibleCount] = useState(8);

  useEffect(() => {
    const controller = new AbortController();
    fetch("/api/content/catalog", { signal: controller.signal, cache: "no-store" })
      .then(async (response) => {
        const result = (await response.json()) as { products?: Product[]; categories?: Category[]; message?: string };
        if (!response.ok || !result.products || !result.categories) throw new Error(result.message || "Catalog could not be loaded.");
        setProducts(result.products);
        setCategories(result.categories);
        setCatalogLoading(false);
      })
      .catch((fetchError) => {
        if ((fetchError as Error).name !== "AbortError") {
          setCatalogError(fetchError instanceof Error ? fetchError.message : "Catalog could not be loaded.");
          setCatalogLoading(false);
        }
      });
    return () => controller.abort();
  }, []);

  // Prevent background scroll when mobile filter modal is open
  useEffect(() => {
    if (isMobileFilterOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isMobileFilterOpen]);

  const selectCategory = (value: string) => {
    setSelectedCategory(value);
    setVisibleCount(8);
  };
  const selectPriceRange = (value: string) => {
    setPriceRange(value);
    setVisibleCount(8);
  };
  const selectCollection = (value: string) => {
    setSelectedCollection(value);
    setVisibleCount(8);
  };
  const updateSearchQuery = (value: string) => {
    setSearchQuery(value);
    setVisibleCount(8);
  };
  const selectSort = (value: SortOption) => {
    setSortBy(value);
    setVisibleCount(8);
  };

  // Category list with accurate item counts
  const categoryList = useMemo(() => {
    const allCount = products.length;
    const list = categories.map((cat) => {
      const count = products.filter(
        (p) => p.category.toLowerCase() === cat.slug.toLowerCase()
      ).length;
      return { ...cat, count };
    });
    return [
      { id: "all", name: "All Genres", slug: "all", count: allCount },
      ...list,
    ];
  }, [categories, products]);

  // Filter & Sort Logic
  const filteredAndSortedProducts = useMemo(() => {
    let result = products.filter((p) => {
      // 1. Category Filter
      const matchesCat =
        selectedCategory === "all" ||
        p.category.toLowerCase() === selectedCategory.toLowerCase();

      // 2. Price Range Filter
      let matchesPrice = true;
      if (priceRange === "under-300") matchesPrice = p.price < 300;
      else if (priceRange === "300-600")
        matchesPrice = p.price >= 300 && p.price <= 600;
      else if (priceRange === "600-1000")
        matchesPrice = p.price >= 600 && p.price <= 1000;
      else if (priceRange === "above-1000") matchesPrice = p.price > 1000;

      // 3. Collections Filter
      let matchesCollection = true;
      if (selectedCollection === "bestseller") {
        matchesCollection = p.badge?.toLowerCase().includes("best") ?? false;
      } else if (selectedCollection === "new") {
        matchesCollection = p.badge?.toLowerCase().includes("new") ?? false;
      } else if (selectedCollection === "trending") {
        matchesCollection =
          p.badge?.toLowerCase().includes("popular") ||
          p.badge?.toLowerCase().includes("trend") ||
          p.badge?.toLowerCase().includes("sale") ||
          (p.rating && p.rating >= 4.5)
            ? true
            : false;
      } else if (selectedCollection === "accessories") {
        matchesCollection =
          p.category.toLowerCase() === "accessories" ||
          (p.badge?.toLowerCase().includes("accessor") ?? false);
      }

      // Search Query
      const matchesSearch =
        searchQuery.trim() === "" ||
        p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.category.toLowerCase().includes(searchQuery.toLowerCase());

      return matchesCat && matchesPrice && matchesCollection && matchesSearch;
    });

    // Sorting
    if (sortBy === "price-asc") {
      result = [...result].sort((a, b) => a.price - b.price);
    } else if (sortBy === "price-desc") {
      result = [...result].sort((a, b) => b.price - a.price);
    } else if (sortBy === "rating") {
      result = [...result].sort((a, b) => (b.rating || 0) - (a.rating || 0));
    }

    return result;
  }, [
    selectedCategory,
    priceRange,
    selectedCollection,
    searchQuery,
    sortBy,
    products,
  ]);

  const activeFilterCount = [
    selectedCategory !== "all",
    priceRange !== "all",
    selectedCollection !== "all",
    searchQuery.trim() !== "",
  ].filter(Boolean).length;

  const hasActiveFilters = activeFilterCount > 0;

  const resetAllFilters = () => {
    setSelectedCategory("all");
    setPriceRange("all");
    setSelectedCollection("all");
    setSearchQuery("");
    setSortBy("featured");
    setVisibleCount(8);
  };

  const breadcrumbItems = [
    { label: "Home", href: "/" },
    { label: "All Products" },
  ];

  return (
    <div className="container mx-auto px-3 sm:px-4 md:px-6 py-6 md:py-10">
      {/* Breadcrumb */}
      <Breadcrumb items={breadcrumbItems} />
      {catalogLoading && <p role="status" className="mb-5 rounded-xl bg-orange-50 px-4 py-3 text-sm text-orange-800">Loading the latest catalog...</p>}
      {catalogError && <p role="alert" className="mb-5 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{catalogError}</p>}

      {/* Header Banner */}
      <div className="mb-6 sm:mb-10 text-center max-w-2xl mx-auto px-2">
        <div className="inline-flex items-center gap-1.5 rounded-full bg-orange-100/80 px-3 py-1 text-xs sm:text-sm font-semibold description tracking-wide text-orange-700 mb-2.5">
          <Sparkles size={14} />
          <span>Explore Complete Library</span>
        </div>
        <h1 className="title text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tight text-gray-900">
          All Books & Literature
        </h1>
        <p className="description mt-2 sm:mt-3 text-xs sm:text-sm md:text-base text-gray-600">
          Discover our full collection across every genre, from bestselling fiction and spiritual devotionals to personal development and finance.
        </p>
      </div>

      {/* Mobile Top Action Toolbar */}
      <div className="mb-5 flex flex-col gap-3 lg:hidden">
        <div className="flex items-center gap-2">
          {/* Mobile Filter Button */}
          <button
            type="button"
            onClick={() => setIsMobileFilterOpen(true)}
            className="flex items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-3.5 py-2.5 text-xs sm:text-sm font-semibold text-gray-800 shadow-sm active:scale-95 transition-all description shrink-0"
          >
            <Filter size={15} className="text-orange-600" />
            <span>Filters</span>
            {hasActiveFilters && (
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-orange-600 text-[10px] font-bold text-white">
                {activeFilterCount}
              </span>
            )}
          </button>

          {/* Search Field (Mobile) */}
          <div className="relative flex-1">
            <SearchBar
              value={searchQuery}
              onChange={updateSearchQuery}
              onSearch={updateSearchQuery}
              debounceMs={300}
              size="sm"
              placeholder="Search books..."
            />
          </div>
        </div>

        {/* Sort & Count Row (Mobile) */}
        <div className="flex items-center justify-between px-1 text-xs text-gray-500">
          <span>
            <strong>{filteredAndSortedProducts.length}</strong> books found
          </span>
          <div className="flex items-center gap-1.5">
            <span className="description text-gray-400">Sort:</span>
            <select
              value={sortBy}
              onChange={(e) => selectSort(e.target.value as SortOption)}
              className="rounded-lg border border-gray-200 bg-white py-1 px-2 text-xs font-semibold text-gray-700 focus:border-orange-500 focus:outline-none description"
            >
              <option value="featured">Featured</option>
              <option value="rating">Top Rated</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Grid: Left Sidebar (3 Filters) + Right Catalog */}
      <div className="grid grid-cols-1 gap-6 md:gap-8 lg:grid-cols-12 items-start">
        {/* ================= SIDEBAR (Desktop >= 1024px) ================= */}
        <aside className="hidden lg:block lg:col-span-3 space-y-6 sticky top-24">
          <div className="rounded-2xl border border-gray-200/80 bg-white p-5 shadow-sm">
            {/* Sidebar Title */}
            <div className="flex items-center justify-between border-b border-gray-100 pb-4">
              <div className="flex items-center gap-2">
                <SlidersHorizontal size={18} className="text-orange-600" />
                <h2 className="title text-base font-bold text-gray-900">
                  Filters
                </h2>
              </div>

              {hasActiveFilters && (
                <button
                  type="button"
                  onClick={resetAllFilters}
                  className="flex items-center gap-1 text-xs font-semibold text-orange-600 hover:text-orange-700 description tracking-wide transition-colors"
                >
                  <RotateCcw size={12} />
                  <span>Reset</span>
                </button>
              )}
            </div>

            {/* 1. Category / Genre Filter */}
            <div className="py-4 border-b border-gray-100">
              <h3 className="title text-sm font-bold text-gray-900 mb-3">
                Category
              </h3>

              <div className="space-y-1 max-h-[280px] overflow-y-auto pr-1">
                {categoryList.map((cat) => {
                  const isSelected = selectedCategory === cat.slug;
                  return (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => selectCategory(cat.slug)}
                      className={`flex w-full items-center justify-between rounded-xl px-3 py-2 text-xs font-medium description tracking-wide transition-all ${
                        isSelected
                          ? "bg-orange-600 text-white font-semibold shadow-sm"
                          : "text-gray-700 hover:bg-orange-50/70 hover:text-orange-600"
                      }`}
                    >
                      <span className="truncate">{cat.name}</span>
                      <span
                        className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                          isSelected
                            ? "bg-white/20 text-white"
                            : "bg-gray-100 text-gray-600"
                        }`}
                      >
                        {cat.count}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 2. Price Range Filter */}
            <div className="py-4 border-b border-gray-100">
              <h3 className="title text-sm font-bold text-gray-900 mb-3">
                Price Range
              </h3>

              <div className="space-y-1.5">
                {[
                  { id: "all", label: "All Prices" },
                  { id: "under-300", label: "Under ₹300" },
                  { id: "300-600", label: "₹300 - ₹600" },
                  { id: "600-1000", label: "₹600 - ₹1000" },
                  { id: "above-1000", label: "Above ₹1000" },
                ].map((item) => (
                  <label
                    key={item.id}
                    className="flex items-center gap-2.5 text-xs description tracking-wide text-gray-700 cursor-pointer hover:text-orange-600 py-1"
                  >
                    <input
                      type="radio"
                      name="priceRange"
                      checked={priceRange === item.id}
                      onChange={() => selectPriceRange(item.id)}
                      className="accent-orange-600 h-4 w-4 cursor-pointer"
                    />
                    <span>{item.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* 3. Curated Collections Filter */}
            <div className="pt-4">
              <h3 className="title text-sm font-bold text-gray-900 mb-3">
                Collections
              </h3>

              <div className="space-y-1.5">
                {[
                  { id: "all", label: "All Collections" },
                  { id: "bestseller", label: "Best Sellers" },
                  { id: "new", label: "New Releases" },
                  { id: "trending", label: "Trending Products" },
                  { id: "accessories", label: "Accessories"}
                ].map((item) => (
                  <label
                    key={item.id}
                    className="flex items-center gap-2.5 text-xs description tracking-wide text-gray-700 cursor-pointer hover:text-orange-600 py-1"
                  >
                    <input
                      type="radio"
                      name="collectionFilter"
                      checked={selectedCollection === item.id}
                      onChange={() => selectCollection(item.id)}
                      className="accent-orange-600 h-4 w-4 cursor-pointer"
                    />
                    <span>{item.label}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </aside>

        {/* ================= RIGHT CATALOG AREA ================= */}
        <main className="col-span-12 lg:col-span-9">
          {/* Top Control Bar (Desktop) */}
          <div className="mb-6 hidden lg:flex items-center justify-between gap-4 rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
            {/* Search Input */}
            <div className="relative flex-1 max-w-md">
              <SearchBar
                value={searchQuery}
                onChange={updateSearchQuery}
                onSearch={updateSearchQuery}
                debounceMs={300}
                size="sm"
                placeholder="Search by title, author, genre..."
              />
            </div>

            {/* Results Count & Sort Dropdown */}
            <div className="flex items-center justify-end gap-4">
              <span className="text-xs text-gray-500 description">
                Showing{" "}
                <strong className="text-gray-900 font-semibold">
                  {filteredAndSortedProducts.length}
                </strong>{" "}
                books
              </span>

              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-500 description">Sort:</span>
                <select
                  value={sortBy}
                  onChange={(e) => selectSort(e.target.value as SortOption)}
                  className="rounded-full border border-gray-200 bg-white px-3.5 py-1.5 text-xs font-semibold text-gray-700 focus:border-orange-500 focus:outline-none description tracking-wide cursor-pointer"
                >
                  <option value="featured">Featured</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                </select>
              </div>
            </div>
          </div>

          {/* Active Filter Chips */}
          {hasActiveFilters && (
            <div className="mb-5 flex flex-wrap items-center gap-1.5 sm:gap-2">
              <span className="text-[11px] sm:text-xs text-gray-500 description font-medium">
                Active:
              </span>

              {selectedCategory !== "all" && (
                <span className="inline-flex items-center gap-1 rounded-full bg-orange-100 px-2.5 py-0.5 sm:px-3 sm:py-1 text-[11px] sm:text-xs font-semibold text-orange-700 description">
                  Genre: {selectedCategory}
                  <button
                    type="button"
                    onClick={() => selectCategory("all")}
                    className="hover:text-orange-900"
                  >
                    <X size={12} />
                  </button>
                </span>
              )}

              {priceRange !== "all" && (
                <span className="inline-flex items-center gap-1 rounded-full bg-orange-100 px-2.5 py-0.5 sm:px-3 sm:py-1 text-[11px] sm:text-xs font-semibold text-orange-700 description">
                  Price: {priceRange}
                  <button
                    type="button"
                    onClick={() => selectPriceRange("all")}
                    className="hover:text-orange-900"
                  >
                    <X size={12} />
                  </button>
                </span>
              )}

              {selectedCollection !== "all" && (
                <span className="inline-flex items-center gap-1 rounded-full bg-orange-100 px-2.5 py-0.5 sm:px-3 sm:py-1 text-[11px] sm:text-xs font-semibold text-orange-700 description">
                  Collection: {selectedCollection === "new" ? "New Releases" : selectedCollection === "bestseller" ? "Best Sellers" : selectedCollection === "accessories" ? "Accessories" : "Trending Products"}
                  <button
                    type="button"
                    onClick={() => selectCollection("all")}
                    className="hover:text-orange-900"
                  >
                    <X size={12} />
                  </button>
                </span>
              )}

              {searchQuery && (
                <span className="inline-flex items-center gap-1 rounded-full bg-orange-100 px-2.5 py-0.5 sm:px-3 sm:py-1 text-[11px] sm:text-xs font-semibold text-orange-700 description">
                  Query: {searchQuery}
                  <button
                    type="button"
                    onClick={() => updateSearchQuery("")}
                    className="hover:text-orange-900"
                  >
                    <X size={12} />
                  </button>
                </span>
              )}

              <button
                type="button"
                onClick={resetAllFilters}
                className="text-[11px] sm:text-xs text-orange-600 hover:underline font-semibold description ml-1"
              >
                Clear all
              </button>
            </div>
          )}

          {/* Book Catalog Grid & Pagination */}
          {filteredAndSortedProducts.length === 0 ? (
            <div className="py-16 sm:py-20 text-center rounded-3xl border border-gray-100 bg-white p-6 sm:p-8">
              <BookOpen size={40} className="mx-auto text-gray-300 mb-3" />
              <h3 className="title text-lg sm:text-xl font-bold text-gray-800">
                No books match your filters
              </h3>
              <p className="description text-xs sm:text-sm text-gray-500 mt-1 max-w-sm mx-auto">
                Try selecting a different category or clearing your active filters to browse the full catalog.
              </p>
              <button
                type="button"
                onClick={resetAllFilters}
                className="mt-5 inline-flex items-center gap-2 rounded-xl bg-orange-600 px-4 py-2.5 text-xs font-semibold text-white shadow-md transition-all hover:bg-orange-700 active:scale-95"
              >
                <RotateCcw size={14} />
                <span>Reset All Filters</span>
              </button>
            </div>
          ) : (
            <div className="space-y-8 sm:space-y-10">
              <ProductGrid
                products={filteredAndSortedProducts.slice(0, visibleCount)}
                className="grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-5 lg:gap-6"
              />

              {/* View More Pagination */}
              {visibleCount < filteredAndSortedProducts.length ? (
                <div className="flex flex-col items-center justify-center gap-3 pt-6 border-t border-gray-100">
                  <div className="flex items-center gap-2.5 text-xs text-gray-500 description tracking-wide">
                    <span>
                      Showing{" "}
                      <strong>
                        {Math.min(visibleCount, filteredAndSortedProducts.length)}
                      </strong>{" "}
                      of <strong>{filteredAndSortedProducts.length}</strong> books
                    </span>
                    <div className="h-1.5 w-24 sm:w-28 overflow-hidden rounded-full bg-gray-200">
                      <div
                        className="h-full bg-orange-600 rounded-full transition-all duration-300"
                        style={{
                          width: `${Math.min(
                            100,
                            (visibleCount / filteredAndSortedProducts.length) * 100
                          )}%`,
                        }}
                      />
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => setVisibleCount((count) => count + 8)}
                    className="group inline-flex items-center justify-center gap-2 rounded-xl bg-orange-600 px-6 sm:px-7 py-3 text-xs sm:text-sm font-semibold text-white shadow-md shadow-orange-600/20 transition-all duration-200 hover:bg-orange-700 hover:shadow-lg hover:shadow-orange-600/30 active:scale-[0.98] description tracking-wide"
                  >
                    <span>View More Books (+8)</span>
                    <ChevronDown
                      size={16}
                      className="transition-transform duration-200 group-hover:translate-y-0.5"
                    />
                  </button>
                </div>
              ) : filteredAndSortedProducts.length > 8 ? (
                <div className="pt-6 border-t border-gray-100 text-center">
                  <p className="text-xs text-gray-400 description tracking-wide">
                    You have viewed all {filteredAndSortedProducts.length} books in this collection.
                  </p>
                </div>
              ) : null}
            </div>
          )}
        </main>
      </div>

      {/* ================= MOBILE / TABLET FILTER DRAWER ================= */}
      {isMobileFilterOpen && (
        <div className="fixed inset-0 z-50 flex bg-black/60 backdrop-blur-sm lg:hidden transition-opacity">
          {/* Backdrop Click to Close */}
          <div
            className="fixed inset-0"
            onClick={() => setIsMobileFilterOpen(false)}
          />

          {/* Drawer Container */}
          <div className="relative ml-auto flex h-full w-full max-w-xs sm:max-w-sm flex-col bg-white shadow-2xl z-10">
            {/* Drawer Header */}
            <div className="flex items-center justify-between border-b border-gray-100 p-4 sm:p-5">
              <div className="flex items-center gap-2">
                <SlidersHorizontal size={18} className="text-orange-600" />
                <h3 className="title text-base sm:text-lg font-bold text-gray-900">
                  Filter Books
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsMobileFilterOpen(false)}
                className="rounded-full p-2 text-gray-500 hover:bg-gray-100 active:scale-95"
              >
                <X size={18} />
              </button>
            </div>

            {/* Drawer Scrollable Content */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-6">
              {/* 1. Category */}
              <div>
                <h4 className="title text-xs sm:text-sm font-bold text-gray-900 mb-2.5">
                  Category / Genre
                </h4>
                <div className="space-y-1 max-h-52 overflow-y-auto pr-1">
                  {categoryList.map((cat) => (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => selectCategory(cat.slug)}
                      className={`flex w-full items-center justify-between rounded-xl px-3 py-2 text-xs font-medium description transition-colors ${
                        selectedCategory === cat.slug
                          ? "bg-orange-600 text-white font-semibold shadow-sm"
                          : "text-gray-700 hover:bg-gray-100"
                      }`}
                    >
                      <span className="truncate">{cat.name}</span>
                      <span
                        className={`text-[10px] rounded-full px-2 py-0.5 ${
                          selectedCategory === cat.slug
                            ? "bg-white/20 text-white"
                            : "bg-gray-100 text-gray-600"
                        }`}
                      >
                        {cat.count}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* 2. Price Range */}
              <div className="border-t border-gray-100 pt-4">
                <h4 className="title text-xs sm:text-sm font-bold text-gray-900 mb-2.5">
                  Price Range
                </h4>
                <div className="space-y-1.5 text-xs">
                  {[
                    { id: "all", label: "All Prices" },
                    { id: "under-300", label: "Under ₹300" },
                    { id: "300-600", label: "₹300 - ₹600" },
                    { id: "600-1000", label: "₹600 - ₹1000" },
                    { id: "above-1000", label: "Above ₹1000" },
                  ].map((item) => (
                    <label
                      key={item.id}
                      className="flex items-center gap-2 text-gray-700 cursor-pointer py-1"
                    >
                      <input
                        type="radio"
                        name="mPriceRange"
                        checked={priceRange === item.id}
                        onChange={() => selectPriceRange(item.id)}
                        className="accent-orange-600 h-4 w-4"
                      />
                      <span className="description">{item.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* 3. Collections */}
              <div className="border-t border-gray-100 pt-4">
                <h4 className="title text-xs sm:text-sm font-bold text-gray-900 mb-2.5">
                  Collections
                </h4>
                <div className="space-y-1.5 text-xs">
                  {[
                    { id: "all", label: "All Collections" },
                    { id: "bestseller", label: "Best Sellers" },
                    { id: "new", label: "New Releases" },
                    { id: "trending", label: "Trending Products" },
                    { id: "accessories", label: "Accessories" },
                  ].map((item) => (
                    <label
                      key={item.id}
                      className="flex items-center gap-2 text-gray-700 cursor-pointer py-1"
                    >
                      <input
                        type="radio"
                        name="mCollectionFilter"
                        checked={selectedCollection === item.id}
                        onChange={() => selectCollection(item.id)}
                        className="accent-orange-600 h-4 w-4"
                      />
                      <span className="description">{item.label}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            {/* Sticky Bottom Actions in Drawer */}
            <div className="border-t border-gray-100 p-4 bg-gray-50 flex gap-2">
              <button
                type="button"
                onClick={resetAllFilters}
                className="flex-1 rounded-xl border border-gray-200 bg-white py-2.5 text-xs font-semibold text-gray-700 hover:bg-gray-100 description"
              >
                Reset All
              </button>
              <button
                type="button"
                onClick={() => setIsMobileFilterOpen(false)}
                className="flex-1 rounded-xl bg-orange-600 py-2.5 text-xs font-semibold text-white shadow-md hover:bg-orange-700 description"
              >
                Show {filteredAndSortedProducts.length} Books
              </button>
            </div>
          </div>
        </div>
      )}

      {/* FAQ Section */}
      <div className="mt-14 sm:mt-20 border-t border-gray-100 pt-8 sm:pt-12">
        <div className="bg-orange-50/70 rounded-3xl p-5 sm:p-8 md:p-10 border border-orange-100/80 shadow-sm max-w-5xl mx-auto">
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

function AllProductsFromSearchParams() {
  const searchParams = useSearchParams();
  const paramsKey = searchParams.toString();

  return (
    <AllProductsContent
      key={paramsKey}
      initialCollection={searchParams.get("collection") || "all"}
      initialCategory={searchParams.get("category") || "all"}
      initialSearch={searchParams.get("search") || ""}
    />
  );
}

export default function AllProductsPage() {
  return (
    <Suspense
      fallback={
        <div className="container mx-auto px-4 py-24 text-center">
          <p className="description text-sm text-gray-500 animate-pulse">
            Loading bookstore catalog...
          </p>
        </div>
      }
    >
      <AllProductsFromSearchParams />
    </Suspense>
  );
}
