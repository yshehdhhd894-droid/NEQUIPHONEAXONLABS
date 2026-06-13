import Svg, { Path } from "react-native-svg";
import { dp } from "@/libs/dp";

/** Igual que ScannerOverlayView.kt — #200000FF (azul ~12.5% opacidad). */
const OVERLAY_COLOR = "rgba(0, 0, 255, 0.125)";
const FRAME_SIZE_DP = 300;

type Props = {
	width: number;
	height: number;
	frameSize?: number;
};

export function QrScannerOverlay({
	width,
	height,
	frameSize = FRAME_SIZE_DP,
}: Props) {
	const frame = dp(frameSize);
	const frameLeft = (width - frame) / 2;
	const frameTop = (height - frame) / 2;

	const path = [
		`M 0 0 H ${width} V ${height} H 0 Z`,
		`M ${frameLeft} ${frameTop} H ${frameLeft + frame} V ${frameTop + frame} H ${frameLeft} Z`,
	].join(" ");

	return (
		<Svg
			width={width}
			height={height}
			pointerEvents="none"
			style={{ position: "absolute", left: 0, top: 0 }}
		>
			<Path d={path} fill={OVERLAY_COLOR} fillRule="evenodd" />
		</Svg>
	);
}
