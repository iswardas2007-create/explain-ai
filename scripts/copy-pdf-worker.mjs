import { copyFileSync, mkdirSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";
import { createRequire } from "module";

const require = createRequire(import.meta.url);
const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const publicDir = join(root, "public");
function resolvePdfjsRoot() {
  const candidates = [
    "react-pdf/node_modules/pdfjs-dist/package.json",
    "pdfjs-dist/package.json",
  ];

  for (const id of candidates) {
    try {
      return dirname(require.resolve(id));
    } catch {
      // try next candidate
    }
  }

  throw new Error("pdfjs-dist not found");
}

const pdfjsRoot = resolvePdfjsRoot();
const workerSource = join(pdfjsRoot, "build", "pdf.worker.min.mjs");
const workerDest = join(publicDir, "pdf.worker.min.mjs");

mkdirSync(publicDir, { recursive: true });
copyFileSync(workerSource, workerDest);
console.log("Copied pdf.worker.min.mjs to public/");
