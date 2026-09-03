import type { Metadata } from "next";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import AdminContentShell from "@/components/admin/AdminContentShell";
import AdminTeamMemberForm from "@/components/admin/team/AdminTeamMemberForm";
import { ADMIN_SESSION_COOKIE, verifyAdminSession } from "@/lib/adminAuth";

export const metadata: Metadata = { title: "Add Team Member" };
export const dynamic = "force-dynamic";

export default async function AddTeamMemberPage() {
  const cookieStore = await cookies();
  if (!verifyAdminSession(cookieStore.get(ADMIN_SESSION_COOKIE)?.value)) {
    redirect("/admin/login");
  }

  return (
    <AdminContentShell
      active="team"
      title="Add team member"
      description="Create an English and Gujarati team profile."
    >
      <AdminTeamMemberForm />
    </AdminContentShell>
  );
}
