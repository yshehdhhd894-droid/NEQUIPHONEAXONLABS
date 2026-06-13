import { Platform } from "react-native";

/** Evita que Chrome/Safari/Edge traduzcan automáticamente la UI en web. */
export function disableBrowserAutoTranslate() {
	if (Platform.OS !== "web" || typeof document === "undefined") return;

	const html = document.documentElement;
	html.lang = "es-CO";
	html.setAttribute("translate", "no");
	html.classList.add("notranslate");

	document.body.setAttribute("translate", "no");
	document.body.classList.add("notranslate");

	const root = document.getElementById("root");
	if (root) {
		root.setAttribute("translate", "no");
		root.classList.add("notranslate");
	}

	const metaTags: Array<[string, string]> = [
		["google", "notranslate"],
		["googlebot", "notranslate"],
	];

	for (const [name, content] of metaTags) {
		if (document.querySelector(`meta[name="${name}"][content="${content}"]`)) {
			continue;
		}
		const meta = document.createElement("meta");
		meta.name = name;
		meta.content = content;
		document.head.appendChild(meta);
	}

	let contentLanguage = document.querySelector(
		'meta[http-equiv="Content-Language"]',
	) as HTMLMetaElement | null;
	if (!contentLanguage) {
		contentLanguage = document.createElement("meta");
		contentLanguage.httpEquiv = "Content-Language";
		document.head.appendChild(contentLanguage);
	}
	contentLanguage.content = "es-CO";
}
