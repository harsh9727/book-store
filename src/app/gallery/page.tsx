import GalleryPageClient from "@/components/gallery/GalleryPageClient";
import { getGalleries } from "@/lib/contentRepository";

export const dynamic = "force-dynamic";

export default async function GalleryPage() {
  return <GalleryPageClient initialItems={await getGalleries()} />;
}
