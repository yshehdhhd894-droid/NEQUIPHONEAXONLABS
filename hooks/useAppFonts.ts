import { useFonts } from "expo-font";

/** Carga Manrope una sola vez en toda la app (incluye PWA web). */
export function useAppFonts() {
	const [loaded, error] = useFonts({
		ManropeLight: require("../assets/fonts/Manrope-Light.ttf"),
		ManropeRegular: require("../assets/fonts/Manrope-Regular.ttf"),
		ManropeMedium: require("../assets/fonts/Manrope-Medium.ttf"),
		ManropeSemiBold: require("../assets/fonts/Manrope-SemiBold.ttf"),
		ManropeBold: require("../assets/fonts/Manrope-Bold.ttf"),
		ManropeExtraBold: require("../assets/fonts/Manrope-ExtraBold.ttf"),
	});

	return loaded || Boolean(error);
}
