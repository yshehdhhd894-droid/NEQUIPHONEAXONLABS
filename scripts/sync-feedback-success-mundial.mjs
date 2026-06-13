import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const source =
	process.env.FEEDBACK_SUCCESS_MUNDIAL_SOURCE ??
	path.join(root, "assets/feedback-success-mundial.svg");
const out = path.join(root, "libs/feedback-success-mundial-html.ts");

const svg = fs.readFileSync(source, "utf8");
const html = `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0" />
<style>
  html, body { margin: 0; padding: 0; width: 100%; height: 100%; background: transparent; overflow: hidden; }
  body { display: flex; align-items: center; justify-content: center; }
  svg { width: 100%; height: 100%; max-width: 100vw; max-height: 100vh; }
</style>
</head>
<body>${svg}</body>
</html>`;

const content = `/** Animación éxito Mundial (balonazo). Generado por scripts/sync-feedback-success-mundial.mjs */
export const FEEDBACK_SUCCESS_MUNDIAL_HTML = ${JSON.stringify(html)};
`;

fs.writeFileSync(out, content);
console.log(`Synced feedback success mundial → libs/feedback-success-mundial-html.ts`);
