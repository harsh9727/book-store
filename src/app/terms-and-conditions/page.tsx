import Link from "next/link";
import { FileCheck2, Mail, Phone } from "lucide-react";
import Breadcrumb from "@/components/common/Breadcrumb";
import { createPageMetadata } from "@/lib/seo";

export const metadata = createPageMetadata({
  title: "Terms & Conditions",
  description:
    "Read the terms that govern use of the Gujarat Tract Book Store website and WhatsApp-assisted purchases.",
  path: "/terms-and-conditions",
});

const eligibility = [
  "Be at least 18 years of age or have permission from a parent or legal guardian.",
  "Provide accurate and complete personal information.",
  "Use the website only for lawful purposes.",
];

const productConditions = [
  "Product availability may change without prior notice.",
  "Images are provided for illustration purposes and may slightly differ from the actual product.",
  "Book editions, cover designs, or publishers may vary depending on availability.",
];

const priceFactors = [
  "Publisher price revisions",
  "Promotions",
  "Taxes",
  "Market conditions",
];

const orderConditions = [
  "Buy Now and the Cart prepare a WhatsApp message that you review and send to GTBS.",
  "A WhatsApp request becomes an accepted order only after GTBS confirms availability, delivery charges, final total, and payment instructions.",
  "We may decline or cancel an order due to pricing errors, stock shortages, suspected fraud, or delivery limitations.",
];

const paymentConditions = [
  "The website does not collect or process a payment.",
  "GTBS provides the available payment method and instructions only after confirming the order in WhatsApp.",
  "Never send a UPI PIN, card PIN, password, or banking credential through the website or WhatsApp.",
];

const delayReasons = [
  "Courier partners",
  "Natural disasters",
  "Government restrictions",
  "Public holidays",
  "Incorrect shipping addresses provided by customers",
];

const returnConditions = [
  "Be unused",
  "Be in original condition",
  "Include original packaging",
  "Meet the eligibility requirements described in our Return Policy",
];

const cartConditions = [
  "The Cart is stored only in your current browser and is not a customer account.",
  "Adding a Product to the Cart does not reserve stock or lock its price.",
  "Review Product names, quantities, variants, and links before sending the prepared WhatsApp message.",
];

const protectedContent = [
  "Logos",
  "Website design",
  "Graphics",
  "Product descriptions",
  "Images",
  "Icons",
  "Text",
  "Blog content",
];

const prohibitedUses = [
  "Violate any applicable laws.",
  "Attempt unauthorized access to our systems.",
  "Upload malicious software or harmful code.",
  "Use automated tools to scrape website content.",
  "Interfere with the website's functionality.",
];

const thirdPartyLimitations = [
  "Third-party content",
  "Privacy practices",
  "Services",
  "Products offered by external websites",
];

