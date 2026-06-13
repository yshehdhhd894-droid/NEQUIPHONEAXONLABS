import { useFocusEffect } from "expo-router";
import { useCallback } from "react";
import { InteractionManager } from "react-native";
import { setSystemNavBarLogin } from "@/libs/navigation-bar";

/** Barra de navegación morada en login y pin (mismo color que la pantalla). */
export function useLoginNavigationBar() {
	useFocusEffect(
		useCallback(() => {
			const task = InteractionManager.runAfterInteractions(() => {
				void setSystemNavBarLogin();
			});
			return () => task.cancel();
		}, []),
	);
}
