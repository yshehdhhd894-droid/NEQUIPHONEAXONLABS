import { Dimensions, View } from "react-native";
import { type BackgroundLevel, BACKGROUND_LEVELS } from "@/store/useBackgroundStore";

import { BgNewProfile0 } from "./svgs/new-profile-0";
import { BgNewProfile1 } from "./svgs/new-profile-1";
import { BgNewProfile2 } from "./svgs/new-profile-2";
import { BgNewProfile3 } from "./svgs/new-profile-3";
import { BgPro } from "./svgs/pro";

const { width: SCREEN_W } = Dimensions.get("window");
const { height: SCREEN_H } = Dimensions.get("window");
const SVG_W = 250;
const SVG_H = 200;

const svgMap: Record<BackgroundLevel, React.FC<{ width: number; height: number }> | null> = {
	0: null,
	1: BgNewProfile0,
	2: BgNewProfile1,
	3: BgNewProfile2,
	4: BgNewProfile3,
	5: BgPro,
};

const svgSizes: Record<BackgroundLevel, { w: number; h: number }> = {
	0: { w: 0, h: 0 },
	1: { w: 250, h: 200 },
	2: { w: 250, h: 200 },
	3: { w: 250, h: 200 },
	4: { w: 250, h: 200 },
	5: { w: 333, h: 338 },
};

export function BackgroundLayer({ level }: { level: BackgroundLevel }) {
	const info = BACKGROUND_LEVELS.find((l) => l.level === level);
	const SvgComponent = svgMap[level];
	const size = svgSizes[level];

	if (!info || level === 0 || !SvgComponent) return null;

	const scale = Math.max(SCREEN_W / size.w, SCREEN_H / size.h) * 1.3;

	return (
		<View
			style={{
				position: "absolute",
				top: 0,
				left: 0,
				right: 0,
				bottom: 0,
				backgroundColor: info.bgColor,
				overflow: "hidden",
			}}
			pointerEvents="none"
		>
			<View
				style={{
					position: "absolute",
					bottom: -20,
					left: SCREEN_W / 2 - (size.w * scale) / 2,
					opacity: 0.5,
				}}
			>
				<SvgComponent width={size.w * scale} height={size.h * scale} />
			</View>
		</View>
	);
}
