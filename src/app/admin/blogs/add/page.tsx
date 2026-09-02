import type { Metadata } from "next";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import AdminBlogForm from "@/components/admin/blog/AdminBlogForm";
import AdminContentShell from "@/components/admin/AdminContentShell";
import { ADMIN_SESSION_COOKIE, verifyAdminSession } from "@/lib/adminAuth";

export const metadata: Metadata = { title: "Add Blog" };

export default async function AddBlogPage() {
  const cookieStore = await cookies();
  if (!verifyAdminSession(cookieStore.get(ADMIN_SESSION_COOKIE)?.value)) redirect("/admin/login");

  return (
    <AdminContentShell active="blogs" title="Add blog" description="Create a new public journal article.">
      <AdminBlogForm />
    </AdminContentShell>
  );
}
