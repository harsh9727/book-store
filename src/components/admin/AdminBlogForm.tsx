"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { ArrowLeft, ImageUp, Save } from "lucide-react";
import { toast } from "sonner";

import type { BlogPost } from "@/types/blog";
import {
  adminJsonRequest,
  slugify,
  uploadAdminImages,
  validateClientImages,
} from "@/lib/adminContentClient";

interface AdminBlogFormProps {
  initialItem?: BlogPost;
}

const inputClass = "mt-1.5 h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/10";
const textareaClass = "mt-1.5 w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/10";

function articleText(blog?: BlogPost) {
  return blog?.content
    .map((section) => [section.heading, section.body].filter(Boolean).join("\n"))
    .join("\n\n") || "";
}

export default function AdminBlogForm({ initialItem }: AdminBlogFormProps) {
  const router = useRouter();
  const [bannerFile, setBannerFile] = useState<File | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [bannerError, setBannerError] = useState("");

  const chooseBanner = (file: File | undefined, input: HTMLInputElement) => {
    if (!file) {
      setBannerFile(null);
      setBannerError("");
      return;
    }
    const validationError = validateClientImages([file]);
    if (validationError) {
      setBannerError(validationError);
      input.value = "";
      return;
    }
    setBannerError("");
    setBannerFile(file);
  };

  const saveBlog = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const values = new FormData(event.currentTarget);
    setBusy(true);
    setError("");
    try {
      let image = initialItem?.image || "";
      let imageKey = initialItem?.imageKey;
      if (bannerFile) {
        const [uploaded] = await uploadAdminImages("blog-banner", [bannerFile]);
        image = uploaded.url;
        imageKey = uploaded.key;
      }
      if (!image) throw new Error("Choose a banner image before saving.");

      const title = String(values.get("title") || "").trim();
      const enteredSlug = String(values.get("slug") || "").trim();
      const payload = {
        title,
        slug: slugify(enteredSlug || title),
        category: String(values.get("category") || "").trim(),
        date: String(values.get("date") || "").trim(),
        readTime: String(values.get("readTime") || "").trim(),
        image,
        ...(imageKey ? { imageKey } : {}),
        summary: String(values.get("summary") || "").trim(),
        author: {
          name: String(values.get("authorName") || "").trim(),
          role: String(values.get("authorRole") || "").trim(),
          avatar: String(values.get("authorAvatar") || "").trim(),
          bio: String(values.get("authorBio") || "").trim(),
        },
        tags: String(values.get("tags") || "").split(",").map((tag) => tag.trim()).filter(Boolean),
        contentText: String(values.get("contentText") || "").trim(),
      };
      const url = initialItem
        ? `/api/admin/content/blogs/${encodeURIComponent(String(initialItem.id))}`
        : "/api/admin/content/blogs";
      await adminJsonRequest(url, initialItem ? "PUT" : "POST", payload);
      toast.success(initialItem ? "Blog updated successfully." : "Blog created successfully.");
      router.push("/admin/blogs");
      router.refresh();
    } catch (saveError) {
      const errorMessage = saveError instanceof Error ? saveError.message : "Blog could not be saved.";
      setError(errorMessage);
      toast.error(errorMessage);
      setBusy(false);
    }
  };

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
      <div className="mb-5 flex items-start justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold">{initialItem ? "Edit blog details" : "Add a new blog"}</h2>
          <p className="text-xs text-slate-500">Banner: JPG, PNG, or WebP; maximum 500 KB.</p>
        </div>
        <Link href="/admin/blogs" className="flex items-center gap-2 rounded-xl border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-50">
          <ArrowLeft size={16} />Back to list
        </Link>
      </div>

      {error && <p role="alert" className="mb-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}

      <form onSubmit={saveBlog} className="grid gap-4 sm:grid-cols-2">
        <label className="sm:col-span-2 text-sm font-semibold">Title<input name="title" required maxLength={220} defaultValue={initialItem?.title} className={inputClass} /></label>
        <label className="text-sm font-semibold">Slug<input name="slug" maxLength={220} defaultValue={initialItem?.slug} placeholder="auto-from-title" className={inputClass} /></label>
        <label className="text-sm font-semibold">Category<input name="category" required maxLength={100} defaultValue={initialItem?.category} className={inputClass} /></label>
        <label className="text-sm font-semibold">Date<input name="date" required defaultValue={initialItem?.date || new Date().toISOString().slice(0, 10)} className={inputClass} /></label>
        <label className="text-sm font-semibold">Read time<input name="readTime" required defaultValue={initialItem?.readTime || "5 min read"} className={inputClass} /></label>
        <label className="sm:col-span-2 text-sm font-semibold">Banner image<input type="file" accept="image/jpeg,image/png,image/webp" required={!initialItem?.image} aria-invalid={Boolean(bannerError)} aria-describedby={bannerError ? "blog-banner-error" : undefined} onChange={(event) => chooseBanner(event.currentTarget.files?.[0], event.currentTarget)} className={`mt-1.5 block w-full rounded-xl border border-dashed p-3 text-sm ${bannerError ? "border-red-400 bg-red-50/40" : "border-slate-300"}`} /><span className="mt-1 flex items-center gap-1 text-xs font-normal text-slate-500"><ImageUp size={13} />{bannerFile?.name || (initialItem?.image ? "Current banner will be kept." : "Choose an image.")}</span>{bannerError && <span id="blog-banner-error" role="alert" className="mt-1.5 block text-xs font-medium text-red-600">{bannerError}</span>}</label>
        <label className="sm:col-span-2 text-sm font-semibold">Summary<textarea name="summary" required maxLength={2000} rows={3} defaultValue={initialItem?.summary} className={textareaClass} /></label>
        <label className="text-sm font-semibold">Author name<input name="authorName" required defaultValue={initialItem?.author.name || "GTBS Editorial Team"} className={inputClass} /></label>
        <label className="text-sm font-semibold">Author role<input name="authorRole" required defaultValue={initialItem?.author.role || "Editor"} className={inputClass} /></label>
        <label className="sm:col-span-2 text-sm font-semibold">Author avatar URL<input name="authorAvatar" required defaultValue={initialItem?.author.avatar || "/images/logo/logo.webp"} className={inputClass} /></label>
        <label className="sm:col-span-2 text-sm font-semibold">Author bio<textarea name="authorBio" maxLength={1500} rows={2} defaultValue={initialItem?.author.bio} className={textareaClass} /></label>
        <label className="sm:col-span-2 text-sm font-semibold">Tags, comma separated<input name="tags" defaultValue={initialItem?.tags.join(", ")} className={inputClass} /></label>
        <label className="sm:col-span-2 text-sm font-semibold">Article content<textarea name="contentText" required maxLength={40000} rows={12} defaultValue={articleText(initialItem)} className={textareaClass} /></label>
        <div className="sm:col-span-2 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <Link href="/admin/blogs" className="flex h-11 items-center justify-center rounded-xl border border-slate-200 px-5 text-sm font-semibold text-slate-600 hover:bg-slate-50">Cancel</Link>
          <button type="submit" disabled={busy} className="flex h-11 items-center justify-center gap-2 rounded-xl bg-orange-600 px-5 text-sm font-semibold text-white hover:bg-orange-700 disabled:opacity-60"><Save size={17} />{busy ? "Saving..." : initialItem ? "Update blog" : "Create blog"}</button>
        </div>
      </form>
    </section>
  );
}
