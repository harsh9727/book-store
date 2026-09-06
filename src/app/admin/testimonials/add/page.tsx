import type { Metadata } from "next";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import AdminContentShell from "@/components/admin/AdminContentShell";
import AdminTestimonialForm from "@/components/admin/testimonial/AdminTestimonialForm";
import { ADMIN_SESSION_COOKIE, verifyAdminSession } from "@/lib/adminAuth";

export const metadata: Metadata = { title: "Add Testimonial" };

export default async function AddTestimonialPage() {
  const cookieStore = await cookies();
  if (!verifyAdminSession(cookieStore.get(ADMIN_SESSION_COOKIE)?.value)) {
    redirect("/admin/login");
  }

  return (
    <AdminContentShell
      title="Add testimonial"
      description="Create a new bilingual homepage testimonial."
    >
      <AdminTestimonialForm />
    </AdminContentShell>
  );
}
