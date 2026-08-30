"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Eye,
  EyeOff,
  KeyRound,
  LoaderCircle,
  LockKeyhole,
  Mail,
  ShieldCheck,
  X,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";

const REMEMBERED_EMAIL_KEY = "gtbs-admin-email";

export default function AdminLoginForm() {
  const router = useRouter();
  const emailInputRef = useRef<HTMLInputElement>(null);
  const rememberMeInputRef = useRef<HTMLInputElement>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serverError, setServerError] = useState("");
  const [fieldErrors, setFieldErrors] = useState<{
    email?: string;
    password?: string;
  }>({});
  const [isForgotOpen, setIsForgotOpen] = useState(false);
  const [recoveryEmail, setRecoveryEmail] = useState("");

  useEffect(() => {
    const savedEmail = window.localStorage.getItem(REMEMBERED_EMAIL_KEY) || "";

    if (emailInputRef.current) {
      emailInputRef.current.value = savedEmail;
    }

    if (rememberMeInputRef.current) {
      rememberMeInputRef.current.checked = Boolean(savedEmail);
    }
  }, []);

  const handleLogin = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setServerError("");

    const formData = new FormData(event.currentTarget);
    const email = String(formData.get("email") || "").trim();
    const password = String(formData.get("password") || "");
    const rememberMe = formData.get("rememberMe") === "on";
    const nextErrors: { email?: string; password?: string } = {};

    if (!/^\S+@\S+\.\S+$/.test(email)) {
      nextErrors.email = "Enter a valid admin email address.";
    }

    if (!password) {
      nextErrors.password = "Enter your admin password.";
    }

    setFieldErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, rememberMe }),
      });
      const result = (await response.json()) as { message?: string };

      if (!response.ok) {
        setServerError(result.message || "Unable to sign in. Please try again.");
        return;
      }

      if (rememberMe) {
        window.localStorage.setItem(REMEMBERED_EMAIL_KEY, email);
      } else {
        window.localStorage.removeItem(REMEMBERED_EMAIL_KEY);
      }
      router.replace("/admin/dashboard");
      router.refresh();
    } catch {
      setServerError("Unable to reach the server. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRecoveryRequest = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const email = String(formData.get("recoveryEmail") || "").trim();
    const subject = encodeURIComponent("Admin password recovery request");
    const body = encodeURIComponent(
      `Please help me reset access to the GTBS admin account associated with ${email}.`
    );

    window.location.href = `mailto:gtbs-1852@yahoo.in?subject=${subject}&body=${body}`;
    setIsForgotOpen(false);
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-center px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid w-full max-w-5xl overflow-hidden rounded-lg border border-gray-200 bg-white shadow-xl lg:grid-cols-[0.9fr_1.1fr]">
          <section className="hidden bg-gray-950 p-10 text-white lg:flex lg:flex-col lg:justify-between">
            <div>
              <Image
                src="/images/logo/logo.webp"
                alt="GTBS Book Store"
                width={88}
                height={88}
                priority
                className="h-20 w-20 object-contain"
              />
              <p className="mt-8 text-xs font-semibold uppercase text-orange-400">
                GTBS Administration
              </p>
              <h1 className="title mt-3 text-3xl font-bold leading-tight">
                Secure bookstore management access
              </h1>
              <p className="description mt-4 max-w-sm text-sm leading-7 text-gray-300">
                Sign in to manage catalog content, orders, customers, and bookstore operations.
              </p>
            </div>
            <div className="flex items-center gap-2 border-t border-white/10 pt-6 text-xs text-gray-400">
              <ShieldCheck size={16} className="text-orange-400" />
              Authorized administrators only
            </div>
          </section>

          <section className="p-6 sm:p-10 lg:p-12">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-sm font-medium text-gray-500 transition-colors hover:text-orange-600"
            >
              <ArrowLeft size={16} />
              Back to store
            </Link>

            <div className="mt-9">
              <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-orange-50 text-orange-600">
                <LockKeyhole size={21} />
              </span>
              <h2 className="title mt-5 text-3xl font-bold text-gray-900">Admin login</h2>
              <p className="description mt-2 text-sm leading-6 text-gray-600">
                Enter your administrator credentials to continue.
              </p>
            </div>

            <form onSubmit={handleLogin} noValidate className="mt-8 space-y-5">
              {serverError && (
                <div
                  role="alert"
                  className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
                >
                  {serverError}
                </div>
              )}

              <div>
                <label htmlFor="admin-email" className="text-sm font-semibold text-gray-800">
                  Email address
                </label>
                <div className="relative mt-2">
                  <Mail
                    size={17}
                    className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
                  />
                  <input
                    ref={emailInputRef}
                    id="admin-email"
                    name="email"
                    type="email"
                    autoComplete="username"
                    aria-invalid={Boolean(fieldErrors.email)}
                    aria-describedby={fieldErrors.email ? "admin-email-error" : undefined}
                    className="h-12 w-full rounded-lg border border-gray-300 bg-white pl-11 pr-4 text-sm text-gray-900 outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
                    placeholder="admin@example.com"
                  />
                </div>
                {fieldErrors.email && (
                  <p id="admin-email-error" className="mt-1.5 text-xs text-red-600">
                    {fieldErrors.email}
                  </p>
                )}
              </div>

              <div>
                <div className="flex items-center justify-between gap-4">
                  <label htmlFor="admin-password" className="text-sm font-semibold text-gray-800">
                    Password
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      setRecoveryEmail(emailInputRef.current?.value || "");
                      setIsForgotOpen(true);
                    }}
                    className="text-xs font-semibold text-orange-600 hover:text-orange-700 hover:underline"
                  >
                    Forgot password?
                  </button>
                </div>
                <div className="relative mt-2">
                  <KeyRound
                    size={17}
                    className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
                  />
                  <input
                    id="admin-password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    aria-invalid={Boolean(fieldErrors.password)}
                    aria-describedby={fieldErrors.password ? "admin-password-error" : undefined}
                    className="h-12 w-full rounded-lg border border-gray-300 bg-white pl-11 pr-12 text-sm text-gray-900 outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
                    placeholder="Enter your password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((visible) => !visible)}
                    className="absolute right-2 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-lg text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-800"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                    title={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {fieldErrors.password && (
                  <p id="admin-password-error" className="mt-1.5 text-xs text-red-600">
                    {fieldErrors.password}
                  </p>
                )}
              </div>

              <label className="flex w-fit cursor-pointer items-center gap-2.5 text-sm text-gray-700">
                <input
                  ref={rememberMeInputRef}
                  type="checkbox"
                  name="rememberMe"
                  className="h-4 w-4 rounded border-gray-300 accent-orange-600"
                />
                Remember me
              </label>

              <button
                type="submit"
                disabled={isSubmitting}
                className="flex h-12 w-full items-center justify-center gap-2 rounded-lg bg-orange-600 px-5 text-sm font-bold text-white transition-colors hover:bg-orange-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isSubmitting ? (
                  <LoaderCircle size={18} className="animate-spin" />
                ) : (
                  <LockKeyhole size={18} />
                )}
                {isSubmitting ? "Signing in..." : "Sign in"}
              </button>
            </form>
          </section>
        </div>
      </div>

      {isForgotOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          role="presentation"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              setIsForgotOpen(false);
            }
          }}
        >
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="forgot-password-title"
            className="w-full max-w-md rounded-lg border border-gray-200 bg-white p-6 shadow-2xl"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 id="forgot-password-title" className="title text-xl font-bold text-gray-900">
                  Forgot password?
                </h2>
                <p className="description mt-2 text-sm leading-6 text-gray-600">
                  Send a recovery request to the GTBS account owner.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsForgotOpen(false)}
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-gray-500 hover:bg-gray-100 hover:text-gray-900"
                aria-label="Close password recovery"
                title="Close"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleRecoveryRequest} className="mt-6">
              <label htmlFor="recovery-email" className="text-sm font-semibold text-gray-800">
                Admin email address
              </label>
              <input
                id="recovery-email"
                name="recoveryEmail"
                type="email"
                required
                value={recoveryEmail}
                onChange={(event) => setRecoveryEmail(event.target.value)}
                className="mt-2 h-11 w-full rounded-lg border border-gray-300 px-3.5 text-sm outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
                placeholder="admin@example.com"
              />
              <div className="mt-6 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsForgotOpen(false)}
                  className="h-10 rounded-lg border border-gray-300 px-4 text-sm font-semibold text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="h-10 rounded-lg bg-orange-600 px-4 text-sm font-semibold text-white hover:bg-orange-700"
                >
                  Request reset
                </button>
              </div>
            </form>
          </section>
        </div>
      )}
    </div>
  );
}
