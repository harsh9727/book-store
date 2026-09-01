import type { NextRequest } from "next/server";

import { ADMIN_SESSION_COOKIE, verifyAdminSession } from "@/lib/adminAuth";
import { isTrustedAdminMutation } from "@/lib/adminRequestSecurity";

export function verifyAdminApiRequest(request: NextRequest) {
  if (!isTrustedAdminMutation(request)) return null;
  return verifyAdminSession(request.cookies.get(ADMIN_SESSION_COOKIE)?.value);
}
