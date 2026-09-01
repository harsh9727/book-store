"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { ArrowLeft, Save, X } from "lucide-react";
import { toast } from "sonner";

import type { GalleryItem, GalleryPhoto } from "@/types/gallery";
import {
  adminJsonRequest,
  slugify,
  uploadAdminImages,
  validateClientImages,
} from "@/lib/adminContentClient";
import { MAX_GALLERY_PHOTOS } from "@/lib/imageRules";

interface AdminGalleryFormProps {
  initialItem?: GalleryItem;
}

interface NewPhotoPreview {
  id: string;
  file: File;
  previewUrl: string;
}

const inputClass = "mt-1.5 h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/10";
const textareaClass = "mt-1.5 w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/10";

export default function AdminGalleryForm({ initialItem }: AdminGalleryFormProps) {
  const router = useRouter();
  const previewUrlsRef = useRef(new Set<string>());
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [newPhotos, setNewPhotos] = useState<NewPhotoPreview[]>([]);
  const [retainedPhotos, setRetainedPhotos] = useState<GalleryPhoto[]>(initialItem?.photos || []);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [coverError, setCoverError] = useState("");
  const [photosError, setPhotosError] = useState("");

  useEffect(() => {
    const previewUrls = previewUrlsRef.current;
    return () => previewUrls.forEach((url) => URL.revokeObjectURL(url));
  }, []);

  const selectCover = (file: File | undefined, input: HTMLInputElement) => {
    if (!file) {
      setCoverFile(null);
      setCoverError("");
      return;
    }
    const validationError = validateClientImages([file]);
    if (validationError) {
      setCoverError(validationError);
      input.value = "";
      return;
    }
    setCoverError("");
    setCoverFile(file);
  };

  const selectPhotos = (files: File[], input: HTMLInputElement) => {
    const validationError = validateClientImages(files);
    if (validationError) {
      setPhotosError(validationError);
      input.value = "";
      return;
    }
    if (retainedPhotos.length + newPhotos.length + files.length > MAX_GALLERY_PHOTOS) {
      setPhotosError(`A gallery can contain at most ${MAX_GALLERY_PHOTOS} extra images.`);
      input.value = "";
      return;
    }
    setPhotosError("");
    const previews = files.map((file) => {
      const previewUrl = URL.createObjectURL(file);
      previewUrlsRef.current.add(previewUrl);
      return { id: crypto.randomUUID(), file, previewUrl };
    });
    setNewPhotos((current) => [...current, ...previews]);
    input.value = "";
  };

  const removeNewPhoto = (photo: NewPhotoPreview) => {
    URL.revokeObjectURL(photo.previewUrl);
    previewUrlsRef.current.delete(photo.previewUrl);
    setNewPhotos((current) => current.filter((item) => item.id !== photo.id));
    setPhotosError("");
  };

  const saveGallery = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const values = new FormData(event.currentTarget);
    setBusy(true);
    setError("");
    try {
      let coverImage = initialItem?.coverImage || "";
      let coverImageKey = initialItem?.coverImageKey;
      if (coverFile) {
        const [uploadedCover] = await uploadAdminImages("gallery-cover", [coverFile]);
        coverImage = uploadedCover.url;
        coverImageKey = uploadedCover.key;
      }
      if (!coverImage) throw new Error("Choose a gallery cover image before saving.");

      const uploadedPhotos = newPhotos.length
        ? await uploadAdminImages("gallery-photos", newPhotos.map((photo) => photo.file))
        : [];
      const photos: GalleryPhoto[] = [
        ...retainedPhotos,
        ...uploadedPhotos.map((photo) => ({
          id: crypto.randomUUID(),
          url: photo.url,
          key: photo.key,
          title: photo.name.replace(/\.[^.]+$/u, ""),
        })),
      ];
      const title = String(values.get("title") || "").trim();
      const enteredSlug = String(values.get("slug") || "").trim();
      const payload = {
        slug: slugify(enteredSlug || title),
        title,
        subtitle: String(values.get("subtitle") || "").trim() || undefined,
        category: String(values.get("category") || "").trim(),
        date: String(values.get("date") || "").trim(),
        location: String(values.get("location") || "").trim(),
        coverImage,
        ...(coverImageKey ? { coverImageKey } : {}),
        description: String(values.get("description") || "").trim(),
        story: String(values.get("story") || "").trim() || undefined,
        organizer: String(values.get("organizer") || "").trim() || undefined,
        tags: String(values.get("tags") || "").split(",").map((tag) => tag.trim()).filter(Boolean),
        photos,
      };
      const url = initialItem
        ? `/api/admin/content/galleries/${encodeURIComponent(String(initialItem.id))}`
        : "/api/admin/content/galleries";
      await adminJsonRequest(url, initialItem ? "PUT" : "POST", payload);
      toast.success(initialItem ? "Gallery updated successfully." : "Gallery created successfully.");
      router.push("/admin/galleries");
      router.refresh();
    } catch (saveError) {
      const errorMessage = saveError instanceof Error ? saveError.message : "Gallery could not be saved.";
      setError(errorMessage);
      toast.error(errorMessage);
      setBusy(false);
    }
  };

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
      <div className="mb-5 flex items-start justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold">{initialItem ? "Edit gallery details" : "Add a new gallery"}</h2>
          <p className="text-xs text-slate-500">Every image: max 500 KB. Extra photos: max 12.</p>
        </div>
        <Link href="/admin/galleries" className="flex items-center gap-2 rounded-xl border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-50">
          <ArrowLeft size={16} />Back to list
        </Link>
      </div>

      {error && <p role="alert" className="mb-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}

      <form onSubmit={saveGallery} className="grid gap-4 sm:grid-cols-2">
        <label className="sm:col-span-2 text-sm font-semibold">Title<input name="title" required maxLength={220} defaultValue={initialItem?.title} className={inputClass} /></label>
        <label className="text-sm font-semibold">Slug<input name="slug" defaultValue={initialItem?.slug} placeholder="auto-from-title" className={inputClass} /></label>
        <label className="text-sm font-semibold">Category<input name="category" required defaultValue={initialItem?.category} className={inputClass} /></label>
        <label className="text-sm font-semibold">Date<input name="date" required defaultValue={initialItem?.date || new Date().toISOString().slice(0, 10)} className={inputClass} /></label>
        <label className="text-sm font-semibold">Location<input name="location" required defaultValue={initialItem?.location} className={inputClass} /></label>
        <label className="sm:col-span-2 text-sm font-semibold">Subtitle<input name="subtitle" defaultValue={initialItem?.subtitle} className={inputClass} /></label>
        <label className="sm:col-span-2 text-sm font-semibold">Cover image<input type="file" accept="image/jpeg,image/png,image/webp" required={!initialItem?.coverImage} aria-invalid={Boolean(coverError)} aria-describedby={coverError ? "gallery-cover-error" : undefined} onChange={(event) => selectCover(event.currentTarget.files?.[0], event.currentTarget)} className={`mt-1.5 block w-full rounded-xl border border-dashed p-3 text-sm ${coverError ? "border-red-400 bg-red-50/40" : "border-slate-300"}`} /><span className="mt-1 block text-xs font-normal text-slate-500">{coverFile?.name || (initialItem?.coverImage ? "Current cover will be kept." : "Choose a cover.")}</span>{coverError && <span id="gallery-cover-error" role="alert" className="mt-1.5 block text-xs font-medium text-red-600">{coverError}</span>}</label>
        <label className="sm:col-span-2 text-sm font-semibold">Description<textarea name="description" required maxLength={2000} rows={3} defaultValue={initialItem?.description} className={textareaClass} /></label>
        <label className="sm:col-span-2 text-sm font-semibold">Story<textarea name="story" maxLength={20000} rows={5} defaultValue={initialItem?.story} className={textareaClass} /></label>
        <label className="text-sm font-semibold">Organizer<input name="organizer" defaultValue={initialItem?.organizer} className={inputClass} /></label>
        <label className="text-sm font-semibold">Tags, comma separated<input name="tags" defaultValue={initialItem?.tags.join(", ")} className={inputClass} /></label>
        <label className="sm:col-span-2 text-sm font-semibold">Extra photos<input type="file" multiple accept="image/jpeg,image/png,image/webp" aria-invalid={Boolean(photosError)} aria-describedby={photosError ? "gallery-photos-error" : undefined} onChange={(event) => selectPhotos(Array.from(event.currentTarget.files || []), event.currentTarget)} className={`mt-1.5 block w-full rounded-xl border border-dashed p-3 text-sm ${photosError ? "border-red-400 bg-red-50/40" : "border-slate-300"}`} /><span className="mt-1 block text-xs font-normal text-slate-500">{retainedPhotos.length + newPhotos.length} / {MAX_GALLERY_PHOTOS} selected</span>{photosError && <span id="gallery-photos-error" role="alert" className="mt-1.5 block text-xs font-medium text-red-600">{photosError}</span>}</label>
        {(retainedPhotos.length > 0 || newPhotos.length > 0) && (
          <div className="sm:col-span-2 grid grid-cols-3 gap-2 sm:grid-cols-4 md:grid-cols-6">
            {retainedPhotos.map((photo) => (
              <div key={photo.id} className="relative aspect-square overflow-hidden rounded-lg bg-slate-100">
                <Image src={photo.url} alt={photo.title} fill className="object-cover" sizes="160px" />
                <button type="button" onClick={() => { setRetainedPhotos((current) => current.filter((item) => item.id !== photo.id)); setPhotosError(""); }} className="absolute right-1 top-1 rounded-full bg-black/70 p-1 text-white" aria-label={`Remove ${photo.title}`}><X size={13} /></button>
              </div>
            ))}
            {newPhotos.map((photo) => (
              <div key={photo.id} className="relative aspect-square overflow-hidden rounded-lg bg-slate-100 ring-2 ring-orange-400/70">
                <Image src={photo.previewUrl} alt={`Selected preview: ${photo.file.name}`} fill unoptimized className="object-cover" sizes="160px" />
                <span className="absolute bottom-1 left-1 rounded-full bg-orange-600 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white">New</span>
                <button type="button" onClick={() => removeNewPhoto(photo)} className="absolute right-1 top-1 rounded-full bg-black/70 p-1 text-white" aria-label={`Remove selected image ${photo.file.name}`}><X size={13} /></button>
              </div>
            ))}
          </div>
        )}
        <div className="sm:col-span-2 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <Link href="/admin/galleries" className="flex h-11 items-center justify-center rounded-xl border border-slate-200 px-5 text-sm font-semibold text-slate-600 hover:bg-slate-50">Cancel</Link>
          <button type="submit" disabled={busy} className="flex h-11 items-center justify-center gap-2 rounded-xl bg-orange-600 px-5 text-sm font-semibold text-white hover:bg-orange-700 disabled:opacity-60"><Save size={17} />{busy ? "Saving..." : initialItem ? "Update gallery" : "Create gallery"}</button>
        </div>
      </form>
    </section>
  );
}
