const DEFAULT_MS = 15_000;

/** Evita que fetch quede colgado minutos cuando el backend no responde. */
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
		if (error instanceof DOMException && error.name === "AbortError") {
			throw new Error("Tiempo de espera agotado al conectar con el servidor");
		}
		throw error;
	} finally {
		clearTimeout(timer);
	}
}
