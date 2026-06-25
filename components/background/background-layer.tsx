import { useMemo } from "react";
import { View } from "react-native";
import { type BackgroundLevel, BACKGROUND_LEVELS } from "@/store/useBackgroundStore";
import { useAppLayoutDimensions } from "@/libs/app-layout-dimensions";

import { BgNewProfile0 } from "./svgs/new-profile-0";
import { BgNewProfile1 } from "./svgs/new-profile-1";
import { BgNewProfile2 } from "./svgs/new-profile-2";
import { BgNewProfile3 } from "./svgs/new-profile-3";
import { BgPro } from "./svgs/pro";

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
	const { width: screenW, height: screenH } = useAppLayoutDimensions();
	const info = BACKGROUND_LEVELS.find((l) => l.level === level);
	const SvgComponent = svgMap[level];
	const size = svgSizes[level];

	const { scale, left } = useMemo(() => {
		if (!size.w || !size.h) {
			return { scale: 1, left: 0 };
		}
		const s = Math.max(screenW / size.w, screenH / size.h) * 1.3;
		return {
			scale: s,
			left: screenW / 2 - (size.w * s) / 2,
		};
	}, [screenW, screenH, size.w, size.h]);

	if (!info || level === 0 || !SvgComponent) return null;

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
					left,
					opacity: 0.5,
				}}
			>
				<SvgComponent width={size.w * scale} height={size.h * scale} />
			</View>
		</View>
	);
}
