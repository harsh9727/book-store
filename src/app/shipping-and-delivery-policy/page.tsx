import Link from "next/link";
import { Clock, Mail, PackageCheck, Phone, Truck } from "lucide-react";
import Breadcrumb from "@/components/common/Breadcrumb";
import { createPageMetadata } from "@/lib/seo";

export const metadata = createPageMetadata({
  title: "Shipping & Delivery Policy",
  description:
    "Learn how Gujarat Tract Book Store processes, ships, tracks, and delivers orders across India.",
  path: "/shipping-and-delivery-policy",
});

const processingDetails = [
  "Orders are typically processed within 1-2 business days.",
  "Orders placed on Sundays or public holidays will be processed on the next business day.",
  "During sales, festivals, or high-demand periods, processing times may be slightly longer.",
];

const coverageDetails = [
  "We currently deliver across India through reliable courier and logistics partners.",
  "If your location is serviceable, your order will be delivered directly to your doorstep.",
  "For international shipping inquiries, please contact our customer support team before placing your order.",
];

const shippingFactors = [
  "Delivery location",
  "Order value",
  "Package weight",
  "Shipping method selected",
];

const freeShippingDetails = [
  "Free shipping may be available on eligible orders that meet the minimum purchase value.",
  "GTBS will confirm any applicable free-shipping offer in WhatsApp before accepting the order.",
];

const failedDeliveryReasons = [
  "Incorrect address",
  "Recipient unavailable",
  "Invalid contact details",
];

const damageRequirements = [
  "Contact us within 48 hours of delivery.",
  "Include your order number.",
  "Provide clear photographs of the package and product, if applicable.",
];

const delayReasons = [
  "Severe weather conditions",
  "Natural disasters",
  "Public holidays",
  "Government restrictions",
  "Courier service disruptions",
  "Unexpected logistical challenges",
];

const addressResponsibilities = [
  "Customers are responsible for providing accurate shipping details during the WhatsApp order confirmation.",
  "Gujarat Tract Book Store is not responsible for delays or failed deliveries resulting from incorrect or incomplete addresses or contact information.",
  "If you notice an error after placing your order, please contact us immediately. We will do our best to update the information before the order is dispatched.",
];

const undeliverableDetails = [
  "If an order is returned to us because it could not be delivered, we will contact you to arrange re-delivery.",
  "Additional shipping charges may apply depending on the reason for the failed delivery.",
];

