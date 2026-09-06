import type { Metadata } from "next";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import AdminContentShell from "@/components/admin/AdminContentShell";
import AdminProductForm from "@/components/admin/product/AdminProductForm";
import { ADMIN_SESSION_COOKIE, verifyAdminSession } from "@/lib/adminAuth";
import { getCategories } from "@/lib/contentRepository";

export const metadata: Metadata = { title: "Add Product" };

export default async function AddProductPage() {
  const cookieStore = await cookies();
  if (!verifyAdminSession(cookieStore.get(ADMIN_SESSION_COOKIE)?.value))
    redirect("/admin/login");
  return (
    <AdminContentShell
      title="Add product"
      description="Create a new storefront product."
    >
      <AdminProductForm categories={await getCategories()} />
    </AdminContentShell>
  );
}
