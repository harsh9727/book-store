import OurStory from "@/components/about/OurStory";
import VisionMission from "@/components/about/VisionMission";
import WhyChooseUs from "@/components/about/WhyChooseUs";
import Team from "@/components/about/Team";
import Newsletter from "@/components/home/Newsletter";
import Faq from "@/components/common/Faq";

const aboutFaqs = [
  {
    question: "What is GTBS Book Store?",
    answer:
      "GTBS Book Store is your trusted destination for Christian books, Holy Bibles, devotionals, study guides, children's books, magazines, and faith-inspired gifts.",
  },
  {
    question: "When was GTBS founded?",
    answer:
      "GTBS has been faithfully serving readers since 2010, providing quality Christian literature and resources.",
  },
  {
    question: "What types of books do you offer?",
    answer:
      "We offer a wide range of Christian books including Bibles, devotionals, study guides, children's books, magazines, and faith-inspired gifts.",
  },
  {
    question: "Do you ship internationally?",
    answer:
      "Yes, we offer international shipping to selected countries. Contact us for specific shipping information to your location.",
  },
  {
    question: "How can I contact customer support?",
    answer:
      "You can reach our customer support team via email at gtbs-1852@yahoo.in or call us at +91 9265429338 or +91 7490028867.",
  },
];

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
      <section className="py-10">
        <div className="container px-3 lg:px-6">
          <div className="bg-orange-50 rounded-2xl p-6">
            <Faq faqs={aboutFaqs} />
          </div>
        </div>
      </section>

    </div>
  );
}