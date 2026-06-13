import { create } from "zustand";

interface BreBSplashState {
	visible: boolean;
	open: () => void;
	close: () => void;
}

export const useBreBSplashStore = create<BreBSplashState>((set) => ({
	visible: false,
	open: () => set({ visible: true }),
	close: () => set({ visible: false }),
}));
