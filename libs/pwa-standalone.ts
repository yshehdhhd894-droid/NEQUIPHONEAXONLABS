import { Platform } from "react-native";

export const PWA_INSTALLED_KEY = "nequi-installed";
export const PWA_NOT_FOUND_PATH = "/404.html";

/** Solo PWA instalada: iOS home screen o display-mode standalone/minimal-ui. */
export function isPwaStandalone(): boolean {
	if (Platform.OS !== "web" || typeof window === "undefined") return true;

	const nav = window.navigator as Navigator & { standalone?: boolean };
	if (nav.standalone === true) return true;
	if (window.matchMedia("(display-mode: standalone)").matches) return true;
	if (window.matchMedia("(display-mode: minimal-ui)").matches) return true;
	return false;
}

function isBrowserSession(): boolean {
	if (isPwaStandalone()) return false;
	if (window.matchMedia("(display-mode: browser)").matches) return true;
	return true;
}

function isLocalDevHost(): boolean {
	if (typeof window === "undefined") return true;
	const host = window.location.hostname;
	return host === "localhost" || host === "127.0.0.1";
}

function isAppRoute(): boolean {
	if (typeof window === "undefined") return false;
	return window.location.pathname.startsWith("/app");
}

export function redirectIfBrowserNotInstalled(): void {
	if (Platform.OS !== "web" || typeof window === "undefined") return;
	if (typeof __DEV__ !== "undefined" && __DEV__) return;
	if (isLocalDevHost()) return;
	if (!isAppRoute()) return;
	if (!isBrowserSession()) return;
	window.location.replace(PWA_NOT_FOUND_PATH);
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
