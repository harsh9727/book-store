import type { Metadata } from "next";
import { cookies } from "next/headers";
import { notFound, redirect } from "next/navigation";

import AdminContentShell from "@/components/admin/AdminContentShell";
import AdminTestimonialForm from "@/components/admin/testimonial/AdminTestimonialForm";
import { ADMIN_SESSION_COOKIE, verifyAdminSession } from "@/lib/adminAuth";
import { getTestimonial } from "@/lib/contentRepository";

interface EditTestimonialPageProps {
  params: Promise<{ id: string }>;
}

export const metadata: Metadata = { title: "Edit Testimonial" };
export const dynamic = "force-dynamic";

export default async function EditTestimonialPage({
  params,
}: EditTestimonialPageProps) {
  const cookieStore = await cookies();
  if (!verifyAdminSession(cookieStore.get(ADMIN_SESSION_COOKIE)?.value)) {
    redirect("/admin/login");
  }

  const { id } = await params;
  const testimonial = await getTestimonial(id);
  if (!testimonial) notFound();

  return (
    <AdminContentShell
      active="testimonials"
      title="Edit testimonial"
      description="Update this bilingual homepage testimonial."
    >
      <AdminTestimonialForm initialItem={testimonial} />
    </AdminContentShell>
  );
}
