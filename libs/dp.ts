import { PixelRatio } from "react-native";

/** Convierte dp de Android a px en React Native. */
export function dp(value: number): number {
	return PixelRatio.roundToNearestPixel(value);
}
