import { cpSync, existsSync, readFileSync, readdirSync, rmSync, statSync, unlinkSync, writeFileSync } from "node:fs";
import { execSync } from "node:child_process";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("..", import.meta.url));
const dist = join(root, "dist");
const publicDir = join(root, "public");
const SW_VERSION = "nequi-v16";

const HARDENING_HEAD = `<script src="/hardening.js" defer></script>`;

/** Bloquea /app en Chrome; solo modo standalone (PWA instalada). */
const PWA_GATE_SCRIPT = `<script>
(function () {
	var h = location.hostname;
	if (h === "localhost" || h === "127.0.0.1") return;
	var standalone =
		window.matchMedia("(display-mode: standalone)").matches ||
		window.matchMedia("(display-mode: fullscreen)").matches ||
		window.matchMedia("(display-mode: minimal-ui)").matches ||
		window.matchMedia("(display-mode: window-controls-overlay)").matches ||
		window.navigator.standalone === true;
	if (!standalone) location.replace("/");
})();
</script>`;

const APP_BOOT_SCRIPT = `<script>
(function () {
	var SW_VER = "${SW_VERSION}";
	try {
		if (localStorage.getItem("nequi-sw-version") !== SW_VER) {
			localStorage.setItem("nequi-sw-version", SW_VER);
			if ("serviceWorker" in navigator) {
				navigator.serviceWorker.getRegistrations().then(function (regs) {
					return Promise.all(regs.map(function (r) { return r.unregister(); }));
				}).then(function () { location.reload(); });
			}
		}
	} catch (e) {}
})();
</script>`;

function injectAppBootScript(appIndexPath) {
	if (!existsSync(appIndexPath)) return;
	let html = readFileSync(appIndexPath, "utf8");
	html = html.replace(
		/<script>\s*\(function\s*\(\)\s*\{[\s\S]*?nequi-sw-version[\s\S]*?\}\)\(\);\s*<\/script>/i,
		"",
	);
	html = html.replace("<head>", "<head>" + PWA_GATE_SCRIPT + APP_BOOT_SCRIPT + HARDENING_HEAD);
	html = html.replace(
		/<script src="(\/app\/_expo\/static\/js\/web\/entry-[^"]+\.js)" defer><\/script>/,
		'<script type="module" src="$1"></script>',
	);
	writeFileSync(appIndexPath, html);
}

const NO_TRANSLATE_HEAD = `<meta http-equiv="Content-Language" content="es-CO"/><meta name="google" content="notranslate"/><meta name="googlebot" content="notranslate"/>`;

function applyNoTranslateHtml(htmlPath) {
	if (!existsSync(htmlPath)) return;
	let html = readFileSync(htmlPath, "utf8");

	html = html.replace(/<html([^>]*)\slang="en"([^>]*)>/gi, '<html$1 lang="es-CO" translate="no" class="notranslate"$2>');
	html = html.replace(/<html(?![^>]*lang=)([^>]*)>/i, '<html lang="es-CO" translate="no" class="notranslate"$1>');
	html = html.replace(/<body(?![^>]*translate=)([^>]*)>/i, '<body translate="no" class="notranslate"$1>');

	if (!html.includes('name="google" content="notranslate"')) {
		html = html.replace("<head>", "<head>" + NO_TRANSLATE_HEAD);
	}

	if (!html.includes("display-mode: standalone")) {
		html = html.replace("<head>", "<head>" + PWA_GATE_SCRIPT);
	}

	if (!html.includes("/hardening.js")) {
		html = html.replace("<head>", "<head>" + HARDENING_HEAD);
	}

	writeFileSync(htmlPath, html);
}

function walkHtmlFiles(dir, files = []) {
	if (!existsSync(dir)) return files;
	for (const entry of readdirSync(dir)) {
		const fullPath = join(dir, entry);
		if (statSync(fullPath).isDirectory()) {
			walkHtmlFiles(fullPath, files);
		} else if (entry.endsWith(".html")) {
			files.push(fullPath);
		}
	}
	return files;
}

function injectNoTranslateIntoAppHtml(appDir) {
	for (const htmlPath of walkHtmlFiles(appDir)) {
		applyNoTranslateHtml(htmlPath);
	}
}

function stripSourceMaps(dir) {
	if (!existsSync(dir)) return;
	for (const entry of readdirSync(dir)) {
		const fullPath = join(dir, entry);
		if (statSync(fullPath).isDirectory()) {
			stripSourceMaps(fullPath);
		} else if (entry.endsWith(".map")) {
			unlinkSync(fullPath);
		}
	}
}

console.log("📦 Exportando app Expo para web...");
try {
	execSync("npx expo export --platform web --output-dir dist/app", {
		cwd: root,
		stdio: "inherit",
		env: { ...process.env, EXPO_NO_METRO_LAZY: "1" },
	});
} catch {
	process.exit(1);
}

stripSourceMaps(join(dist, "app"));

console.log("📄 Copiando archivos públicos (bienvenida + PWA)...");
if (existsSync(join(dist, "index.html"))) {
	rmSync(join(dist, "index.html"));
}

for (const file of [
	"index.html",
	"manifest.json",
	"sw.js",
	"serve.json",
	"hardening.js",
	"404.html",
	"_redirects",
]) {
	cpSync(join(publicDir, file), join(dist, file));
}

for (const file of ["manifest.json", "sw.js", "hardening.js"]) {
	cpSync(join(publicDir, file), join(dist, "app", file));
}

if (existsSync(join(publicDir, "icons"))) {
	cpSync(join(publicDir, "icons"), join(dist, "icons"), { recursive: true });
}

if (existsSync(join(publicDir, "fonts"))) {
	cpSync(join(publicDir, "fonts"), join(dist, "fonts"), { recursive: true });
}

injectAppBootScript(join(dist, "app", "index.html"));
injectNoTranslateIntoAppHtml(join(dist, "app"));
applyNoTranslateHtml(join(dist, "index.html"));

console.log("✅ PWA lista en:", dist);
console.log("   Bienvenida → /index.html");
console.log("   App Nequi  → /app/");
