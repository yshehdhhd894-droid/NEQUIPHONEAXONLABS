import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const sourceDir =
	process.env.ENROLL_TOUR_SVG_SOURCE ??
	"/home/axondevui/NEQUIS DESCOMPILED/NEQUICOLOMBIAREAL/assets/www/assets/images/enroll-tour";
const out = path.join(root, "components/enroll-tour/enroll-tour-svgs.ts");
const files = ["pocket", "send", "payments", "goals", "money"];

const lines = [
	"/** SVG Nequi originales (272×359) — copia exacta, no editar a mano. */",
	"",
];

for (const name of files) {
	const xml = fs.readFileSync(path.join(sourceDir, `${name}.svg`), "utf8");
	lines.push(`export const ${name.toUpperCase()}_SVG = ${JSON.stringify(xml)};`);
	lines.push("");
}

fs.writeFileSync(out, lines.join("\n"));
console.log(`Synced ${files.length} SVGs → enroll-tour-svgs.ts`);
