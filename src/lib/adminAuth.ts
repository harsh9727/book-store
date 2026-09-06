import {
  createHmac,
  randomBytes,
  randomUUID,
  scrypt as nodeScrypt,
  timingSafeEqual,
} from "node:crypto";

import {
  readAdminCredentialOverride,
  writeAdminCredentialOverride,
} from "./adminCredentialStore.ts";

const SCRYPT_COST = 32_768;
const SCRYPT_BLOCK_SIZE = 8;
const SCRYPT_PARALLELIZATION = 1;
const SCRYPT_KEY_LENGTH = 64;
const SCRYPT_MAX_MEMORY = 64 * 1024 * 1024;
const MAX_SESSION_AGE_MS = 30 * 24 * 60 * 60 * 1000;
const CLOCK_SKEW_MS = 5 * 60 * 1000;

function deriveScryptKey(password: string, salt: Buffer) {
  return new Promise<Buffer>((resolve, reject) => {
    nodeScrypt(
      password,
      salt,
      SCRYPT_KEY_LENGTH,
      {
        cost: SCRYPT_COST,
        blockSize: SCRYPT_BLOCK_SIZE,
        parallelization: SCRYPT_PARALLELIZATION,
        maxmem: SCRYPT_MAX_MEMORY,
      },
      (error, derivedKey) => {
        if (error) reject(error);
        else resolve(derivedKey);
      },
    );
  });
}

export const ADMIN_SESSION_COOKIE =
  process.env.NODE_ENV === "production"
    ? "__Host-gtbs_admin_session"
    : "gtbs_admin_session";

interface AdminSessionPayload {
  audience: "gtbs-admin";
  email: string;
  expiresAt: number;
  issuedAt: number;
  sessionId: string;
  version: string;
}

interface ScryptPasswordHash {
  cost: number;
  blockSize: number;
  parallelization: number;
  salt: Buffer;
  derivedKey: Buffer;
}

function safeCompare(left: Buffer | string, right: Buffer | string) {
  const leftBuffer = Buffer.isBuffer(left) ? left : Buffer.from(left);
  const rightBuffer = Buffer.isBuffer(right) ? right : Buffer.from(right);

  return (
    leftBuffer.length === rightBuffer.length &&
    timingSafeEqual(leftBuffer, rightBuffer)
  );
}

function getSessionSecret() {
  return process.env.ADMIN_SESSION_SECRET?.trim() || "";
}

function getSessionVersion() {
  const storedCredentials = readAdminCredentialOverride();
  if (storedCredentials.status === "valid") {
    return storedCredentials.credentials.sessionVersion;
  }
  return process.env.ADMIN_SESSION_VERSION?.trim() || "1";
}

function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

function parsePasswordHash(value?: string): ScryptPasswordHash | null {
  if (!value) return null;

  const [
    algorithm,
    costValue,
    blockSizeValue,
    parallelizationValue,
    saltValue,
    keyValue,
  ] = value.split("$");
  const cost = Number(costValue);
  const blockSize = Number(blockSizeValue);
  const parallelization = Number(parallelizationValue);

  if (
    algorithm !== "scrypt" ||
    cost !== SCRYPT_COST ||
    blockSize !== SCRYPT_BLOCK_SIZE ||
    parallelization !== SCRYPT_PARALLELIZATION
  ) {
    return null;
  }

  try {
    const salt = Buffer.from(saltValue, "base64url");
    const derivedKey = Buffer.from(keyValue, "base64url");

    if (salt.length < 16 || derivedKey.length !== SCRYPT_KEY_LENGTH)
      return null;
    return { cost, blockSize, parallelization, salt, derivedKey };
  } catch {
    return null;
  }
}

