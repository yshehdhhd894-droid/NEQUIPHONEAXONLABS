import { Platform } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
	HOME_FOOTER_HEIGHT_BASE,
	useFooterLayoutMetrics,
} from "@/hooks/useFooterLayoutMetrics";

/** Altura base del footer en dispositivo de referencia. */
export const HOME_FOOTER_HEIGHT = HOME_FOOTER_HEIGHT_BASE;

/** Barra de 3 botones en Android cuando el inset llega en 0 (edge-to-edge). */
const ANDROID_NAV_BAR_FALLBACK = 48;

/** Home indicator en iPhone PWA cuando SafeAreaInsets devuelve 0. */
const WEB_IOS_BOTTOM_FALLBACK = 34;

function resolveBottomInset(bottom: number) {
	if (Platform.OS === "android") {
		return Math.max(bottom, ANDROID_NAV_BAR_FALLBACK);
	}
	if (Platform.OS === "web" && bottom === 0) {
		return WEB_IOS_BOTTOM_FALLBACK;
	}
	return bottom;
}

/** Espacio sobre la barra de navegación del sistema. */
export function useBottomInset(extra = 0) {
	const { bottom } = useSafeAreaInsets();
	return resolveBottomInset(bottom) + extra;
}

export function useHomeContentBottomPadding(extra = 16) {
	const { footerHeight } = useFooterLayoutMetrics();
	return useBottomInset(footerHeight + extra);
}

/** Padding bajo botones fijos (Sigue / Continuar) para no chocar con la barra del sistema. */
export function useFormFooterBottomPadding(extra = 20) {
	return useBottomInset(extra);
}

/** Padding inferior en ScrollView de comprobantes (botón Listo, etc.). */
export function useVoucherScrollBottomPadding(extra = 32) {
	return useBottomInset(extra);
}
