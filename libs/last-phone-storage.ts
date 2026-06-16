import AsyncStorage from "@react-native-async-storage/async-storage";
import { Platform } from "react-native";

const ASYNC_KEY = "@last_phone";
const ASYNC_DRAFT_KEY = "@phone_draft";
const WEB_KEY = "nequi_last_phone";
const WEB_DRAFT_KEY = "nequi_phone_draft";
const WEB_SECURE_PHONE_KEY = "nequi_secure_secure_phone";

function normalizePhone(phone: string) {
	return phone.replace(/\D/g, "");
}

function readWebDraft(): string | null {
	if (typeof localStorage === "undefined") return null;
	try {
		const fromDraft = localStorage.getItem(WEB_DRAFT_KEY);
		if (fromDraft) return normalizePhone(fromDraft);

		const fromLast = localStorage.getItem(WEB_KEY);
		if (fromLast) return normalizePhone(fromLast);

		const fromSecure = localStorage.getItem(WEB_SECURE_PHONE_KEY);
		if (fromSecure) return normalizePhone(fromSecure);
	} catch {
		// ignore
	}
	return null;
}

function writeWebDraft(phone: string): void {
	if (typeof localStorage === "undefined") return;
	try {
		localStorage.setItem(WEB_DRAFT_KEY, phone);
	} catch {
		// quota / modo privado
	}
}

/** Restaura el teléfono al instante en PWA (sin esperar AsyncStorage). */
export function getPhoneDraftSync(): string | null {
	if (Platform.OS !== "web") return null;
	const draft = readWebDraft();
	return draft && draft.length > 0 ? draft : null;
}

/** Guarda el número mientras el usuario escribe (antes de pulsar Entra). */
export function savePhoneDraft(phone: string): void {
	const clean = normalizePhone(phone);
	if (!clean) return;

	writeWebDraft(clean);
	void AsyncStorage.setItem(ASYNC_DRAFT_KEY, clean).catch(() => {});
}

/** Guarda el último teléfono usado (PWA web + nativo). */
export async function saveLastPhone(phone: string): Promise<void> {
	const clean = normalizePhone(phone);
	if (clean.length < 10) return;

	savePhoneDraft(clean);
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
	const sync = getPhoneDraftSync();
	if (sync) return sync;

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
		const fromDraft = await AsyncStorage.getItem(ASYNC_DRAFT_KEY);
		if (fromDraft) return normalizePhone(fromDraft);

		const stored = await AsyncStorage.getItem(ASYNC_KEY);
		if (stored) return normalizePhone(stored);
	} catch {
		// ignore
	}

	return null;
}
