import ContactSection from "@/components/contact/ContactSection";
import ContactForm from "@/components/contact/ContactForm";
import Faq from "@/components/common/Faq";
import { contactFaqs } from "@/data/faqs";

function Contact() {
  return (
    <div>
      <ContactSection />
      <ContactForm />
      
      {/* FAQ Section */}
      <section className="py-12">
        <div className="container mx-auto px-4 lg:px-6">
          <div className="bg-orange-50/70 rounded-3xl p-6 sm:p-10 border border-orange-100/80 shadow-sm max-w-5xl mx-auto">
            <Faq
              faqs={contactFaqs}
              badge="Support & Inquiries"
              title="Contact & Customer Service FAQs"
              subtitle="Quick solutions to questions regarding visits, customer support, and communication."
            />
          </div>
        </div>
      </section>
    </div>
  );
}

export default Contact;