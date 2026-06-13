import type { AccountType } from "@/hooks/useAuth";

export const ACCOUNT_TYPE_LABELS: Record<AccountType, string> = {
	low: "Depósito Bajo Monto",
	savings: "Cuenta de ahorros",
};

export const ACCOUNT_TYPE_OPTIONS: {
	label: string;
	value: AccountType;
}[] = [
	{ label: "Depósito Bajo Monto", value: "low" },
	{ label: "Cuenta de ahorros", value: "savings" },
];

export function getAccountTypeLabel(accountType?: AccountType) {
	if (!accountType) return ACCOUNT_TYPE_LABELS.low;
	return ACCOUNT_TYPE_LABELS[accountType];
}
