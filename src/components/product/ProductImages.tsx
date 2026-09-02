"use client";

import { useState } from "react";
import Image from "next/image";

interface ProductImagesProps {
  images?: string[];
  mainImage: string;
  title: string;
  badge?: string;
}

export default function ProductImages({
  images,
  mainImage,
  title,
  badge,
}: ProductImagesProps) {
  const allImages = [...new Set([mainImage, ...(images || [])])];
  const [selectedImage, setSelectedImage] = useState(allImages[0]);

  return (
    <div className="flex flex-col-reverse gap-4 md:flex-row">
      {/* Thumbnails */}
      {allImages.length > 1 && (
        <div className="flex gap-3 overflow-x-auto pb-2 md:flex-col md:overflow-visible md:pb-0">
          {allImages.map((img, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setSelectedImage(img)}
              className={`relative h-20 w-16 shrink-0 cursor-pointer overflow-hidden rounded-xl border-2 transition-all duration-200 ${
                selectedImage === img
                  ? "border-orange-600 ring-2 ring-orange-100 shadow-sm"
                  : "border-gray-200 hover:border-gray-300 opacity-75 hover:opacity-100"
              }`}
            >
              <Image
                src={img}
                alt={`${title} thumbnail ${idx + 1}`}
                fill
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}

      {/* Main Image Stage */}
      <div className="relative aspect-[3/4] w-full flex-1 overflow-hidden rounded-2xl border border-gray-100 bg-gradient-to-b from-gray-50 to-gray-100 p-6 shadow-sm">
        {badge && (
          <span className="absolute left-4 top-4 z-10 rounded-full bg-orange-600 px-3.5 py-1 text-xs font-semibold text-white shadow-md">
            {badge}
          </span>
        )}

        <div className="relative h-full w-full">
          <Image
            src={selectedImage}
            alt={title}
            fill
            priority
            className="object-contain drop-shadow-xl transition-transform duration-300 hover:scale-105"
          />
        </div>
      </div>
    </div>
  );
}
