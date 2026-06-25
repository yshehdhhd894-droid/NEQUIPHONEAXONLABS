import { View } from "react-native";
import { SvgXml } from "react-native-svg";
import { BANNER_STORE_SVG_XML } from "@/components/services/banner-store-svg";
import { useLayoutScale } from "@/libs/layout-scale";

const ASPECT_RATIO = 314 / 600;

export function ServicesStoreBanner() {
	const { width } = useLayoutScale();
	const bannerWidth = width - 16;
	const bannerHeight = bannerWidth * ASPECT_RATIO;

	return (
		<View className="overflow-hidden rounded-[4px]">
			<SvgXml
				xml={BANNER_STORE_SVG_XML}
				width={bannerWidth}
				height={bannerHeight}
			/>
		</View>
	);
}
