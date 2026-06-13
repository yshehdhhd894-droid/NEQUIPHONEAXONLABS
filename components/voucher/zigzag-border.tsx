import { View } from "react-native";
import Svg, { Path } from "react-native-svg";

const PEAK_HEIGHT = 8;
const PEAK_WIDTH = 17.8;

function buildTopPath(width: number) {
	const numPeaks = Math.floor(width / PEAK_WIDTH);
	let path = `M 0,${PEAK_HEIGHT}`;
	for (let i = 0; i < numPeaks; i++) {
		const x = i * PEAK_WIDTH;
		path += ` L ${x + PEAK_WIDTH / 2},0 L ${x + PEAK_WIDTH},${PEAK_HEIGHT}`;
	}
	return `${path} L ${width},${PEAK_HEIGHT} L 0,${PEAK_HEIGHT} Z`;
}

function buildBottomPath(width: number) {
	const numPeaks = Math.floor(width / PEAK_WIDTH);
	let path = "M 0,0";
	for (let i = 0; i < numPeaks; i++) {
		const x = i * PEAK_WIDTH;
		path += ` L ${x + PEAK_WIDTH / 2},${PEAK_HEIGHT} L ${x + PEAK_WIDTH},0`;
	}
	return `${path} L ${width},0 L 0,0 Z`;
}

export function ZigzagBorderTop({ width = 320 }: { width?: number }) {
	return (
		<View
			pointerEvents="none"
			style={{
				position: "absolute",
				top: -PEAK_HEIGHT,
				left: 0,
				width,
				height: PEAK_HEIGHT,
				zIndex: 20,
				elevation: 20,
			}}
		>
			<Svg
				height={PEAK_HEIGHT}
				width={width}
				renderToHardwareTextureAndroid
				shouldRasterizeIOS
			>
				<Path d={buildTopPath(width)} fill="#ffffff" />
			</Svg>
		</View>
	);
}

export function ZigzagBorderBottom({ width = 320 }: { width?: number }) {
	return (
		<View
			pointerEvents="none"
			style={{
				position: "absolute",
				bottom: -PEAK_HEIGHT,
				left: 0,
				width,
				height: PEAK_HEIGHT,
				zIndex: 20,
				elevation: 20,
			}}
		>
			<Svg
				height={PEAK_HEIGHT}
				width={width}
				renderToHardwareTextureAndroid
				shouldRasterizeIOS
			>
				<Path d={buildBottomPath(width)} fill="#ffffff" />
			</Svg>
		</View>
	);
}
