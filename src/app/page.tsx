import { createPageMetadata, siteConfig } from "@/lib/seo";
import HeroSection from "@/components/home/HeroSection";
import FeaturesSection from "@/components/home/FeaturesSection";
import NewArrivals from "@/components/home/NewArrivals";
import Magazines from "@/components/home/Magazines";
import BestSallers from "@/components/home/BestSallers";
import Trendings from "@/components/home/Trendings";
import CategorySection from "@/components/home/CategorySection";
import WhyChoose from "@/components/home/WhyChoose";
import OurAccessories from "@/components/home/OurAccessories";
import Reviews from "@/components/home/Reviews";
import FaqAndBlog from "@/components/home/FaqAndBlog";
import { getProducts, getTestimonials } from "@/lib/contentRepository";

export const metadata = createPageMetadata({
  title: "Christian Books, Bibles & Faith Resources",
  description: siteConfig.description,
  path: "/",
});

export const dynamic = "force-dynamic";

export default async function Home() {
  const [products, testimonials] = await Promise.all([
    getProducts(),
    getTestimonials(),
  ]);
  const hasBadge = (product: (typeof products)[number], value: string) => product.badge?.toLowerCase().includes(value) ?? false;
  const newReleases = products.filter((product) => hasBadge(product, "new"));
  const bestSellers = products.filter((product) => hasBadge(product, "best"));
  const trending = products.filter((product) => hasBadge(product, "trend") || hasBadge(product, "popular") || (product.rating ?? 0) >= 4.7);
  const accessories = products.filter((product) => product.category === "accessories" || hasBadge(product, "accessor"));
  return (
    <div className="py-3">
      <HeroSection />
      <FeaturesSection />
      <div id="new-releases">
        <NewArrivals products={newReleases} />
      </div>
      <div id="magazines">
        <Magazines />
      </div>
      <div id="best-sellers">
        <BestSallers products={bestSellers} />
      </div>
      <div id="trending-books">
        <Trendings products={trending} />
      </div>
      <CategorySection />
      <WhyChoose />
      <OurAccessories products={accessories} />
      <Reviews testimonials={testimonials} />
      <FaqAndBlog />
    </div>
  );
}
