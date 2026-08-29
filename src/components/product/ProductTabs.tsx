"use client";

import { useState } from "react";
import { BookOpen, CheckCircle, FileText, UserCheck } from "lucide-react";
import { Product } from "@/types/product";

interface ProductTabsProps {
  product: Product;
}

type ProductTab = "synopsis" | "specs" | "author";

const tabs = [
  { id: "synopsis", label: "Synopsis & Features", icon: BookOpen },
  { id: "specs", label: "Book Specifications", icon: FileText },
  { id: "author", label: "About the Author", icon: UserCheck },
] as const;

export default function ProductTabs({ product }: ProductTabsProps) {
  const [activeTab, setActiveTab] = useState<ProductTab>("synopsis");

  return (
    <div className="mt-14">
      <div className="flex overflow-x-auto border-b border-gray-200">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`flex shrink-0 items-center gap-2 border-b-2 px-6 py-3.5 text-sm font-semibold transition-all duration-200 ${
                isActive
                  ? "border-orange-600 text-orange-600"
                  : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-900"
              }`}
            >
              <Icon size={17} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      <div className="pt-8">
        {activeTab === "synopsis" && (
          <div className="max-w-4xl space-y-6 text-gray-700">
            <div>
              <h3 className="title mb-3 text-xl font-bold text-gray-900">
                Book Overview
              </h3>
              <p className="description text-base leading-relaxed text-gray-600">
                {product.synopsis || product.description}
              </p>
            </div>

            {product.features && product.features.length > 0 && (
              <div className="rounded-2xl border border-orange-100 bg-orange-50/50 p-6">
                <h4 className="title mb-3 text-base font-bold text-orange-950">
                  Key Highlights
                </h4>
                <ul className="space-y-2.5 text-sm text-gray-700">
                  {product.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2.5">
                      <CheckCircle
                        size={17}
                        className="mt-0.5 shrink-0 text-orange-600"
                      />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        {activeTab === "specs" && (
          <div className="max-w-3xl">
            <h3 className="title mb-5 text-xl font-bold text-gray-900">
              Technical Details
            </h3>
            <div className="divide-y divide-gray-100 overflow-hidden rounded-2xl border border-gray-200 bg-white">
              <div className="grid grid-cols-1 bg-gray-50/50 p-4 text-sm sm:grid-cols-2">
                <span className="font-semibold text-gray-500">Publisher</span>
                <span className="text-gray-900">
                  {product.publisher || "Global Publishing House"}
                </span>
              </div>
              <div className="grid grid-cols-1 p-4 text-sm sm:grid-cols-2">
                <span className="font-semibold text-gray-500">Publication Date</span>
                <span className="text-gray-900">{product.publishedDate || "2023"}</span>
              </div>
              <div className="grid grid-cols-1 bg-gray-50/50 p-4 text-sm sm:grid-cols-2">
                <span className="font-semibold text-gray-500">Print Length</span>
                <span className="text-gray-900">
                  {product.pages ? `${product.pages} pages` : "320 pages"}
                </span>
              </div>
              <div className="grid grid-cols-1 p-4 text-sm sm:grid-cols-2">
                <span className="font-semibold text-gray-500">Language</span>
                <span className="text-gray-900">{product.language || "English"}</span>
              </div>
              <div className="grid grid-cols-1 bg-gray-50/50 p-4 text-sm sm:grid-cols-2">
                <span className="font-semibold text-gray-500">ISBN-13</span>
                <span className="font-mono text-gray-900">
                  {product.isbn || "978-0123456789"}
                </span>
              </div>
              <div className="grid grid-cols-1 p-4 text-sm sm:grid-cols-2">
                <span className="font-semibold text-gray-500">Dimensions</span>
                <span className="text-gray-900">
                  {product.dimensions || "6.0 x 1.0 x 9.0 inches"}
                </span>
              </div>
            </div>
          </div>
        )}

        {activeTab === "author" && (
          <div className="max-w-3xl space-y-4">
            <h3 className="title text-xl font-bold text-gray-900">
              About {product.author}
            </h3>
            <p className="description text-base leading-relaxed text-gray-600">
              {product.authorBio ||
                `${product.author} is an internationally acclaimed author whose writings have captivated readers worldwide. Known for insightful prose and deep emotional authenticity.`}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
