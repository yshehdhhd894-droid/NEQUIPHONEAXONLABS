import { SvgXml } from "react-native-svg";
import { LEYENDA_SVG, MISSION_DAY_SVG } from "./profile-svgs";

interface IconSize {
	width?: number;
	height?: number;
}

export function MissionDayIcon({ width = 55, height = 57 }: IconSize) {
	return <SvgXml xml={MISSION_DAY_SVG} width={width} height={height} />;
}

export function LeyendaAvatar({ width = 110, height = 111 }: IconSize) {
	return <SvgXml xml={LEYENDA_SVG} width={width} height={height} />;
}
