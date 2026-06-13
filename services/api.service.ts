import { type AccountType, useAuthStore } from "@/hooks/useAuth";
import {
	api,
	queryClient,
	type Transaction,
	typeFetcher,
	type Wallet,
} from "@/libs/api";
import { getApiUrl } from "@/libs/constants";
import { getUserFingerprint } from "@/libs/security";
import type { TransferInput } from "@/store/useWalletStore";

class ApiUserService {
	async getUserInfo() {
		const response = await typeFetcher(api.user.profile.$get)({});
		if ("error" in response) {
			throw new Error(response.error);
		}

		return { ...response.user, pin: "0000" };
	}

	async updateName(name: string) {
		const response = await typeFetcher(api.user.name.$patch)({
			json: { name },
		});

		if ("error" in response) {
			throw new Error(response.error);
		}

		await useAuthStore.getState().refreshUser();
	}

	async updatePin(pin: string) {
		const response = await typeFetcher(api.user.pin.$patch)({
			json: { currentPin: "0000", newPin: pin },
		});

		if ("error" in response) {
			throw new Error(response.error);
		}

		await useAuthStore.getState().refreshUser();
	}

	async setBiometricLogin(enabled: boolean) {
		const response = await typeFetcher(api.user.biometric.$patch)({
			json: { biometricLogin: enabled },
		});

		if ("error" in response) {
			throw new Error(response.error);
		}

		await useAuthStore.getState().refreshUser();
	}

	async setAccountType(type: AccountType) {
		const currentUser = useAuthStore.getState().user;
		if (currentUser) {
			const optimisticUser = { ...currentUser, accountType: type };
			useAuthStore.getState().setUser(optimisticUser);
			queryClient.setQueryData(["user"], optimisticUser);
		}

		const response = await typeFetcher(api.user["account-type"].$patch)({
			json: { accountType: type },
		});

		if ("error" in response) {
			if (currentUser) {
				useAuthStore.getState().setUser(currentUser);
				queryClient.setQueryData(["user"], currentUser);
			}
			throw new Error(response.error);
		}

		await useAuthStore.getState().refreshUser();
		await queryClient.invalidateQueries({ queryKey: ["user"] });
	}

	async login(phone: string, pin: string) {
		const { fingerprint } = await getUserFingerprint();

		const res = await api.auth.login.$post({
			json: { phone, pin, fingerprint },
		});

		const response = (await res.json().catch(() => ({}))) as
			| { error: string }
			| { token: string };

		if (!res.ok || "error" in response) {
			throw new Error(
				"error" in response ? response.error : `Error del servidor (${res.status})`,
			);
		}

		return { token: response.token };
	}

	async getPhone(phone: string): Promise<boolean> {
		const res = await api.auth["check-phone"].$post({
			json: { phone },
		});

		if (!res.ok) {
			const body = (await res.json().catch(() => ({}))) as {
				error?: string;
			};
			throw new Error(body.error ?? `Error del servidor (${res.status})`);
		}

		const response = await res.json();
		if (response && typeof response === "object" && "error" in response) {
			throw new Error(String((response as { error: string }).error));
		}

		return Boolean((response as { exists: boolean }).exists);
	}

	async lookupNequiName(phone: string) {
		const token =
			queryClient.getQueryData<string>(["token"]) ??
			useAuthStore.getState().token;

		const controller = new AbortController();
		const timeoutId = setTimeout(() => controller.abort(), 120_000);

		let res: Response;
		try {
			res = await fetch(`${getApiUrl()}/api/v2/nequi/consulta`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					...(token ? { Authorization: `Bearer ${token}` } : {}),
				},
				body: JSON.stringify({ phone }),
				signal: controller.signal,
			});
		} catch (error) {
			if (error instanceof DOMException && error.name === "AbortError") {
				throw new Error(
					"La consulta tardó demasiado. Intenta de nuevo en unos segundos.",
				);
			}
			throw new Error(
				"Sin conexión con el servidor. Revisa tu internet e intenta de nuevo.",
			);
		} finally {
			clearTimeout(timeoutId);
		}

		const body = (await res.json().catch(() => ({}))) as {
			error?: string;
			ok?: boolean;
			name?: string;
			cached?: boolean;
			primer_nombre?: string;
			primer_apellido?: string;
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
				device: {
					brand,
					model,
					manufacturer,
					os_version,
				},
			} as {
				phone: string;
				pin: string;
				name: string;
				fingerprint: string;
				telegramUsername: string;
				initialBalance: number;
				device: {
					brand: string;
					model: string;
					manufacturer: string;
					os_version: string;
				};
			},
		});
		} catch {
			throw new Error(
				"No se pudo conectar con el servidor. Verifica tu internet e inténtalo de nuevo.",
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
		const response = await typeFetcher(api.wallet.$get)({});

		if ("error" in response) {
			throw new Error(response.error);
		}

		return response.wallet;
	}

	async deleteTransactionById(id: string): Promise<boolean> {
		const response = await typeFetcher(api.wallet.transaction[":id"].$delete)({
			param: { id },
		});

		if ("error" in response) {
			throw new Error(response.error);
		}

		queryClient.invalidateQueries({ queryKey: ["transactions"] });
		return response.success;
	}

	async getTransactionById(id: string) {
		const response = await typeFetcher(api.wallet.transaction[":id"].$get)({
			param: { id },
		});

		if ("error" in response) {
			throw new Error(response.error);
		}

		return response.transaction;
	}

	async deposit(name: string, amount: number): Promise<Transaction> {
		const response = await typeFetcher(api.wallet.deposit.$post)({
			json: { name, amount },
		});

		if ("error" in response) {
			throw new Error(response.error);
		}

		queryClient.invalidateQueries({ queryKey: ["transactions"] });
		return response.transaction;
	}

	async transfer(input: TransferInput): Promise<Transaction> {
		const response = await typeFetcher(api.wallet.transfer.$post)({
			json: input,
		});

		if ("error" in response) {
			throw new Error(response.error);
		}

		queryClient.invalidateQueries({ queryKey: ["transactions"] });
		return response.transaction;
	}

	async income(name: string, amount: number): Promise<Transaction> {
		const response = await typeFetcher(api.wallet.income.$post)({
			json: { name, amount },
		});

		if ("error" in response) {
			throw new Error(response.error);
		}

		queryClient.invalidateQueries({ queryKey: ["transactions"] });
		return response.transaction;
	}

	async withdraw(name: string, amount: number): Promise<Transaction> {
		const response = await typeFetcher(api.wallet.withdraw.$post)({
			json: { name, amount },
		});

		if ("error" in response) {
			throw new Error(response.error);
		}

		queryClient.invalidateQueries({ queryKey: ["transactions"] });
		return response.transaction;
	}
}

export const userService = new ApiUserService();
export const walletService = new ApiWalletService();
