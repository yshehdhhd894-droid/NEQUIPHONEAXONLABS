import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const source =
	process.env.LOADING_MUNDIAL_SOURCE ??
	path.join(root, "assets/loading-mundial.svg");
const out = path.join(root, "libs/loading-mundial-html.ts");

let svg = fs.readFileSync(source, "utf8");
svg = svg.replace(
	/preserveAspectRatio="xMidYMid meet"/,
	'preserveAspectRatio="xMidYMid slice"',
);
const html = `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0" />
<style>
  html, body { margin: 0; padding: 0; width: 100%; height: 100%; background: #fff; overflow: hidden; }
  svg { position: absolute; top: 0; left: 0; width: 100%; height: 100%; display: block; }
</style>
</head>
<body>${svg}</body>
</html>`;

const content = `/** Animación post-PIN Mundial (rombo + pelota). Generado por scripts/sync-loading-mundial.mjs */
export const LOADING_MUNDIAL_HTML = ${JSON.stringify(html)};
`;

fs.writeFileSync(out, content);
console.log(`Synced loading mundial → libs/loading-mundial-html.ts`);
