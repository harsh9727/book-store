"use client";

import { Mail, ArrowRight } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

interface NewsletterProps {
  title: string;
  description?: string;
}

const Newsletter = ({ title, description }: NewsletterProps) => {
  const { t } = useLanguage();
  const subscriptionEmail =
    "mailto:gtbs-1852@yahoo.in?subject=GTBS%20newsletter%20subscription";

  return (
    <section className="bg-white py-10 md:py-12">
      <div className="container px-3 lg:px-6">
        <div className="relative overflow-hidden rounded-2xl bg-orange-50 px-6 py-8 sm:px-8 md:px-10">
          {/* Decorative Circle */}
          <div className="absolute -right-16 -top-16 h-40 w-40 rounded-full bg-orange-600/5" />
          <div className="absolute -bottom-20 left-1/3 h-40 w-40 rounded-full bg-orange-600/5" />

          <div className="relative flex flex-col items-center gap-7 lg:flex-row lg:justify-between">
            {/* Left Content */}
            <div className="flex items-center gap-4 text-center sm:text-left">
              {/* Mail Icon */}
              <div className="hidden h-14 w-14 shrink-0 items-center justify-center rounded-full bg-white text-orange-600 shadow-sm sm:flex">
                <Mail size={25} strokeWidth={1.7} />
              </div>

              <div>
                <h2 className="title text-2xl font-semibold text-gray-900 sm:text-3xl">
                  {title}
                </h2>

                {description && (
                  <p className="description mt-1.5 text-sm text-gray-500 sm:text-[15px]">
                    {description}
                  </p>
                )}
              </div>
            </div>

            <a
              href={subscriptionEmail}
              className="description group flex h-12 w-full max-w-xs items-center justify-center gap-2 rounded-xl bg-orange-600 px-7 text-sm font-medium text-white transition-all duration-300 hover:bg-orange-700 hover:shadow-lg hover:shadow-orange-600/20"
            >
                {t("common.newsletterRequest")}
                <ArrowRight
                  size={16}
                  className="transition-transform duration-300 group-hover:translate-x-1"
                />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Newsletter;
