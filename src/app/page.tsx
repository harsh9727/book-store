import HeroSection from "@/components/home/HeroSection";
import FeaturesSection from "@/components/home/FeaturesSection";
import NewArrivals from "@/components/home/NewArrivals";
import Magazines from "@/components/home/Magazines";
import BestSallers from "@/components/home/BestSallers";
import Trendings from "@/components/home/Trendings";
import CategorySection from "@/components/home/CategorySection";
import WhyChoose from "@/components/home/WhyChoose";
import Newsletter from "@/components/home/Newsletter";
import Reviews from "@/components/home/Reviews";
import FaqAndBlog from "@/components/home/FaqAndBlog";

export default function Home() {
  return (
    <div className="py-3">
      <HeroSection />
      <FeaturesSection />
      <div id="new-releases">
        <NewArrivals />
      </div>
      <div id="magazines">
        <Magazines />
      </div>
      <div id="best-sellers">
        <BestSallers />
      </div>
      <div id="trending-books">
        <Trendings />
      </div>
      <CategorySection />
      <WhyChoose />
      <Newsletter 
        title="Get Updates on New Releases & Exclusive Deals"
        description="Subscribe to our newsletter and never miss a great read!"
      />
      <Reviews />
      <FaqAndBlog />
    </div>
  );
}