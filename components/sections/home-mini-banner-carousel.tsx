import { memo, useMemo } from "react";
import { Image, ScrollView, View } from "react-native";
import { useHomeLayoutMetrics } from "@/hooks/useHomeLayoutMetrics";

const HOME_BANNER_CARDS = [
	require("@/assets/cards_home/trimmed/card1.png"),
	require("@/assets/cards_home/trimmed/card2.png"),
	require("@/assets/cards_home/trimmed/card3.png"),
] as const;

/** Carrusel horizontal de tarjetillas del home (PNG, sin SVG/React). */
function HomeMiniBannerCarousel() {
	const m = useHomeLayoutMetrics();
	const cardWidth = m.width - m.sectionPaddingH * 2;
	const cardHeight = useMemo(() => Math.round(cardWidth * 0.34), [cardWidth]);

	return (
		<ScrollView
			horizontal
			showsHorizontalScrollIndicator={false}
			decelerationRate="fast"
			snapToInterval={cardWidth + m.miniBannerGap}
			snapToAlignment="start"
			style={{ flexGrow: 0 }}
			nestedScrollEnabled
			contentContainerStyle={{
				gap: m.miniBannerGap,
				paddingHorizontal: m.sectionPaddingH,
				paddingRight: m.sectionPaddingH - m.miniBannerGap,
			}}
			className="mt-1 mb-0"
		>
			{HOME_BANNER_CARDS.map((source, index) => (
				<View
					key={`home-banner-${index}`}
					style={{
						width: cardWidth,
						height: cardHeight,
						borderRadius: m.miniBannerRadius,
					}}
					className="overflow-hidden bg-guanabana"
				>
					<Image
						source={source}
						style={{ width: cardWidth, height: cardHeight }}
						resizeMode="cover"
					/>
				</View>
			))}
		</ScrollView>
	);
}

export default memo(HomeMiniBannerCarousel);
