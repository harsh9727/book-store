import ContactSection from "@/components/contact/ContactSection";
import ContactForm from "@/components/contact/ContactForm";
import Faq from "@/components/common/Faq";

const contactFaqs = [
  {
    question: "How can I reach customer support?",
    answer:
      "You can reach our customer support team via email at gtbs-1852@yahoo.in or call us at +91 9265429338 or +91 7490028867 during business hours.",
  },
  {
    question: "What are your business hours?",
    answer:
      "Our store is open Monday to Saturday. For specific timing, please contact us via phone or email.",
  },
  {
    question: "Where is your store located?",
    answer:
      "We are located at Sahitya Seva Sadan, Shahid Veer Kinariwala Marg, I P Mission Compound, Ellisbridge, Ahmedabad, Gujarat 380006.",
  },
  {
    question: "How quickly do you respond to inquiries?",
    answer:
      "We typically respond to all inquiries within 24-48 business hours. For urgent matters, please call us directly.",
  },
  {
    question: "Can I visit your store in person?",
    answer:
      "Yes, you are welcome to visit our store during business hours. We recommend calling ahead to confirm availability.",
  },
];

function Contact() {
  return (
    <div>
      <ContactSection />
      <ContactForm />
      <section className="py-10">
        <div className="container px-3 lg:px-6">
          <div className="bg-orange-50 rounded-2xl p-6">
            <Faq faqs={contactFaqs} />
          </div>
        </div>
      </section>
    </div>
  );
}

export default Contact;