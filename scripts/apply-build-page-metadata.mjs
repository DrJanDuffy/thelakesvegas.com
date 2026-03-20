/**
 * Wrap `export const metadata: Metadata = { ... };` with `buildPageMetadata({ ... })`.
 * Order: replace block first, then insert import (keeps byte offsets valid).
 * Skips: home if already patched, listings/[id], async generateMetadata, inner openGraph (handle manually).
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const appDir = path.join(root, "src", "app");

function walk(dir) {
  const out = [];
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) out.push(...walk(p));
    else if (e.name === "page.tsx") out.push(p);
  }
  return out;
}

function routePathFromFile(file) {
  const rel = path.relative(appDir, path.dirname(file)).replace(/\\/g, "/");
  return rel ? `/${rel}` : "/";
}

function findMetadataBlock(src) {
  const marker = "export const metadata: Metadata = ";
  const start = src.indexOf(marker);
  if (start === -1) return null;
  const braceStart = src.indexOf("{", start);
  if (braceStart === -1) return null;
  let depth = 0;
  for (let i = braceStart; i < src.length; i++) {
    const c = src[i];
    if (c === "{") depth++;
    else if (c === "}") {
      depth--;
      if (depth === 0) {
        let end = i + 1;
        while (end < src.length && /\s/.test(src[end])) end++;
        if (src[end] === ";") end++;
        return { start, end, inner: src.slice(braceStart + 1, i) };
      }
    }
  }
  return null;
}

function parseMultilineTitle(inner) {
  const m = inner.match(/title:\s*\n\s*"([^"]*)"/s);
  if (m) return m[1].replace(/\s+/g, " ").trim();
  const m2 = inner.match(/title:\s*"([^"]*)"/s);
  if (m2) return m2[1].trim();
  return null;
}

function parseMultilineDescription(inner) {
  const m = inner.match(/description:\s*\n\s*"([^"]*)"/s);
  if (m) return m[1].replace(/\s+/g, " ").trim();
  const m2 = inner.match(/description:\s*`([^`]*)`/s);
  if (m2) return m2[1].trim();
  const m3 = inner.match(/description:\s*"([^"]*)"/s);
  if (m3) return m3[1].trim();
  return null;
}

function parseKeywords(inner) {
  const m = inner.match(/keywords:\s*\[([\s\S]*?)\]/);
  if (!m) return null;
  const body = m[1];
  const out = [];
  for (const line of body.split("\n")) {
    const q = line.match(/"([^"]*)"/);
    if (q) out.push(q[1]);
  }
  return out.length ? out : null;
}

function hasRobots(inner) {
  return /robots:\s*\{/.test(inner);
}

const importLine = 'import { buildPageMetadata } from "@/lib/page-metadata";\n';

const files = walk(appDir);
let updated = 0;
let skipped = 0;

for (const file of files) {
  let src = fs.readFileSync(file, "utf8");
  if (file.replace(/\\/g, "/").includes("/[id]/")) {
    skipped++;
    continue;
  }
  if (/export\s+async\s+function\s+generateMetadata/.test(src)) {
    skipped++;
    continue;
  }
  if (src.includes("buildPageMetadata(")) {
    skipped++;
    continue;
  }

  const block = findMetadataBlock(src);
  if (!block) {
    skipped++;
    continue;
  }

  const inner = block.inner;
  if (/openGraph\s*:/.test(inner)) {
    console.warn("SKIP openGraph (set manually):", path.relative(root, file));
    skipped++;
    continue;
  }

  const title = parseMultilineTitle(inner);
  const description = parseMultilineDescription(inner);
  const keywords = parseKeywords(inner);

  if (!title || !description) {
    console.warn("SKIP parse:", path.relative(root, file), { title: !!title, description: !!description });
    skipped++;
    continue;
  }

  const route = routePathFromFile(file);

  const kw =
    keywords && keywords.length
      ? `,\n  keywords: [\n${keywords.map((k) => `    ${JSON.stringify(k)},`).join("\n")}\n  ]`
      : "";

  const robotsBlock = hasRobots(inner)
    ? `,
  robots: {
    index: true,
    follow: true,
  }`
    : "";

  const newMeta = `export const metadata: Metadata = buildPageMetadata({
  path: ${JSON.stringify(route)},
  title: ${JSON.stringify(title)},
  description: ${JSON.stringify(description)}${kw}${robotsBlock},
});`;

  src = src.slice(0, block.start) + newMeta + src.slice(block.end);

  if (!src.includes("@/lib/page-metadata")) {
    const needle = 'import type { Metadata } from "next";';
    const idx = src.indexOf(needle);
    if (idx === -1) {
      console.warn("No Metadata import:", path.relative(root, file));
      skipped++;
      continue;
    }
    const endLine = src.indexOf("\n", idx);
    if (endLine === -1) {
      skipped++;
      continue;
    }
    src = src.slice(0, endLine + 1) + importLine + src.slice(endLine + 1);
  }

  fs.writeFileSync(file, src);
  updated++;
  console.log("OK", path.relative(root, file));
}

console.log({ updated, skipped });
