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
})();
