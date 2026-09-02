import type { Metadata } from "next";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import AdminContentShell from "@/components/admin/AdminContentShell";
import AdminProductManager from "@/components/admin/product/AdminProductManager";
import { ADMIN_SESSION_COOKIE, verifyAdminSession } from "@/lib/adminAuth";
import { getCategories, getProducts } from "@/lib/contentRepository";

export const metadata: Metadata = { title: "Manage Products" };
export const dynamic = "force-dynamic";

export default async function AdminProductsPage() {
  const cookieStore = await cookies();
  if (!verifyAdminSession(cookieStore.get(ADMIN_SESSION_COOKIE)?.value)) redirect("/admin/login");
  const [products, categories] = await Promise.all([getProducts(), getCategories()]);
  return <AdminContentShell active="products" title="Product management" description="Create, edit, and remove storefront products."><AdminProductManager initialItems={products} categories={categories} /></AdminContentShell>;
}
