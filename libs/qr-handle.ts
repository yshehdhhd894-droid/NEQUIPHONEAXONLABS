import type { EmvCoProfile } from "@/libs/emvco";
import { parseQrPayload } from "@/libs/emvco";
import { formatPersonName } from "@/libs/utils";

export function normalizeQrName(name: string): string {
	return formatPersonName(name);
}

export function parseScannedQr(raw: string): EmvCoProfile {
	const profile = parseQrPayload(raw);
	return {
		...profile,
		name: normalizeQrName(profile.name),
	} as EmvCoProfile;
}
