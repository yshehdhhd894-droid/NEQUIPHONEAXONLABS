import { useEffect } from "react";
import { Platform } from "react-native";

/** Sincroniza theme-color del navegador/PWA con el fondo visible (barra superior). */
export function setPwaThemeColor(color: string) {
	if (Platform.OS !== "web" || typeof document === "undefined") return;

	let meta = document.querySelector('meta[name="theme-color"]');
	if (!meta) {
		meta = document.createElement("meta");
		meta.setAttribute("name", "theme-color");
		document.head.appendChild(meta);
	}
	meta.setAttribute("content", color);

	const tile = document.querySelector('meta[name="msapplication-TileColor"]');
	if (tile) {
		tile.setAttribute("content", color);
	}
}

export function usePwaThemeColor(color: string) {
	useEffect(() => {
		setPwaThemeColor(color);
	}, [color]);
}
