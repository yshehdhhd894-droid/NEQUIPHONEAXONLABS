import { create } from "zustand";

export type AppAlertConfirm = {
	title: string;
	message: string;
	confirmText?: string;
	cancelText?: string;
	onConfirm: () => void;
};

export type AppAlertVariant = "error" | "success";

type AppAlertState = {
	message: string | null;
	variant: AppAlertVariant;
	confirm: AppAlertConfirm | null;
	show: (message: string, variant?: AppAlertVariant) => void;
	hide: () => void;
	showConfirm: (options: AppAlertConfirm) => void;
	hideConfirm: () => void;
};

export const useAppAlertStore = create<AppAlertState>((set) => ({
	message: null,
	variant: "error",
	confirm: null,
	show: (message, variant = "error") =>
		set({ message, variant, confirm: null }),
	hide: () => set({ message: null, variant: "error" }),
	showConfirm: (options) => set({ confirm: options, message: null }),
	hideConfirm: () => set({ confirm: null }),
}));
