import { useMemo } from "react";
import { useLayoutScale } from "@/libs/layout-scale";

/** status (h-12) + HomeBackground SVG — debe coincidir con app/home/index.tsx */
const HOME_HEADER_STATUS_PX = 48;
const HOME_HEADER_ORCHID_PX = 264;
/** Aire entre curva y tarjetilla en reposo (solo body). */
const HOME_SHEET_GAP_BELOW_CURVE_PX = 14;
/** Inicio del body (negativo = un poco más arriba; solo body). */
const HOME_BODY_BELOW_HEADER_PX = -10;
/** Solape de la tapa sobre el scroll para no ver costura (px). */
const HOME_BODY_CAP_OVERLAP_PX = 2;

/** Tamaños del home adaptados al ancho, alto y DPI del dispositivo. */
export function useHomeLayoutMetrics() {
	const { scale, scaleV, scaleMin, width, height, fontScale } = useLayoutScale();

	const metrics = useMemo(() => {
		const tallScreenExtra =
			height > 780 ? scaleV(Math.min((height - 780) * 0.06, 28)) : 0;
		const shortScreenAdjust = height < 700 ? scaleV(-6) : 0;

		const headerStatusHeight = scaleV(HOME_HEADER_STATUS_PX);
		const headerOrchidHeight = scale(HOME_HEADER_ORCHID_PX) + shortScreenAdjust;
		const headerBlock = headerStatusHeight + headerOrchidHeight;
		const bodyScrollPaddingTop =
			scaleV(HOME_SHEET_GAP_BELOW_CURVE_PX) +
			(tallScreenExtra > 0 ? scaleV(4) : 0);
		const bodyBaseTop = headerBlock + scaleV(HOME_BODY_BELOW_HEADER_PX);
		const bodyFixedCapHeight =
			bodyScrollPaddingTop + scaleMin(HOME_BODY_CAP_OVERLAP_PX);

		return {
			scale,
			scaleV,
			scaleMin,
			width,
			height,
			fontScale,
			headerStatusHeight,
			headerOrchidHeight,
			headerBlock,
			greetingRowTop: scaleV(42),
			greetingRowHeight: scaleV(40),
			headerPaddingX: scale(16),
			headerIconGap: scale(8),
			headerGreetingGap: scale(16),
			balanceSectionMarginTop: scaleV(32),
			greetingFontSize: scale(15),
			nameFontSize: scale(18),
			accountTypeFontSize: scale(16),
			balanceFontSize: scale(30),
			balanceSymbolFontSize: scale(30),
			balanceDecimalFontSize: scale(24),
			balanceSymbolMarginRight: scale(6),
			balanceDecimalOffset: scaleV(4),
			totalFontSize: scale(16),
			totalDecimalFontSize: scale(14),
			tuPlataMarginTop: scaleV(20),
			tuPlataIconSize: scale(16),
			eyeIconSize: scale(14),
			sectionPaddingH: scale(20),
			sectionPaddingRight: scale(32),
			sectionPaddingBottom: scale(8),
			sectionHeaderIconSize: scale(15),
			sectionEditIconSize: scale(22),
			sheetBorderRadius: scale(18),
			bodyScrollBottom: scaleV(12),
			shimmerCardHeight: scale(150),
			shimmerCardPadding: scale(20),
			shimmerCardRadius: scale(12),
			shimmerImageWidth: scale(110),
			boxSize: scale(60),
			iconSize: scale(42),
			itemWidth: scale(76),
			itemGap: scale(32),
			rowMinHeight: scale(108),
			bodyBaseTop,
			bodyScrollPaddingTop,
			bodyFixedCapHeight,
			labelFontSize: scale(14),
			sectionFontSize: scale(15),
			wideItemWidth: scale(84),
			extraWideItemWidth: scale(88),
			miniBannerGap: scale(12),
			miniBannerRadius: scale(6),
		};
	}, [scale, scaleV, scaleMin, width, height, fontScale]);

	return metrics;
}
