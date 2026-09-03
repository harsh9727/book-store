"use client";

import { BookOpen, Tag, Truck, Headphones } from "lucide-react";

const benefits = [
  {
    icon: BookOpen,
    title: "Wide Selection",
    description: "Thousands of books across every genre and category.",
  },
  {
    icon: Tag,
    title: "Best Prices",
    description:
      "Competitive pricing and exclusive offers on your favorite books.",
  },
  {
    icon: Truck,
    title: "Quick Delivery",
    description:
      "Fast and reliable shipping delivered straight to your doorstep.",
  },
  {
    icon: Headphones,
    title: "24/7 Support",
    description: "We're here to help whenever you need assistance.",
  },
];

const WhyChooseUs = () => {
  return (
    <section aria-labelledby="why-choose-us-heading" className="bg-white py-10">
      <div className="container mx-auto px-4 lg:px-6">
        {/* ================= SECTION HEADING ================= */}
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-orange-600 md:text-xs">
            Why Choose GTBS Books?
          </p>

          <h2
            id="why-choose-us-heading"
            className="title mt-3 text-[30px] font-bold leading-tight tracking-tight text-gray-900 sm:text-[34px] md:text-[40px]"
          >
            Built for <span className="text-orange-600">Book Lovers</span>
          </h2>
        </div>

        {/* ================= BENEFITS ================= */}
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:gap-5">
          {benefits.map((benefit) => {
            const Icon = benefit.icon;

            return (
              <article
                key={benefit.title}
                className="group flex min-h-[250px] flex-col items-center rounded-2xl border border-gray-200 bg-white p-6 text-center transition-all duration-300 hover:-translate-y-1 hover:border-orange-100 hover:shadow-[0_12px_35px_rgba(0,0,0,0.06)]"
              >
                {/* Icon */}
                <div className="flex h-[82px] w-[82px] items-center justify-center rounded-full bg-orange-50 transition-all duration-300 group-hover:bg-orange-100">
                  <Icon
                    size={38}
                    strokeWidth={1.7}
                    className="text-orange-600 transition-transform duration-300 group-hover:scale-105"
                    aria-hidden="true"
                  />
                </div>

                {/* Title */}
                <h3 className="title mt-7 text-[18px] font-bold text-gray-900">
                  {benefit.title}
                </h3>

                {/* Description */}
                <p className="description mt-3 max-w-[230px] text-[14px] leading-6 text-gray-500 md:text-sm">
                  {benefit.description}
                </p>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;
