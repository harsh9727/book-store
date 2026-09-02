"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { ArrowLeft, Plus, Save, X } from "lucide-react";
import { toast } from "sonner";

import { adminJsonRequest, slugify, uploadAdminImages, validateClientImages } from "@/lib/adminContentClient";
import type { Category } from "@/types/category";
import { PRODUCT_BADGES, type Product, type ProductBadge } from "@/types/product";

interface Props { initialItem?: Product; categories: Category[]; }

const inputClass = "mt-1.5 h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/10";
const textareaClass = "mt-1.5 w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/10";

function normalizeBadge(value?: string): ProductBadge | "" {
  const normalized = value?.toLowerCase() || "";
  if (normalized.includes("best")) return "Best Sellers";
  if (normalized.includes("new")) return "New Releases";
  if (normalized.includes("trend") || normalized.includes("popular") || normalized.includes("sale")) return "Trending Products";
  if (normalized.includes("accessor")) return "Accessories";
  return "";
}

export default function AdminProductForm({ initialItem, categories: initialCategories }: Props) {
  const router = useRouter();
  const [categoryOptions, setCategoryOptions] = useState(initialCategories);
  const [selectedCategory, setSelectedCategory] = useState(initialItem?.category || "");
  const [categoryCreatorOpen, setCategoryCreatorOpen] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [newCategorySlug, setNewCategorySlug] = useState("");
  const [categoryBusy, setCategoryBusy] = useState(false);
  const [categoryError, setCategoryError] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageError, setImageError] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const createCategory = async () => {
    const name = newCategoryName.trim();
    const slug = slugify(newCategorySlug.trim() || name);
    if (!name || !slug) {
      setCategoryError("Enter a category name.");
      return;
    }
    setCategoryBusy(true);
    setCategoryError("");
    try {
      const result = await adminJsonRequest<{ item: Category }>(
        "/api/admin/content/categories",
        "POST",
        { name, slug },
      );
      setCategoryOptions((current) =>
        [...current, result.item].sort((left, right) => left.name.localeCompare(right.name)),
      );
      setSelectedCategory(result.item.slug);
      setNewCategoryName("");
      setNewCategorySlug("");
      setCategoryCreatorOpen(false);
      toast.success("Category created and selected.");
    } catch (createError) {
      const message = createError instanceof Error ? createError.message : "Category could not be created.";
      setCategoryError(message);
      toast.error(message);
    } finally {
      setCategoryBusy(false);
    }
  };

  const save = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const values = new FormData(event.currentTarget);
    const optionalNumber = (name: string) => {
      const raw = String(values.get(name) || "").trim();
      return raw === "" ? undefined : Number(raw);
    };
    setBusy(true);
    setError("");
    try {
      let image = String(values.get("image") || "").trim() || initialItem?.image || "";
      let imageKey = image === initialItem?.image ? initialItem?.imageKey : undefined;
      if (imageFile) {
        const [uploaded] = await uploadAdminImages("product-image", [imageFile]);
        image = uploaded.url;
        imageKey = uploaded.key;
      }
      if (!image) throw new Error("Upload an image or enter an image URL.");
      const title = String(values.get("title") || "").trim();
      const payload = {
        id: slugify(String(values.get("slug") || "").trim() || title),
        title,
        author: String(values.get("author") || "").trim(),
        price: Number(values.get("price")),
        image,
        imageKey,
        images: String(values.get("images") || "").split(/\r?\n/gu).map((value) => value.trim()).filter(Boolean),
        category: selectedCategory,
        rating: optionalNumber("rating"),
        reviewsCount: optionalNumber("reviewsCount"),
        inStock: values.get("inStock") === "on",
        stockCount: optionalNumber("stockCount"),
        badge: String(values.get("badge") || "").trim() || undefined,
        format: values.getAll("format").map(String),
        pages: optionalNumber("pages"),
        publisher: String(values.get("publisher") || "").trim() || undefined,
        publishedDate: String(values.get("publishedDate") || "").trim() || undefined,
        isbn: String(values.get("isbn") || "").trim() || undefined,
        language: String(values.get("language") || "").trim() || undefined,
        dimensions: String(values.get("dimensions") || "").trim() || undefined,
        description: String(values.get("description") || "").trim() || undefined,
        synopsis: String(values.get("synopsis") || "").trim() || undefined,
        authorBio: String(values.get("authorBio") || "").trim() || undefined,
        features: String(values.get("features") || "").split(/\r?\n/gu).map((value) => value.trim()).filter(Boolean),
      };
      const url = initialItem ? `/api/admin/content/products/${encodeURIComponent(initialItem.id)}` : "/api/admin/content/products";
      await adminJsonRequest(url, initialItem ? "PUT" : "POST", payload);
      toast.success(initialItem ? "Product updated." : "Product created.");
      router.push("/admin/products");
      router.refresh();
    } catch (saveError) {
      const message = saveError instanceof Error ? saveError.message : "Product could not be saved.";
      setError(message);
      toast.error(message);
      setBusy(false);
    }
  };

  return <section className="space-y-5">
    <div className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between"><div><h2 className="text-lg font-bold">{initialItem ? "Edit product" : "Add a new product"}</h2><p className="text-xs text-slate-500">Catalog, stock, pricing, and product-detail content.</p></div><Link href="/admin/products" className="flex h-10 items-center justify-center gap-2 rounded-xl border border-slate-200 px-3 text-sm font-semibold text-slate-600 hover:bg-slate-50"><ArrowLeft size={16} />Back to list</Link></div>
    {error && <p role="alert" className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}
    <form onSubmit={save} className="grid gap-5 lg:grid-cols-2">
      <fieldset className="grid gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:grid-cols-2 lg:col-span-2"><legend className="px-2 font-bold">Core details</legend>
        <label className="text-sm font-semibold sm:col-span-2">Title<input name="title" required maxLength={220} defaultValue={initialItem?.title} className={inputClass} /></label>
        <label className="text-sm font-semibold">Slug<input name="slug" maxLength={220} defaultValue={initialItem?.id} placeholder="auto-from-title" className={inputClass} /></label>
        <label className="text-sm font-semibold">Author<input name="author" required maxLength={160} defaultValue={initialItem?.author} className={inputClass} /></label>
        <div>
          <div className="flex items-center justify-between gap-3">
            <label htmlFor="product-category" className="text-sm font-semibold">Category</label>
            <button type="button" onClick={() => { setCategoryCreatorOpen(true); setCategoryError(""); }} className="inline-flex items-center gap-1 text-xs font-semibold text-orange-600 hover:text-orange-700">
              <Plus size={14} />Add category
            </button>
          </div>
          <select id="product-category" name="category" required value={selectedCategory} onChange={(event) => setSelectedCategory(event.target.value)} className={inputClass}>
            <option value="" disabled>Select category</option>
            {categoryOptions.map((item) => <option key={item.id} value={item.slug}>{item.name}</option>)}
          </select>
        </div>
        <label className="text-sm font-semibold">Badge<select name="badge" defaultValue={normalizeBadge(initialItem?.badge)} className={inputClass}><option value="">No badge</option>{PRODUCT_BADGES.map((badge) => <option key={badge} value={badge}>{badge}</option>)}</select></label>
        <label className="text-sm font-semibold sm:col-span-2">Price (₹)<input name="price" type="number" min="0" step="0.01" required defaultValue={initialItem?.price} className={`${inputClass} number-input-no-spinner`} /></label>
      </fieldset>

      <fieldset className="grid gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"><legend className="px-2 font-bold">Inventory and rating</legend>
        <label className="flex items-center gap-2 text-sm font-semibold"><input name="inStock" type="checkbox" defaultChecked={initialItem?.inStock !== false} className="h-4 w-4 accent-orange-600" />Available for sale</label>
        <label className="text-sm font-semibold">Stock count<input name="stockCount" type="number" min="0" step="1" defaultValue={initialItem?.stockCount} className={inputClass} /></label>
        <label className="text-sm font-semibold">Rating<input name="rating" type="number" min="0" max="5" step="0.1" defaultValue={initialItem?.rating} className={inputClass} /></label>
        <label className="text-sm font-semibold">Reviews count<input name="reviewsCount" type="number" min="0" step="1" defaultValue={initialItem?.reviewsCount} className={inputClass} /></label>
      </fieldset>

      <fieldset className="grid gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"><legend className="px-2 font-bold">Product image</legend>
        <label className="text-sm font-semibold">Image URL<input name="image" maxLength={2048} defaultValue={initialItem?.image} placeholder="/images/... or UploadThing URL" className={inputClass} /></label>
        <label className="text-sm font-semibold">Upload replacement<input type="file" accept="image/jpeg,image/png,image/webp" aria-invalid={Boolean(imageError)} onChange={(event) => { const file = event.currentTarget.files?.[0]; if (!file) return setImageFile(null); const validationError = validateClientImages([file]); setImageError(validationError || ""); setImageFile(validationError ? null : file); if (validationError) event.currentTarget.value = ""; }} className="mt-1.5 block w-full rounded-xl border border-dashed border-slate-300 p-3 text-sm" />{imageError && <span className="mt-1 block text-xs text-red-600">{imageError}</span>}</label>
        <label className="text-sm font-semibold">Extra image URLs, one per line<textarea name="images" rows={4} defaultValue={initialItem?.images?.filter((image) => image !== initialItem.image).join("\n")} className={textareaClass} /></label>
      </fieldset>

      <fieldset className="grid gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:grid-cols-2 lg:col-span-2"><legend className="px-2 font-bold">Book specifications</legend>
        <label className="text-sm font-semibold">Pages<input name="pages" type="number" min="1" step="1" defaultValue={initialItem?.pages} className={inputClass} /></label>
        <label className="text-sm font-semibold">Publisher<input name="publisher" maxLength={240} defaultValue={initialItem?.publisher} className={inputClass} /></label>
        <label className="text-sm font-semibold">Published date<input name="publishedDate" maxLength={120} defaultValue={initialItem?.publishedDate} className={inputClass} /></label>
        <label className="text-sm font-semibold">ISBN<input name="isbn" maxLength={40} defaultValue={initialItem?.isbn} className={inputClass} /></label>
        <label className="text-sm font-semibold">Language<input name="language" maxLength={80} defaultValue={initialItem?.language} className={inputClass} /></label>
        <label className="text-sm font-semibold">Dimensions<input name="dimensions" maxLength={160} defaultValue={initialItem?.dimensions} className={inputClass} /></label>
        <div className="sm:col-span-2"><span className="text-sm font-semibold">Formats</span><div className="mt-2 flex flex-wrap gap-4">{["Hardcover", "Paperback", "E-Book", "Audiobook"].map((format) => <label key={format} className="flex items-center gap-2 text-sm"><input type="checkbox" name="format" value={format} defaultChecked={initialItem?.format?.includes(format as NonNullable<Product["format"]>[number])} className="accent-orange-600" />{format}</label>)}</div></div>
      </fieldset>

      <fieldset className="grid gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm lg:col-span-2"><legend className="px-2 font-bold">Storefront content</legend>
        <label className="text-sm font-semibold">Short description<textarea name="description" maxLength={10000} rows={4} defaultValue={initialItem?.description} className={textareaClass} /></label>
        <label className="text-sm font-semibold">Synopsis<textarea name="synopsis" maxLength={20000} rows={5} defaultValue={initialItem?.synopsis} className={textareaClass} /></label>
        <label className="text-sm font-semibold">Author bio<textarea name="authorBio" maxLength={10000} rows={4} defaultValue={initialItem?.authorBio} className={textareaClass} /></label>
        <label className="text-sm font-semibold">Features, one per line<textarea name="features" rows={5} defaultValue={initialItem?.features?.join("\n")} className={textareaClass} /></label>
      </fieldset>
      <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end lg:col-span-2"><Link href="/admin/products" className="flex h-11 items-center justify-center rounded-xl border border-slate-200 bg-white px-5 text-sm font-semibold text-slate-600">Cancel</Link><button disabled={busy || !selectedCategory || Boolean(imageError)} className="flex h-11 items-center justify-center gap-2 rounded-xl bg-orange-600 px-5 text-sm font-semibold text-white hover:bg-orange-700 disabled:opacity-60"><Save size={17} />{busy ? "Saving..." : initialItem ? "Update product" : "Create product"}</button></div>
    </form>
    {categoryCreatorOpen && (
      <div
        className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm"
        onMouseDown={(event) => {
          if (event.target === event.currentTarget && !categoryBusy) {
            setCategoryCreatorOpen(false);
            setCategoryError("");
          }
        }}
      >
        <div role="dialog" aria-modal="true" aria-labelledby="create-category-title" className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 id="create-category-title" className="text-xl font-bold text-slate-900">Add category</h2>
              <p className="mt-1 text-sm text-slate-500">Create a category and select it for this product.</p>
            </div>
            <button type="button" onClick={() => { setCategoryCreatorOpen(false); setCategoryError(""); }} disabled={categoryBusy} className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600 disabled:opacity-50" aria-label="Close category popup"><X size={18} /></button>
          </div>
          <div className="mt-5 space-y-4">
            <label className="block text-sm font-semibold">Category name<input autoFocus value={newCategoryName} onChange={(event) => setNewCategoryName(event.target.value)} maxLength={120} className={inputClass} /></label>
            <label className="block text-sm font-semibold">Slug<input value={newCategorySlug} onChange={(event) => setNewCategorySlug(event.target.value)} maxLength={220} placeholder={slugify(newCategoryName) || "auto-from-name"} className={inputClass} /></label>
            {categoryError && <p role="alert" className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{categoryError}</p>}
          </div>
          <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
            <button type="button" onClick={() => { setCategoryCreatorOpen(false); setCategoryError(""); }} disabled={categoryBusy} className="h-11 rounded-xl border border-slate-200 px-5 text-sm font-semibold text-slate-600 hover:bg-slate-50 disabled:opacity-50">Cancel</button>
            <button type="button" disabled={categoryBusy} onClick={createCategory} className="flex h-11 items-center justify-center gap-2 rounded-xl bg-orange-600 px-5 text-sm font-semibold text-white hover:bg-orange-700 disabled:opacity-60"><Plus size={17} />{categoryBusy ? "Creating..." : "Create and select"}</button>
          </div>
        </div>
      </div>
    )}
  </section>;
}
