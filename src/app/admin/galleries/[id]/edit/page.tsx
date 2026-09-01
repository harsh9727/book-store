import type { Metadata } from "next";
import { cookies } from "next/headers";
import { notFound, redirect } from "next/navigation";

import AdminContentShell from "@/components/admin/AdminContentShell";
import AdminGalleryForm from "@/components/admin/AdminGalleryForm";
import { ADMIN_SESSION_COOKIE, verifyAdminSession } from "@/lib/adminAuth";
import { getGallery } from "@/lib/contentRepository";

interface EditGalleryPageProps {
  params: Promise<{ id: string }>;
}

export const metadata: Metadata = { title: "Edit Gallery" };
export const dynamic = "force-dynamic";

export default async function EditGalleryPage({ params }: EditGalleryPageProps) {
  const cookieStore = await cookies();
  if (!verifyAdminSession(cookieStore.get(ADMIN_SESSION_COOKIE)?.value)) redirect("/admin/login");

  const { id } = await params;
  const gallery = await getGallery(id);
  if (!gallery) notFound();

  return (
    <AdminContentShell active="galleries" title="Edit gallery" description="Update this public gallery album.">
      <AdminGalleryForm initialItem={gallery} />
    </AdminContentShell>
  );
}
