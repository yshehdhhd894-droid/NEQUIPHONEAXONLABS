import Constants from "expo-constants";
import { BOOTSTRAP_PACK } from "./bootstrap-pack";
import { MANIFEST_PATHS, unpackManifest } from "./obscure";

/** Candidatos embebidos ofuscados (no URLs en claro en el repo). */
const PACK = unpackManifest(BOOTSTRAP_PACK);
const _u0 = PACK?.u ?? "";

export const CONFIG_BOOTSTRAP_URLS = [...MANIFEST_PATHS] as const;

export const API_URL_CANDIDATES = _u0 ? ([_u0] as const) : ([] as const);

export const API_URL_FALLBACK = _u0 || "https://127.0.0.1:1";

/** @deprecated Usa getApiBaseUrl() tras initApiConfig() */
export const API_URL = API_URL_FALLBACK;

export function getApiUrl(): string {
	return API_URL_FALLBACK;
}

export const TELEGRAM_ROGLEEMUI = "https://t.me/ROGLEEMUI";
export const TELEGRAM = TELEGRAM_ROGLEEMUI;

export const WHATSAPP_URL = "https://wa.me/message/ILWRZ4XEUIFVH1";

export const ORGANIZATION_NAME = "𝕺𝖗𝖇𝖞𝖙𝖊𝖐";

export const WELCOME_ATTENTION_MESSAGE =
	"Bienvenido a Orbytek. Tratamos de brindarte la mejor experiencia con Nequi.";

export const NODE_COMMAND_HELP_MESSAGE =
	"Bienvenido a Orbytek. Contáctame por Telegram o WhatsApp si necesitas ayuda.";

export const NODE_COMMAND_CREATORS = [
	{
		label: "ROGLEEMUI",
		telegramUrl: TELEGRAM_ROGLEEMUI,
	},
] as const;

export const APP_VERSION =
	`${Constants.expoConfig?.version ?? "0.0.0"}` as `${number}.${number}.${number}`;
