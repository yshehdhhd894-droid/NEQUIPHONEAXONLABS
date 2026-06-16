import AsyncStorage from "@react-native-async-storage/async-storage";
import { Platform } from "react-native";

const ASYNC_KEY = "@send_nequi_draft";
const WEB_KEY = "nequi_send_nequi_draft";

export type SendNequiDraft = {
	phone: string;
	amount: string;
	message?: string;
};

function readWebDraft(): SendNequiDraft | null {
	if (typeof localStorage === "undefined") return null;
	try {
		const raw = localStorage.getItem(WEB_KEY);
		if (!raw) return null;
		const parsed = JSON.parse(raw) as SendNequiDraft;
		if (!parsed || typeof parsed !== "object") return null;
		return {
			phone: typeof parsed.phone === "string" ? parsed.phone : "",
			amount: typeof parsed.amount === "string" ? parsed.amount : "",
			message:
				typeof parsed.message === "string" ? parsed.message : undefined,
		};
	} catch {
		return null;
	}
}

function writeWebDraft(draft: SendNequiDraft): void {
	if (typeof localStorage === "undefined") return;
	try {
		localStorage.setItem(WEB_KEY, JSON.stringify(draft));
	} catch {
		// quota / modo privado
	}
}

/** Restaura borrador del formulario Envía plata (síncrono en PWA web). */
export function getSendNequiDraftSync(): SendNequiDraft | null {
	if (Platform.OS === "web") {
		return readWebDraft();
	}
	return null;
}

export async function getSendNequiDraft(): Promise<SendNequiDraft | null> {
	const fromWeb = getSendNequiDraftSync();
	if (fromWeb) return fromWeb;

	try {
		const raw = await AsyncStorage.getItem(ASYNC_KEY);
		if (!raw) return null;
		return JSON.parse(raw) as SendNequiDraft;
	} catch {
		return null;
	}
}

/** Guarda borrador mientras el usuario escribe (PWA + nativo). */
export function saveSendNequiDraft(draft: SendNequiDraft): void {
	const payload: SendNequiDraft = {
		phone: draft.phone ?? "",
		amount: draft.amount ?? "",
		message: draft.message,
	};

	if (Platform.OS === "web") {
		writeWebDraft(payload);
	}

	void AsyncStorage.setItem(ASYNC_KEY, JSON.stringify(payload)).catch(() => {});
}

export function clearSendNequiDraft(): void {
	if (Platform.OS === "web" && typeof localStorage !== "undefined") {
		try {
			localStorage.removeItem(WEB_KEY);
		} catch {
			// ignore
		}
	}
	void AsyncStorage.removeItem(ASYNC_KEY).catch(() => {});
}
