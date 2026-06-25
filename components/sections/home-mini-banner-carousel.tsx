import { memo } from "react";
import { ScrollView } from "react-native";
import MiniBanner from "@/components/mini-banner/mini-banner";
import { useHomeLayoutMetrics } from "@/hooks/useHomeLayoutMetrics";
import { HOME_MINI_BANNERS } from "@/libs/mini-banner-config";

const BANNER_ASPECT = 140 / 390;

/** Carrusel de tarjetillas — ancho 100% del área útil, escala en cada pantalla. */
function HomeMiniBannerCarousel() {
	const m = useHomeLayoutMetrics();
	const cardWidth = m.width - m.sectionPaddingH * 2;

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
			{HOME_MINI_BANNERS.map((banner) => (
				<MiniBanner
					key={banner.id}
					title={banner.title}
					description={banner.description}
					linkText={banner.linkText}
					image={banner.image}
					bannerColor={banner.bannerColor}
					typeBanner={banner.typeBanner}
					width={cardWidth}
				/>
			))}
		</ScrollView>
	);
}

export default memo(HomeMiniBannerCarousel);

export { BANNER_ASPECT };
