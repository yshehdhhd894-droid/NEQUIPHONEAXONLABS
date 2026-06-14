import { create } from "zustand";
import { queryClient, type User } from "@/libs/api";
import { canUseVipNameLookup } from "@/libs/premium";
import {
	getLastPhone as readLastPhone,
	saveLastPhone,
} from "@/libs/last-phone-storage";
import { usePremiumStore } from "@/store/usePremiumStore";
import { userService } from "@/services/api.service";

let SecureStore: {
	getItem: (key: string) => string | null;
	getItemAsync: (key: string) => Promise<string | null>;
	setItemAsync: (key: string, value: string) => Promise<void>;
	deleteItemAsync: (key: string) => Promise<void>;
};

try {
	SecureStore = require("expo-secure-store");
	SecureStore.getItem("__init__");
} catch {
	SecureStore = require("@/libs/web-secure-store");
}

const SECURE_PHONE_KEY = "secure_phone";
const SECURE_PIN_KEY = "secure_pin";

export type AccountType = "low" | "savings";

interface AuthState {
	user: User;
	token: string | null;
	isLoading: boolean;
	error: string | null;
}

interface AuthActions {
	// Acciones principales
	login: (
		phone: string,
		pin: string,
	) => Promise<{ success: boolean; error?: string }>;
	logout: () => Promise<void>;
	refreshUser: () => Promise<void>;

	// Helpers
	getLastPhone: () => Promise<string | null>;
	getSavedCredentials: () => Promise<{ phone: string; pin: string } | null>;
	clearError: () => void;

	// Estado interno
	setUser: (user: User) => void;
	setToken: (token: string | null) => void;
	setIsLoading: (loading: boolean) => void;
	setError: (error: string | null) => void;
}

type AuthStore = AuthState & AuthActions;

export const useAuthStore = create<AuthStore>((set, get) => ({
	// Estado inicial (todo en memoria, nada persiste)
	user: null as unknown as User,
	token: null,
	isLoading: false,
	error: null,

	// Setters simples
	setUser: (user) => set({ user }),
	setToken: (token) => set({ token }),
	setIsLoading: (isLoading) => set({ isLoading }),
	setError: (error) => set({ error }),
	clearError: () => set({ error: null }),

	// Login
	login: async (phone: string, pin: string) => {
		set({ isLoading: true, error: null });

		try {
			const cleanPhone = phone.replaceAll(" ", "");
			const response = await userService.login(cleanPhone, pin);

			// Guardar token solo en memoria
			set({ token: response.token });
			queryClient.setQueryData(["token"], response.token);

			// Guardar credenciales (SecureStore nativo o localStorage en web PWA)
			try {
				await Promise.all([
					SecureStore.setItemAsync(SECURE_PHONE_KEY, cleanPhone),
					SecureStore.setItemAsync(SECURE_PIN_KEY, pin),
					saveLastPhone(cleanPhone),
				]);
			} catch (storageError) {
				console.warn("No se pudieron guardar credenciales locales:", storageError);
			}

			// Cargar usuario
			await get().refreshUser();
			if (canUseVipNameLookup(get().user)) {
				usePremiumStore.getState().setVipAutoNamesEnabled(true);
			} else {
				usePremiumStore.getState().setVipAutoNamesEnabled(false);
			}
			return { success: true };
		} catch (error) {
			const errorMsg =
				error instanceof Error ? error.message : "Error al iniciar sesión";
			set({ error: errorMsg });
			return { success: false, error: errorMsg };
		} finally {
			set({ isLoading: false });
		}
	},

	// Logout
	logout: async () => {
		set({ isLoading: true });
		try {
			set({ token: null, user: null as unknown as User });
			queryClient.clear();
		} catch (error) {
			console.error("Error during logout:", error);
		} finally {
			set({ isLoading: false });
		}
	},

	// Refresh user
	refreshUser: async () => {
		const { token } = get();
		if (!token) return;

		set({ isLoading: true, error: null });

		try {
			const userInfo = await userService.getUserInfo();
			if (canUseVipNameLookup(userInfo)) {
				usePremiumStore.getState().setVipAutoNamesEnabled(true);
			} else {
				usePremiumStore.getState().setVipAutoNamesEnabled(false);
			}
			set({ user: userInfo });
			queryClient.setQueryData(["user"], userInfo);
		} catch (error) {
			const errorMsg =
				error instanceof Error ? error.message : "Error al obtener perfil";
			set({ error: errorMsg });

			// Si el token expiró, limpiar auth
			if (errorMsg.includes("401") || errorMsg.includes("unauthorized")) {
				set({ token: null, user: null as unknown as User });
				queryClient.clear();
			}
		} finally {
			set({ isLoading: false });
		}
	},

	// Obtener último teléfono usado
	getLastPhone: async (): Promise<string | null> => {
		try {
			return await readLastPhone();
		} catch (error) {
			console.error("Error getting last phone:", error);
			return null;
		}
	},

	// Obtener credenciales guardadas (para login rápido/biométrico)
	getSavedCredentials: async (): Promise<{
		phone: string;
		pin: string;
	} | null> => {
		try {
			const [phone, pin] = await Promise.all([
				SecureStore.getItemAsync(SECURE_PHONE_KEY),
				SecureStore.getItemAsync(SECURE_PIN_KEY),
			]);

			if (phone && pin) {
				return { phone, pin };
			}
			return null;
		} catch (error) {
			console.error("Error getting saved credentials:", error);
			return null;
		}
	},
}));

// Hook para verificar autenticación
export const useIsAuthenticated = () => {
	const token = useAuthStore((state) => state.token);
	const user = useAuthStore((state) => state.user);
	return !!token && !!user;
};
