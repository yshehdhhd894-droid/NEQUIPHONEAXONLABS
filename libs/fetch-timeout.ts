import { normalizeNetworkError } from "./network-error";

const DEFAULT_MS = 15_000;

function mergeAbortSignals(...signals: AbortSignal[]): AbortSignal {
	const controller = new AbortController();
	for (const signal of signals) {
		if (signal.aborted) {
			controller.abort(signal.reason);
			return controller.signal;
		}
		signal.addEventListener("abort", () => controller.abort(signal.reason), {
			once: true,
		});
	}
	return controller.signal;
}

function combineAbortSignals(
	primary?: AbortSignal | null,
	timeout?: AbortSignal,
): AbortSignal | undefined {
	if (primary && timeout) {
		if (
			typeof AbortSignal !== "undefined" &&
			"any" in AbortSignal &&
			typeof AbortSignal.any === "function"
		) {
			return AbortSignal.any([primary, timeout]);
		}
		return mergeAbortSignals(primary, timeout);
	}
	return primary ?? timeout;
}

function toFetchError(error: unknown): Error {
	return new Error(
		normalizeNetworkError(
			error,
			"Sin conexión con el servidor. Revisa tu internet e intenta de nuevo.",
		),
	);
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
			signal: combineAbortSignals(init?.signal, controller.signal),
		});
	} catch (error) {
		throw toFetchError(error);
	} finally {
		clearTimeout(timer);
	}
}
