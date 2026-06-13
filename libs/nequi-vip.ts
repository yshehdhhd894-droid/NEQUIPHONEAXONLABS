import { lookupNequiName } from "@/libs/nequi-name-lookup";
import type { InsertVictim } from "@/store/useVictimsStore";

export async function resolveNequiVictimForPhone(
	phone: string,
	findVictim: (value: string) => { name: string } | undefined,
	addVictim: (victim: InsertVictim) => void,
): Promise<{ found: boolean; name?: string }> {
	const clean = phone.replace(/\D/g, "");
	const existing = findVictim(clean);
	if (existing) {
		return { found: true, name: existing.name };
	}

	const lookup = await lookupNequiName(clean);
	if (!lookup) {
		return { found: false };
	}

	addVictim({
		type: "phone",
		value: clean,
		name: lookup.name,
	});

	return { found: true, name: lookup.name };
}
