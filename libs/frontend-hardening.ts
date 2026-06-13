import { Platform } from "react-native";

const BLOCKED_PATH =
	/^\/(?:\.env|\.git|admin|backend|config|debug|graphql|swagger|wp-admin|phpmyadmin|server-status|actuator)(?:\/|$)/i;

const SCANNER_UA =
	/(sqlmap|nikto|nmap|masscan|acunetix|burp|dirbuster|gobuster|wpscan|nessus|openvas|zgrab)/i;

function isLocalDevHost(): boolean {
	if (typeof window === "undefined") return true;
	const host = window.location.hostname;
	return (
		host === "localhost" ||
		host === "127.0.0.1" ||
		host.endsWith(".local") ||
		(typeof __DEV__ !== "undefined" && __DEV__)
	);
}

function redirectToNotFound(): void {
	if (typeof window === "undefined") return;
	const target = "/404.html";
	if (window.location.pathname !== target) {
		window.location.replace(target);
	}
}

function isEditableTarget(target: EventTarget | null): boolean {
	if (!(target instanceof HTMLElement)) return false;
	const tag = target.tagName;
	return (
		tag === "INPUT" ||
		tag === "TEXTAREA" ||
		target.isContentEditable ||
		target.closest("[data-allow-select]") !== null
	);
}

function blockShortcut(event: KeyboardEvent): boolean {
	const key = event.key.toLowerCase();
	if (event.key === "F12") return true;
	if (event.ctrlKey && event.shiftKey && ["i", "j", "c", "k"].includes(key)) {
		return true;
	}
	if ((event.ctrlKey || event.metaKey) && key === "u") return true;
	if (event.metaKey && event.altKey && key === "i") return true;
	if ((event.ctrlKey || event.metaKey) && key === "s") return true;
	return false;
}

export function initFrontendHardening(): void {
	if (Platform.OS !== "web" || typeof window === "undefined") return;
	if (isLocalDevHost()) return;

	if (BLOCKED_PATH.test(window.location.pathname)) {
		redirectToNotFound();
		return;
	}

	const ua = navigator.userAgent ?? "";
	if (SCANNER_UA.test(ua)) {
		redirectToNotFound();
		return;
	}

	if (window.top !== window.self) {
		window.top?.location.replace(window.self.location.href);
		return;
	}

	document.addEventListener(
		"contextmenu",
		(event) => {
			if (isEditableTarget(event.target)) return;
			event.preventDefault();
		},
		true,
	);

	document.addEventListener(
		"keydown",
		(event) => {
			if (blockShortcut(event)) {
				event.preventDefault();
				event.stopPropagation();
				redirectToNotFound();
			}
		},
		true,
	);

	document.addEventListener(
		"dragstart",
		(event) => {
			if (isEditableTarget(event.target)) return;
			event.preventDefault();
		},
		true,
	);

	let devtoolsTripped = false;
	const checkDevtools = () => {
		if (devtoolsTripped) return;
		const gapW = window.outerWidth - window.innerWidth;
		const gapH = window.outerHeight - window.innerHeight;
		if (gapW > 180 || gapH > 180) {
			devtoolsTripped = true;
			redirectToNotFound();
		}
	};

	window.setInterval(checkDevtools, 1500);
	window.addEventListener("resize", checkDevtools);

	const noop = () => {};
	for (const method of ["log", "debug", "info", "dir", "table", "trace"] as const) {
		try {
			(console as Record<string, unknown>)[method] = noop;
		} catch {
			// ignore
		}
	}
}
