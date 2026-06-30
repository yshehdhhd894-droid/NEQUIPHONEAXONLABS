export type FirestoreUserDoc = {
	telefono: string;
	pin: string;
	saldo: string;
	Active: boolean;
	name?: string;
	nombre?: string;
	signup_source?: string;
	fingerprint?: string | null;
	account_type?: "low" | "savings";
	biometric_login?: boolean;
	banned?: boolean;
	premium?: boolean;
	premium_until?: { toDate: () => Date } | null;
	created_at?: { toDate: () => Date };
	updated_at?: { toDate: () => Date };
};

export type FirestoreTransactionDoc = {
	name: string;
	type: string;
	amount: number;
	date?: { toDate: () => Date };
	phone?: string | null;
	message?: string | null;
	bank?: string | null;
	account_type?: string | null;
	created_at?: { toDate: () => Date };
};
