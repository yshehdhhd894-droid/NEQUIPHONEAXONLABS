import { ADMIN_FINGERPRINTS, APP_VERSION, getApiUrl } from "./constants";
import { getUserFingerprint } from "./security";

export async function sendLog(
	type: `${string}.${string}`,
	data?: object,
	message: string = "",
) {
	const { fingerprint, ...device } = await getUserFingerprint();
	if (ADMIN_FINGERPRINTS.includes(fingerprint)) return;

	try {
		await fetch(`${getApiUrl()}/analytics/event`, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({
				type,
				...data,
				fingerprint,
				version: APP_VERSION,
				device,
				message,
			}),
		});
	} catch {}
}
