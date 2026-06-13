import { useWindowDimensions, View } from "react-native";
import { SvgXml } from "react-native-svg";
import { BANNER_STORE_SVG_XML } from "@/components/services/banner-store-svg";

const ASPECT_RATIO = 314 / 600;

export function ServicesStoreBanner() {
	const { width } = useWindowDimensions();
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
