import type { Metadata } from "next";
import { cookies } from "next/headers";
import { notFound, redirect } from "next/navigation";

import AdminContentShell from "@/components/admin/AdminContentShell";
import AdminProductForm from "@/components/admin/product/AdminProductForm";
import { ADMIN_SESSION_COOKIE, verifyAdminSession } from "@/lib/adminAuth";
import { getCategories, getProduct } from "@/lib/contentRepository";

export const metadata: Metadata = { title: "Edit Product" };
export const dynamic = "force-dynamic";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function EditProductPage({ params }: Props) {
  const cookieStore = await cookies();
  if (!verifyAdminSession(cookieStore.get(ADMIN_SESSION_COOKIE)?.value))
    redirect("/admin/login");
  const { id } = await params;
  const [product, categories] = await Promise.all([
    getProduct(id),
    getCategories(),
  ]);
  if (!product) notFound();
  return (
    <AdminContentShell
      active="products"
      title="Edit product"
      description="Update storefront product details."
    >
      <AdminProductForm initialItem={product} categories={categories} />
    </AdminContentShell>
  );
}
