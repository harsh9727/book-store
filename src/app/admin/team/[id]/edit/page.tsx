import type { Metadata } from "next";
import { cookies } from "next/headers";
import { notFound, redirect } from "next/navigation";

import AdminContentShell from "@/components/admin/AdminContentShell";
import AdminTeamMemberForm from "@/components/admin/team/AdminTeamMemberForm";
import { ADMIN_SESSION_COOKIE, verifyAdminSession } from "@/lib/adminAuth";
import { getTeamMember } from "@/lib/contentRepository";

export const metadata: Metadata = { title: "Edit Team Member" };
export const dynamic = "force-dynamic";

export default async function EditTeamMemberPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const cookieStore = await cookies();
  if (!verifyAdminSession(cookieStore.get(ADMIN_SESSION_COOKIE)?.value)) {
    redirect("/admin/login");
  }

  const { id } = await params;
  const teamMember = await getTeamMember(decodeURIComponent(id));
  if (!teamMember) notFound();

  return (
    <AdminContentShell
      title="Edit team member"
      description="Update the shared image and bilingual profile details."
    >
      <AdminTeamMemberForm initialItem={teamMember} />
    </AdminContentShell>
  );
}
