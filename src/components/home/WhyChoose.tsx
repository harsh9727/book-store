import Image from "next/image";
import {
  BadgeCheck,
  BookOpen,
  CreditCard,
  Headphones,
  RotateCcw,
} from "lucide-react";

import BookstoreImg from "../../../public/images/products/why-choose.webp";

const benefits = [
  {
    title: "Trusted Christian Collection",
    description:
      "Carefully selected Christian books, Bibles, devotionals, and ministry resources.",
    icon: BookOpen,
  },
  {
    title: "Affordable Prices",
    description:
      "Enjoy competitive prices, special offers, and great value on every purchase.",
    icon: BadgeCheck,
  },
  {
    title: "Secure Payments",
    description:
      "Safe and secure payment options for a smooth and reliable shopping experience.",
    icon: CreditCard,
  },
  {
    title: "Easy Returns",
    description:
      "Simple return options for eligible products so you can shop with confidence.",
    icon: RotateCcw,
  },
  {
    title: "Excellent Support",
    description:
      "Our team is always ready to help you choose the right books and assist with orders.",
    icon: Headphones,
  },
];

const WhyChoose = () => {
  return (
    <section className="bg-white py-12">
      <div className="container px-3 lg:px-6">
        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
          {/* Image */}
          <div className="overflow-hidden rounded-2xl">
            <Image
              src={BookstoreImg}
              alt="GTBS Christian Bookstore"
              width={900}
              height={650}
              className="h-[380px] w-full object-cover transition-transform duration-700 hover:scale-105 sm:h-[460px]"
            />
          </div>

          {/* Content */}
          <div>
            {/* Main Heading */}
            <h2 className="title text-3xl font-semibold leading-tight text-gray-900 sm:text-4xl">
              Why Choose Our{" "}
              <span className="text-orange-600">Christian Bookstore?</span>
            </h2>

            {/* Description */}
            <p className="description mt-4 max-w-xl text-sm leading-6 text-gray-500 sm:text-[15px]">
              We are committed to providing quality Christian books, helpful
              resources, affordable prices, and a trusted shopping experience
              for every reader.
            </p>

            {/* Benefits */}
            <div className="mt-7 space-y-5">
              {benefits.map((benefit) => {
                const Icon = benefit.icon;

                return (
                  <div key={benefit.title} className="group flex gap-4">
                    {/* Icon */}
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-orange-50 text-orange-600 transition-all duration-300 group-hover:bg-orange-600 group-hover:text-white">
                      <Icon size={19} strokeWidth={1.8} />
                    </div>

                    {/* Text */}
                    <div>
                      <h3 className="title text-[17px] font-semibold text-gray-900 transition-colors duration-300 group-hover:text-orange-600">
                        {benefit.title}
                      </h3>

                      <p className="description mt-1 text-sm leading-5 text-gray-500">
                        {benefit.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhyChoose;
