import { NEQUI_NAMES_SEED } from "@/data/nequi-names-seed";
import { buildNequiDisplayName } from "@/libs/nequi-display-name";
import {
	getCachedVipName,
	setCachedVipName,
} from "@/libs/nequi-vip-cache";
import { formatPersonName } from "@/libs/utils";
import { userService } from "@/services/api.service";

export type NequiNameLookupResult = {
	name: string;
	source: "local" | "api";
	cached?: boolean;
};

const inflight = new Map<string, Promise<NequiNameLookupResult | null>>();

function normalizePhone(phone: string) {
	return phone.replace(/\D/g, "");
}

/** Números de prueba / falsos que no deben consultarse con VIP. */
export function isFakeNequiPhone(phone: string): boolean {
	const clean = normalizePhone(phone);
	if (clean.length !== 10) return false;
	if (clean === "3000000000") return true;
	if (/^3(0+)$/.test(clean)) return true;
	return false;
}

/** Busca en la base local embebida en la PWA. */
export function lookupNequiNameLocal(phone: string): string | null {
	const clean = normalizePhone(phone);
	if (clean.length !== 10) return null;
	return NEQUI_NAMES_SEED[clean] ?? null;
}

async function lookupNequiNameOnce(
	clean: string,
): Promise<NequiNameLookupResult | null> {
	const localName = lookupNequiNameLocal(clean);
	if (localName) {
		return { name: formatPersonName(localName), source: "local" };
	}

	const cachedName = await getCachedVipName(clean);
	if (cachedName) {
		return { name: formatPersonName(cachedName), source: "api", cached: true };
	}

	const api = await userService.lookupNequiName(clean);
	const displayName = buildNequiDisplayName(api);
	if (!displayName) {
		throw new Error(
			"El servidor no devolvió nombre. Intenta de nuevo en unos segundos.",
		);
	}

	const formatted = formatPersonName(displayName);
	if (!api.cached) {
		void setCachedVipName(clean, formatted);
	}

	return {
		name: formatted,
		source: "api",
		cached: api.cached,
	};
}

/**
 * Resuelve nombre: seed local → caché PWA → API (una sola petición en vuelo por número).
 */
export async function lookupNequiName(
	phone: string,
): Promise<NequiNameLookupResult | null> {
	const clean = normalizePhone(phone);
	if (clean.length !== 10 || !clean.startsWith("3")) return null;

	const pending = inflight.get(clean);
	if (pending) return pending;

	const job = lookupNequiNameOnce(clean).finally(() => {
		inflight.delete(clean);
	});

	inflight.set(clean, job);
	return job;
}

/** Precalienta caché + backend mientras el usuario termina de escribir el número. */
export function prefetchNequiName(phone: string): void {
	const clean = normalizePhone(phone);
	if (clean.length !== 10 || !clean.startsWith("3") || isFakeNequiPhone(clean)) {
		return;
	}
	if (lookupNequiNameLocal(clean)) return;
	if (inflight.has(clean)) return;
	void getCachedVipName(clean).then((hit) => {
		if (!hit && !inflight.has(clean)) {
			void lookupNequiName(clean).catch(() => {});
		}
	});
}
