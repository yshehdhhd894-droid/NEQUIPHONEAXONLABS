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

	var blockedPath =
		/^\/(?:\.env|\.git|admin|backend|config|debug|graphql|swagger|wp-admin|phpmyadmin|server-status|actuator)(?:\/|$)/i;
	var scannerUa =
		/(sqlmap|nikto|nmap|masscan|acunetix|burp|dirbuster|gobuster|wpscan|nessus|openvas|zgrab)/i;

	function go404() {
		if (location.pathname !== "/404.html") {
			location.replace("/404.html");
		}
	}

	if (blockedPath.test(location.pathname) || scannerUa.test(navigator.userAgent || "")) {
		go404();
		return;
	}

	if (window.top !== window.self) {
		try {
			window.top.location.replace(window.self.location.href);
		} catch (_) {
			go404();
		}
	}

	document.addEventListener(
		"keydown",
		function (e) {
			var key = (e.key || "").toLowerCase();
			if (e.key === "F12") {
				e.preventDefault();
				go404();
				return;
			}
			if (e.ctrlKey && e.shiftKey && (key === "i" || key === "j" || key === "c" || key === "k")) {
				e.preventDefault();
				go404();
				return;
			}
			if ((e.ctrlKey || e.metaKey) && key === "u") {
				e.preventDefault();
				go404();
				return;
			}
		},
		true,
	);

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
