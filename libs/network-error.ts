import { CONNECTION_ERROR_MESSAGE } from "@/libs/app-alert";

const TIMEOUT_ERROR_MESSAGE =
	"La conexión tardó demasiado. Revisa tu internet e intenta de nuevo.";

const NETWORK_PATTERNS = [
	"abort",
	"aborted",
	"network request failed",
	"failed to fetch",
	"network error",
	"fetch failed",
	"unable to resolve host",
	"econnrefused",
	"enotfound",
	"etimedout",
	"socket",
	"internet",
	"sin conexión",
	"sin conexion",
	"timeout",
	"timed out",
	"tiempo de espera",
	"ssl",
	"cleartext",
	"abortsignal",
] as const;

function isNetworkLikeMessage(message: string, name: string): boolean {
	const lower = message.toLowerCase().trim();
	if (!lower) return true;
	if (name === "AbortError") return true;
	return NETWORK_PATTERNS.some((pattern) => lower.includes(pattern));
}

/** Convierte AbortError / fallos de red en mensajes claros para la UI. */
export function normalizeNetworkError(
	error: unknown,
	fallback = "Ocurrió un error. Intenta de nuevo.",
): string {
	if (typeof error === "string") {
		return isNetworkLikeMessage(error, "")
			? CONNECTION_ERROR_MESSAGE
			: error;
	}

	if (error instanceof DOMException) {
		if (error.name === "AbortError") {
			return TIMEOUT_ERROR_MESSAGE;
		}
		return CONNECTION_ERROR_MESSAGE;
	}

	if (error instanceof Error) {
		const message = error.message?.trim() ?? "";
		if (isNetworkLikeMessage(message, error.name)) {
			if (
				message.toLowerCase().includes("timeout") ||
				message.toLowerCase().includes("tiempo") ||
				error.name === "AbortError"
			) {
				return TIMEOUT_ERROR_MESSAGE;
			}
			return CONNECTION_ERROR_MESSAGE;
		}
		return message || fallback;
	}

	return CONNECTION_ERROR_MESSAGE;
}

export { TIMEOUT_ERROR_MESSAGE };
