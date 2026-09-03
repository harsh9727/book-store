"use client";

import Image from "next/image";
import { Mail, Phone, MapPin } from "lucide-react";

import ContactImage from "../../../public/images/contact/contact.webp";

const ContactSection = () => {
  return (
    <section className="bg-white py-10">
      <div className="container px-6 lg:px-8">
        <div className="grid items-center gap-8 lg:grid-cols-2 lg:gap-16">
          {/* Left Content */}
          <div>
            {/* Small Heading */}
            <p className="mb-5 text-sm font-bold uppercase tracking-wide text-orange-600">
              Get in Touch
            </p>

            {/* Main Heading */}
            <h2 className=" title text-4xl font-bold leading-[1.15] tracking-tight text-black sm:text-5xl">
              We’d Love to <span className="text-orange-600">Hear</span> From
              You!
            </h2>

            {/* Description */}
            <p className="mt-5 description leading-7 text-gray-700 sm:text-lg">
              Have a question, suggestion, or need help? Our team is here for
              you. Reach out and we&apos;ll get back to you as soon as possible.
            </p>

            {/* Contact Details */}
            <div className="mt-9 grid gap-x-5 gap-y-8 sm:grid-cols-2">
              {/* Email */}
              <a
                href="mailto:gtbs-1852@yahoo.in"
                className="group flex items-center gap-4"
              >
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-orange-600 text-white transition-transform duration-300 group-hover:scale-105">
                  <Mail size={21} strokeWidth={2} />
                </div>

                <div>
                  <h3 className="title font-bold text-gray-900">Email Us</h3>

                  <p className="mt-1 description text-sm text-gray-600 transition-colors group-hover:text-orange-600">
                    gtbs-1852@yahoo.in
                  </p>
                </div>
              </a>

              {/* Phone */}
              <div className="flex items-start gap-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-orange-600 text-white">
                  <Phone size={21} strokeWidth={2} />
                </div>

                <div>
                  <h3 className="title font-bold text-gray-900">Call Us</h3>

                  <div className="flex items-center gap-5">
                    <a
                      href="tel:+919265429338"
                      className="mt-1 block text-sm text-gray-600 transition-colors description hover:text-orange-600"
                    >
                      +91 9265429338
                    </a>
                    <span className="text-gray-400">|</span>
                    <a
                      href="tel:+917490028867"
                      className="block description text-sm text-gray-600 transition-colors hover:text-orange-600"
                    >
                      +91 7490028867
                    </a>
                  </div>
                </div>
              </div>

              {/* Address */}
              <a
                href="https://www.google.com/maps/search/?api=1&query=Sahitya+Seva+Sadan,+Shahid+Veer+Kinariwala+Marg,+I+P+Mission+Compound,+Ellisbridge,+Ahmedabad,+Gujarat+380006"
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-start gap-4 sm:col-span-2"
              >
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-orange-600 text-white transition-transform duration-300 group-hover:scale-105">
                  <MapPin size={21} strokeWidth={2} />
                </div>

                <div>
                  <h3 className="title font-bold text-gray-900">Visit Us</h3>

                  <p className="mt-1 description text-sm leading-6 text-gray-600 transition-colors group-hover:text-orange-600">
                    Sahitya Seva Sadan, Shahid Veer Kinariwala Marg, I P Mission
                    Compound, Ellisbridge, Ahmedabad, Gujarat 380006
                  </p>
                </div>
              </a>
            </div>
          </div>

          {/* Right Image */}
          <div className="relative overflow-hidden rounded-2xl">
            <Image
              src={ContactImage}
              alt="Contact us"
              width={900}
              height={650}
              className="h-[420px] w-full object-cover sm:h-[480px]"
              priority
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
