const SW_VERSION = "nequi-v14";

const BLOCKED_PATHS =
	/^\/(?:\.env|\.git|admin|backend|config|debug|graphql|swagger|wp-admin|phpmyadmin|server-status|actuator)(?:\/|$)/i;

self.addEventListener("install", (event) => {
	self.skipWaiting();
});

self.addEventListener("activate", (event) => {
	event.waitUntil(
		(async () => {
			const keys = await caches.keys();
			await Promise.all(keys.map((key) => caches.delete(key)));
			await self.clients.claim();
		})(),
	);
});

self.addEventListener("fetch", (event) => {
	const url = new URL(event.request.url);

	if (url.origin === self.location.origin && BLOCKED_PATHS.test(url.pathname)) {
		event.respondWith(new Response("Not Found", { status: 404, statusText: "Not Found" }));
		return;
	}

	// Las consultas al API remoto no pasan por el SW (origin distinto).
	if (url.pathname.includes("/api/")) {
		return;
	}

	event.respondWith(
		fetch(event.request).catch(() =>
			caches.match(event.request).then((r) => r || Response.error()),
		),
	);
});

self.addEventListener("message", (event) => {
	if (event.data === "SKIP_WAITING") {
		self.skipWaiting();
	}
});
