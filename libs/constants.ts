import Constants from "expo-constants";

/**
 * Bootstrap remoto — config iOS (paralelo al Android en jsonbackend).
 * GitHub/Vercel: public/ios-config.json en el repo del backend iOS.
 */
export const CONFIG_BOOTSTRAP_URL =
	"https://jsonbackend.vercel.app/ios-config.json";

/** Backend iOS Node Command en VPS (no compartir con Android). */
export const API_URL_CANDIDATES = [
	"https://nequi-ios-node.18-118-168-237.nip.io",
] as const;

export const API_URL_FALLBACK = API_URL_CANDIDATES[0];

/** @deprecated Usa getApiBaseUrl() tras initApiConfig() */
export const API_URL = API_URL_FALLBACK;

export function getApiUrl(): string {
	return API_URL_FALLBACK;
}

export const TELEGRAM = "https://t.me/Noderunapps";
export const TELEGRAM_AXONDEVUI = "https://t.me/AXONDEVUI";

export const WELCOME_ATTENTION_MESSAGE =
	"Bienvenido a [𝕹𝖔𝖉𝖊 𝕮𝖔𝖒𝖒𝖆𝖓𝖉] donde tratamos de brindar los mejores servicios.";

export const NODE_COMMAND_HELP_MESSAGE =
	"Bienvenido a [𝕹𝖔𝖉𝖊 𝕮𝖔𝖒𝖒𝖆𝖓𝖉]. Somos un equipo dedicado a brindarte la mejor experiencia. Conoce a quienes hacen posible este proyecto.";

export const NODE_COMMAND_CREATORS = [
	{
		label: "AXONDEVUI",
		telegramUrl: "https://t.me/AXONDEVUI",
	},
	{
		label: "SANGRE_BINEROJS",
		telegramUrl: "https://t.me/SANGRE_BINEROJS",
	},
] as const;

export const APP_VERSION =
	`${Constants.expoConfig?.version ?? "0.0.0"}` as `${number}.${number}.${number}`;
