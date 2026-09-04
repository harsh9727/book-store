import AllProductsPageClient from "@/components/product/AllProductsPageClient";
import { getCategories, getProducts } from "@/lib/contentRepository";

export const dynamic = "force-dynamic";

export default async function AllProductsPage() {
  const [products, categories] = await Promise.all([
    getProducts(),
    getCategories(),
  ]);

  return (
    <AllProductsPageClient products={products} categories={categories} />
  );
}
