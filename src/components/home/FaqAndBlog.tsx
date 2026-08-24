import Faq from "@/components/common/Faq";
import Blogs from "@/components/common/Blogs";

const homeFaqs = [
  {
    question: "How long does shipping take?",
    answer:
      "Most orders are delivered within 3–7 business days depending on your location.",
  },
  {
    question: "Do you offer international shipping?",
    answer:
      "Yes, we offer international shipping to selected countries.",
  },
  {
    question: "Can I return or exchange a book?",
    answer:
      "Yes, eligible books can be returned or exchanged according to our return policy.",
  },
  {
    question: "Do you offer gift wrapping?",
    answer:
      "Yes, gift wrapping is available for selected books and orders.",
  },
  {
    question: "How can I track my order?",
    answer:
      "Once your order is shipped, you will receive a tracking link by email.",
  },
];

const FaqAndBlog = () => {
  return (
    <section className="py-10">
      <div className="container px-3 lg:px-6 ">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
          {/* FAQ Section - 5 columns */}
          <div className="lg:col-span-5 bg-orange-50 rounded-2xl p-6">
            <Faq faqs={homeFaqs} />
          </div>

          {/* Blogs Section - 7 columns */}
          <div className="lg:col-span-7 bg-orange-50 rounded-2xl p-6">
            <Blogs limit={3} />
          </div>
        </div>
      </div>
    </section>
  );
};

export default FaqAndBlog;
