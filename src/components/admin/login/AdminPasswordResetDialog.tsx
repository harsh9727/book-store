"use client";

import {
  ArrowLeft,
  Check,
  CheckCircle2,
  KeyRound,
  LoaderCircle,
  LockKeyhole,
  Mail,
  ShieldCheck,
  X,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";

type ResetStep = "email" | "otp" | "password" | "success";

interface PasswordResetResponse {
  challengeId?: string;
  resetToken?: string;
  message?: string;
}

interface AdminPasswordResetDialogProps {
  initialEmail: string;
  onClose: () => void;
}

const steps = [
  { key: "email", label: "Email" },
  { key: "otp", label: "OTP" },
  { key: "password", label: "Password" },
] as const;

async function submitPasswordReset(body: object) {
  const response = await fetch("/api/admin/password-reset", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-GTBS-Admin-Request": "1",
    },
    body: JSON.stringify(body),
  });
  const result = (await response.json()) as PasswordResetResponse;
  if (!response.ok) {
    throw new Error(result.message || "Password recovery could not continue.");
  }
  return result;
}

export default function AdminPasswordResetDialog({
  initialEmail,
  onClose,
}: AdminPasswordResetDialogProps) {
  const dialogRef = useRef<HTMLElement>(null);
  const emailInputRef = useRef<HTMLInputElement>(null);
  const otpInputRef = useRef<HTMLInputElement>(null);
  const passwordInputRef = useRef<HTMLInputElement>(null);
  const [step, setStep] = useState<ResetStep>("email");
  const [email, setEmail] = useState(initialEmail);
  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [challengeId, setChallengeId] = useState("");
  const [resetToken, setResetToken] = useState("");
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const previouslyFocused = document.activeElement as HTMLElement | null;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    emailInputRef.current?.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
        return;
      }
      if (event.key !== "Tab" || !dialogRef.current) return;

      const focusable = Array.from(
        dialogRef.current.querySelectorAll<HTMLElement>(
          'button:not([disabled]), input:not([disabled]), [href], [tabindex]:not([tabindex="-1"])',
        ),
      );
      if (!focusable.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = previousOverflow;
      previouslyFocused?.focus();
    };
  }, [onClose]);

  useEffect(() => {
    if (step === "email") emailInputRef.current?.focus();
    if (step === "otp") otpInputRef.current?.focus();
    if (step === "password") passwordInputRef.current?.focus();
  }, [step]);

  const requestCode = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setBusy(true);
    setError("");
    setNotice("");

    try {
      const normalizedEmail = email.trim();
      const result = await submitPasswordReset({
        action: "request",
        email: normalizedEmail,
      });
      if (!result.challengeId) {
        throw new Error("Password recovery could not start.");
      }
      setEmail(normalizedEmail);
      setChallengeId(result.challengeId);
      setNotice(
        result.message ||
          "If this address matches the Admin account, a code has been sent.",
      );
      setStep("otp");
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : "Password recovery could not start.",
      );
    } finally {
      setBusy(false);
    }
  };

  const verifyCode = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setBusy(true);
    setError("");

    try {
      const result = await submitPasswordReset({
        action: "verify",
        email,
        challengeId,
        code,
      });
      if (!result.resetToken) {
        throw new Error("The verification code could not be confirmed.");
      }
      setResetToken(result.resetToken);
      setNotice("Email verified. Create a new password.");
      setStep("password");
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : "The verification code could not be confirmed.",
      );
    } finally {
      setBusy(false);
    }
  };

  const changePassword = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");

    if (newPassword.length < 12) {
      setError("Use at least 12 characters for the new password.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setError("The password confirmation does not match.");
      return;
    }

    setBusy(true);
    try {
      const result = await submitPasswordReset({
        action: "complete",
        email,
        challengeId,
        resetToken,
        newPassword,
      });
      setNewPassword("");
      setConfirmPassword("");
      setNotice(
        result.message || "Password changed. Sign in with the new password.",
      );
      setStep("success");
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : "The new password could not be saved.",
      );
    } finally {
      setBusy(false);
    }
  };

  const startAgain = () => {
    setStep("email");
    setCode("");
    setNewPassword("");
    setConfirmPassword("");
    setChallengeId("");
    setResetToken("");
    setNotice("");
    setError("");
  };

  const activeStepIndex =
    step === "success"
      ? steps.length
      : steps.findIndex((item) => item.key === step);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      role="presentation"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget && !busy) onClose();
      }}
    >
      <section
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="forgot-password-title"
        aria-describedby="forgot-password-description"
        className="w-full max-w-md rounded-xl border border-gray-200 bg-white p-6 shadow-2xl sm:p-7"
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2
              id="forgot-password-title"
              className="title text-xl font-bold text-gray-900"
            >
              Reset Admin password
            </h2>
            <p
              id="forgot-password-description"
              className="description mt-2 text-sm leading-6 text-gray-600"
            >
              Verify the Admin email before choosing a new password.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={busy}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-gray-500 hover:bg-gray-100 hover:text-gray-900 disabled:opacity-50"
            aria-label="Close password recovery"
            title="Close"
          >
            <X size={18} />
          </button>
        </div>

        {step !== "success" ? (
          <ol className="mt-6 grid grid-cols-3 gap-2" aria-label="Reset steps">
            {steps.map((item, index) => {
              const complete = index < activeStepIndex;
              const active = index === activeStepIndex;
              return (
                <li
                  key={item.key}
                  className={`flex min-w-0 items-center gap-2 rounded-lg px-2 py-2 text-xs font-semibold ${
                    active
                      ? "bg-orange-50 text-orange-700"
                      : complete
                        ? "bg-emerald-50 text-emerald-700"
                        : "bg-gray-50 text-gray-400"
                  }`}
                  aria-current={active ? "step" : undefined}
                >
                  <span
                    className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[10px] ${
                      active
                        ? "bg-orange-600 text-white"
                        : complete
                          ? "bg-emerald-600 text-white"
                          : "bg-gray-200 text-gray-500"
                    }`}
                  >
                    {complete ? <Check size={12} /> : index + 1}
                  </span>
                  <span className="truncate">{item.label}</span>
                </li>
              );
            })}
          </ol>
        ) : null}

        {notice && step !== "success" ? (
          <p
            id="password-reset-notice"
            role="status"
            className="mt-5 rounded-lg bg-blue-50 px-3.5 py-3 text-xs leading-5 text-blue-700"
          >
            {notice}
          </p>
        ) : null}
        {error ? (
          <p
            id="password-reset-error"
            role="alert"
            className="mt-5 rounded-lg bg-red-50 px-3.5 py-3 text-xs leading-5 text-red-700"
          >
            {error}
          </p>
        ) : null}

        {step === "email" ? (
          <form onSubmit={requestCode} className="mt-6">
            <label
              htmlFor="recovery-email"
              className="text-sm font-semibold text-gray-800"
            >
              Admin email address
            </label>
            <div className="relative mt-2">
              <Mail
                size={17}
                className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <input
                ref={emailInputRef}
                id="recovery-email"
                name="recoveryEmail"
                type="email"
                autoComplete="email"
                required
                maxLength={254}
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                aria-describedby={error ? "password-reset-error" : undefined}
                className="h-12 w-full rounded-lg border border-gray-300 pl-11 pr-4 text-sm outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
                placeholder="admin@example.com"
              />
            </div>
            <button
              type="submit"
              disabled={busy}
              className="mt-6 flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-orange-600 px-4 text-sm font-semibold text-white hover:bg-orange-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {busy ? (
                <LoaderCircle size={17} className="animate-spin" />
              ) : (
                <ShieldCheck size={17} />
              )}
              {busy ? "Sending code..." : "Send verification code"}
            </button>
          </form>
        ) : null}

        {step === "otp" ? (
          <form onSubmit={verifyCode} className="mt-6">
            <label
              htmlFor="recovery-code"
              className="text-sm font-semibold text-gray-800"
            >
              6-digit verification code
            </label>
            <div className="relative mt-2">
              <KeyRound
                size={17}
                className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <input
                ref={otpInputRef}
                id="recovery-code"
                name="recoveryCode"
                type="text"
                inputMode="numeric"
                autoComplete="one-time-code"
                pattern="[0-9]{6}"
                maxLength={6}
                required
                value={code}
                onChange={(event) =>
                  setCode(event.target.value.replace(/\D/gu, "").slice(0, 6))
                }
                aria-describedby={
                  error ? "password-reset-error" : "password-reset-notice"
                }
                className="h-12 w-full rounded-lg border border-gray-300 pl-11 pr-4 text-center text-lg font-bold tracking-[0.35em] outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
                placeholder="000000"
              />
            </div>
            <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row">
              <button
                type="button"
                onClick={startAgain}
                disabled={busy}
                className="inline-flex h-11 items-center justify-center gap-2 rounded-lg border border-gray-300 px-4 text-sm font-semibold text-gray-700 hover:bg-gray-50 disabled:opacity-60 sm:w-32"
              >
                <ArrowLeft size={16} /> Back
              </button>
              <button
                type="submit"
                disabled={busy || code.length !== 6}
                className="flex h-11 flex-1 items-center justify-center gap-2 rounded-lg bg-orange-600 px-4 text-sm font-semibold text-white hover:bg-orange-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {busy ? (
                  <LoaderCircle size={17} className="animate-spin" />
                ) : (
                  <ShieldCheck size={17} />
                )}
                {busy ? "Verifying..." : "Verify code"}
              </button>
            </div>
          </form>
        ) : null}

        {step === "password" ? (
          <form onSubmit={changePassword} className="mt-6 space-y-4">
            <div>
              <label
                htmlFor="new-admin-password"
                className="text-sm font-semibold text-gray-800"
              >
                New password
              </label>
              <div className="relative mt-2">
                <LockKeyhole
                  size={17}
                  className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
                />
                <input
                  ref={passwordInputRef}
                  id="new-admin-password"
                  name="newPassword"
                  type="password"
                  autoComplete="new-password"
                  minLength={12}
                  maxLength={128}
                  required
                  value={newPassword}
                  onChange={(event) => setNewPassword(event.target.value)}
                  aria-describedby={
                    error ? "password-reset-error" : "password-requirement"
                  }
                  className="h-12 w-full rounded-lg border border-gray-300 pl-11 pr-4 text-sm outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
                />
              </div>
              <p
                id="password-requirement"
                className="mt-1.5 text-xs text-gray-500"
              >
                Use at least 12 characters.
              </p>
            </div>
            <div>
              <label
                htmlFor="confirm-admin-password"
                className="text-sm font-semibold text-gray-800"
              >
                Confirm new password
              </label>
              <input
                id="confirm-admin-password"
                name="confirmPassword"
                type="password"
                autoComplete="new-password"
                minLength={12}
                maxLength={128}
                required
                value={confirmPassword}
                onChange={(event) => setConfirmPassword(event.target.value)}
                className="mt-2 h-12 w-full rounded-lg border border-gray-300 px-4 text-sm outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
              />
            </div>
            <div className="flex flex-col-reverse gap-2 pt-2 sm:flex-row">
              <button
                type="button"
                onClick={startAgain}
                disabled={busy}
                className="h-11 rounded-lg border border-gray-300 px-4 text-sm font-semibold text-gray-700 hover:bg-gray-50 disabled:opacity-60 sm:w-32"
              >
                Start again
              </button>
              <button
                type="submit"
                disabled={busy}
                className="flex h-11 flex-1 items-center justify-center gap-2 rounded-lg bg-orange-600 px-4 text-sm font-semibold text-white hover:bg-orange-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {busy ? (
                  <LoaderCircle size={17} className="animate-spin" />
                ) : (
                  <LockKeyhole size={17} />
                )}
                {busy ? "Saving..." : "Set new password"}
              </button>
            </div>
          </form>
        ) : null}

        {step === "success" ? (
          <div className="py-7 text-center">
            <CheckCircle2 className="mx-auto text-emerald-600" size={48} />
            <h3 className="mt-4 text-lg font-bold text-gray-900">
              Password changed
            </h3>
            <p
              role="status"
              className="mx-auto mt-2 max-w-sm text-sm leading-6 text-gray-600"
            >
              {notice}
            </p>
            <button
              type="button"
              onClick={onClose}
              className="mt-6 h-11 w-full rounded-lg bg-orange-600 px-4 text-sm font-semibold text-white hover:bg-orange-700"
            >
              Back to sign in
            </button>
          </div>
        ) : null}
      </section>
    </div>
  );
}
