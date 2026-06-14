import { Platform } from "react-native";

/** Solo endurecimiento suave: no redirige a 404 (rompía login en iPhone al abrir teclado). */
export function initFrontendHardening(): void {
	if (Platform.OS !== "web" || typeof window === "undefined") return;

	const host = window.location.hostname;
	if (
		host === "localhost" ||
		host === "127.0.0.1" ||
		host.endsWith(".local") ||
		(typeof __DEV__ !== "undefined" && __DEV__)
	) {
		return;
	}

	document.addEventListener(
		"contextmenu",
		(event) => {
			const target = event.target;
			if (!(target instanceof HTMLElement)) return;
			const tag = target.tagName;
			if (
				tag === "INPUT" ||
				tag === "TEXTAREA" ||
				target.isContentEditable ||
				target.closest("[data-allow-select]")
			) {
				return;
			}
			event.preventDefault();
		},
		true,
	);
}