const shippingSummary = [
  ["Processing time", "1-2 business days"],
  ["Delivery coverage", "Across India"],
  ["Delivery time", "2-10 business days, depending on location"],
  ["Order tracking", "Available after dispatch"],
  ["Secure packaging", "Included with every order"],
  ["Customer support", "Available for shipping assistance"],
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

function ShippingSection({
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

export default function ShippingAndDeliveryPolicyPage() {
  return (
    <div className="bg-white">
      <div className="container mx-auto max-w-4xl px-4 pt-8 lg:px-6">
        <Breadcrumb
          items={[
            { label: "Home", href: "/" },
            { label: "Shipping & Delivery Policy" },
          ]}
          className="mb-0"
        />
      </div>

      <header className="border-b border-orange-100 bg-orange-50/70">
        <div className="container mx-auto px-4 py-12 text-center md:py-16 lg:px-6">
          <span className="mb-4 inline-flex items-center gap-2 rounded-full bg-white px-3.5 py-1.5 text-sm font-semibold text-orange-700 shadow-sm ring-1 ring-orange-100">
            <Truck size={16} />
            Safe and reliable delivery
          </span>
          <h1 className="title text-3xl font-extrabold text-gray-900 md:text-5xl">
            Shipping &amp; Delivery Policy
          </h1>
          <p className="description mx-auto mt-4 max-w-2xl text-sm leading-7 text-gray-600 sm:text-base">
            How we process, ship, track, and deliver your Gujarat Tract Book
            Store orders.
          </p>
          <p className="description mt-3 text-xs font-medium text-gray-500">
            Effective date: September 5, 2026
          </p>
        </div>
      </header>

      <main className="container mx-auto max-w-4xl px-4 py-8 md:py-12 lg:px-6">
        <div className="description border-b border-gray-200 pb-8 text-sm leading-7 text-gray-600 sm:text-base sm:leading-8">
          <p>
            Thank you for shopping with Gujarat Tract Book Store. We are
            committed to delivering your books and faith-inspired products
            safely and on time. This Shipping &amp; Delivery Policy explains how
            we process, ship, and deliver your orders.
          </p>
        </div>

        <ShippingSection number={1} title="Order Processing">
          <p>
            Once your order is successfully placed and payment is confirmed, our
            team begins processing it.
          </p>
          <BulletList items={processingDetails} />
          <p className="mt-4">
            You will receive an email or SMS confirmation once your order has
            been processed.
          </p>
        </ShippingSection>

        <ShippingSection number={2} title="Shipping Coverage">
          <BulletList items={coverageDetails} />
        </ShippingSection>

        <ShippingSection number={3} title="Delivery Time">
          <p>Estimated delivery times may vary depending on your location.</p>
          <div className="mt-5 overflow-hidden rounded-lg border border-gray-200">
            <table className="w-full border-collapse text-left text-sm sm:text-base">
              <thead className="bg-gray-900 text-white">
                <tr>
                  <th className="px-4 py-3 font-semibold sm:px-5">Location</th>
                  <th className="px-4 py-3 font-semibold sm:px-5">
                    Estimated delivery time
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                <tr>
                  <td className="px-4 py-3 sm:px-5">Metro cities</td>
                  <td className="px-4 py-3 font-medium text-gray-800 sm:px-5">
                    1-2 business days
                  </td>
                </tr>
                <tr className="bg-gray-50/70">
                  <td className="px-4 py-3 sm:px-5">Other cities</td>
                  <td className="px-4 py-3 font-medium text-gray-800 sm:px-5">
                    2-3 business days
                  </td>
                </tr>
                <tr>
                  <td className="px-4 py-3 sm:px-5">
                    Rural &amp; remote areas
                  </td>
                  <td className="px-4 py-3 font-medium text-gray-800 sm:px-5">
                    3-5 business days
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="mt-4">
            These are estimated timelines and may vary due to courier operations
            or unforeseen circumstances.
          </p>
        </ShippingSection>

        <ShippingSection number={4} title="Shipping Charges">
          <p>Shipping charges are confirmed in WhatsApp based on:</p>
          <BulletList items={shippingFactors} />
          <p className="mt-4">
            Any applicable shipping charges will be clearly displayed before you
            complete your purchase.
          </p>
        </ShippingSection>

        <ShippingSection number={5} title="Free Shipping">
          <BulletList items={freeShippingDetails} />
        </ShippingSection>

        <ShippingSection number={6} title="Order Tracking">
          <p>
            Once your order has been shipped, you will receive a shipping
            confirmation email or SMS. You can use the tracking information to
            monitor the status of your delivery.
          </p>
        </ShippingSection>

        <ShippingSection number={7} title="Delivery Attempts">
          <p>
            Our courier partners will make one or more delivery attempts.
            Delivery may be unsuccessful due to:
          </p>
          <BulletList items={failedDeliveryReasons} />
          <p className="mt-4">
            The package may be returned to us. Additional shipping charges may
            apply if re-delivery is requested.
          </p>
        </ShippingSection>

        <ShippingSection number={8} title="Packaging">
          <p>
            Every order is carefully packed to help protect books and other
            products during transit. Our goal is to ensure that your purchase
            arrives in excellent condition.
          </p>
        </ShippingSection>

        <ShippingSection number={9} title="Damaged or Missing Items">
          <p>
            If your order arrives damaged, incomplete, or contains the wrong
            product:
          </p>
          <BulletList items={damageRequirements} />
          <p className="mt-4">
            Our team will review your request and provide an appropriate
            resolution.
          </p>
        </ShippingSection>

        <ShippingSection number={10} title="Delivery Delays">
          <p>
            While we aim to deliver every order on time, delays may occasionally
            occur due to:
          </p>
          <BulletList items={delayReasons} />
          <p className="mt-4">
            We appreciate your patience in such situations and will keep you
            informed whenever possible.
          </p>
        </ShippingSection>

        <ShippingSection number={11} title="Incorrect Shipping Information">
          <BulletList items={addressResponsibilities} />
        </ShippingSection>

        <ShippingSection number={12} title="Undeliverable Orders">
          <BulletList items={undeliverableDetails} />
        </ShippingSection>

        <ShippingSection number={13} title="Contact Us">
          <p>
            If you have any questions regarding shipping or delivery, please
            contact us.
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
        </ShippingSection>

        <section className="mt-10 border-y border-orange-200 bg-orange-50/70 px-5 py-8 sm:px-8">
          <div className="mb-6 flex items-center gap-3">
            <PackageCheck className="text-orange-600" size={24} />
            <h2 className="title text-2xl font-bold text-gray-900">
              Shipping Summary
            </h2>
          </div>
          <dl className="grid gap-x-8 gap-y-4 sm:grid-cols-2">
            {shippingSummary.map(([label, value]) => (
              <div key={label} className="border-b border-orange-200/70 pb-3">
                <dt className="description text-xs font-semibold uppercase text-gray-500">
                  {label}
                </dt>
                <dd className="description mt-1 text-sm font-medium text-gray-900 sm:text-base">
                  {value}
                </dd>
              </div>
            ))}
          </dl>
        </section>
      </main>
    </div>
  );
}
