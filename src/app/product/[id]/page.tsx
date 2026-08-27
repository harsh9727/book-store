import { notFound } from "next/navigation";
import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";
import { products } from "@/data/products";
import ProductImages from "@/components/product/ProductImages";
import ProductInfo from "@/components/product/ProductInfo";
import ProductTabs from "@/components/product/ProductTabs";
import RelatedProducts from "@/components/product/RelatedProducts";

interface ProductPageProps {
  params: Promise<{ id: string }>;
}

export async function generateStaticParams() {
  return products.map((product) => ({
    id: product.id,
  }));
}

export default async function ProductDetailPage({ params }: ProductPageProps) {
  const { id } = await params;
  const product = products.find((p) => p.id === id) || products[0];

  if (!product) {
    notFound();
  }

  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      {/* Breadcrumbs */}
      <nav className="mb-8 flex items-center gap-2 text-xs text-gray-500">
        <Link href="/" className="flex items-center gap-1 hover:text-orange-600 transition-colors">
          <Home size={14} />
          <span>Home</span>
        </Link>
        <ChevronRight size={12} />
        <Link href="/shop" className="hover:text-orange-600 transition-colors">
          Books
        </Link>
        <ChevronRight size={12} />
        <Link
          href={`/shop?category=${product.category}`}
          className="capitalize hover:text-orange-600 transition-colors"
        >
          {product.category}
        </Link>
        <ChevronRight size={12} />
        <span className="truncate max-w-[200px] sm:max-w-md font-medium text-gray-900">
          {product.title}
        </span>
      </nav>

      {/* Main Product Hero Grid */}
      <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-14">
        {/* Left Gallery */}
        <div className="lg:col-span-5">
          <ProductImages
            mainImage={product.image}
            images={product.images}
            title={product.title}
            badge={product.badge}
          />
        </div>

        {/* Right Info & Purchase Actions */}
        <div className="lg:col-span-7">
          <ProductInfo product={product} />
        </div>
      </div>

      {/* Product Information Tabs */}
      <ProductTabs product={product} />

      {/* Related Products Carousel / Grid */}
      <RelatedProducts
        currentProductId={product.id}
        category={product.category}
        allProducts={products}
      />
    </div>
  );
}
