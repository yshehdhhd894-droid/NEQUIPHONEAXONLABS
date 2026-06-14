(function () {
	"use strict";

	var host = location.hostname;
	if (host === "localhost" || host === "127.0.0.1") return;

	var path = location.pathname;
	if (!path.startsWith("/app")) return;

	var standalone =
		window.matchMedia("(display-mode: standalone)").matches ||
		window.matchMedia("(display-mode: fullscreen)").matches ||
		window.matchMedia("(display-mode: minimal-ui)").matches ||
		window.matchMedia("(display-mode: window-controls-overlay)").matches ||
		window.navigator.standalone === true;

	if (!standalone) {
		location.replace("/404.html");
	}
})();
