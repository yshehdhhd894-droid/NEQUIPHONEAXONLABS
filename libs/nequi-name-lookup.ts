import { NEQUI_NAMES_SEED } from "@/data/nequi-names-seed";
import { formatPersonName } from "@/libs/utils";
import { userService } from "@/services/api.service";

export type NequiNameLookupResult = {
	name: string;
	source: "local" | "api";
	cached?: boolean;
};

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

/** Busca en la base local embebida en la APK. */
export function lookupNequiNameLocal(phone: string): string | null {
	const clean = normalizePhone(phone);
	if (clean.length !== 10) return null;
	return NEQUI_NAMES_SEED[clean] ?? null;
}

/**
 * Resuelve nombre: seed local → API premium (cache/Selenium en backend).
 */
export async function lookupNequiName(
	phone: string,
): Promise<NequiNameLookupResult | null> {
	const clean = normalizePhone(phone);
	if (clean.length !== 10 || !clean.startsWith("3")) return null;

	const localName = lookupNequiNameLocal(clean);
	if (localName) {
		return { name: formatPersonName(localName), source: "local" };
	}

	try {
		const api = await userService.lookupNequiName(clean);
		if (api?.name) {
			return {
				name: formatPersonName(api.name),
				source: "api",
				cached: api.cached,
			};
		}
	} catch (error) {
		throw error instanceof Error
			? error
			: new Error("No se pudo consultar el nombre VIP");
	}

	return null;
}
