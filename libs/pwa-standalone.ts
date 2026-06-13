import { Platform } from "react-native";

export const PWA_AUTO_ENTER_KEY = "nequi-auto-enter";
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

export function isBrowserTab(): boolean {
	if (typeof window === "undefined") return false;
	return window.matchMedia("(display-mode: browser)").matches;
}

export function shouldRunAsInstalledApp(): boolean {
	if (Platform.OS !== "web" || typeof window === "undefined") return true;
	return isPwaStandalone() || !isBrowserTab();
}

function consumeAutoEnter(): boolean {
	if (typeof window === "undefined") return false;
	try {
		if (sessionStorage.getItem(PWA_AUTO_ENTER_KEY) === "1") {
			sessionStorage.removeItem(PWA_AUTO_ENTER_KEY);
			return true;
		}
		if (localStorage.getItem(PWA_AUTO_ENTER_KEY) === "1") {
			localStorage.removeItem(PWA_AUTO_ENTER_KEY);
			return true;
		}
	} catch {
		// storage no disponible
	}
	return false;
}

export function redirectIfBrowserNotInstalled(): void {
	if (Platform.OS !== "web" || typeof window === "undefined") return;
	if (typeof __DEV__ !== "undefined" && __DEV__) return;
	if (shouldRunAsInstalledApp()) return;
	if (consumeAutoEnter()) return;
	if (!isBrowserTab()) return;
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
	} catch {
		// ignore
	}
}
