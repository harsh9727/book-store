import type { Metadata } from "next";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import AdminLoginForm from "@/components/admin/login/AdminLoginForm";
import {
  ADMIN_SESSION_COOKIE,
  isAdminMfaRequired,
  verifyAdminSession,
} from "@/lib/adminAuth";
import { siteConfig } from "@/lib/seo";

export const metadata: Metadata = {
  title: { absolute: `Admin Login | ${siteConfig.name}` },
  description: "Secure administrator login for Gujarat Tract Book Store.",
};

export default async function AdminLoginPage() {
  const cookieStore = await cookies();
  const session = verifyAdminSession(
    cookieStore.get(ADMIN_SESSION_COOKIE)?.value,
  );

  if (session) {
    redirect("/admin/dashboard");
  }

  return <AdminLoginForm mfaRequired={isAdminMfaRequired()} />;
}
