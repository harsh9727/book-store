"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  CalendarDays,
  MapPin,
  Camera,
  ArrowRight,
  Sparkles,
  Search,
} from "lucide-react";
import { galleries } from "@/data/galleries";

export default function GalleryPage() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  const categories = ["All", "Events", "Exhibitions", "Community", "Book Launches"];

  const filteredGalleries = galleries.filter((item) => {
    const matchesCategory =
      selectedCategory === "All" || item.category === selectedCategory;
    const matchesSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.tags.some((tag) =>
        tag.toLowerCase().includes(searchQuery.toLowerCase())
      );
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      {/* Header */}
      <div className="mb-10 text-center max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-1.5 rounded-full bg-orange-100/80 px-3.5 py-1 text-sm font-semibold text-orange-600 mb-3 description">
          <Sparkles size={14} />
          <span>Moments & Memories</span>
        </div>
        <h1 className="title text-3xl font-extrabold tracking-tight text-gray-900 md:text-5xl">
          Photo Gallery & Events
        </h1>
        <p className="description mt-3 text-sm md:text-base text-gray-600">
          Step inside our bookstore events, author meetups, community story sessions, and literary exhibitions.
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
              className={`shrink-0 rounded-full px-4 py-2 text-sm font-medium description tracking-wide transition-all ${
                selectedCategory === cat
                  ? "bg-orange-600 text-white shadow-sm font-semibold"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
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
            placeholder="Search gallery & events..."
            className="w-full rounded-full border border-gray-200 bg-white py-2.5 pl-9 pr-4 text-sm font-medium text-gray-900 description tracking-wide focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500"
          />
        </div>
      </div>

      {/* Gallery Album Cards Grid */}
      {filteredGalleries.length === 0 ? (
        <div className="py-16 text-center">
          <p className="text-gray-500 description text-sm">No gallery albums found matching your search.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {filteredGalleries.map((album) => (
            <article
              key={album.id}
              className="group flex flex-col overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-orange-200 hover:shadow-xl hover:shadow-orange-500/10"
            >
              {/* Cover Image & Badges */}
              <Link
                href={`/gallery/${album.id}`}
                className="relative aspect-[16/10] w-full overflow-hidden bg-gray-100"
              >
                <Image
                  src={album.coverImage}
                  alt={album.title}
                  fill
                  className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

                <span className="absolute left-4 top-4 rounded-full bg-orange-600 px-3.5 py-1 pb-1.5 text-sm font-medium tracking-wide text-white shadow-sm description">
                  {album.category}
                </span>

                <span className="absolute right-4 top-4 flex items-center gap-1.5 rounded-full bg-black/60 px-3 pt-1 pb-1.5 text-sm font-medium tracking-wide text-white backdrop-blur-sm shadow-sm description">
                  <Camera size={16} />
                  <span>{album.photos.length} Photos</span>
                </span>
              </Link>

              {/* Album Content */}
              <div className="flex flex-1 flex-col p-6 sm:p-7">
                <div className="flex flex-wrap items-center gap-4 text-xs text-gray-500 mb-3">
                  <div className="flex items-center gap-1">
                    <CalendarDays size={16} className="text-orange-600" />
                    <p className="text-sm description tracking-wide">{album.date}</p>
                  </div>
                  <div className="flex items-center gap-1">
                    <MapPin size={16} className="text-orange-600" />
                    <p className="text-sm description tracking-wide">{album.location}</p>
                  </div>
                </div>

                <Link href={`/gallery/${album.id}`}>
                  <h2 className="title text-xl sm:text-2xl font-bold text-gray-900 transition-colors group-hover:text-orange-600">
                    {album.title}
                  </h2>
                </Link>

                <p className="description mt-2.5 tracking-wide text-sm text-gray-600 line-clamp-2 leading-relaxed">
                  {album.description}
                </p>

                {/* Action Button */}
                <div className="mt-6 border-t border-gray-100 pt-5">
                  <Link
                    href={`/gallery/${album.id}`}
                    className="flex items-center justify-between description tracking-wide font-semibold text-sm text-orange-600 group-hover:text-orange-700"
                  >
                    <span>View Full Photo Collection</span>
                    <ArrowRight
                      size={16}
                      className="transition-transform group-hover:translate-x-1"
                    />
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
