import Link from "next/link";
import { Clock, Mail, Phone, ShieldCheck } from "lucide-react";
import Breadcrumb from "@/components/common/Breadcrumb";
import { createPageMetadata } from "@/lib/seo";

export const metadata = createPageMetadata({
  title: "Privacy Policy",
  description:
    "Learn how Gujarat Tract Book Store collects, uses, stores, and protects your personal information.",
  path: "/privacy-policy",
});

const informationGroups = [
  {
    title: "Personal information",
    items: [
      "Full name",
      "Email address",
      "Phone number",
      "Shipping address",
    ],
  },
  {
    title: "Browser-local Cart information",
    items: [
      "Selected Products",
      "Selected quantities and variants",
      "Displayed prices",
      "Product links",
    ],
  },
  {
    title: "Technical information",
    items: [
      "IP address",
      "Browser type",
      "Device information",
      "Operating system",
      "Pages visited",
      "Date and time of visits",
      "Cookies and similar technologies",
    ],
  },
];

const uses = [
  "Respond to order requests that you choose to send through WhatsApp.",
  "Provide customer support.",
  "Respond to your inquiries and requests.",
  "Send order confirmations and shipping updates.",
  "Improve our website, products, and services.",
  "Detect fraud and maintain website security.",
  "Comply with legal obligations.",
  "Send promotional emails and newsletters only when you choose to receive them.",
];

const sharingPartners = [
  "WhatsApp/Meta when you choose Buy Now or send your Cart",
  "EmailJS when you submit the Contact form",
  "Delivery and courier partners",
  "Website hosting and technology providers",
  "Government authorities when required by law",
];

const rights = [
  "Access your personal information.",
  "Update or correct inaccurate information.",
  "Request deletion of inquiry information, subject to legal obligations.",
  "Withdraw consent for marketing communications.",
  "Request information regarding the personal data we hold about you.",
];

const marketingContent = [
  "New book releases",
  "Special offers",
  "Seasonal promotions",
  "Reading recommendations",
  "Event announcements",
];

const retentionReasons = [
  "Complete your orders.",
  "Respond to your inquiries.",
  "Comply with legal and tax obligations.",
  "Resolve disputes.",
  "Enforce our agreements.",
];

