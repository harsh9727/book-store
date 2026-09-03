import assert from "node:assert/strict";
import { createHmac, randomBytes } from "node:crypto";
import test, { after, before } from "node:test";
import {
  createAdminPasswordHash,
  createAdminSession,
  getAdminAuthConfigurationIssues,
  validateAdminCredentials,
  verifyAdminSession,
} from "../src/lib/adminAuth.ts";
import {
  clearAdminLoginFailures,
  getAdminLoginLimit,
  recordAdminLoginFailure,
  resetAdminLoginRateLimitForTests,
} from "../src/lib/adminRateLimit.ts";
import {
  ADMIN_REQUEST_HEADER,
  ADMIN_REQUEST_HEADER_VALUE,
  isTrustedAdminMutation,
} from "../src/lib/adminRequestSecurity.ts";

const originalEnvironment = { ...process.env };

function currentTotpForTest() {
  const counterBuffer = Buffer.alloc(8);
  counterBuffer.writeBigUInt64BE(BigInt(Math.floor(Date.now() / 30_000)));
  const digest = createHmac("sha1", Buffer.from("12345678901234567890"))
    .update(counterBuffer)
    .digest();
  const offset = digest[digest.length - 1] & 0x0f;
  const code =
    (((digest[offset] & 0x7f) << 24) |
      ((digest[offset + 1] & 0xff) << 16) |
      ((digest[offset + 2] & 0xff) << 8) |
      (digest[offset + 3] & 0xff)) %
    1_000_000;
  return code.toString().padStart(6, "0");
}

before(async () => {
  Reflect.set(process.env, "NODE_ENV", "test");
  process.env.ADMIN_EMAIL = "admin@example.com";
  process.env.ADMIN_PASSWORD_HASH = await createAdminPasswordHash(
    "correct-horse-battery-staple",
    randomBytes(16),
  );
  process.env.ADMIN_SESSION_SECRET =
    "test-session-secret-that-is-longer-than-32-characters";
  process.env.ADMIN_SESSION_VERSION = "1";
  process.env.ADMIN_REQUIRE_MFA = "false";
  process.env.NEXT_PUBLIC_SITE_URL = "https://www.example.com";
  delete process.env.ADMIN_PASSWORD;
  delete process.env.ADMIN_TOTP_SECRET;
});

after(() => {
  for (const key of Object.keys(process.env)) {
    if (!(key in originalEnvironment)) delete process.env[key];
  }
  Object.assign(process.env, originalEnvironment);
});

test("validates a scrypt password hash without accepting wrong credentials", async () => {
  assert.equal(getAdminAuthConfigurationIssues().length, 0);
  assert.equal(
    await validateAdminCredentials(
      " ADMIN@example.com ",
      "correct-horse-battery-staple",
    ),
    true,
  );
  assert.equal(
    await validateAdminCredentials("admin@example.com", "incorrect-password"),
    false,
  );
  assert.equal(
    await validateAdminCredentials(
      "other@example.com",
      "correct-horse-battery-staple",
    ),
    false,
  );
});

test("rejects weak production configuration", () => {
  const previousSecret = process.env.ADMIN_SESSION_SECRET;
  process.env.ADMIN_SESSION_SECRET = "short";
  assert.match(getAdminAuthConfigurationIssues().join(" "), /at least 32/u);
  process.env.ADMIN_SESSION_SECRET = previousSecret;
});

test("requires a password hash and MFA in production", () => {
  const passwordHash = process.env.ADMIN_PASSWORD_HASH;
  Reflect.set(process.env, "NODE_ENV", "production");
  delete process.env.ADMIN_PASSWORD_HASH;
  process.env.ADMIN_PASSWORD = "plaintext-must-not-work";
  process.env.ADMIN_REQUIRE_MFA = "false";
  process.env.NEXT_PUBLIC_SITE_URL = "http://www.example.com";

  const issues = getAdminAuthConfigurationIssues().join(" ");
  assert.match(issues, /ADMIN_PASSWORD_HASH/u);
  assert.match(issues, /ADMIN_REQUIRE_MFA/u);
  assert.match(issues, /HTTPS/u);

  Reflect.set(process.env, "NODE_ENV", "test");
  process.env.ADMIN_PASSWORD_HASH = passwordHash;
  delete process.env.ADMIN_PASSWORD;
  process.env.NEXT_PUBLIC_SITE_URL = "https://www.example.com";
});

test("verifies a six-digit TOTP code when MFA is enabled", async () => {
  process.env.ADMIN_REQUIRE_MFA = "true";
  process.env.ADMIN_TOTP_SECRET = "GEZDGNBVGY3TQOJQGEZDGNBVGY3TQOJQ";

  assert.equal(
    await validateAdminCredentials(
      "admin@example.com",
      "correct-horse-battery-staple",
      currentTotpForTest(),
    ),
    true,
  );
  assert.equal(
    await validateAdminCredentials(
      "admin@example.com",
      "correct-horse-battery-staple",
      "000000",
    ),
    false,
  );

  process.env.ADMIN_REQUIRE_MFA = "false";
  delete process.env.ADMIN_TOTP_SECRET;
});

test("signs, verifies, expires, tampers, and globally rotates sessions", () => {
  const session = createAdminSession("admin@example.com", Date.now() + 60_000);
  assert.equal(verifyAdminSession(session)?.email, "admin@example.com");
  assert.equal(verifyAdminSession(`${session}tampered`), null);

  process.env.ADMIN_SESSION_VERSION = "2";
  assert.equal(verifyAdminSession(session), null);
  process.env.ADMIN_SESSION_VERSION = "1";
});

test("locks a client/account pair after five failures and permits explicit reset", () => {
  resetAdminLoginRateLimitForTests();
  const now = 1_000_000;
  for (let attempt = 0; attempt < 4; attempt += 1) {
    assert.equal(
      recordAdminLoginFailure("client-a", "admin@example.com", now).allowed,
      true,
    );
  }
  const locked = recordAdminLoginFailure("client-a", "admin@example.com", now);
  assert.equal(locked.allowed, false);
  assert.equal(locked.retryAfterSeconds, 900);
  assert.equal(
    getAdminLoginLimit("client-a", "admin@example.com", now).allowed,
    false,
  );

  clearAdminLoginFailures("client-a", "admin@example.com");
  assert.equal(
    getAdminLoginLimit("client-a", "admin@example.com", now).allowed,
    true,
  );
});

test("requires a matching origin and explicit admin mutation header", () => {
  const trustedRequest = new Request("http://localhost:3000/api/admin/logout", {
    method: "POST",
    headers: {
      Origin: "http://localhost:3000",
      "Sec-Fetch-Site": "same-origin",
      [ADMIN_REQUEST_HEADER]: ADMIN_REQUEST_HEADER_VALUE,
    },
  });
  assert.equal(isTrustedAdminMutation(trustedRequest), true);

  const crossOriginRequest = new Request(
    "http://localhost:3000/api/admin/logout",
    {
      method: "POST",
      headers: {
        Origin: "https://attacker.example",
        [ADMIN_REQUEST_HEADER]: ADMIN_REQUEST_HEADER_VALUE,
      },
    },
  );
  assert.equal(isTrustedAdminMutation(crossOriginRequest), false);
});
