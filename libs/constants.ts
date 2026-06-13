import Constants from "expo-constants";

/**
 * URL pública del backend Nequi iOS (túnel HTTPS en VPS Axion).
 * Solo va la URL del API — nunca tokens, JWT secret ni claves en el cliente PWA.
 */
export const API_URL =
	"https://antiques-manchester-baseball-outcome.trycloudflare.com";

export function getApiUrl(): string {
	return API_URL;
}

export const TELEGRAM = "https://t.me/axonlabsorg";
export const TELEGRAM_AXONDEVUI = "https://t.me/AXONDEVUI";

export const WELCOME_ATTENTION_MESSAGE =
	"Bienvenido a la comunidad de Axonlabsorg donde tratamos de brindar los mejores servicios. App ya disponible para Android e iPhone.";

export const APP_VERSION =
	`${Constants.expoConfig?.version ?? "0.0.0"}` as `${number}.${number}.${number}`;
