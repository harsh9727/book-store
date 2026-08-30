import { NextResponse } from "next/server";
import {
  ADMIN_SESSION_COOKIE,
  createAdminSession,
  isAdminAuthConfigured,
  validateAdminCredentials,
} from "@/lib/adminAuth";

const SESSION_HOURS = 8;
const REMEMBERED_SESSION_DAYS = 30;

export async function POST(request: Request) {
  if (!isAdminAuthConfigured()) {
    return NextResponse.json(
      { message: "Admin login is not configured on the server." },
      { status: 503 }
    );
  }

  const body = (await request.json()) as {
    email?: string;
    password?: string;
    rememberMe?: boolean;
  };
  const email = body.email?.trim() || "";
  const password = body.password || "";

  if (!validateAdminCredentials(email, password)) {
    return NextResponse.json(
      { message: "The email or password is incorrect." },
      { status: 401 }
    );
  }

  const sessionDuration = body.rememberMe
    ? REMEMBERED_SESSION_DAYS * 24 * 60 * 60 * 1000
    : SESSION_HOURS * 60 * 60 * 1000;
  const expiresAt = Date.now() + sessionDuration;
  const response = NextResponse.json({ success: true });

  response.cookies.set({
    name: ADMIN_SESSION_COOKIE,
    value: createAdminSession(email, expiresAt),
    httpOnly: true,
    sameSite: "strict",
    secure:
      process.env.NODE_ENV === "production" &&
      process.env.NEXT_PUBLIC_SITE_URL?.startsWith("https://") === true,
    path: "/",
    ...(body.rememberMe
      ? { maxAge: REMEMBERED_SESSION_DAYS * 24 * 60 * 60 }
      : {}),
  });

  return response;
}
