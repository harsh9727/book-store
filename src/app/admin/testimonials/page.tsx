import type { Metadata } from "next";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import AdminContentShell from "@/components/admin/AdminContentShell";
import AdminTestimonialManager from "@/components/admin/testimonial/AdminTestimonialManager";
import { ADMIN_SESSION_COOKIE, verifyAdminSession } from "@/lib/adminAuth";
import { getTestimonials } from "@/lib/contentRepository";

export const metadata: Metadata = { title: "Manage Testimonials" };
export const dynamic = "force-dynamic";

export default async function AdminTestimonialsPage() {
  const cookieStore = await cookies();
  if (!verifyAdminSession(cookieStore.get(ADMIN_SESSION_COOKIE)?.value)) {
    redirect("/admin/login");
  }

  return (
    <AdminContentShell
      title="Testimonial management"
      description="Manage bilingual customer testimonials shown on the homepage."
    >
      <AdminTestimonialManager initialItems={await getTestimonials()} />
    </AdminContentShell>
  );
}
