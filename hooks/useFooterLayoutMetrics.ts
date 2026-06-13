import { useMemo } from "react";
import { useLayoutScale } from "@/libs/layout-scale";

/** Altura base del footer (tabs + FAB + padding) en dispositivo de referencia. */
export const HOME_FOOTER_HEIGHT_BASE = 98;

export function useFooterLayoutMetrics() {
	const { scale, scaleV } = useLayoutScale();

	return useMemo(() => {
		const paddingY = scaleV(17);
		const tabBarHeight = scale(64);
		const footerHeight = paddingY * 2 + tabBarHeight;

		return {
			paddingY,
			tabBarHeight,
			footerHeight,
			horizontalPadding: scale(16),
			gap: scale(8),
			tabInnerPadding: scale(4),
			tabRadius: scale(8),
			tabIconSize: scale(24),
			tabLabelSize: scale(12),
			fabSize: scale(64),
			fabIconSize: scale(28),
			fabLabelSize: scale(32),
			actionGap: scale(26),
			actionLabelSize: scale(16),
			actionBottomExtra: scale(24),
		};
	}, [scale, scaleV]);
}
