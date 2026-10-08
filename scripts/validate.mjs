import fs from "node:fs";
import path from "node:path";
import process from "node:process";

const root = process.cwd();
const htmlPath = path.join(root, "index.html");
const html = fs.readFileSync(htmlPath, "utf8");
const app = fs.readFileSync(path.join(root, "app.js"), "utf8");
const errors = [];
const warnings = [];

function fail(message) {
  errors.push(message);
}

function warn(message) {
  warnings.push(message);
}

function attributes(fragment) {
  const result = {};
  const matcher = /([:\w-]+)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s"'=<>`]+)))?/g;
  let match;
  while ((match = matcher.exec(fragment))) {
    result[match[1].toLowerCase()] = match[2] ?? match[3] ?? match[4] ?? "";
  }
  return result;
}

// Core document structure.
if (!/<html\b[^>]*\blang="pt-BR"/i.test(html)) fail("<html> must declare lang=pt-BR.");
if (!/<meta\b[^>]*\bname="description"/i.test(html)) fail("Missing meta description.");
if (!/<title>[^<]+<\/title>/i.test(html)) fail("Missing non-empty title.");
if (!/<main\b/i.test(html)) fail("Missing <main> landmark.");
if (!/<h1\b/i.test(html)) fail("Missing H1.");
if (!/<a\b[^>]*class="skip-link"/i.test(html)) fail("Missing skip link.");

// IDs must be unique.
const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map((match) => match[1]);
const seen = new Set();
for (const id of ids) {
  if (seen.has(id)) fail(`Duplicate id: #${id}`);
  seen.add(id);
}

// Internal anchors must resolve. Source cards are rendered from app.js, so their IDs are checked separately.
for (const match of html.matchAll(/<a\b([^>]*)>/gi)) {
  const attrs = attributes(match[1]);
  const href = attrs.href;
  if (!href) continue;
  if (href.startsWith("#") && href.length > 1) {
    const target = decodeURIComponent(href.slice(1));
    if (!seen.has(target) && !/^source-[rgxo]\d+$/i.test(target)) {
      fail(`Broken internal anchor: ${href}`);
    }
  }
  if (attrs.target === "_blank" && !String(attrs.rel).split(/\s+/).includes("noopener")) {
    fail(`External link with target=_blank is missing rel=noopener: ${href}`);
  }
}

// Every static button declares type to avoid accidental form submission.
for (const match of html.matchAll(/<button\b([^>]*)>/gi)) {
  const attrs = attributes(match[1]);
  if (!attrs.type) fail(`Button missing explicit type: ${match[0].slice(0, 100)}`);
}

// Inputs and selects need either an enclosing label or an explicit label reference/ARIA label.
for (const match of html.matchAll(/<(input|select)\b([^>]*)>/gi)) {
  const attrs = attributes(match[2]);
  if (attrs.type === "hidden") continue;
  const index = match.index ?? 0;
  const before = html.slice(0, index).toLowerCase();
  const after = html.slice(index);
  const insideLabel = before.lastIndexOf("<label") > before.lastIndexOf("</label>");
  const explicit = attrs.id && new RegExp(`<label\\b[^>]*\\bfor=["']${attrs.id}["']`, "i").test(html);
  const aria = attrs["aria-label"] || attrs["aria-labelledby"];
  const wrapsSoon = insideLabel && /<\/label>/i.test(after);
  if (!explicit && !aria && !wrapsSoon) {
    fail(`Form control lacks an accessible label: ${match[0]}`);
  }
}

// Referenced local assets must exist.
const localRefs = new Set();
for (const match of html.matchAll(/\b(?:href|src)="([^"]+)"/gi)) {
  const ref = match[1];
  if (
    !ref ||
    ref.startsWith("#") ||
    ref.startsWith("http://") ||
    ref.startsWith("https://") ||
    ref.startsWith("mailto:") ||
    ref.startsWith("tel:") ||
    ref.startsWith("data:")
  ) continue;
  localRefs.add(ref.split(/[?#]/)[0]);
}
for (const ref of localRefs) {
  if (!fs.existsSync(path.join(root, ref))) fail(`Referenced local file does not exist: ${ref}`);
}

// Source IDs cited by the static guide must exist in the JS data set.
const citedSources = [...new Set([...html.matchAll(/href="#source-([rgxo]\d+)"/gi)].map((match) => match[1].toUpperCase()))];
for (const source of citedSources) {
  if (!new RegExp(`id:\\s*["']${source}["']`).test(app)) fail(`Cited source ${source} is absent from app.js.`);
}
const declaredSourceCount = (app.match(/\bid:\s*["'][RGXO]\d+["']/g) || []).length;
if (declaredSourceCount !== 17) fail(`Expected 17 source records, found ${declaredSourceCount}.`);

// Required downloadable templates.
for (const file of [
  "templates/plano-de-conteudo.csv",
  "templates/rastreador-de-links.csv",
  "templates/diario-de-experimentos.csv"
]) {
  const fullPath = path.join(root, file);
  if (!fs.existsSync(fullPath)) fail(`Missing template: ${file}`);
  else if (fs.readFileSync(fullPath, "utf8").trim().split("\n").length < 2) warn(`Template has no sample row: ${file}`);
}

if (warnings.length) {
  console.warn("Warnings:");
  warnings.forEach((message) => console.warn(`  - ${message}`));
}

if (errors.length) {
  console.error(`Validation failed with ${errors.length} issue${errors.length === 1 ? "" : "s"}:`);
  errors.forEach((message) => console.error(`  - ${message}`));
  process.exit(1);
}

console.log(`Validation passed: ${ids.length} unique IDs, ${localRefs.size} local assets, ${declaredSourceCount} sources.`);
