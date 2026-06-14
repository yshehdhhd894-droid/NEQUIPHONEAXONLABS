import AsyncStorage from "@react-native-async-storage/async-storage";
import { Platform } from "react-native";

const ASYNC_KEY = "@last_phone";
const WEB_KEY = "nequi_last_phone";
const WEB_SECURE_PHONE_KEY = "nequi_secure_secure_phone";

function normalizePhone(phone: string) {
	return phone.replace(/\D/g, "");
}

/** Guarda el último teléfono usado (PWA web + nativo). */
export async function saveLastPhone(phone: string): Promise<void> {
	const clean = normalizePhone(phone);
	if (clean.length < 10) return;

	await AsyncStorage.setItem(ASYNC_KEY, clean);

	if (Platform.OS === "web" && typeof localStorage !== "undefined") {
		try {
			localStorage.setItem(WEB_KEY, clean);
		} catch {
			// quota / modo privado
		}
	}
}

/** Recupera el último teléfono; en web prioriza localStorage (más estable en PWA). */
export async function getLastPhone(): Promise<string | null> {
	if (Platform.OS === "web" && typeof localStorage !== "undefined") {
		try {
			const fromWeb = localStorage.getItem(WEB_KEY);
			if (fromWeb) return normalizePhone(fromWeb);

			const fromSecure = localStorage.getItem(WEB_SECURE_PHONE_KEY);
			if (fromSecure) return normalizePhone(fromSecure);
		} catch {
			// ignore
		}
	}

	try {
		const stored = await AsyncStorage.getItem(ASYNC_KEY);
		if (stored) return normalizePhone(stored);
	} catch {
		// ignore
	}

	return null;
}
