import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  CalendarDays,
  MapPin,
  Camera,
  ChevronRight,
  Home,
  User,
  ArrowRight,
} from "lucide-react";
import { galleries } from "@/data/galleries";
import GalleryLightbox from "@/components/gallary/GalleryLightbox";

interface GalleryDetailPageProps {
  params: Promise<{ id: string }>;
}

export async function generateStaticParams() {
  return galleries.map((g) => ({
    id: String(g.id),
  }));
}

export default async function GalleryDetailPage({
  params,
}: GalleryDetailPageProps) {
  const { id } = await params;
  const album =
    galleries.find((g) => String(g.id) === id || g.slug === id) ||
    galleries[0];

  if (!album) {
    notFound();
  }

  const otherAlbums = galleries
    .filter((g) => String(g.id) !== String(album.id))
    .slice(0, 2);

  return (
    <div className="container mx-auto px-4 py-8 md:py-10">
      {/* Breadcrumbs */}
      <nav className="mb-8 flex items-center gap-2 text-sm text-gray-500 description tracking-wide font-medium">
        <Link
          href="/"
          className="flex items-center gap-1 hover:text-orange-600 transition-colors"
        >
          <Home size={14} />
          <span>Home</span>
        </Link>
        <ChevronRight size={12} />
        <Link href="/gallery" className="hover:text-orange-600 transition-colors">
          Gallery
        </Link>
        <ChevronRight size={12} />
        <span className="truncate max-w-[240px] sm:max-w-md font-semibold text-gray-600 description tracking-wide">
          {album.title}
        </span>
      </nav>

      <div className="md:p-6 p-3 rounded-xl bg-white shadow-sm border border-gray-400">
        {/* Hero Title & Event Details Header */}
        <header className="mb-8 max-w-4xl">
          <div className="flex flex-wrap items-center gap-3 text-xs mb-3">
            <span className="rounded-full bg-orange-100 px-3.5 py-1 text-xs description tracking-wide font-semibold text-orange-700">
              {album.category}
            </span>
            <div className="flex items-center gap-1">
              <CalendarDays size={16} className="text-orange-600" />
              <p className="text-sm text-gray-500 description tracking-wide">{album.date}</p>
            </div>
            <div className="flex items-center gap-1">
              <MapPin size={16} className="text-orange-600" />
              <p className="text-sm text-gray-500 description tracking-wide">{album.location}</p>
            </div>
          </div>

          <h1 className="title text-3xl font-extrabold tracking-tight text-gray-900 md:text-4xl lg:text-5xl">
            {album.title}
          </h1>

          {album.organizer && (
            <p className="mt-3 flex items-center gap-1.5 text-sm description tracking-wide text-gray-500">
              <User size={16} className="text-orange-600" />
              <span>Organized by <strong className="text-gray-800 ml-1">{album.organizer}</strong></span>
            </p>
          )}
        </header>

        {/* Story & Background Info Box */}
        <div className="mb-12 rounded-3xl bg-gradient-to-br from-orange-50/60 via-amber-50/40 to-white p-3 sm:p-6 border border-orange-100">
          <h2 className="title text-lg font-bold text-gray-900 mb-2">
            About This Event
          </h2>
          <p className="description text-sm md:text-base leading-relaxed text-gray-700">
            {album.story || album.description}
          </p>
        </div>

        {/* Photos Section Header */}
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Camera size={20} className="text-orange-600" />
            <h2 className="title text-2xl font-bold text-gray-900">
              Photo Collection ({album.photos.length})
            </h2>
          </div>
          <span className="text-sm text-gray-500">
            Click any photo to enlarge and browse
          </span>
        </div>

        {/* Interactive Lightbox Photos Grid */}
        <GalleryLightbox photos={album.photos} />
      </div>

      {/* Other Galleries Section */}
      {otherAlbums.length > 0 && (
        <section className="mt-15 border-t border-gray-100 pt-10">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="title text-2xl font-bold text-gray-900">
              Explore More Albums
            </h2>
            <Link
              href="/gallery"
              className="flex items-center gap-1 text-sm font-semibold text-orange-600 hover:underline"
            >
              View All <ArrowRight size={14} />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {otherAlbums.map((other) => (
              <Link
                key={other.id}
                href={`/gallery/${other.id}`}
                className="group flex flex-col sm:flex-row gap-5 overflow-hidden rounded-2xl border border-gray-100 bg-white p-4 shadow-sm hover:shadow-md transition-all"
              >
                <div className="relative aspect-[4/3] w-full sm:w-48 overflow-hidden rounded-xl bg-gray-100 shrink-0">
                  <Image
                    src={other.coverImage}
                    alt={other.title}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <span className="absolute bottom-2 right-2 rounded-full bg-black/60 px-2 py-0.5 text-[13px] description tracking-wide font-semibold text-white">
                    {other.photos.length} photos
                  </span>
                </div>

                <div className="flex flex-col justify-center">
                  <span className="text-sm description tracking-wide font-semibold text-orange-600">
                    {other.category}
                  </span>
                  <h4 className="title text-lg font-bold text-gray-900 group-hover:text-orange-600 transition-colors mt-1">
                    {other.title}
                  </h4>
                  <p className="text-sm description tracking-wide text-gray-500 mt-1">{other.date}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
