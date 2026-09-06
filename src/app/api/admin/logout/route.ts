import { NextResponse } from "next/server";
import { ADMIN_SESSION_COOKIE } from "@/lib/adminAuth";
import { isTrustedAdminMutation } from "@/lib/adminRequestSecurity";

export async function POST(request: Request) {
  if (!isTrustedAdminMutation(request)) {
    return NextResponse.json(
      { message: "Request could not be verified." },
      { status: 403, headers: { "Cache-Control": "no-store" } },
    );
  }

  const response = NextResponse.json(
    { success: true },
    { headers: { "Cache-Control": "no-store" } },
  );
  response.cookies.set({
    name: ADMIN_SESSION_COOKIE,
    value: "",
    expires: new Date(0),
    httpOnly: true,
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production",
    priority: "high",
    path: "/",
  });
  return response;
}
