"use client";

import Link from "next/link";
import { FaWhatsapp } from "react-icons/fa6";

export default function WhatsAppButton() {
  const phoneNumber = "917490028867";
  const defaultMessage = encodeURIComponent(
    "Hello ProBooks! I would like to inquire about books and orders."
  );
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${defaultMessage}`;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex items-center group">
      {/* Tooltip on hover */}
      <span className="pointer-events-none absolute right-16 hidden rounded-lg bg-gray-900/90 px-3 py-1.5 text-xs font-semibold text-white shadow-md backdrop-blur-sm transition-all duration-200 group-hover:block whitespace-nowrap">
        Chat with us on WhatsApp
      </span>

      {/* Pulsing ring */}
      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-40" />

      {/* WhatsApp Button */}
      <Link
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat on WhatsApp with +91 7490028867"
        className="relative flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-xl shadow-emerald-600/30 transition-all duration-300 hover:scale-110 hover:bg-[#20bd5a] hover:shadow-2xl active:scale-95"
      >
        <FaWhatsapp className="h-8 w-8 drop-shadow-sm" />
      </Link>
    </div>
  );
}
