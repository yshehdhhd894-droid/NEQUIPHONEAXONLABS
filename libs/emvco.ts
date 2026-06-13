export interface TLVNode {
	tag: string;
	length: number;
	rawValue: string;
	value?: string | Record<string, TLVNode> | TLVNode[];
}

/**
 * Try to parse a TLV string (EMV QR payload style).
 * The payload format expected:
 *   tag (2 chars) + length (2 chars decimal) + value (length chars)
 * Repeats until end.
 *
 * If a value itself is a valid TLV stream, this function will parse it recursively.
 */
export function parseTLVStream(
	payload: string,
	start = 0,
	end?: number,
): { nodes: TLVNode[]; consumed: number } {
	const nodes: TLVNode[] = [];
	const limit = end ?? payload.length;
	let pos = start;

	while (pos + 4 <= limit) {
		const tag = payload.slice(pos, pos + 2);
		const lenStr = payload.slice(pos + 2, pos + 4);

		if (!/^\d{2}$/.test(lenStr)) break;
		const length = parseInt(lenStr, 10);

		const valueStart = pos + 4;
		const valueEnd = valueStart + length;

		if (valueEnd > limit) {
			break;
		}

		const rawValue = payload.substring(valueStart, valueEnd);
		const nestedAttempt = tryParseNested(rawValue);

		const node: TLVNode = {
			tag,
			length,
			rawValue,
			value: nestedAttempt !== null ? nestedAttempt : rawValue,
		};

		nodes.push(node);
		pos = valueEnd;
	}

	return { nodes, consumed: pos - start };
}

/**
 * Try to parse a value string as a TLV stream.
 * If successful and it consumes the entire value, return parsed nodes (as an object keyed by tag).
 * Otherwise, return null (meaning treat value as plain string).
 */
export function tryParseNested(value: string): Record<string, TLVNode> | null {
	if (value.length < 4) return null;
	const { nodes, consumed } = parseTLVStream(value, 0, value.length);

	if (consumed === value.length && nodes.length > 0) {
		// convert to keyed object; if duplicate tags appear, convert to array for that tag
		const obj: Record<string, TLVNode | TLVNode[]> = {};
		for (const n of nodes) {
			if (obj[n.tag]) {
				if (Array.isArray(obj[n.tag])) {
					(obj[n.tag] as TLVNode[]).push(n);
				} else {
					obj[n.tag] = [obj[n.tag] as TLVNode, n];
				}
			} else {
				obj[n.tag] = n;
			}
		}

		const normalized: Record<string, TLVNode> = {};
		Object.keys(obj).forEach((k) => {
			normalized[k] = obj[k] as TLVNode;
		});

		return normalized;
	}
	return null;
}

interface EmvCoNequi {
	qrType: "P2P.NEQUI";
	name: string;
	key: string;
}

interface EmvCoApp {
	qrType: "P2P.APP";
	name: string;
}

interface EmvCoRBM {
	qrType: "RBM";
	name: string;
	key: string;
}

export type EmvCoProfile = EmvCoNequi | EmvCoApp | EmvCoRBM;

function normalizeBrebKey(raw: string): string {
	const digits = raw.replace(/\D/g, "");
	if (digits.length >= 10) return digits.slice(0, 10).padEnd(10, "0");
	return digits.padEnd(10, "0");
}

