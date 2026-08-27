"use client";

import { useState } from "react";
import { toast } from "sonner";
import { MessageSquare, Send, Heart, Share2, Copy, Check } from "lucide-react";
import { BlogComment } from "@/types/blog";

interface BlogCommentsProps {
  initialComments?: BlogComment[];
  blogTitle: string;
}

export default function BlogComments({
  initialComments = [],
  blogTitle,
}: BlogCommentsProps) {
  const [comments, setComments] = useState<BlogComment[]>(initialComments);
  const [name, setName] = useState("");
  const [commentText, setCommentText] = useState("");
  const [likes, setLikes] = useState(24);
  const [hasLiked, setHasLiked] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleLike = () => {
    if (hasLiked) {
      setLikes(likes - 1);
      setHasLiked(false);
    } else {
      setLikes(likes + 1);
      setHasLiked(true);
      toast.success("Thank you for liking this article!");
    }
  };

  const handleCopyLink = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard?.writeText(window.location.href);
      setCopied(true);
      toast.success("Article link copied!");
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleSubmitComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !commentText.trim()) {
      toast.error("Please enter your name and comment.");
      return;
    }

    const newComment: BlogComment = {
      id: `c-${Date.now()}`,
      name: name.trim(),
      date: "Just now",
      content: commentText.trim(),
    };

    setComments([newComment, ...comments]);
    setName("");
    setCommentText("");
    toast.success("Your comment has been posted!");
  };

  return (
    <div className="mt-12 border-t border-gray-100 pt-10">
      {/* Interaction Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl bg-gray-50/80 p-4 sm:p-5 border border-gray-100">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleLike}
            className={`flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold transition-all ${
              hasLiked
                ? "bg-red-50 text-red-600 border border-red-200"
                : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-200"
            }`}
          >
            <Heart size={18} className={hasLiked ? "fill-red-500 text-red-500" : ""} />
            <span>{likes} Claps & Likes</span>
          </button>

          <div className="flex items-center gap-1.5 text-xs text-gray-500">
            <MessageSquare size={16} />
            <span>{comments.length} Comments</span>
          </div>
        </div>

        {/* Share Buttons */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-gray-500">Share:</span>
          <button
            type="button"
            onClick={handleCopyLink}
            className="flex items-center gap-1 rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs font-medium text-gray-700 hover:border-orange-500 hover:text-orange-600"
          >
            {copied ? <Check size={14} className="text-emerald-600" /> : <Copy size={14} />}
            <span>{copied ? "Copied" : "Copy Link"}</span>
          </button>
        </div>
      </div>

      {/* Comment Section */}
      <div className="mt-10 max-w-3xl">
        <h3 className="title text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
          <MessageSquare size={20} className="text-orange-600" />
          <span>Discussion & Thoughts ({comments.length})</span>
        </h3>

        {/* Add Comment Form */}
        <form onSubmit={handleSubmitComment} className="mb-8 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm space-y-3.5">
          <h4 className="text-sm font-bold text-gray-900">Leave a Reply</h4>
          <div>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your Name"
              className="w-full rounded-xl border border-gray-200 bg-gray-50/50 px-3.5 py-2 text-sm text-gray-900 focus:border-orange-500 focus:bg-white focus:outline-none"
            />
          </div>
          <div>
            <textarea
              rows={3}
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder="Join the discussion... What are your thoughts on this article?"
              className="w-full rounded-xl border border-gray-200 bg-gray-50/50 px-3.5 py-2 text-sm text-gray-900 focus:border-orange-500 focus:bg-white focus:outline-none"
            />
          </div>
          <button
            type="submit"
            className="inline-flex items-center gap-2 rounded-xl bg-orange-600 px-5 py-2 text-xs font-semibold text-white shadow-sm hover:bg-orange-700"
          >
            <Send size={13} />
            <span>Post Comment</span>
          </button>
        </form>

        {/* Comments List */}
        <div className="space-y-4">
          {comments.map((comment) => (
            <div
              key={comment.id}
              className="rounded-2xl border border-gray-100 bg-gray-50/50 p-4 text-sm"
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className="font-bold text-gray-900">{comment.name}</span>
                <span className="text-xs text-gray-400">{comment.date}</span>
              </div>
              <p className="description text-gray-700 leading-relaxed">{comment.content}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
