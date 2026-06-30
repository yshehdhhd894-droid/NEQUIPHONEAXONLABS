import { type AccountType, useAuthStore } from "@/hooks/useAuth";
import { queryClient, type Transaction, type Wallet } from "@/libs/api";
import { getApiBaseUrl } from "@/libs/api-config";
import {
	fetchAppFeatures,
	mergeUserPremiumNamesFree,
} from "@/libs/app-features";
import { getAuthToken, syncAuthToken } from "@/libs/auth-token";
import { fetchWithTimeout } from "@/libs/fetch-timeout";
import {
	firestoreGetUserProfile,
	firestoreLoginWithPhonePin,
	firestorePhoneExists,
	firestoreUpdateAccountType,
	firestoreUpdateBiometric,
	firestoreUpdateUserName,
	firestoreUpdateUserPin,
} from "@/libs/firestore-users";
import {
	firestoreCreateTransaction,
	firestoreDeleteTransaction,
	firestoreGetTransaction,
	firestoreGetWallet,
} from "@/libs/firestore-wallet";
import { normalizeNetworkError } from "@/libs/network-error";
import { getUserFingerprint } from "@/libs/security";
import { withTimeout } from "@/libs/with-timeout";
import { api } from "@/libs/api";
import type { TransferInput } from "@/store/useWalletStore";

let SecureStore: {
	getItemAsync: (key: string) => Promise<string | null>;
	setItemAsync: (key: string, value: string) => Promise<void>;
};

try {
	SecureStore = require("expo-secure-store");
} catch {
	SecureStore = require("@/libs/web-secure-store");
}

const SECURE_PIN_KEY = "secure_pin";

function isJwtToken(token: string): boolean {
	return token.split(".").length === 3;
}

function requireUserId(): string {
	const userId = useAuthStore.getState().user?.id;
	if (!userId) {
		throw new Error("Sesión expirada. Cierra sesión y vuelve a entrar.");
	}
	return userId;
}

async function fetchBackendJwt(
	phone: string,
	pin: string,
): Promise<string | null> {
	const base = getApiBaseUrl().replace(/\/$/, "");
	if (!base) return null;

	const { fingerprint } = await getUserFingerprint();
	try {
		const res = await fetchWithTimeout(
			`${base}/api/v2/auth/login`,
			{
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					Accept: "application/json",
				},
				body: JSON.stringify({ phone, pin, fingerprint }),
			},
			15_000,
		);
		if (!res.ok) return null;
		const data = (await res.json()) as { token?: string };
		return data.token?.trim() || null;
	} catch {
		return null;
	}
}

async function ensureBackendJwt(): Promise<string> {
	const current = getAuthToken();
	if (current && isJwtToken(current)) {
		return current;
	}

	const pin = await SecureStore.getItemAsync(SECURE_PIN_KEY);
	const phone = useAuthStore.getState().user?.phone?.replace(/\D/g, "");
	if (!phone || !pin) {
		throw new Error("Sesión expirada. Cierra sesión y vuelve a entrar.");
	}

	const jwt = await fetchBackendJwt(phone, pin);
	if (!jwt) {
		throw new Error(
			"Consulta premium no disponible. Revisa tu internet o intenta más tarde.",
		);
	}

	useAuthStore.getState().setToken(jwt);
	syncAuthToken(jwt);
	return jwt;
}

class ApiUserService {
	async getUserInfo() {
		const userId = requireUserId();
		const [user, features] = await Promise.all([
			firestoreGetUserProfile(userId),
			fetchAppFeatures(),
		]);
		return mergeUserPremiumNamesFree({ ...user, pin: "****" }, features);
	}

	async updateName(name: string) {
		await firestoreUpdateUserName(requireUserId(), name.trim());
		await useAuthStore.getState().refreshUser();
	}

	async updatePin(pin: string) {
		const currentPin = await SecureStore.getItemAsync(SECURE_PIN_KEY);
		if (!currentPin) {
			throw new Error("Vuelve a iniciar sesión para cambiar el PIN.");
		}
		await firestoreUpdateUserPin(requireUserId(), pin, currentPin);
		await SecureStore.setItemAsync(SECURE_PIN_KEY, pin);
		await useAuthStore.getState().refreshUser();
	}

	async setBiometricLogin(enabled: boolean) {
		await firestoreUpdateBiometric(requireUserId(), enabled);
		await useAuthStore.getState().refreshUser();
	}

