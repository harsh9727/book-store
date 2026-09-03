import type { Metadata } from "next";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import AdminContentShell from "@/components/admin/AdminContentShell";
import AdminGalleryManager from "@/components/admin/gallery/AdminGalleryManager";
import { ADMIN_SESSION_COOKIE, verifyAdminSession } from "@/lib/adminAuth";
import { getGalleries } from "@/lib/contentRepository";

export const metadata: Metadata = { title: "Manage Gallery" };
export const dynamic = "force-dynamic";

export default async function AdminGalleriesPage() {
  const cookieStore = await cookies();
  if (!verifyAdminSession(cookieStore.get(ADMIN_SESSION_COOKIE)?.value))
    redirect("/admin/login");
  return (
    <AdminContentShell
      active="galleries"
      title="Gallery management"
      description="Manage albums, cover images, and up to 12 photos per album."
    >
      <AdminGalleryManager initialItems={await getGalleries()} />
    </AdminContentShell>
  );
}
