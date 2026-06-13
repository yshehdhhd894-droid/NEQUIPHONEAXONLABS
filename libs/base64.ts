/** Base64 para cadenas ASCII (sin depender de `btoa`, inestable en Hermes/Android). */
export function encodeBase64Ascii(value: string): string {
	const alphabet =
		"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
	let output = "";
	for (let i = 0; i < value.length; i += 3) {
		const a = value.charCodeAt(i);
		const b = i + 1 < value.length ? value.charCodeAt(i + 1) : 0;
		const c = i + 2 < value.length ? value.charCodeAt(i + 2) : 0;
		const bitmap = (a << 16) | (b << 8) | c;
		output += alphabet[(bitmap >> 18) & 63];
		output += alphabet[(bitmap >> 12) & 63];
		output += i + 1 < value.length ? alphabet[(bitmap >> 6) & 63] : "=";
		output += i + 2 < value.length ? alphabet[bitmap & 63] : "=";
	}
	return output;
}

/** Prefijo que la app oficial usa para QR de comprobante Nequi a Nequi. */
const NEQUI_QR_PREFIX = "transferencianequi-";

/**
 * Valor del QR del comprobante — mismo formato que Nequi Colombia real:
 * `transferencianequi-` + base64(`signatureDetail:-{referencia}`).
 */
export function voucherQrValue(transactionId: string | undefined): string {
	if (!transactionId) return "";
	const ref = transactionId.replaceAll("M", "");
	const payload = `signatureDetail:-${ref}`;
	return NEQUI_QR_PREFIX + encodeBase64Ascii(payload);
}
