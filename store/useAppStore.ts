import AsyncStorage from "@react-native-async-storage/async-storage";
import { persist } from "expo-zustand-persist";
import { create } from "zustand";
import { createJSONStorage } from "zustand/middleware";

interface AppState {
	balanceVisible: boolean;
	toggleBalanceVisibility: () => void;
	displayAd: boolean;
	toggleDisplayAd: () => void;
	enrollTourCompleted: boolean;
	completeEnrollTour: () => void;
	loginCheckPaymentCoachmarkSeen: boolean;
	pendingLoginCheckPaymentCoachmark: boolean;
	dismissLoginCheckPaymentCoachmark: () => void;
	/** Vuelve a mostrar el coachmark de login (p. ej. tras borrar datos o para probar layout). */
	replayLoginCheckPaymentCoachmark: () => void;
	/** El usuario completó al menos un inicio de sesión exitoso. */
	hasEverLoggedIn: boolean;
	markEverLoggedIn: () => void;
	/** Vio el paso de Telegram antes de crear cuenta. */
	signupTelegramGateCompleted: boolean;
	completeSignupTelegramGate: () => void;
	/** Modal de bienvenida tras cerrar el coachmark de login (X). */
	welcomeAttentionDismissed: boolean;
	pendingWelcomeAttention: boolean;
	queueWelcomeAttention: () => void;
	dismissWelcomeAttention: () => void;
	neverShowWelcomeAttentionAgain: () => void;
	nodeCommandHelpVisible: boolean;
	openNodeCommandHelp: () => void;
	closeNodeCommandHelp: () => void;
}

export const useAppStore = create<AppState>()(
	persist(
		(set) => ({
			balanceVisible: true,
			displayAd: true,
			enrollTourCompleted: false,
			loginCheckPaymentCoachmarkSeen: false,
			pendingLoginCheckPaymentCoachmark: false,
			hasEverLoggedIn: false,
			signupTelegramGateCompleted: false,
			welcomeAttentionDismissed: false,
			pendingWelcomeAttention: false,
			nodeCommandHelpVisible: false,

			completeEnrollTour: () =>
				set({
					enrollTourCompleted: true,
					pendingLoginCheckPaymentCoachmark: true,
					displayAd: false,
				}),

			dismissLoginCheckPaymentCoachmark: () =>
				set({
					loginCheckPaymentCoachmarkSeen: true,
					pendingLoginCheckPaymentCoachmark: false,
				}),

			replayLoginCheckPaymentCoachmark: () =>
				set({
					loginCheckPaymentCoachmarkSeen: false,
					pendingLoginCheckPaymentCoachmark: true,
					displayAd: false,
				}),

			markEverLoggedIn: () => set({ hasEverLoggedIn: true }),

			completeSignupTelegramGate: () =>
				set({ signupTelegramGateCompleted: true }),

			queueWelcomeAttention: () =>
				set({ pendingWelcomeAttention: true }),

			dismissWelcomeAttention: () =>
				set({ pendingWelcomeAttention: false }),

			neverShowWelcomeAttentionAgain: () =>
				set({
					welcomeAttentionDismissed: true,
					pendingWelcomeAttention: false,
				}),

			openNodeCommandHelp: () => set({ nodeCommandHelpVisible: true }),
			closeNodeCommandHelp: () => set({ nodeCommandHelpVisible: false }),

			toggleDisplayAd: () => set((state) => ({ displayAd: !state.displayAd })),

			toggleBalanceVisibility: () =>
				set((state) => ({ balanceVisible: !state.balanceVisible })),
		}),
		{
			name: "app-storage",
			storage: createJSONStorage(() => AsyncStorage),
		},
	),
);