/** ACH Colombia: tag 50 sub 01 primero; luego tag 26 CO.COM.RBM.LLA. */
function extractBrebKeyFromNodes(nodes: TLVNode[]): string | undefined {
	const tag50 = nodes.find((n) => n.tag === "50");
	if (
		tag50 &&
		typeof tag50.value === "object" &&
		tag50.value &&
		!Array.isArray(tag50.value)
	) {
		const sub = tag50.value as Record<string, TLVNode>;
		const tag50Key = sub["01"]?.rawValue?.trim();
		if (tag50Key && tag50Key.replace(/\D/g, "").length >= 10) {
			return normalizeBrebKey(tag50Key);
		}
	}

	for (let i = 26; i <= 51; i++) {
		const tag = i.toString().padStart(2, "0");
		const node = nodes.find((n) => n.tag === tag);
		if (
			node &&
			typeof node.value === "object" &&
			node.value &&
			!Array.isArray(node.value)
		) {
			const sub = node.value as Record<string, TLVNode>;
			const guid = sub["00"]?.rawValue?.toUpperCase() || "";
			const isKeyTemplate =
				guid.includes("BANCOLOMBIA") ||
				/CO\.COM\.(RBM|CRB)\.(LLA|CU)/.test(guid);

			if (isKeyTemplate) {
				for (const subTag of ["01", "02", "03", "04", "05"]) {
					const value = sub[subTag]?.rawValue?.trim();
					if (value && value.replace(/\D/g, "").length >= 10) {
						return normalizeBrebKey(value);
					}
				}
			}
		}
	}

	const tag50Key = getValueFromNestedObject(nodes, ["50", "01"]);
	if (tag50Key && tag50Key.replace(/\D/g, "").length >= 10) {
		return normalizeBrebKey(tag50Key);
	}

	return undefined;
}

export function getReadableInfoFromTLVNodes(nodes: TLVNode[]): EmvCoProfile {
	const rmbCode = getValueFromNestedObject(nodes, ["49", "01"]);
	const serviceCode = getValueFromNestedObject(nodes, ["92", "01"]);
	const qrType = rmbCode || serviceCode;
	const name =
		nodes.find((n) => n.tag === "59")?.rawValue?.trim() ||
		parseEmvCoNameFromNodes(nodes) ||
		"";

	if (qrType === "P2P.NEQUI") {
		const key =
			getValueFromNestedObject(nodes, ["62", "02"]) ||
			extractKeyFromPayload(nodes.map((n) => n.rawValue).join(""));
		if (!key) throw new Error("QR Nequi sin llave");
		return { qrType, name: name || "Nequi", key };
	}

	if (qrType === "RBM") {
		const key =
			extractBrebKeyFromNodes(nodes) ||
			getValueFromNestedObject(nodes, ["62", "02"]) ||
			extractKeyFromPayload(nodes.map((n) => n.rawValue).join(""));
		if (!key) throw new Error("QR Bre-B sin llave");
		return {
			qrType,
			name: name || "Negocio",
			key: normalizeBrebKey(key),
		};
	}

	if (!qrType) {
		const brebKey = extractBrebKeyFromNodes(nodes);
		if (brebKey) {
			return {
				qrType: "RBM",
				name: name || "Bancolombia",
				key: brebKey,
			};
		}
		throw new Error("Unknown QR type");
	}

	return {
		qrType: qrType as "P2P.APP",
		name: name || "Pago QR",
	};
}

function parseEmvCoNameFromNodes(nodes: TLVNode[]): string | undefined {
	const tag59 = nodes.find((n) => n.tag === "59")?.rawValue?.trim();
	if (tag59) return tag59;

	const tag62 = nodes.find((n) => n.tag === "62");
	if (tag62 && typeof tag62.value === "object" && tag62.value && !Array.isArray(tag62.value)) {
		const sub = tag62.value as Record<string, TLVNode>;
		const alt = sub["07"]?.rawValue?.trim();
		if (alt) return alt;
	}

	for (let i = 26; i <= 51; i++) {
		const tag = i.toString().padStart(2, "0");
		const node = nodes.find((n) => n.tag === tag);
		if (node && typeof node.value === "object" && node.value && !Array.isArray(node.value)) {
			const sub = node.value as Record<string, TLVNode>;
			const merchant = sub["01"]?.rawValue?.trim();
			if (merchant) return merchant;
		}
	}

	return undefined;
}

function parseEmvCoName(raw: string): string | undefined {
	const { nodes } = parseTLVStream(raw.trim());
	if (!nodes.length) return undefined;
	return parseEmvCoNameFromNodes(nodes);
}