function decodeBase32(value: string) {
  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567";
  const normalized = value
    .toUpperCase()
    .replace(/=+$/u, "")
    .replace(/\s+/gu, "");
  let bits = "";

  for (const character of normalized) {
    const index = alphabet.indexOf(character);
    if (index < 0) return null;
    bits += index.toString(2).padStart(5, "0");
  }

  const bytes: number[] = [];
  for (let offset = 0; offset + 8 <= bits.length; offset += 8) {
    bytes.push(Number.parseInt(bits.slice(offset, offset + 8), 2));
  }

  return bytes.length >= 20 ? Buffer.from(bytes) : null;
}

function createTotp(secret: Buffer, counter: number) {
  const counterBuffer = Buffer.alloc(8);
  counterBuffer.writeBigUInt64BE(BigInt(counter));
  const digest = createHmac("sha1", secret).update(counterBuffer).digest();
  const offset = digest[digest.length - 1] & 0x0f;
  const code =
    (((digest[offset] & 0x7f) << 24) |
      ((digest[offset + 1] & 0xff) << 16) |
      ((digest[offset + 2] & 0xff) << 8) |
      (digest[offset + 3] & 0xff)) %
    1_000_000;

  return code.toString().padStart(6, "0");
}

export function getAdminAuthConfigurationIssues() {
  const issues: string[] = [];
  const email = process.env.ADMIN_EMAIL?.trim() || "";
  const environmentPasswordHash = parsePasswordHash(
    process.env.ADMIN_PASSWORD_HASH,
  );
  const storedCredentials = readAdminCredentialOverride();
  const sessionSecret = getSessionSecret();
  const production = process.env.NODE_ENV === "production";

  if (!/^\S+@\S+\.\S+$/u.test(email))
    issues.push("ADMIN_EMAIL must be a valid email address.");
  if (Buffer.byteLength(sessionSecret) < 32) {
    issues.push("ADMIN_SESSION_SECRET must contain at least 32 characters.");
  }
  if (
    storedCredentials.status === "invalid" ||
    (storedCredentials.status === "valid" &&
      !parsePasswordHash(storedCredentials.credentials.passwordHash))
  ) {
    issues.push("Persisted admin credentials are invalid.");
  }
  if (!environmentPasswordHash && (production || !process.env.ADMIN_PASSWORD)) {
    issues.push("ADMIN_PASSWORD_HASH must be a valid supported scrypt hash.");
  }
  if (production && process.env.ADMIN_REQUIRE_MFA !== "true") {
    issues.push("ADMIN_REQUIRE_MFA must be true in production.");
  }
  if (production) {
    try {
      const siteUrl = new URL(process.env.NEXT_PUBLIC_SITE_URL || "");
      if (
        siteUrl.protocol !== "https:" ||
        siteUrl.username ||
        siteUrl.password
      ) {
        issues.push(
          "NEXT_PUBLIC_SITE_URL must be a credential-free HTTPS URL in production.",
        );
      }
    } catch {
      issues.push(
        "NEXT_PUBLIC_SITE_URL must be a valid HTTPS URL in production.",
      );
    }
  }
  if (
    process.env.ADMIN_REQUIRE_MFA === "true" &&
    !decodeBase32(process.env.ADMIN_TOTP_SECRET || "")
  ) {
    issues.push(
      "ADMIN_TOTP_SECRET must be a valid Base32 secret of at least 20 bytes.",
    );
  }

  return issues;
}

export function isAdminAuthConfigured() {
  return getAdminAuthConfigurationIssues().length === 0;
}

export function isAdminMfaRequired() {
  return process.env.ADMIN_REQUIRE_MFA === "true";
}

async function verifyPassword(password: string) {
  const storedCredentials = readAdminCredentialOverride();
  const parsedHash =
    storedCredentials.status === "valid"
      ? parsePasswordHash(storedCredentials.credentials.passwordHash)
      : parsePasswordHash(process.env.ADMIN_PASSWORD_HASH);

  if (!parsedHash) {
    return (
      process.env.NODE_ENV !== "production" &&
      Boolean(process.env.ADMIN_PASSWORD) &&
      safeCompare(password, process.env.ADMIN_PASSWORD || "")
    );
  }

  const derivedKey = await deriveScryptKey(password, parsedHash.salt);

  return safeCompare(derivedKey, parsedHash.derivedKey);
}

