import { createPageMetadata, siteConfig } from "@/lib/seo";
import HeroSection from "@/components/home/HeroSection";
import FeaturesSection from "@/components/home/FeaturesSection";
import Magazines from "@/components/home/Magazines";
import CategorySection from "@/components/home/CategorySection";
import WhyChoose from "@/components/home/WhyChoose";
import ProductCarouselSection from "@/components/home/ProductCarouselSection";
import Reviews from "@/components/home/Reviews";
import FaqAndBlog from "@/components/home/FaqAndBlog";
import {
  getCategories,
  getProducts,
  getTestimonials,
} from "@/lib/contentRepository";

export const metadata = createPageMetadata({
  title: "Christian Books, Bibles & Faith Resources",
  description: siteConfig.description,
  path: "/",
});

export const revalidate = 300;

export default async function Home() {
  const [products, testimonials, categories] = await Promise.all([
    getProducts(),
    getTestimonials(),
    getCategories(),
  ]);
  const hasBadge = (product: (typeof products)[number], value: string) =>
    product.badge?.toLowerCase().includes(value) ?? false;
  const newReleases = products.filter((product) => hasBadge(product, "new"));
  const bestSellers = products.filter((product) => hasBadge(product, "best"));
  const trending = products.filter(
    (product) =>
      hasBadge(product, "trend") ||
      hasBadge(product, "popular") ||
      (product.rating ?? 0) >= 4.7,
  );
  const accessories = products.filter(
    (product) =>
      product.category === "accessories" || hasBadge(product, "accessor"),
  );
  const magazineProducts = products.filter(
    (product) => product.category === "magazines",
  );

  return (
    <div className="py-3">
      <HeroSection />
      <FeaturesSection />
      <div id="new-releases">
        <ProductCarouselSection
          title="New Releases"
          description="Explore the latest Christian books, devotionals, study guides, children’s books, and inspiring titles recently added to our collection."
          href="/allproducts?collection=new"
          products={newReleases}
        />
      </div>
      <div id="magazines">
        <Magazines products={magazineProducts} />
      </div>
      <div id="best-sellers">
        <ProductCarouselSection
          title="Best Sellers"
          description="Discover the books readers return to most, from trusted faith resources to practical guides and memorable stories."
          href="/allproducts?collection=bestseller"
          products={bestSellers}
          background="bg-[#fffaf5]"
        />
      </div>
      <div id="trending-books">
        <ProductCarouselSection
          title="Trending Products"
          description="Explore popular books, Bibles, devotionals, and inspirational titles currently attracting readers."
          href="/allproducts?collection=trending"
          products={trending}
        />
      </div>
      <CategorySection categories={categories} products={products} />
      <WhyChoose />
      <ProductCarouselSection
        title="Our Accessories"
        description="Thoughtful essentials for readers, gifting, and creating a peaceful study space with comfort and style."
        href="/allproducts?collection=accessories"
        products={accessories}
        background="bg-[#fffaf5]"
      />
      <Reviews testimonials={testimonials} />
      <FaqAndBlog />
    </div>
  );
}
