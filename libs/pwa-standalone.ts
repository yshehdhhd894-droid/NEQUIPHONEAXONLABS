import { Platform } from "react-native";

export const PWA_INSTALLED_KEY = "nequi-installed";

export function isPwaStandalone(): boolean {
	if (Platform.OS !== "web" || typeof window === "undefined") return true;
	return (
		window.matchMedia("(display-mode: standalone)").matches ||
		window.matchMedia("(display-mode: fullscreen)").matches ||
		window.matchMedia("(display-mode: minimal-ui)").matches ||
		window.matchMedia("(display-mode: window-controls-overlay)").matches ||
		(window.navigator as Navigator & { standalone?: boolean }).standalone ===
			true
	);
}

function isLocalDevHost(): boolean {
	if (typeof window === "undefined") return true;
	const host = window.location.hostname;
	return host === "localhost" || host === "127.0.0.1";
}

/** Chrome/pestaña normal → bienvenida. Solo PWA instalada (standalone) entra a /app. */
export function redirectIfBrowserNotInstalled(): void {
	if (Platform.OS !== "web" || typeof window === "undefined") return;
	if (typeof __DEV__ !== "undefined" && __DEV__) return;
	if (isLocalDevHost()) return;
	if (isPwaStandalone()) return;
	window.location.replace("/");
}

export function markAppBootReady(): void {
	if (typeof window === "undefined") return;
	const win = window as Window & {
		__NEQUI_APP_READY__?: boolean;
		__NEQUI_BOOT_RELOADED__?: boolean;
		__NEQUI_SCRIPT_RELOADED__?: boolean;
	};
	win.__NEQUI_APP_READY__ = true;
	win.__NEQUI_BOOT_RELOADED__ = false;
	win.__NEQUI_SCRIPT_RELOADED__ = false;
	try {
		sessionStorage.removeItem("nequi-boot-reload");
		sessionStorage.removeItem("nequi-script-reload");
		sessionStorage.removeItem("nequi-sw-cleared");
		sessionStorage.removeItem("nequi-auto-enter");
		localStorage.removeItem("nequi-auto-enter");
	} catch {
		// ignore
	}
}
