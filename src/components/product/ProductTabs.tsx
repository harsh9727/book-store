"use client";

import { useState } from "react";
import { Star, CheckCircle, ThumbsUp, MessageSquarePlus, BookOpen, FileText, UserCheck, Shield } from "lucide-react";
import { toast } from "sonner";
import { Product, ProductReview } from "@/types/product";
import ProductRating from "./ProductRating";

interface ProductTabsProps {
  product: Product;
}

export default function ProductTabs({ product }: ProductTabsProps) {
  const [activeTab, setActiveTab] = useState<"synopsis" | "specs" | "author" | "reviews">("synopsis");
  const [reviewsList, setReviewsList] = useState<ProductReview[]>(product.reviews || []);
  const [newRating, setNewRating] = useState(5);
  const [newTitle, setNewTitle] = useState("");
  const [newComment, setNewComment] = useState("");
  const [newName, setNewName] = useState("");
  const [showReviewForm, setShowReviewForm] = useState(false);

  const handleAddReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newComment.trim() || !newName.trim()) {
      toast.error("Please fill in all review fields");
      return;
    }

    const review: ProductReview = {
      id: `r-${Date.now()}`,
      user: newName,
      rating: newRating,
      date: "Just now",
      title: newTitle,
      comment: newComment,
      verifiedPurchase: true,
    };

    setReviewsList([review, ...reviewsList]);
    setNewTitle("");
    setNewComment("");
    setNewName("");
    setShowReviewForm(false);
    toast.success("Thank you! Your review has been submitted.");
  };

  const tabs = [
    { id: "synopsis", label: "Synopsis & Features", icon: BookOpen },
    { id: "specs", label: "Book Specifications", icon: FileText },
    { id: "author", label: "About the Author", icon: UserCheck },
    { id: "reviews", label: `Reviews (${reviewsList.length})`, icon: MessageSquarePlus },
  ];

  return (
    <div className="mt-14">
      {/* Tab Navigation */}
      <div className="flex border-b border-gray-200 overflow-x-auto">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id as any)}
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

      {/* Tab Content */}
      <div className="pt-8">
        {/* Synopsis Tab */}
        {activeTab === "synopsis" && (
          <div className="space-y-6 max-w-4xl text-gray-700">
            <div>
              <h3 className="title text-xl font-bold text-gray-900 mb-3">Book Overview</h3>
              <p className="description text-base leading-relaxed text-gray-600">
                {product.synopsis || product.description}
              </p>
            </div>

            {product.features && product.features.length > 0 && (
              <div className="rounded-2xl bg-orange-50/50 border border-orange-100 p-6">
                <h4 className="title text-base font-bold text-orange-950 mb-3">Key Highlights</h4>
                <ul className="space-y-2.5 text-sm text-gray-700">
                  {product.features.map((feat, idx) => (
                    <li key={idx} className="flex items-start gap-2.5">
                      <CheckCircle size={17} className="text-orange-600 shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        {/* Specifications Tab */}
        {activeTab === "specs" && (
          <div className="max-w-3xl">
            <h3 className="title text-xl font-bold text-gray-900 mb-5">Technical Details</h3>
            <div className="divide-y divide-gray-100 rounded-2xl border border-gray-200 overflow-hidden bg-white">
              <div className="grid grid-cols-1 sm:grid-cols-2 p-4 text-sm bg-gray-50/50">
                <span className="font-semibold text-gray-500">Publisher</span>
                <span className="text-gray-900">{product.publisher || "Global Publishing House"}</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 p-4 text-sm">
                <span className="font-semibold text-gray-500">Publication Date</span>
                <span className="text-gray-900">{product.publishedDate || "2023"}</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 p-4 text-sm bg-gray-50/50">
                <span className="font-semibold text-gray-500">Print Length</span>
                <span className="text-gray-900">{product.pages ? `${product.pages} pages` : "320 pages"}</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 p-4 text-sm">
                <span className="font-semibold text-gray-500">Language</span>
                <span className="text-gray-900">{product.language || "English"}</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 p-4 text-sm bg-gray-50/50">
                <span className="font-semibold text-gray-500">ISBN-13</span>
                <span className="text-gray-900 font-mono">{product.isbn || "978-0123456789"}</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 p-4 text-sm">
                <span className="font-semibold text-gray-500">Dimensions</span>
                <span className="text-gray-900">{product.dimensions || "6.0 x 1.0 x 9.0 inches"}</span>
              </div>
            </div>
          </div>
        )}

        {/* Author Tab */}
        {activeTab === "author" && (
          <div className="max-w-3xl space-y-4">
            <h3 className="title text-xl font-bold text-gray-900">About {product.author}</h3>
            <p className="description text-base leading-relaxed text-gray-600">
              {product.authorBio ||
                `${product.author} is an internationally acclaimed author whose writings have captivated readers worldwide. Known for insightful prose and deep emotional authenticity.`}
            </p>
          </div>
        )}

        {/* Reviews Tab */}
        {activeTab === "reviews" && (
          <div className="max-w-4xl space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl bg-gray-50 p-6 border border-gray-200">
              <div>
                <h3 className="title text-xl font-bold text-gray-900">Customer Ratings & Reviews</h3>
                {product.rating && (
                  <div className="mt-2 flex items-center gap-3">
                    <span className="text-3xl font-extrabold text-gray-900">{product.rating.toFixed(1)}</span>
                    <ProductRating rating={product.rating} reviewsCount={reviewsList.length} size={18} />
                  </div>
                )}
              </div>
              <button
                type="button"
                onClick={() => setShowReviewForm(!showReviewForm)}
                className="rounded-xl bg-orange-600 px-5 py-2.5 text-sm font-semibold text-white transition-all hover:bg-orange-700 shadow-sm"
              >
                {showReviewForm ? "Cancel Review" : "Write a Review"}
              </button>
            </div>

            {/* Review Form */}
            {showReviewForm && (
              <form onSubmit={handleAddReview} className="rounded-2xl border border-orange-200 bg-orange-50/30 p-6 space-y-4">
                <h4 className="title text-base font-bold text-gray-900">Write Your Review</h4>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Your Rating</label>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setNewRating(star)}
                        className="text-amber-400 hover:scale-110 transition-transform"
                      >
                        <Star size={24} className={newRating >= star ? "fill-amber-400" : "text-gray-300"} />
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Your Name</label>
                    <input
                      type="text"
                      value={newName}
                      onChange={(e) => setNewName(e.target.value)}
                      placeholder="e.g. John Doe"
                      className="w-full rounded-lg border border-gray-300 bg-white px-3.5 py-2 text-sm text-gray-900 focus:border-orange-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Review Headline</label>
                    <input
                      type="text"
                      value={newTitle}
                      onChange={(e) => setNewTitle(e.target.value)}
                      placeholder="e.g. Truly inspirational and transformative"
                      className="w-full rounded-lg border border-gray-300 bg-white px-3.5 py-2 text-sm text-gray-900 focus:border-orange-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Review Comments</label>
                  <textarea
                    rows={4}
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Share what you liked, learned, or experienced..."
                    className="w-full rounded-lg border border-gray-300 bg-white px-3.5 py-2 text-sm text-gray-900 focus:border-orange-500 focus:outline-none"
                  />
                </div>

                <button
                  type="submit"
                  className="rounded-xl bg-orange-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-orange-700 shadow-sm"
                >
                  Submit Review
                </button>
              </form>
            )}

            {/* Reviews List */}
            <div className="space-y-4">
              {reviewsList.map((review) => (
                <div key={review.id} className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-sm text-gray-900">{review.user}</span>
                      {review.verifiedPurchase && (
                        <span className="flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold text-emerald-700">
                          <CheckCircle size={10} /> Verified Purchase
                        </span>
                      )}
                    </div>
                    <span className="text-xs text-gray-400">{review.date}</span>
                  </div>

                  <div className="mt-2">
                    <ProductRating rating={review.rating} showCount={false} size={14} />
                  </div>

                  <h5 className="mt-2 text-sm font-bold text-gray-900">{review.title}</h5>
                  <p className="mt-1 text-sm text-gray-600 leading-relaxed">{review.comment}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
