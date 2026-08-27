import OurStory from "@/components/about/OurStory";
import VisionMission from "@/components/about/VisionMission";
import WhyChooseUs from "@/components/about/WhyChooseUs";
import Team from "@/components/about/Team";
import Newsletter from "@/components/home/Newsletter";
import Faq from "@/components/common/Faq";
import { aboutFaqs } from "@/data/faqs";

export default function About() {
  return (
    <div>
      <OurStory />
      <VisionMission />
      <WhyChooseUs />
      <Newsletter 
        title="Join our community"
        description="Stay updated with our latest releases and exclusive offers."
      />
      <Team />
      
      {/* FAQ Section */}
      <section className="py-12">
        <div className="container mx-auto px-4 lg:px-6">
          <div className="bg-orange-50/70 rounded-3xl p-6 sm:p-10 border border-orange-100/80 shadow-sm max-w-5xl mx-auto">
            <Faq
              faqs={aboutFaqs}
              badge="Learn More About Us"
              title="About ProBooks & GTBS FAQ"
              subtitle="Everything you need to know about our history, collections, and publishing values."
            />
          </div>
        </div>
      </section>
    </div>
  );
}