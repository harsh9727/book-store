"use client";

import Link from "next/link";
import { UserPlus, Mail, Lock, User, ArrowRight } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.info(
      "Customer registration will be available soon. For book inquiries or instant orders, please contact us via WhatsApp!",
    );
  };

  return (
    <div className="min-h-[75vh] bg-gradient-to-b from-orange-50/40 via-white to-white py-12 md:py-16">
      <div className="container mx-auto px-4 lg:px-6">
        <div className="max-w-md mx-auto">
          {/* Header */}
          <div className="mb-8 text-center">
            <div className="inline-flex items-center gap-1.5 rounded-full bg-orange-100/80 px-3.5 py-1 text-xs font-semibold text-orange-700 mb-3">
              <UserPlus size={14} />
              <span>Join GTBS Readers</span>
            </div>
            <h1 className="title text-3xl font-extrabold text-gray-900 tracking-tight">
              Create an Account
            </h1>
            <p className="description mt-2 text-sm text-gray-600">
              Join our reading community for personalized recommendations
            </p>
          </div>

          {/* Form Card */}
          <div className="rounded-3xl border border-gray-200/80 bg-white p-7 sm:p-9 shadow-sm">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-gray-700 mb-1.5">
                  Full Name
                </label>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Your Name"
                    required
                    className="h-11 w-full rounded-xl border border-gray-300 pl-10 pr-4 text-sm outline-none transition focus:border-orange-600 focus:ring-1 focus:ring-orange-600"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-gray-700 mb-1.5">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    required
                    className="h-11 w-full rounded-xl border border-gray-300 pl-10 pr-4 text-sm outline-none transition focus:border-orange-600 focus:ring-1 focus:ring-orange-600"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-gray-700 mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Create a strong password"
                    required
                    className="h-11 w-full rounded-xl border border-gray-300 pl-10 pr-4 text-sm outline-none transition focus:border-orange-600 focus:ring-1 focus:ring-orange-600"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full mt-2 inline-flex items-center justify-center gap-2 rounded-xl bg-orange-600 py-3 px-4 text-sm font-semibold text-white shadow-sm transition-all duration-300 hover:bg-orange-700 hover:shadow-lg hover:shadow-orange-600/20 active:scale-95"
              >
                <span>Create Account</span>
                <ArrowRight size={16} />
              </button>
            </form>

            <div className="mt-6 pt-6 border-t border-gray-100 text-center text-xs text-gray-600">
              <span>Already have an account? </span>
              <Link
                href="/login"
                className="font-semibold text-orange-600 hover:underline"
              >
                Sign In
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
