"use client";

import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function AdminLogoutButton() {
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    await fetch("/api/admin/logout", { method: "POST" });
    router.replace("/admin/login");
    router.refresh();
  };

  return (
    <button
      type="button"
      onClick={handleLogout}
      disabled={isLoggingOut}
      aria-label={isLoggingOut ? "Signing out" : "Sign out"}
      className="inline-flex h-10 w-10 items-center justify-center gap-2 rounded-xl border border-gray-300 text-sm font-semibold text-gray-700 transition-colors hover:border-red-200 hover:bg-red-50 hover:text-red-600 disabled:opacity-60 sm:w-auto sm:px-4"
    >
      <LogOut size={16} />
      <span className="hidden sm:inline">{isLoggingOut ? "Signing out..." : "Sign out"}</span>
    </button>
  );
}
