import { randomUUID } from "node:crypto";
import { readFileSync } from "node:fs";
import { mkdir, rename, rm, writeFile } from "node:fs/promises";
import path from "node:path";
import { z } from "zod";

const adminCredentialSchema = z
  .object({
    version: z.literal(1),
    passwordHash: z.string().min(1).max(512),
    sessionVersion: z.string().min(16).max(128),
    passwordChangedAt: z.string().datetime({ offset: true }),
  })
  .strict();

export type AdminCredentialOverride = z.infer<typeof adminCredentialSchema>;

export type AdminCredentialReadResult =
  | { status: "missing" }
  | { status: "invalid" }
  | { status: "valid"; credentials: AdminCredentialOverride };

let testStoragePath: string | undefined;
let writeQueue: Promise<unknown> = Promise.resolve();

function credentialStoragePath() {
  if (process.env.NODE_ENV === "test" && testStoragePath) {
    return testStoragePath;
  }
  return path.join(process.cwd(), "storage", "admin-credentials.json");
}

export function readAdminCredentialOverride(): AdminCredentialReadResult {
  try {
    const parsed = adminCredentialSchema.safeParse(
      JSON.parse(
        readFileSync(
          /* turbopackIgnore: true */ credentialStoragePath(),
          "utf8",
        ),
      ),
    );
    return parsed.success
      ? { status: "valid", credentials: parsed.data }
      : { status: "invalid" };
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") {
      return { status: "missing" };
    }
    return { status: "invalid" };
  }
}

export function writeAdminCredentialOverride(
  credentials: AdminCredentialOverride,
) {
  const parsed = adminCredentialSchema.parse(credentials);
  const operation = writeQueue.then(async () => {
    const storagePath = credentialStoragePath();
    const storageDirectory = path.dirname(storagePath);
    const temporaryPath = path.join(
      storageDirectory,
      `admin-credentials-${randomUUID()}.tmp`,
    );

    await mkdir(storageDirectory, { recursive: true });
    try {
      await writeFile(temporaryPath, `${JSON.stringify(parsed, null, 2)}\n`, {
        encoding: "utf8",
        mode: 0o600,
      });
      await rename(temporaryPath, storagePath);
    } catch (error) {
      await rm(temporaryPath, { force: true }).catch(() => undefined);
      throw error;
    }
  });

  writeQueue = operation.catch(() => undefined);
  return operation;
}

export function setAdminCredentialStorePathForTests(filePath?: string) {
  if (process.env.NODE_ENV !== "test") {
    throw new Error("The Admin credential test path is test-only.");
  }
  testStoragePath = filePath;
}
