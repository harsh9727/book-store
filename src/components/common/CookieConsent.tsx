"use client";

import Link from "next/link";
import { Cookie, ShieldCheck, X } from "lucide-react";
import { useSyncExternalStore } from "react";
import {
  getCookieConsentSnapshot,
  saveCookieConsent,
  subscribeToCookieConsent,
} from "@/lib/cookieConsent";

export default function CookieConsent() {
  const consent = useSyncExternalStore(
    subscribeToCookieConsent,
    getCookieConsentSnapshot,
    () => null
  );

  if (consent) {
    return null;
  }

  return (
    <section
      role="dialog"
      aria-modal="false"
      aria-labelledby="cookie-consent-title"
      aria-describedby="cookie-consent-description"
      className="fixed inset-x-3 bottom-3 z-[200] mx-auto max-w-4xl overflow-hidden rounded-lg border border-gray-200 bg-white shadow-2xl sm:bottom-5"
    >
      <div className="flex flex-col gap-5 p-5 sm:p-6 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex max-w-2xl items-start gap-3.5">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-orange-50 text-orange-600">
            <Cookie size={20} />
          </span>
          <div>
            <h2
              id="cookie-consent-title"
              className="title text-lg font-bold text-gray-900"
            >
              Cookie preferences
            </h2>
            <p
              id="cookie-consent-description"
              className="description mt-1.5 text-sm leading-6 text-gray-600"
            >
              We use essential cookies to remember your choices. Optional functional
              cookies enable full-site Gujarati translation through Google Translate.
              Read our{" "}
              <Link
                href="/privacy-policy"
                className="font-semibold text-orange-600 underline underline-offset-2 hover:text-orange-700"
              >
                Privacy Policy
              </Link>
              .
            </p>
          </div>
        </div>

        <div className="flex shrink-0 flex-col gap-2 sm:flex-row lg:justify-end">
          <button
            type="button"
            onClick={() => saveCookieConsent("essential")}
            className="inline-flex h-10 items-center justify-center gap-2 rounded-lg border border-gray-300 px-4 text-sm font-semibold text-gray-700 transition-colors hover:border-gray-400 hover:bg-gray-50"
          >
            <X size={16} />
            Essential only
          </button>
          <button
            type="button"
            onClick={() => saveCookieConsent("functional")}
            className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-orange-600 px-4 text-sm font-semibold text-white transition-colors hover:bg-orange-700"
          >
            <ShieldCheck size={16} />
            Allow functional cookies
          </button>
        </div>
      </div>
    </section>
  );
}
