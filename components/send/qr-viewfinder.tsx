import Svg, { Path } from "react-native-svg";
import { dp } from "@/libs/dp";

/** Igual que QRViewfinderView.kt — esquinas nequi_pink #da0081. */
const CORNER_COLOR = "#da0081";
const FRAME_SIZE_DP = 320;
const CORNER_LENGTH_DP = 60;
const CORNER_THICKNESS_DP = 40;
const STROKE_WIDTH_DP = 2.5;

function buildCornerPath(
	startX: number,
	startY: number,
	midX: number,
	midY: number,
	endX: number,
	endY: number,
	cornerLength: number,
	cornerThickness: number,
): string {
	const dx1 = midX - startX;
	const dy1 = midY - startY;
	const dist1 = Math.sqrt(dx1 * dx1 + dy1 * dy1);

	const dx2 = endX - startX;
	const dy2 = endY - startY;
	const dist2 = Math.sqrt(dx2 * dx2 + dy2 * dy2);

	const ratio1 = dist1 > 0 ? cornerLength / dist1 : 0;
	const ratio2 = dist2 > 0 ? cornerLength / dist2 : 0;

	const point1X = startX + dx1 * ratio1;
	const point1Y = startY + dy1 * ratio1;
	const point2X = startX + dx2 * ratio2;
	const point2Y = startY + dy2 * ratio2;

	const dx3 = point1X - startX;
	const dy3 = point1Y - startY;
	const dist3 = Math.sqrt(dx3 * dx3 + dy3 * dy3);

	const dx4 = point2X - startX;
	const dy4 = point2Y - startY;
	const dist4 = Math.sqrt(dx4 * dx4 + dy4 * dy4);

	const ratio3 = dist3 > 0 ? (dist3 - cornerThickness) / dist3 : 0;
	const ratio4 = dist4 > 0 ? (dist4 - cornerThickness) / dist4 : 0;

	const inner1X = startX + dx3 * ratio3;
	const inner1Y = startY + dy3 * ratio3;
	const inner2X = startX + dx4 * ratio4;
	const inner2Y = startY + dy4 * ratio4;

	const control1X = startX + (inner1X - startX) * 0.4;
	const control1Y = startY + (inner1Y - startY) * 0.4;
	const control2X = startX + (inner2X - startX) * 0.4;
	const control2Y = startY + (inner2Y - startY) * 0.4;

	return [
		`M ${point1X} ${point1Y}`,
		`L ${inner1X} ${inner1Y}`,
		`C ${control1X} ${control1Y} ${control2X} ${control2Y} ${inner2X} ${inner2Y}`,
		`L ${point2X} ${point2Y}`,
	].join(" ");
}

type Props = {
	width: number;
	height: number;
	frameSize?: number;
};

export function QrViewfinder({
	width,
	height,
	frameSize = FRAME_SIZE_DP,
}: Props) {
	const frame = dp(frameSize);
	const cornerLength = dp(CORNER_LENGTH_DP);
	const cornerThickness = dp(CORNER_THICKNESS_DP);
	const strokeWidth = dp(STROKE_WIDTH_DP);

	const centerX = width / 2;
	const centerY = height / 2;
	const halfFrame = frame / 2;
	const frameLeft = centerX - halfFrame;
	const frameTop = centerY - halfFrame;
	const frameRight = centerX + halfFrame;
	const frameBottom = centerY + halfFrame;

	const corners = [
		buildCornerPath(
			frameLeft,
			frameTop,
			frameRight,
			frameTop,
			frameLeft,
			frameBottom,
			cornerLength,
			cornerThickness,
		),
		buildCornerPath(
			frameRight,
			frameTop,
			frameRight,
			frameBottom,
			frameLeft,
			frameTop,
			cornerLength,
			cornerThickness,
		),
		buildCornerPath(
			frameLeft,
			frameBottom,
			frameLeft,
			frameTop,
			frameRight,
			frameBottom,
			cornerLength,
			cornerThickness,
		),
		buildCornerPath(
			frameRight,
			frameBottom,
			frameLeft,
			frameBottom,
			frameRight,
			frameTop,
			cornerLength,
			cornerThickness,
		),
	];

	return (
		<Svg
			width={width}
			height={height}
			pointerEvents="none"
			style={{ position: "absolute", left: 0, top: 0 }}
		>
			{corners.map((d, index) => (
				<Path
					key={index}
					d={d}
					stroke={CORNER_COLOR}
					strokeWidth={strokeWidth}
					strokeLinecap="round"
					strokeLinejoin="round"
					fill="none"
				/>
			))}
		</Svg>
	);
}
