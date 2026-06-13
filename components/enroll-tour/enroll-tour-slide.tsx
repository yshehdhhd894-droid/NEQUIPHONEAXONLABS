import { memo } from "react";
import { View } from "react-native";
import { SvgXml } from "react-native-svg";
import Text from "@/components/basic/text";
import {
	ENROLL_TOUR_SVG_HEIGHT,
	ENROLL_TOUR_SVG_WIDTH,
} from "@/components/enroll-tour/constants";
import type { EnrollTourSlide } from "@/libs/enroll-tour";

const UVA = "#200020";

type Props = {
	slide: EnrollTourSlide;
};

function EnrollTourSlidePage({ slide }: Props) {
	return (
		<View className="flex-1 bg-white">
			<View className="flex-1 items-center justify-center">
				<SvgXml
					xml={slide.svgXml}
					width={ENROLL_TOUR_SVG_WIDTH}
					height={ENROLL_TOUR_SVG_HEIGHT}
				/>
			</View>

			<View className="px-5 pt-2 pb-4">
				<Text
					fontWeight="bold"
					className="text-center leading-8 mb-2"
					style={{ color: UVA, fontSize: 26 }}
				>
					{slide.title}
				</Text>
				<Text
					className="text-center leading-[22px]"
					style={{ color: "#454545", fontSize: 16 }}
				>
					{slide.content}
				</Text>
			</View>
		</View>
	);
}

export default memo(
	EnrollTourSlidePage,
	(prev, next) => prev.slide.id === next.slide.id,
);
