(function () {
	"use strict";

	function isStandalonePwa() {
		if (window.navigator.standalone === true) return true;
		if (window.matchMedia("(display-mode: standalone)").matches) return true;
		if (window.matchMedia("(display-mode: minimal-ui)").matches) return true;
		return false;
	}

	function isBrowserSession() {
		if (isStandalonePwa()) return false;
		if (window.matchMedia("(display-mode: browser)").matches) return true;
		return true;
	}

	window.__nequiIsStandalonePwa = isStandalonePwa;
	window.__nequiIsBrowserSession = isBrowserSession;
})();
