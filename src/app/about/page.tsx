import OurStory from "@/components/about/OurStory";
import VisionMission from "@/components/about/VisionMission";
import WhyChooseUs from "@/components/about/WhyChooseUs";
import Team from "@/components/about/Team";
import Newsletter from "@/components/home/Newsletter";

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
    </div>
  );
}