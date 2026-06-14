(function () {
	"use strict";

	var host = location.hostname;
	if (host === "localhost" || host === "127.0.0.1") return;

	if (!location.pathname.startsWith("/app")) return;

	var isStandalone =
		typeof window.__nequiIsStandalonePwa === "function"
			? window.__nequiIsStandalonePwa()
			: window.navigator.standalone === true ||
				window.matchMedia("(display-mode: standalone)").matches;

	if (!isStandalone) {
		location.replace("/404.html");
	}
})();