function parseJsonName(raw: string): string | undefined {
	const match = raw.match(
		/"(merchant_name|merchantName|name|nombre|negocio|comercio)"\s*:\s*"([^"]+)"/i,
	);
	return match?.[2]?.trim();
}

function extractKeyFromPayload(payload: string): string | undefined {
	const digits = [...payload.matchAll(/(\d{10,})/g)].map((m) => m[1]);
	if (!digits.length) return undefined;

	return (
		digits.find((d) => /^00\d{8}$/.test(d)) ||
		digits.find((d) => d.startsWith("00") && d.length >= 10) ||
		digits.find((d) => d.startsWith("3") && d.length === 10) ||
		digits[0]?.slice(0, 10)
	);
}

function extractBrebData(payload: string): EmvCoRBM | null {
	let name = "";
	let key: string | undefined;

	const emvName = parseEmvCoName(payload);
	if (emvName) {
		name = emvName;
		const allDigits = [...payload.matchAll(/(\d{10,})/g)].map((m) => m[1]);
		key =
			allDigits.find((d) => d.startsWith("00") || d.startsWith("3")) ||
			allDigits[0];
	}

	if (!name) {
		const jsonName = parseJsonName(payload);
		if (jsonName) {
			name = jsonName;
			const jsonKey = payload.match(
				/"(id|merchant_id|merchantId|phone|telefono|celular)"\s*:\s*"?(\d{10,})"?/i,
			);
			key = jsonKey?.[2];
		}
	}

	if (!key) {
		const allDigits = [...payload.matchAll(/(\d{10,})/g)].map((m) => m[1]);
		if (allDigits.length) {
			key =
				allDigits.find((d) => d.startsWith("00") && d.length >= 10) ||
				allDigits.find((d) => d.startsWith("3") && d.length === 10) ||
				allDigits[0]?.slice(0, 10);
		}
	}

	if (key && !name) {
		if (/BANCOLOMBIA/i.test(payload)) name = "Bancolombia";
		else if (/NEQUI/i.test(payload)) name = "Nequi";
		else name = "Código QR";
	}

	if (!key || key.length < 10) return null;

	return {
		qrType: "RBM",
		name: name || "Negocio QR",
		key: normalizeBrebKey(key),
	};
}

/** Parsea QR EMVCo + fallback Bre-B/Bancolombia (galería y cámara). */
export function parseQrPayload(raw: string): EmvCoProfile {
	const candidates = [raw.trim()];
	try {
		const decoded = decodeURIComponent(raw.trim());
		if (decoded && decoded !== raw.trim()) candidates.push(decoded);
	} catch {
		/* ignore */
	}

	for (const candidate of candidates) {
		const { nodes } = parseTLVStream(candidate);
		if (nodes.length > 0) {
			try {
				return getReadableInfoFromTLVNodes(nodes);
			} catch {
				const breb = extractBrebData(candidate);
				if (breb) return breb;
			}
		}

		const breb = extractBrebData(candidate);
		if (breb) return breb;

		if (/BANCOLOMBIA|RBM|CO\.COM\.BANCOLOMBIA/i.test(candidate)) {
			const key = extractKeyFromPayload(candidate);
			if (key) {
				return {
					qrType: "RBM",
					name:
						parseJsonName(candidate) ||
						parseEmvCoName(candidate) ||
						"Bancolombia",
					key: normalizeBrebKey(key),
				};
			}
		}
	}

	throw new Error("QR no reconocido");
}

function getValueFromNestedObject(
	nodes: TLVNode[],
	path: string[],
): string | undefined {
	let current: any = nodes;

	for (let i = 0; i < path.length; i++) {
		const key = path[i];

		if (Array.isArray(current)) {
			const found = current.find((n: TLVNode) => n.tag === key);
			if (!found) return undefined;
			current = found.value;
			continue;
		}

		if (current && typeof current === "object" && current[key]) {
			current = current[key].value ?? current[key].rawValue;
			continue;
		}

		return undefined;
	}

	if (typeof current === "string") return current;
	if (current?.rawValue) return current.rawValue;

	return undefined;
}
