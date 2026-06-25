import { useEffect, useState } from "react";
import { Dimensions, Platform, useWindowDimensions } from "react-native";

/** Mismo tope que `#root` en global.css — columna tipo teléfono en escritorio. */
export const MAX_PHONE_WIDTH = 480;

export function resolveAppLayoutWidth(windowWidth: number): number {
	if (Platform.OS !== "web") return windowWidth;
	return Math.min(windowWidth, MAX_PHONE_WIDTH);
}

export function resolveAppLayoutDimensions(
	windowWidth: number,
	windowHeight: number,
): { width: number; height: number } {
	return {
		width: resolveAppLayoutWidth(windowWidth),
		height: windowHeight,
	};
}

/** Sustituto de `Dimensions.get("window")` cuando el ancho debe respetar el contenedor web. */
export function getAppWindowDimensions() {
	const dims = Dimensions.get("window");
	if (Platform.OS !== "web") return dims;
	return {
		...dims,
		...resolveAppLayoutDimensions(dims.width, dims.height),
	};
}

function readRootSize(): { width: number; height: number } | null {
	if (typeof document === "undefined") return null;
	const root = document.getElementById("root");
	if (!root) return null;
	const rect = root.getBoundingClientRect();
	if (rect.width <= 0 || rect.height <= 0) return null;
	return {
		width: Math.round(rect.width),
		height: Math.round(rect.height),
	};
}

/**
 * Dimensiones del área visible de la app.
 * En web usa el tamaño real de `#root` (no el viewport completo del navegador).
 */
export function useAppLayoutDimensions() {
	const windowDims = useWindowDimensions();
	const [rootSize, setRootSize] = useState<{ width: number; height: number } | null>(
		() => (Platform.OS === "web" ? readRootSize() : null),
	);

	useEffect(() => {
		if (Platform.OS !== "web" || typeof document === "undefined") return;

		const update = () => {
			const next = readRootSize();
			if (!next) return;
			setRootSize((prev) =>
				prev?.width === next.width && prev?.height === next.height ? prev : next,
			);
		};

		update();
		const root = document.getElementById("root");
		if (!root) return;

		const ro = new ResizeObserver(update);
		ro.observe(root);
		window.addEventListener("resize", update);

		return () => {
			ro.disconnect();
			window.removeEventListener("resize", update);
		};
	}, []);

	if (Platform.OS !== "web") {
		return windowDims;
	}

	if (rootSize) {
		return {
			...windowDims,
			width: rootSize.width,
			height: rootSize.height,
		};
	}

	return {
		...windowDims,
		...resolveAppLayoutDimensions(windowDims.width, windowDims.height),
	};
}
