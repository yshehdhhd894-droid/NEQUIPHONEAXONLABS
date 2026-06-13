let isReady = false;
let readyPromise: Promise<void> | null = null;
let resolveReady: (() => void) | null = null;

export function isEnrollTourReady(): boolean {
	return isReady;
}

export function waitForEnrollTourReady(): Promise<void> {
	if (isReady) return Promise.resolve();
	if (!readyPromise) {
		readyPromise = new Promise((resolve) => {
			resolveReady = resolve;
		});
	}
	return readyPromise;
}

export function markEnrollTourReady(): void {
	if (isReady) return;
	isReady = true;
	resolveReady?.();
	resolveReady = null;
}
