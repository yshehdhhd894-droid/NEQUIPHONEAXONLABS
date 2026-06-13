/** Valida que el texto decodificado sea un QR de pago real (EMVCo / Bre-B). */
export function isValidPaymentQrPayload(text: string): boolean {
	const value = text.trim();
	if (!value) return false;

	if (value.startsWith("000201")) return true;
	if (/^https?:\/\//i.test(value)) return true;
	if (/CO\.COM\.(RBM|CRB|RED)/i.test(value)) return true;
	if (/BANCOLOMBIA|Bre-?B/i.test(value)) return true;

	// Rechaza falsos positivos típicos de fotos (seriales, números sueltos).
	if (/^\d{1,12}$/.test(value)) return false;

	return false;
}
