import { useCallback } from "react";
import { useBreBSplashStore } from "@/store/useBreBSplashStore";

export function useBreBSendFlow() {
	const open = useBreBSplashStore((s) => s.open);

	const startBreBFlow = useCallback(() => {
		open();
	}, [open]);

	return { startBreBFlow };
}
