import Image from "next/image";
import Link from "next/link";
import { Phone, Mail, MapPin } from "lucide-react";
import Logo from "../../../public/images/logo/logo.webp";

const quickLinks = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Blogs", href: "/blogs" },
  { label: "Gallery", href: "/gallery" },
  { label: "Contact", href: "/contact" },
];

const policyLinks = [
  { label: "Privacy Policy", href: "/privacy-policy" },
  { label: "Terms and Conditions", href: "/terms-and-conditions" },
  { label: "Shipping and Delivery Policy", href: "/shipping-and-delivery-policy" },
];

function FooterHeading({ children }: { children: React.ReactNode }) {
  return (
    <div className="mb-5">
      <h3 className="text-white text-lg font-semibold">{children}</h3>
      <span className="mt-2 block h-[2px] w-8 bg-amber-400/80 rounded-full" />
    </div>
  );
}

function Footer() {
  return (
    <footer className="relative bg-black pt-16 pb-8">
      {/* thin gradient accent line at the very top of the footer */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-amber-400/60 to-transparent" />

      <div className="container px-3 lg:px-6">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-12">
          {/* Brand */}
          <div className="lg:col-span-4">
            <Image src={Logo} alt="GTBS Book Store" width={72} height={72} />
            <p className="text-white/60 font-normal pt-5 text-sm leading-relaxed max-w-xs">
              Welcome to GTBS Book Store, your trusted destination for
              Christian books, Holy Bibles, devotionals, study guides,
              children&apos;s books, magazines, and faith-inspired gifts.
            </p>

          </div>

          {/* Quick Links */}
          <div className="lg:col-span-2">
            <FooterHeading>Quick Links</FooterHeading>
            <ul className="text-white/60 font-normal text-sm space-y-3">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="transition-colors hover:text-amber-400">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Policy Links */}
          <div className="lg:col-span-3">
            <FooterHeading>Policy Links</FooterHeading>
            <ul className="text-white/60 font-normal text-sm space-y-3">
              {policyLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="transition-colors hover:text-amber-400">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div className="lg:col-span-3">
            <FooterHeading>Contact Information</FooterHeading>
            <ul className="text-white/60 font-normal text-sm space-y-4">
              <li>
                <div className="flex items-center gap-3 text-white/60">
                  <Phone size={16} className="shrink-0 text-amber-400/80" />

                  <Link
                    href="tel:+919265429338"
                    className="transition-colors hover:text-amber-400"
                  >
                    +91 9265429338
                  </Link>

                  <span className="h-5 w-px bg-white/30" />

                  <Link
                    href="tel:+917490028867"
                    className="transition-colors hover:text-amber-400"
                  >
                    +91 7490028867
                  </Link>
                </div>
              </li>
              <li>
                <Link href="mailto:gtbs-1852@yahoo.in" className="flex items-center gap-3 transition-colors hover:text-amber-400">
                  <Mail size={16} className="shrink-0 text-amber-400/80" />
                  gtbs-1852@yahoo.in
                </Link>
              </li>
              <li>
                <Link href="https://www.google.com/maps" className="flex items-start gap-3 transition-colors hover:text-amber-400">
                  <MapPin size={16} className="mt-0.5 shrink-0 text-amber-400/80" />
                  Sahitya Seva Sadan, Shahid Veer Kinariwala Marg, I P Mission Compound, Ellisbridge, Ahmedabad, Gujarat 380006
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-14 flex flex-col-reverse items-center gap-4 border-t border-white/10 pt-6 sm:flex-row sm:justify-between">
          <p className="text-white/40 text-xs">
            © {new Date().getFullYear()} GTBS Book Store. All rights reserved.
          </p>
          <p className="text-white/40 text-xs">
            Faithfully serving readers since 2010.
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
