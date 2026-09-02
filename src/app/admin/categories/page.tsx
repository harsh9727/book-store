import type { Metadata } from "next";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import AdminContentShell from "@/components/admin/AdminContentShell";
import AdminCategoryManager from "@/components/admin/category/AdminCategoryManager";
import { ADMIN_SESSION_COOKIE, verifyAdminSession } from "@/lib/adminAuth";
import { getCategories, getProducts } from "@/lib/contentRepository";

export const metadata: Metadata = { title: "Manage Categories" };
export const dynamic = "force-dynamic";

export default async function AdminCategoriesPage() {
  const cookieStore = await cookies();
  if (!verifyAdminSession(cookieStore.get(ADMIN_SESSION_COOKIE)?.value)) redirect("/admin/login");
  const [categories, products] = await Promise.all([getCategories(), getProducts()]);
  return <AdminContentShell active="categories" title="Category management" description="Maintain the category list used by products."><AdminCategoryManager initialItems={categories} products={products} /></AdminContentShell>;
}
