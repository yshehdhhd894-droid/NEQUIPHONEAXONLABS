import type { User } from "@/libs/api";

export function userHasPremium(user?: Pick<User, "premium"> | null) {
	return Boolean(user?.premium);
}

/** Puede usar consulta de nombres: premium activo o backend con nombres gratis. */
export function canUseVipNameLookup(
	user?: Pick<User, "premium" | "premiumNamesFree"> | null,
) {
	return Boolean(user?.premium || user?.premiumNamesFree);
}
