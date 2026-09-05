import assert from "node:assert/strict";
import { existsSync, readFileSync, readdirSync } from "node:fs";
import path from "node:path";
import test from "node:test";

const root = process.cwd();

function walk(directory: string): string[] {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const item = path.join(directory, entry.name);
    return entry.isDirectory() ? walk(item) : [item];
  });
}

const sourceFiles = walk(path.join(root, "src")).filter((file) =>
  /\.(?:ts|tsx|css)$/.test(file),
);

test("all literal public image references resolve to existing files", () => {
  const missing: string[] = [];

  for (const file of sourceFiles) {
    const source = readFileSync(file, "utf8");
    for (const match of source.matchAll(/["'`](\/images\/[A-Za-z0-9_./ -]+)["'`]/g)) {
      const publicFile = path.join(root, "public", match[1]);
      if (!existsSync(publicFile)) {
        missing.push(`${path.relative(root, file)} -> ${match[1]}`);
      }
    }
  }

  assert.deepEqual(missing, []);
});

test("literal internal links target an App Router page", () => {
  const routePatterns = walk(path.join(root, "src", "app"))
    .filter((file) => path.basename(file) === "page.tsx")
    .map((file) => {
      const route = path
        .relative(path.join(root, "src", "app"), path.dirname(file))
        .split(path.sep)
        .filter((segment) => !/^\(.+\)$/.test(segment))
        .map((segment) => (segment.startsWith("[") ? "[^/]+" : segment))
        .join("/");
      return new RegExp(`^/${route}$`.replace("//$", "/$"));
    });
  const broken: string[] = [];
  const hrefPattern = /(?:href\s*=\s*|href:\s*)["'](\/[A-Za-z0-9_./?=&%#-]*)["']/g;

  for (const file of sourceFiles) {
    const source = readFileSync(file, "utf8");
    for (const match of source.matchAll(hrefPattern)) {
      const pathname = match[1].split(/[?#]/, 1)[0] || "/";
      if (!routePatterns.some((pattern) => pattern.test(pathname))) {
        broken.push(`${path.relative(root, file)} -> ${match[1]}`);
      }
    }
  }

  assert.deepEqual(broken, []);
});

test("client modules do not reference server-only secrets", () => {
  const exposed: string[] = [];
  const serverOnlyName =
    /process\.env\.(?:ADMIN_[A-Z0-9_]+|UPLOADTHING_TOKEN)/g;

  for (const file of sourceFiles.filter((item) => item.endsWith(".tsx"))) {
    const source = readFileSync(file, "utf8");
    if (!/^\s*["']use client["'];/.test(source)) continue;
    if (serverOnlyName.test(source)) exposed.push(path.relative(root, file));
    serverOnlyName.lastIndex = 0;
  }

  assert.deepEqual(exposed, []);
});