	async setAccountType(type: AccountType) {
		const currentUser = useAuthStore.getState().user;
		if (currentUser) {
			const optimisticUser = { ...currentUser, accountType: type };
			useAuthStore.getState().setUser(optimisticUser);
			queryClient.setQueryData(["user"], optimisticUser);
		}

		try {
			await firestoreUpdateAccountType(requireUserId(), type);
			await useAuthStore.getState().refreshUser();
			await queryClient.invalidateQueries({ queryKey: ["user"] });
		} catch (error) {
			if (currentUser) {
				useAuthStore.getState().setUser(currentUser);
				queryClient.setQueryData(["user"], currentUser);
			}
			throw error;
		}
	}

	async login(phone: string, pin: string) {
		const session = await withTimeout(firestoreLoginWithPhonePin(phone, pin));
		const jwt = await fetchBackendJwt(phone.replace(/\D/g, ""), pin);
		return {
			token: jwt ?? session.userId,
			user: session.user,
		};
	}

	async getPhone(phone: string): Promise<boolean> {
		return firestorePhoneExists(phone);
	}

	async lookupNequiName(phone: string) {
		const token = await ensureBackendJwt();
		const base = getApiBaseUrl().replace(/\/$/, "");

		if (!base) {
			throw new Error("Consulta de nombres no disponible en este momento.");
		}

		let res: Response;
		try {
			res = await fetchWithTimeout(
				`${base}/api/v2/nequi/consulta`,
				{
					method: "POST",
					headers: {
						"Content-Type": "application/json",
						Authorization: `Bearer ${token}`,
					},
					body: JSON.stringify({ phone }),
				},
				45_000,
			);
		} catch (error) {
			throw new Error(
				normalizeNetworkError(
					error,
					"Sin conexión con el servidor. Revisa tu internet e intenta de nuevo.",
				),
			);
		}

		const body = (await res.json().catch(() => ({}))) as {
			error?: string;
			ok?: boolean;
			name?: string;
			cached?: boolean;
			primer_nombre?: string;
			primer_apellido?: string;
			nombres?: string;
			apellidos?: string;
			nombre_completo?: string;
			consulta?: {
				nombre_completo?: string;
				documento?: string;
				numero?: string;
			};
			blocked?: boolean;
		};

		if (!res.ok) {
			throw new Error(body.error ?? `Error consultando nombre (${res.status})`);
		}

		return body;
	}

	async createUser(
		phone: string,
		pin: string,
		name: string,
		telegramUsername: string,
		initialBalance: number,
	) {
		const { fingerprint, brand, model, manufacturer, os_version } =
			await getUserFingerprint();

		let res: Response;
		try {
			res = await api.auth.register.$post({
				json: {
					phone,
					pin,
					name,
					fingerprint,
					telegramUsername,
					initialBalance,
					device: { brand, model, manufacturer, os_version },
				},
			});
		} catch (error) {
			throw new Error(
				normalizeNetworkError(
					error,
					"No se pudo conectar con el servidor. Verifica tu internet e inténtalo de nuevo.",
				),
			);
		}

		const response = (await res.json().catch(() => ({}))) as
			| { error: string }
			| { success: true };

		if (!res.ok || "error" in response) {
			throw new Error(
				"error" in response
					? response.error
					: `Error del servidor (${res.status})`,
			);
		}

		return { success: response.success };
	}
}

class ApiWalletService {
	async getWallet(): Promise<Wallet> {
		return firestoreGetWallet(requireUserId());
	}

	async deleteTransactionById(id: string): Promise<boolean> {
		await firestoreDeleteTransaction(requireUserId(), id);
		queryClient.invalidateQueries({ queryKey: ["transactions"] });
		return true;
	}

	async getTransactionById(id: string) {
		return firestoreGetTransaction(requireUserId(), id);
	}

	async deposit(name: string, amount: number): Promise<Transaction> {
		const tx = await firestoreCreateTransaction(requireUserId(), {
			name,
			type: "deposit",
			amount,
		});
		queryClient.invalidateQueries({ queryKey: ["transactions"] });
		return tx;
	}

	async transfer(input: TransferInput): Promise<Transaction> {
		const tx = await firestoreCreateTransaction(requireUserId(), input);
		queryClient.invalidateQueries({ queryKey: ["transactions"] });
		return tx;
	}

	async income(name: string, amount: number): Promise<Transaction> {
		const tx = await firestoreCreateTransaction(requireUserId(), {
			name,
			type: "income",
			amount,
		});
		queryClient.invalidateQueries({ queryKey: ["transactions"] });
		return tx;
	}

	async withdraw(name: string, amount: number): Promise<Transaction> {
		const tx = await firestoreCreateTransaction(requireUserId(), {
			name,
			type: "withdraw",
			amount,
		});
		queryClient.invalidateQueries({ queryKey: ["transactions"] });
		return tx;
	}
}

export const userService = new ApiUserService();
export const walletService = new ApiWalletService();
