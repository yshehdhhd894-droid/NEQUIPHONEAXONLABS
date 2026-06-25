import { useCallback } from "react";
import {
	MAX_PHONE_WIDTH,
	useAppLayoutDimensions,
} from "@/libs/app-layout-dimensions";

export { MAX_PHONE_WIDTH };

/** Ancho de referencia (iPhone 14 / mayoría de Android estándar). */
const BASE_WIDTH = 390;

/** Alto de referencia para espaciado vertical. */
const BASE_HEIGHT = 844;

/** Límites de escala para pantallas muy pequeñas o muy grandes. */
const MIN_WIDTH_SCALE = 0.76;
const MAX_WIDTH_SCALE = 1.12;
const MIN_HEIGHT_SCALE = 0.78;
const MAX_HEIGHT_SCALE = 1.08;

/** Evita que display size 500–700 rompa el layout. */
export const MAX_FONT_SCALE_MULTIPLIER = 1.15;

export function useLayoutScale() {
	const { width, height, fontScale } = useAppLayoutDimensions();

	const layoutWidth = width;
	const layoutHeight = height;

	const widthScale = Math.min(
		Math.max(layoutWidth / BASE_WIDTH, MIN_WIDTH_SCALE),
		MAX_WIDTH_SCALE,
	);
	const heightScale = Math.min(
		Math.max(layoutHeight / BASE_HEIGHT, MIN_HEIGHT_SCALE),
		MAX_HEIGHT_SCALE,
	);
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
