import type { Metadata } from "next";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import AdminContentShell from "@/components/admin/AdminContentShell";
import AdminGalleryForm from "@/components/admin/gallery/AdminGalleryForm";
import { ADMIN_SESSION_COOKIE, verifyAdminSession } from "@/lib/adminAuth";

export const metadata: Metadata = { title: "Add Gallery" };

export default async function AddGalleryPage() {
  const cookieStore = await cookies();
  if (!verifyAdminSession(cookieStore.get(ADMIN_SESSION_COOKIE)?.value)) redirect("/admin/login");

  return (
    <AdminContentShell active="galleries" title="Add gallery" description="Create a new public gallery album.">
      <AdminGalleryForm />
    </AdminContentShell>
  );
}
