"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

interface FaqItem {
  question: string;
  answer: string;
}

interface FaqProps {
  faqs: FaqItem[];
}

const Faq = ({ faqs }: FaqProps) => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <>
      {/* ================= FAQ SECTION ================= */}
        {/* Heading */}
        <div className="mb-6">

          <h2 className="title text-2xl font-semibold tracking-tight text-orange-600 md:text-[28px]">
            Frequently Asked Questions
          </h2>
        </div>

        {/* FAQ Items */}
        <div className="space-y-2.5">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;

            return (
              <div
                key={faq.question}
                className={`overflow-hidden rounded-xl border transition-all duration-300 ${isOpen
                    ? "border-orange-100 bg-orange-50/40"
                    : "border-gray-100 bg-[#fafafa] hover:border-gray-200 hover:bg-gray-50"
                  }`}
              >
                <button
                  type="button"
                  onClick={() =>
                    setOpenIndex(isOpen ? null : index)
                  }
                  className="flex w-full items-center justify-between gap-4 px-4 py-4 text-left"
                >
                  <span className="title text-sm font-medium text-gray-800 md:text-[15px]">
                    {faq.question}
                  </span>

                  <span
                    className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full transition-all duration-300 ${isOpen
                        ? "bg-orange-500 text-white"
                        : "bg-white text-gray-500 shadow-sm"
                      }`}
                  >
                    <ChevronDown
                      size={16}
                      className={`transition-transform duration-300 ${isOpen ? "rotate-180" : ""
                        }`}
                    />
                  </span>
                </button>

                <div
                  className={`grid transition-all duration-300 ${isOpen
                      ? "grid-rows-[1fr] opacity-100"
                      : "grid-rows-[0fr] opacity-0"
                    }`}
                >
                  <div className="overflow-hidden">
                    <p className="description px-4 pb-4 pr-12 text-sm leading-6 text-gray-500">
                      {faq.answer}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
    </>
  );
};

export default Faq;