function BulletList({ items }: { items: string[] }) {
  return (
    <ul className="mt-4 grid gap-2 text-sm leading-7 text-gray-600 sm:grid-cols-2 sm:text-base">
      {items.map((item) => (
        <li key={item} className="flex items-start gap-3">
          <span className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-orange-600" />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

function PolicySection({
  number,
  title,
  children,
}: {
  number: number;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="border-b border-gray-200 py-8 last:border-b-0 md:py-10">
      <div className="mb-4 flex items-start gap-3">
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-orange-600 text-sm font-bold text-white">
          {number}
        </span>
        <h2 className="title pt-0.5 text-xl font-bold text-gray-900 sm:text-2xl">
          {title}
        </h2>
      </div>
      <div className="description text-sm leading-7 text-gray-600 sm:text-base sm:leading-8">
        {children}
      </div>
    </section>
  );
}

export default function PrivacyPolicyPage() {
  return (
    <div className="bg-white">
      <div className="container mx-auto max-w-4xl px-4 pt-8 lg:px-6">
        <Breadcrumb
          items={[{ label: "Home", href: "/" }, { label: "Privacy Policy" }]}
          className="mb-0"
        />
      </div>

      <header className="border-b border-orange-100 bg-orange-50/70">
        <div className="container mx-auto px-4 py-12 text-center md:py-16 lg:px-6">
          <span className="mb-4 inline-flex items-center gap-2 rounded-full bg-white px-3.5 py-1.5 text-sm font-semibold text-orange-700 shadow-sm ring-1 ring-orange-100">
            <ShieldCheck size={16} />
            Your privacy matters
          </span>
          <h1 className="title text-3xl font-extrabold text-gray-900 md:text-5xl">
            Privacy Policy
          </h1>
          <p className="description mx-auto mt-4 max-w-2xl text-sm leading-7 text-gray-600 sm:text-base">
            How Gujarat Tract Book Store collects, uses, stores, and safeguards
            your information.
          </p>
          <p className="description mt-3 text-xs font-medium text-gray-500">
            Effective date: September 5, 2026
          </p>
        </div>
      </header>

      <main className="container mx-auto max-w-4xl px-4 py-8 md:py-12 lg:px-6">
        <div className="description border-b border-gray-200 pb-8 text-sm leading-7 text-gray-600 sm:text-base sm:leading-8">
          <p>
            At Gujarat Tract Book Store, we value your privacy and are committed
            to protecting your personal information. This Privacy Policy
            explains how we collect, use, store, and safeguard your information
            when you visit our website, submit the Contact form, or choose to
            send a Product request through WhatsApp.
          </p>
          <p className="mt-3 font-medium text-gray-800">
            By using our website, you agree to the practices described in this
            Privacy Policy.
          </p>
        </div>

        <PolicySection number={1} title="Information We Collect">
          <p>
            To provide our services effectively, we may collect the following
            information:
          </p>
          <div className="mt-5 grid gap-6 md:grid-cols-3">
            {informationGroups.map((group) => (
              <div key={group.title}>
                <h3 className="font-semibold text-gray-900">{group.title}</h3>
                <BulletList items={group.items} />
              </div>
            ))}
          </div>
        </PolicySection>

        <PolicySection number={2} title="How We Use Your Information">
          <p>We use your information to:</p>
          <BulletList items={uses} />
        </PolicySection>

        <PolicySection number={3} title="Payment Information">
          <p>
            This website does not collect or process payments. GTBS confirms
            payment options only after reviewing your WhatsApp request. Never
            send a UPI PIN, card PIN, password, or banking credential through
            the website or WhatsApp.
          </p>
        </PolicySection>

        <PolicySection number={4} title="Cookies">
          <p>
            The public storefront does not show a cookie-preference banner or
            store a cookie-consent choice. Cookies are limited to features that
            require them:
          </p>
          <BulletList
            items={[
              "A signed, secure session cookie protects the administration area after an administrator logs in.",
              "Google Translate may use a language cookie after you explicitly select Gujarati.",
            ]}
          />
          <p className="mt-4">
            The storefront does not currently use analytics, advertising, or
            personalization cookies. Disabling cookies may prevent admin login
            or Gujarati translation from working correctly.
          </p>
          <p className="mt-3">
            The public Cart is stored in your browser&apos;s local storage, not
            in a customer account or server-side order database.
          </p>
        </PolicySection>

        <PolicySection number={5} title="Information Sharing">
          <p>
            We respect your privacy and do not sell or rent your personal
            information to third parties. We may share your information only
            when necessary with:
          </p>
          <BulletList items={sharingPartners} />
          <p className="mt-4">
            These partners receive only the information necessary to perform
            their services.
          </p>
        </PolicySection>

        <PolicySection number={6} title="Data Security">
          <p>
            We implement reasonable administrative, technical, and
            organizational security measures to protect your personal
            information against unauthorized access, misuse, alteration, or
            disclosure.
          </p>
          <p className="mt-3">
            While we strive to protect your information, no method of internet
            transmission or electronic storage is completely secure.
          </p>
        </PolicySection>

        <PolicySection number={7} title="Your Rights">
          <p>You have the right to:</p>
          <BulletList items={rights} />
          <p className="mt-4">
            To exercise these rights, please contact us using the details
            provided below.
          </p>
        </PolicySection>

        <PolicySection number={8} title="Marketing Communications">
          <p>If you subscribe to our newsletter, we may send you:</p>
          <BulletList items={marketingContent} />
          <p className="mt-4">
            You may unsubscribe at any time by clicking the
            &quot;Unsubscribe&quot; link included in our emails or by contacting
            us directly.
          </p>
        </PolicySection>

        <PolicySection number={9} title="Third-Party Services">
          <p>
            Our website may contain links to third-party websites or use
            third-party services such as WhatsApp, EmailJS, image hosting, or
            shipping partners. We are not responsible for the privacy practices
            or content of third-party websites. We encourage you to review their
            privacy policies before sharing personal information.
          </p>
        </PolicySection>

        <PolicySection number={10} title="Children's Privacy">
          <p>
            Our website is intended for general audiences. We do not knowingly
            collect personal information from children under the age of 13
            without parental or guardian consent. If you believe that a child
            has provided personal information, please contact us so we can take
            appropriate action.
          </p>
        </PolicySection>

        <PolicySection number={11} title="Data Retention">
          <p>
            We retain your personal information only for as long as necessary
            to:
          </p>
          <BulletList items={retentionReasons} />
          <p className="mt-4">
            When information is no longer required, it is securely deleted or
            anonymized.
          </p>
        </PolicySection>

        <PolicySection number={12} title="Policy Updates">
          <p>
            We may update this Privacy Policy from time to time to reflect
            changes in our services, legal requirements, or business practices.
            Any updates will be published on this page with a revised Effective
            Date. We encourage you to review this page periodically.
          </p>
        </PolicySection>

        <PolicySection number={13} title="Contact Us">
          <p>
            If you have any questions about this Privacy Policy or how your
            information is handled, please contact us.
          </p>
          <div className="mt-5 border-l-2 border-orange-500 pl-5">
            <p className="font-semibold text-gray-900">
              Gujarat Tract Book Store
            </p>
            <div className="mt-3 flex flex-col gap-3">
              <Link
                href="mailto:gtbs-1852@yahoo.in"
                className="flex items-center gap-2 text-gray-700 transition-colors hover:text-orange-600"
              >
                <Mail size={17} className="text-orange-600" />
                gtbs-1852@yahoo.in
              </Link>
              <Link
                href="tel:+919265429330"
                className="flex items-center gap-2 text-gray-700 transition-colors hover:text-orange-600"
              >
                <Phone size={17} className="text-orange-600" />
                +91 92654 29330
              </Link>
              <p className="flex items-center gap-2 text-gray-700">
                <Clock size={17} className="text-orange-600" />
                Monday - Saturday, 10:00 AM - 6:00 PM
              </p>
            </div>
          </div>
        </PolicySection>
      </main>
    </div>
  );
}
