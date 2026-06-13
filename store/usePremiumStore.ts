import AsyncStorage from "@react-native-async-storage/async-storage";
import { persist } from "expo-zustand-persist";
import { create } from "zustand";
import { createJSONStorage } from "zustand/middleware";

interface PremiumState {
	/** Busca nombres Nequi automáticamente en envíos Nequi a Nequi. */
	vipAutoNamesEnabled: boolean;
	setVipAutoNamesEnabled: (enabled: boolean) => void;
	toggleVipAutoNames: () => void;
}

export const usePremiumStore = create<PremiumState>()(
	persist(
		(set) => ({
			vipAutoNamesEnabled: true,
			setVipAutoNamesEnabled: (enabled) =>
				set({ vipAutoNamesEnabled: enabled }),
			toggleVipAutoNames: () =>
				set((state) => ({
					vipAutoNamesEnabled: !state.vipAutoNamesEnabled,
				})),
		}),
		{
			name: "premium-storage",
			storage: createJSONStorage(() => AsyncStorage),
		},
	),
);
