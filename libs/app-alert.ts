import type { AppAlertConfirm } from "@/store/useAppAlertStore";
import { useAppAlertStore } from "@/store/useAppAlertStore";

/** Rojo-coral Nequi (zanahoria): rojo fusionado con rosa, no rosa puro. */
export const APP_ALERT_BACKGROUND = "#FF585F";
/** Verde Nequi para alertas de éxito / excelente. */
export const APP_ALERT_SUCCESS_BACKGROUND = "#0eb364";
export const APP_ALERT_SUCCESS_ICON_CIRCLE = "#9ae5c0";
export const APP_ALERT_TEXT = "#1C1C1C";
export const CONNECTION_ERROR_MESSAGE =
	"Ha ocurrido un error de conexión, por favor inténtalo nuevamente";

export function showAppAlert(message: string) {
	useAppAlertStore.getState().show(message, "error");
}

export function showAppSuccess(message: string) {
	useAppAlertStore.getState().show(message, "success");
}

export function hideAppAlert() {
	useAppAlertStore.getState().hide();
}

export function showAppError(message = CONNECTION_ERROR_MESSAGE) {
	showAppAlert(message);
}

export function showAppConfirm(options: AppAlertConfirm) {
	useAppAlertStore.getState().showConfirm(options);
}

export function isConnectionError(message: string) {
	if (message === CONNECTION_ERROR_MESSAGE) return true;

	const lower = message.toLowerCase();
	return (
		lower.includes("network") ||
		lower.includes("fetch") ||
		lower.includes("failed") ||
		lower.includes("conexión") ||
		lower.includes("conexion") ||
		lower.includes("servidor") ||
		lower.includes("mantenimiento")
	);
}