const liabilityLimitations = [
  "Indirect damages",
  "Consequential losses",
  "Business interruption",
  "Data loss",
  "Delays caused by third-party services",
  "Technical interruptions beyond our control",
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

function TermsSection({
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

export default function TermsAndConditionsPage() {
  return (
    <div className="bg-white">
      <div className="container mx-auto max-w-4xl px-4 pt-8 lg:px-6">
        <Breadcrumb
          items={[
            { label: "Home", href: "/" },
            { label: "Terms & Conditions" },
          ]}
          className="mb-0"
        />
      </div>

      <header className="border-b border-orange-100 bg-orange-50/70">
        <div className="container mx-auto px-4 py-12 text-center md:py-16 lg:px-6">
          <span className="mb-4 inline-flex items-center gap-2 rounded-full bg-white px-3.5 py-1.5 text-sm font-semibold text-orange-700 shadow-sm ring-1 ring-orange-100">
            <FileCheck2 size={16} />
            Website and purchase terms
          </span>
          <h1 className="title text-3xl font-extrabold text-gray-900 md:text-5xl">
            Terms &amp; Conditions
          </h1>
          <p className="description mx-auto mt-4 max-w-2xl text-sm leading-7 text-gray-600 sm:text-base">
            The terms governing your use of Gujarat Tract Book Store and
            purchases requested through WhatsApp.
          </p>
          <p className="description mt-3 text-xs font-medium text-gray-500">
            Effective date: September 5, 2026
          </p>
        </div>
      </header>

      <main className="container mx-auto max-w-4xl px-4 py-8 md:py-12 lg:px-6">
        <div className="description border-b border-gray-200 pb-8 text-sm leading-7 text-gray-600 sm:text-base sm:leading-8">
          <p>
            Welcome to Gujarat Tract Book Store. These Terms &amp; Conditions
            govern your use of our website and Product requests sent to GTBS
            through WhatsApp.
          </p>
          <p className="mt-3 font-medium text-gray-800">
            By accessing or using our website, you agree to comply with these
            terms. If you do not agree with any part of these Terms &amp;
            Conditions, please discontinue using our website.
          </p>
        </div>

        <TermsSection number={1} title="About Gujarat Tract Book Store">
          <p>
            Gujarat Tract Book Store is an online bookstore dedicated to
            providing Christian books, Holy Bibles, devotionals, children&apos;s
            books, educational resources, magazines, gifts, and faith-inspired
            products. Our goal is to offer authentic publications and a seamless
            shopping experience for readers, families, churches, ministries, and
            educational institutions.
          </p>
        </TermsSection>

        <TermsSection number={2} title="Acceptance of Terms">
          <p>
            By visiting our website, adding Products to the browser-local Cart,
            sending a WhatsApp request, or using any of our services, you
            acknowledge that you have read, understood, and accepted these Terms
            &amp; Conditions.
          </p>
        </TermsSection>

        <TermsSection number={3} title="Eligibility">
          <p>To request an order through WhatsApp, you must:</p>
          <BulletList items={eligibility} />
        </TermsSection>

        <TermsSection number={4} title="Products & Availability">
          <p>
            We strive to keep all product information accurate and up to date.
            However:
          </p>
          <BulletList items={productConditions} />
        </TermsSection>

        <TermsSection number={5} title="Pricing">
          <p>
            All prices displayed on our website are in Indian Rupees (INR).
            Prices may change without prior notice due to:
          </p>
          <BulletList items={priceFactors} />
          <p className="mt-4">
            GTBS confirms the final Product total and delivery charges in
            WhatsApp before payment.
          </p>
        </TermsSection>

        <TermsSection number={6} title="Orders">
          <p>When requesting an order:</p>
          <BulletList items={orderConditions} />
          <p className="mt-4">
            If an order is cancelled after payment, the applicable refund will
            be processed according to our Refund Policy.
          </p>
        </TermsSection>

        <TermsSection number={7} title="Payments">
          <p>
            Payment is arranged only after GTBS has reviewed and confirmed the
            WhatsApp request:
          </p>
          <BulletList items={paymentConditions} />
        </TermsSection>

        <TermsSection number={8} title="Shipping & Delivery">
          <p>
            Delivery timelines may vary depending on your location and product
            availability. We are not responsible for delays caused by:
          </p>
          <BulletList items={delayReasons} />
          <p className="mt-4">
            Customers are responsible for providing accurate shipping
            information.
          </p>
        </TermsSection>

        <TermsSection number={9} title="Returns & Refunds">
          <p>
            Returns and refunds are subject to our Return &amp; Refund Policy.
            Returned products must generally:
          </p>
          <BulletList items={returnConditions} />
          <p className="mt-4">
            Digital products, downloadable content, or items damaged after
            delivery may not qualify for returns unless required by applicable
            law.
          </p>
        </TermsSection>

        <TermsSection number={10} title="Browser-local Cart">
          <p>The website does not provide customer accounts:</p>
          <BulletList items={cartConditions} />
        </TermsSection>

        <TermsSection number={11} title="Intellectual Property">
          <p>
            All content available on this website includes, but is not limited
            to:
          </p>
          <BulletList items={protectedContent} />
          <p className="mt-4">
            This content is the property of Gujarat Tract Book Store or its
            respective licensors and is protected under applicable intellectual
            property laws. Unauthorized copying, reproduction, distribution, or
            commercial use is prohibited without written permission.
          </p>
        </TermsSection>

        <TermsSection number={12} title="Acceptable Use">
          <p>You agree not to:</p>
          <BulletList items={prohibitedUses} />
          <p className="mt-4">
            Violation of these terms may result in suspension or termination of
            access.
          </p>
        </TermsSection>

        <TermsSection number={13} title="Third-Party Links">
          <p>
            Our website may contain links to external websites for informational
            purposes. Gujarat Tract Book Store is not responsible for:
          </p>
          <BulletList items={thirdPartyLimitations} />
          <p className="mt-4">
            Users access third-party websites at their own discretion.
          </p>
        </TermsSection>

        <TermsSection number={14} title="Limitation of Liability">
          <p>
            To the maximum extent permitted by law, Gujarat Tract Book Store
            shall not be liable for:
          </p>
          <BulletList items={liabilityLimitations} />
          <p className="mt-4">
            Our total liability shall not exceed the value of the order placed
            by the customer.
          </p>
        </TermsSection>

        <TermsSection number={15} title="Privacy">
          <p>
            Your use of this website is also governed by our{" "}
            <Link
              href="/privacy-policy"
              className="font-semibold text-orange-600 underline decoration-orange-200 underline-offset-4 transition-colors hover:text-orange-700"
            >
              Privacy Policy
            </Link>
            , which explains how we collect, use, and protect your personal
            information.
          </p>
        </TermsSection>

        <TermsSection number={16} title="Changes to Terms">
          <p>
            We reserve the right to modify these Terms &amp; Conditions at any
            time. Updated versions will be published on this page with a revised
            Effective Date. Continued use of the website after changes are
            posted constitutes acceptance of the updated Terms.
          </p>
        </TermsSection>

        <TermsSection number={17} title="Governing Law">
          <p>
            These Terms &amp; Conditions shall be governed by and interpreted in
            accordance with the laws of India. Any disputes arising from the use
            of this website shall be subject to the jurisdiction of the
            competent courts in the city where Gujarat Tract Book Store
            operates.
          </p>
        </TermsSection>

        <TermsSection number={18} title="Contact Us">
          <p>
            If you have any questions regarding these Terms &amp; Conditions,
            please contact us.
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
            </div>
          </div>
        </TermsSection>
      </main>
    </div>
  );
}
