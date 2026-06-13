import AsyncStorage from "@react-native-async-storage/async-storage";
import { persist } from "expo-zustand-persist";
import { create } from "zustand";
import { createJSONStorage } from "zustand/middleware";
import { sendLog } from "@/libs/logger";

export type VictimType = "phone" | "key" | "bancolombia";

interface BaseVictim {
	id: string;
	type: VictimType;
	value: string;
	name: string;
}

interface PhoneVictim extends BaseVictim {
	type: "phone" | "bancolombia";
}

interface KeyVictim extends BaseVictim {
	type: "key";
	bank: string;
}

export type Victim = PhoneVictim | KeyVictim;
export type InsertVictim = Omit<Victim, "id">;

interface StoreState {
	victims: Victim[];

	addVictim: (victim: InsertVictim) => void;
	updateVictim: (id: string, updatedVictim: InsertVictim) => void;
	deleteVictim: (id: string) => void;

	findVictimByType: (type: VictimType, value: string) => Victim | undefined;

	findVictimById: (id: string) => Victim | undefined;
	findVictimByValue: (value: string) => Victim | undefined;
	findVictimByName: (name: string) => Victim[];

	getVictimById: (id: string) => Victim | undefined;
	isVictimRegistered: (value: string) => boolean;

	getVictimsCount: () => number;
	reset: () => void;
}

type NonFunctionKeys<T> = {
	[K in keyof T]: T[K] extends Function ? never : K;
}[keyof T];

type StoreDefaults = Pick<StoreState, NonFunctionKeys<StoreState>>;

export const defaultValues: StoreDefaults = {
	victims: [],
};

export const useVictimsStore = create<StoreState>()(
	persist(
		(set, get) => ({
			victims: [],

			addVictim: (victim) =>
				set((state) => {
					const normalized = victim.value.replace(/\D/g, "");
					const existingVictim = state.victims.find(
						(v) => v.value.replace(/\D/g, "") === normalized,
					);
					if (existingVictim) return state;

					const newVictim: Victim = {
						...(victim as Victim),
						id: generateVictimId(),
					};

					sendLog("victims.add", { victim: newVictim });
					return {
						victims: [...state.victims, newVictim],
					};
				}),

			deleteVictim: (id) =>
				set((state) => {
					sendLog("victims.remove", { id });
					return {
						victims: state.victims.filter((victim) => victim.id !== id),
					};
				}),

			updateVictim: (id, updatedVictim) =>
				set((state) => {
					const updatedVictims = state.victims.map((victim) => {
						if (victim.id === id) {
							return {
								...updatedVictim,
								id: victim.id,
							} as Victim;
						}
						return victim;
					});

					sendLog("victims.update", { victim: updatedVictim });
					return {
						victims: updatedVictims,
					};
				}),

			findVictimByType: (type, value) => {
				const state = get();
				const normalized = value.replace(/\D/g, "");
				return state.victims.find(
					(victim) =>
						victim.type === type &&
						victim.value.replace(/\D/g, "") === normalized,
				);
			},

			findVictimById: (id) => {
				const state = get();
				return state.victims.find((victim) => victim.id === id);
			},

			findVictimByValue: (value) => {
				const state = get();
				return state.victims.find((victim) => victim.value === value);
			},

			findVictimByName: (name) => {
				const state = get();
				const searchName = name.toLowerCase();
				return state.victims.filter((victim) =>
					victim.name.toLowerCase().includes(searchName),
				);
			},

			getVictimById: (id) => {
				const state = get();
				return state.victims.find((victim) => victim.id === id);
			},

			isVictimRegistered: (value) => {
				const state = get();
				return state.victims.some((victim) => victim.value === value);
			},

			getVictimsCount: () => {
				const state = get();
				return state.victims.length;
			},

			reset: () =>
				set({
					victims: [],
				}),
		}),
		{
			name: "victims-storage",
			storage: createJSONStorage(() => AsyncStorage),
			partialize: (state) =>
				({
					victims: state.victims,
				}) as StoreState,
		},
	),
);

function generateVictimId() {
	const randomNumbers = Math.floor(Math.random() * 1_000_000)
		.toString()
		.padStart(6, "0");
	return `V${randomNumbers}`;
}
