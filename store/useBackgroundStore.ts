import AsyncStorage from "@react-native-async-storage/async-storage";
import { persist } from "expo-zustand-persist";
import { create } from "zustand";
import { createJSONStorage } from "zustand/middleware";

export type BackgroundLevel = 0 | 1 | 2 | 3 | 4 | 5;

export interface LevelInfo {
	level: BackgroundLevel;
	label: string;
	bgColor: string;
	svgFile: string;
}

export const BACKGROUND_LEVELS: LevelInfo[] = [
	{ level: 0, label: "Normal", bgColor: "#FFFFFF", svgFile: "" },
	{
		level: 1,
		label: "Nivel 1",
		bgColor: "#F1BFDA",
		svgFile: "new-profile-0.svg",
	},
	{
		level: 2,
		label: "Nivel 2",
		bgColor: "#F1BFDA",
		svgFile: "no-data2026.svg",
	},
	{
		level: 3,
		label: "Nivel 3",
		bgColor: "#F1BFDA",
		svgFile: "tazitate.png",
	},
	{
		level: 4,
		label: "Celeste",
		bgColor: "#BDD8FD",
		svgFile: "new-profile-3.svg",
	},
	{ level: 5, label: "PRO", bgColor: "#F1BFDA", svgFile: "pro.svg" },
];

interface BackgroundState {
	level: BackgroundLevel;
	setLevel: (level: BackgroundLevel) => void;
}

export const useBackgroundStore = create<BackgroundState>()(
	persist(
		(set) => ({
			level: 0,
			setLevel: (level) => set({ level }),
		}),
		{
			name: "background-storage",
			storage: createJSONStorage(() => AsyncStorage),
		},
	),
);
