const DEFAULT_MS = 15_000;

const CONNECTION_ERROR =
	"Sin conexión con el servidor. Revisa tu internet e intenta de nuevo.";

function toFetchError(error: unknown): Error {
	if (error instanceof Error && error.message && error.name !== "DOMException") {
		return error;
	}
	if (error instanceof DOMException) {
		if (error.name === "AbortError") {
			return new Error("Tiempo de espera agotado al conectar con el servidor");
		}
		return new Error(CONNECTION_ERROR);
	}
	return new Error(CONNECTION_ERROR);
}

/** Evita que fetch quede colgado y que DOMException llegue crudo a la UI. */
export async function fetchWithTimeout(
	input: RequestInfo | URL,
	init?: RequestInit,
	timeoutMs = DEFAULT_MS,
): Promise<Response> {
	const controller = new AbortController();
	const timer = setTimeout(() => controller.abort(), timeoutMs);
	try {
		return await fetch(input, {
			...init,
			signal: init?.signal
				? AbortSignal.any([init.signal, controller.signal])
				: controller.signal,
		});
	} catch (error) {
		throw toFetchError(error);
	} finally {
		clearTimeout(timer);
	}
}
