"use client";

import Link from "next/link";
import { AlertTriangle, RefreshCw } from "lucide-react";

export default function ErrorPage({ reset }: { reset: () => void }) {
  return (
    <div className="container mx-auto flex min-h-[60vh] items-center justify-center px-4 py-16 text-center">
      <div className="max-w-lg rounded-3xl border border-gray-200 bg-white p-8 shadow-sm sm:p-10">
        <AlertTriangle aria-hidden="true" className="mx-auto h-10 w-10 text-orange-600" />
        <h1 className="title mt-4 text-3xl font-bold text-gray-900">
          Something Went Wrong
        </h1>
        <p className="description mt-3 text-sm leading-6 text-gray-600">
          We could not load this page. Please try again, or return to the storefront.
        </p>
        <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
          <button
            type="button"
            onClick={reset}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-orange-600 px-5 py-3 text-sm font-semibold text-white hover:bg-orange-700"
          >
            <RefreshCw size={16} />
            Try again
          </button>
          <Link
            href="/"
            className="inline-flex items-center justify-center rounded-xl border border-gray-200 px-5 py-3 text-sm font-semibold text-gray-700 hover:border-orange-300 hover:text-orange-700"
          >
            Return home
          </Link>
        </div>
      </div>
    </div>
  );
}
