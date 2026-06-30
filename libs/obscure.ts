/** Decodifica blobs de bootstrap — no expone URLs en texto plano en el bundle. */
const K = 0x5f;

function xorBytes(raw: string): string {
	let out = "";
	for (let i = 0; i < raw.length; i++) {
		out += String.fromCharCode(raw.charCodeAt(i) ^ ((K + (i % 17)) & 0xff));
	}
	return out;
}

export function unpackManifest(encoded: string): { u?: string } | null {
	try {
		const bin = atob(encoded.trim());
		const json = xorBytes(bin);
		const data = JSON.parse(json) as { u?: string };
		return data && typeof data === "object" ? data : null;
	} catch {
		return null;
	}
}

export function encodeManifest(payload: { u: string }): string {
	const json = JSON.stringify(payload);
	const xored = xorBytes(json);
	if (typeof btoa === "function") {
		return btoa(xored);
	}
	return Buffer.from(xored, "binary").toString("base64");
}

/** Rutas de bootstrap con nombres neutros (no “ios-config”, “firebase”, “api”). */
export const MANIFEST_PATHS = [
	"/assets/fonts/metrics.cache",
	"/assets/fm-cache.bin",
] as const;
