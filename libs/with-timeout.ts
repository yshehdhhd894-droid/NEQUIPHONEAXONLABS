const DEFAULT_MS = 12_000;

export async function withTimeout<T>(
	promise: Promise<T>,
	timeoutMs = DEFAULT_MS,
	message = "La conexión tardó demasiado. Revisa tu internet e intenta de nuevo.",
): Promise<T> {
	let timer: ReturnType<typeof setTimeout> | undefined;
	try {
		return await Promise.race([
			promise,
			new Promise<T>((_, reject) => {
				timer = setTimeout(() => reject(new Error(message)), timeoutMs);
			}),
		]);
	} finally {
		if (timer) clearTimeout(timer);
	}
}
