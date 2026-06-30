(function () {
	"use strict";

	var host = location.hostname;
	if (
		host === "localhost" ||
		host === "127.0.0.1" ||
		host.slice(-6) === ".local"
	) {
		return;
	}

	document.addEventListener(
		"contextmenu",
		function (e) {
			var t = e.target;
			if (!t) return;
			var tag = t.tagName || "";
			if (tag === "INPUT" || tag === "TEXTAREA" || t.isContentEditable) return;
			e.preventDefault();
		},
		true,
	);

	/* Oculta pistas obvias en consola (F12) en producción */
	try {
		var noop = function () {};
		if (window.console) {
			["debug", "info", "log", "warn"].forEach(function (k) {
				try {
					console[k] = noop;
				} catch (e) {}
			});
		}
	} catch (e) {}

	/* Bloquea atajos típicos de inspección (no afecta uso normal de la app) */
	document.addEventListener(
		"keydown",
		function (e) {
			var k = e.key || "";
			if (e.keyCode === 123) {
				e.preventDefault();
				return;
			}
			if (e.ctrlKey && e.shiftKey && (k === "I" || k === "J" || k === "C")) {
				e.preventDefault();
			}
			if (e.metaKey && e.altKey && (k === "i" || k === "I")) {
				e.preventDefault();
			}
		},
		true,
	);
})();
