import { createHash } from "node:crypto";

export const ADMIN_REQUEST_HEADER = "x-gtbs-admin-request";
export const ADMIN_REQUEST_HEADER_VALUE = "1";

function getExpectedOrigin(request: Request) {
  if (process.env.NODE_ENV === "production") {
    try {
      return new URL(process.env.NEXT_PUBLIC_SITE_URL || "").origin;
    } catch {
      return null;
    }
  }

  return new URL(request.url).origin;
}

export function isTrustedAdminMutation(request: Request) {
  const origin = request.headers.get("origin");
  const expectedOrigin = getExpectedOrigin(request);
  const fetchSite = request.headers.get("sec-fetch-site");

  return (
    request.headers.get(ADMIN_REQUEST_HEADER) === ADMIN_REQUEST_HEADER_VALUE &&
    Boolean(origin && expectedOrigin && origin === expectedOrigin) &&
    (!fetchSite || fetchSite === "same-origin")
  );
}

export function getAdminClientIdentifier(request: Request) {
  const trustProxy = process.env.ADMIN_TRUST_PROXY === "true";
  const forwardedAddress = trustProxy
    ? request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      request.headers.get("cf-connecting-ip")?.trim()
    : null;
  const identifier = forwardedAddress || "shared-untrusted-proxy";

  return createHash("sha256").update(identifier).digest("base64url");
}
