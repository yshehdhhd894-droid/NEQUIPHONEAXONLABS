import { useCallback } from "react";
import { Platform, useWindowDimensions } from "react-native";

/** Ancho de referencia (iPhone 14 / mayoría de Android estándar). */
const BASE_WIDTH = 390;

/** Alto de referencia para espaciado vertical. */
const BASE_HEIGHT = 844;

/** Teléfonos grandes (Pro Max) sin techo artificial. */
const MAX_PHONE_WIDTH = 480;

/** Evita que display size 500–700 rompa el layout. */
export const MAX_FONT_SCALE_MULTIPLIER = 1.15;

export function useLayoutScale() {
	const { width, height, fontScale } = useWindowDimensions();

	/** Escala fluida en móviles; en pantallas anchas no inflar más allá de un teléfono grande. */
	const layoutWidth =
		Platform.OS === "web" ? Math.min(width, MAX_PHONE_WIDTH) : width;
	const layoutHeight = height;

	const widthScale = Math.max(layoutWidth / BASE_WIDTH, 0.82);
	const heightScale = Math.max(layoutHeight / BASE_HEIGHT, 0.85);
	const cappedFont = Math.min(
		Math.max(fontScale, 1),
		MAX_FONT_SCALE_MULTIPLIER,
	);
	const fontFactor = 1 + (cappedFont - 1) * 0.35;

	const scale = useCallback(
		(size: number) => Math.round(size * widthScale * fontFactor),
		[widthScale, fontFactor],
	);

	const scaleV = useCallback(
		(size: number) => Math.round(size * heightScale),
		[heightScale],
	);

	const scaleMin = useCallback(
		(size: number) =>
			Math.round(size * Math.min(widthScale, heightScale) * fontFactor),
		[widthScale, heightScale, fontFactor],
	);

	return {
		scale,
		scaleV,
		scaleMin,
		width: layoutWidth,
		height: layoutHeight,
		windowWidth: width,
		windowHeight: height,
		widthScale,
		heightScale,
		fontScale: cappedFont,
	};
}
