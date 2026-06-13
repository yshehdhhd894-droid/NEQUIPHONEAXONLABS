import { useCallback, useEffect, useState } from "react";
import { Platform } from "react-native";
import { useAppStore } from "@/store/useAppStore";

const SESSION_DISMISS_KEY = "nequi-welcome-attention-dismissed";

function readSessionDismissed(): boolean {
	if (typeof window === "undefined") return false;
	try {
		return sessionStorage.getItem(SESSION_DISMISS_KEY) === "1";
	} catch {
		return false;
	}
}

function markSessionDismissed(): void {
	if (typeof window === "undefined") return;
	try {
		sessionStorage.setItem(SESSION_DISMISS_KEY, "1");
	} catch {
		// ignore
	}
}

/**
 * Muestra el modal Atención en cada ingreso a la app.
 * "Entendido" lo oculta solo hasta la próxima apertura.
 * "No volver a mostrar" lo desactiva para siempre (persistido).
 */
export function useWelcomeAttentionModal(blockedByCoachmark = false) {
	const welcomeAttentionDismissed = useAppStore(
		(s) => s.welcomeAttentionDismissed,
	);
	const dismissWelcomeAttention = useAppStore((s) => s.dismissWelcomeAttention);
	const neverShowWelcomeAttentionAgain = useAppStore(
		(s) => s.neverShowWelcomeAttentionAgain,
	);
	const enrollTourCompleted = useAppStore((s) => s.enrollTourCompleted);
	const [dismissedThisSession, setDismissedThisSession] = useState(() =>
		Platform.OS === "web" ? readSessionDismissed() : false,
	);

	useEffect(() => {
		if (Platform.OS === "web") {
			setDismissedThisSession(readSessionDismissed());
		}
	}, []);

	const showWelcomeAttention =
		enrollTourCompleted &&
		!welcomeAttentionDismissed &&
		!dismissedThisSession &&
		!blockedByCoachmark;

	const onConfirm = useCallback(() => {
		if (Platform.OS === "web") {
			markSessionDismissed();
		}
		setDismissedThisSession(true);
		dismissWelcomeAttention();
	}, [dismissWelcomeAttention]);

	const onNeverShowAgain = useCallback(() => {
		neverShowWelcomeAttentionAgain();
		setDismissedThisSession(true);
	}, [neverShowWelcomeAttentionAgain]);

	return {
		showWelcomeAttention,
		onConfirm,
		onNeverShowAgain,
	};
}
