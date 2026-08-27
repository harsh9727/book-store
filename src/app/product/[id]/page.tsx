import { notFound } from "next/navigation";
import { products } from "@/data/products";
import Breadcrumb from "@/components/common/Breadcrumb";
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

  const breadcrumbItems = [
    { label: "Home", href: "/" },
    { label: "Shop", href: "/shop" },
    { label: product.category, href: `/shop?category=${product.category}` },
    { label: product.title },
  ];

  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      {/* Breadcrumbs */}
      <Breadcrumb items={breadcrumbItems} />

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
