import type { Metadata } from "next";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import AdminBlogManager from "@/components/admin/AdminBlogManager";
import AdminContentShell from "@/components/admin/AdminContentShell";
import { ADMIN_SESSION_COOKIE, verifyAdminSession } from "@/lib/adminAuth";
import { getBlogs } from "@/lib/contentRepository";

export const metadata: Metadata = { title: "Manage Blogs" };
export const dynamic = "force-dynamic";

export default async function AdminBlogsPage() {
  const cookieStore = await cookies();
  if (!verifyAdminSession(cookieStore.get(ADMIN_SESSION_COOKIE)?.value)) redirect("/admin/login");
  return <AdminContentShell active="blogs" title="Blog management" description="Create, edit, and remove public journal articles."><AdminBlogManager initialItems={await getBlogs()} /></AdminContentShell>;
}
