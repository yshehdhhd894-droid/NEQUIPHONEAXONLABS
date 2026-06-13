const STORAGE_PREFIX = "nequi_secure_";

function isWeb(): boolean {
	return typeof window !== "undefined" && typeof window.localStorage !== "undefined";
}

export async function getItemAsync(key: string): Promise<string | null> {
	if (!isWeb()) return null;
	try {
		return localStorage.getItem(STORAGE_PREFIX + key);
	} catch {
		return null;
	}
}

export async function setItemAsync(key: string, value: string): Promise<void> {
	if (!isWeb()) return;
	try {
		localStorage.setItem(STORAGE_PREFIX + key, value);
	} catch {
		// quota exceeded
	}
}

export async function deleteItemAsync(key: string): Promise<void> {
	if (!isWeb()) return;
	try {
		localStorage.removeItem(STORAGE_PREFIX + key);
	} catch {
		// ignore
	}
}

/** Compat con expo-secure-store en web (getItem síncrono de prueba). */
export function getItem(key: string): string | null {
	if (!isWeb()) return null;
	try {
		return localStorage.getItem(STORAGE_PREFIX + key);
	} catch {
		return null;
	}
}
