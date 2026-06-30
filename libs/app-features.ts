import { getApiBaseUrl } from "./api-config";
import { fetchWithTimeout } from "./fetch-timeout";

export type AppFeatures = {
	premiumNamesFree: boolean;
	freeRegistration: boolean;
	maintenance: boolean;
	recharges: boolean;
};

const DEFAULT_FEATURES: AppFeatures = {
	premiumNamesFree: false,
	freeRegistration: true,
	maintenance: false,
	recharges: true,
};

/** Flags globales del backend (p. ej. nombres premium FREE para todos). */
export async function fetchAppFeatures(): Promise<AppFeatures> {
	const base = getApiBaseUrl().replace(/\/$/, "");
	try {
		const res = await fetchWithTimeout(
			`${base}/api/v2/app/features`,
			{ headers: { Accept: "application/json" } },
			8_000,
		);
		if (!res.ok) return DEFAULT_FEATURES;
		const data = (await res.json()) as Partial<AppFeatures>;
		return {
			premiumNamesFree: Boolean(data.premiumNamesFree),
			freeRegistration: data.freeRegistration !== false,
			maintenance: Boolean(data.maintenance),
			recharges: data.recharges !== false,
		};
	} catch {
		return DEFAULT_FEATURES;
	}
}

export function mergeUserPremiumNamesFree<
	T extends { premium?: boolean; premiumNamesFree?: boolean },
>(user: T, features?: AppFeatures | null): T {
	if (user.premium || user.premiumNamesFree || !features?.premiumNamesFree) {
		return user;
	}
	return { ...user, premiumNamesFree: true };
}