export async function validateAdminCredentials(
  email: string,
  password: string,
  oneTimeCode?: string,
) {
  if (!isAdminAuthConfigured()) return false;

  const passwordMatches = await verifyPassword(password);
  const emailMatches = safeCompare(
    normalizeEmail(email),
    normalizeEmail(process.env.ADMIN_EMAIL || ""),
  );

  if (!passwordMatches || !emailMatches) return false;
  if (!isAdminMfaRequired()) return true;

  const secret = decodeBase32(process.env.ADMIN_TOTP_SECRET || "");
  const submittedCode = oneTimeCode?.replace(/\s+/gu, "") || "";
  if (!secret || !/^\d{6}$/u.test(submittedCode)) return false;

  const currentCounter = Math.floor(Date.now() / 30_000);
  return [-1, 0, 1].some((offset) =>
    safeCompare(submittedCode, createTotp(secret, currentCounter + offset)),
  );
}

export async function createAdminPasswordHash(password: string, salt: Buffer) {
  if (password.length < 12)
    throw new Error("Admin passwords must contain at least 12 characters.");
  if (salt.length < 16)
    throw new Error("Password salts must contain at least 16 bytes.");

  const derivedKey = await deriveScryptKey(password, salt);

  return [
    "scrypt",
    SCRYPT_COST,
    SCRYPT_BLOCK_SIZE,
    SCRYPT_PARALLELIZATION,
    salt.toString("base64url"),
    derivedKey.toString("base64url"),
  ].join("$");
}

export async function replaceAdminPassword(password: string) {
  const passwordHash = await createAdminPasswordHash(password, randomBytes(16));
  await writeAdminCredentialOverride({
    version: 1,
    passwordHash,
    sessionVersion: randomUUID(),
    passwordChangedAt: new Date().toISOString(),
  });
}

export function createAdminSession(email: string, expiresAt: number) {
  if (!isAdminAuthConfigured()) {
    throw new Error("Admin authentication is not configured.");
  }
  const now = Date.now();
  if (expiresAt <= now || expiresAt - now > MAX_SESSION_AGE_MS) {
    throw new Error("Admin session expiry is outside the allowed range.");
  }

  const payload = Buffer.from(
    JSON.stringify({
      audience: "gtbs-admin",
      email: normalizeEmail(email),
      expiresAt,
      issuedAt: now,
      sessionId: randomUUID(),
      version: getSessionVersion(),
    } satisfies AdminSessionPayload),
  ).toString("base64url");
  const signature = createHmac("sha256", getSessionSecret())
    .update(payload)
    .digest("base64url");

  return `${payload}.${signature}`;
}

export function verifyAdminSession(token?: string) {
  if (!token || !isAdminAuthConfigured() || token.length > 2_048) return null;

  const parts = token.split(".");
  if (parts.length !== 2) return null;
  const [payload, signature] = parts;
  const expectedSignature = createHmac("sha256", getSessionSecret())
    .update(payload)
    .digest("base64url");

  if (!safeCompare(signature, expectedSignature)) return null;

  try {
    const session = JSON.parse(
      Buffer.from(payload, "base64url").toString("utf8"),
    ) as Partial<AdminSessionPayload>;
    const now = Date.now();

    if (
      session.audience !== "gtbs-admin" ||
      typeof session.email !== "string" ||
      normalizeEmail(session.email) !==
        normalizeEmail(process.env.ADMIN_EMAIL || "") ||
      typeof session.expiresAt !== "number" ||
      typeof session.issuedAt !== "number" ||
      typeof session.sessionId !== "string" ||
      session.sessionId.length < 16 ||
      session.version !== getSessionVersion() ||
      session.expiresAt <= now ||
      session.issuedAt > now + CLOCK_SKEW_MS ||
      session.expiresAt - session.issuedAt > MAX_SESSION_AGE_MS
    ) {
      return null;
    }

    return session as AdminSessionPayload;
  } catch {
    return null;
  }
}
