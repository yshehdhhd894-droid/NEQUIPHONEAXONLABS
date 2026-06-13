import Svg, { Circle, Path, Rect, type SvgProps } from "react-native-svg";

export function CardOutline(props: SvgProps) {
	return (
		<Svg width="40" height="40" viewBox="0 0 40 40" fill="none" {...props}>
			<Rect
				width={12.5}
				height={20}
				x={13.75}
				y={10}
				stroke={props.color || "#ECE7F5"}
				rx={1.5}
			/>
			<Path
				stroke={props.color || "#ECE7F5"}
				strokeLinecap="round"
				strokeLinejoin="round"
				d="M16.25 27.875v-8.25M22.5 13.25v1.5a.25.25 0 1 1-.5 0v-1.5a.25.25 0 1 1 .5 0Z"
			/>
		</Svg>
	);
}

export function AvaliableOutline(props: SvgProps) {
	return (
		<Svg width="40" height="40" viewBox="0 0 40 40" fill="none" {...props}>
			<Path
				stroke="#ECE7F5"
				strokeLinejoin="round"
				d="M10.25 23.75h19.5a.75.75 0 0 0 .75-.75V12.5a.75.75 0 0 0-.75-.75h-19.5a.75.75 0 0 0-.75.75V23c0 .414.336.75.75.75Z"
			/>
			<Path
				stroke="#ECE7F5"
				strokeLinecap="round"
				strokeLinejoin="round"
				d="M11 26h18M12.5 28.25h15M20 21.5a3.75 3.75 0 1 0 0-7.5 3.75 3.75 0 0 0 0 7.5ZM30.5 15.5a3.75 3.75 0 0 1-3.75-3.75M9.5 15.5a3.75 3.75 0 0 0 3.75-3.75M30.5 20a3.75 3.75 0 0 0-3.75 3.75M9.5 20a3.75 3.75 0 0 1 3.75 3.75"
			/>
		</Svg>
	);
}

export function PocketsOutline(props: SvgProps) {
	return (
		<Svg width="40" height="40" viewBox="0 0 40 40" fill="none" {...props}>
			<Path
				stroke="#ECE7F5"
				d="M14.5 18.25h11a1.5 1.5 0 0 1 1.5 1.5v7.5a3.5 3.5 0 0 1-3.5 3.5h-7a3.5 3.5 0 0 1-3.5-3.5v-7.5a1.5 1.5 0 0 1 1.5-1.5Z"
			/>
			<Path
				stroke="#ECE7F5"
				strokeDasharray="2 4"
				strokeLinecap="round"
				d="M13.25 21.125h13.5"
			/>
			<Path
				stroke="#ECE7F5"
				d="M24.5 18.5v-8a1 1 0 0 0-1-1h-7a1 1 0 0 0-1 1v8"
			/>
			<Path
				fill="#ECE7F5"
				d="M20.227 11h-.323v.41c-.64.043-1.249.478-1.249 1.197 0 .773.55 1.051 1.25 1.245v1.34c-.305-.005-.664-.193-.88-.446l-.525.507c.377.369.878.544 1.404.562v.435h.323v-.435c.663-.018 1.273-.447 1.273-1.287 0-.815-.663-1.1-1.273-1.293v-1.22c.275 0 .574.115.76.32l.483-.507c-.323-.284-.807-.423-1.243-.43V11Zm-.323 2.15c-.304-.09-.532-.247-.532-.58 0-.35.252-.525.532-.555v1.136Zm.323.798c.317.109.556.266.556.622 0 .357-.221.605-.556.623v-1.245Z"
			/>
		</Svg>
	);
}

export function GoalsOutline(props: SvgProps) {
	return (
		<Svg width="40" height="40" viewBox="0 0 40 40" fill="none" {...props}>
			<Path
				stroke={props.color || "#ECE7F5"}
				strokeLinejoin="round"
				d="M16.68 13.503c-3.615.95-5.68 3.767-5.68 7.082 0 2.809 1.424 4.74 3.492 5.896v1.956c0 .311.267.563.597.563h2.31c.33 0 .597-.252.597-.563v-.79c1.484.236 3.056.22 4.555-.03v.82c0 .311.267.563.597.563h2.31c.33 0 .597-.252.597-.563v-1.913c1.92-.942 3.438-2.67 4.093-4.529.368-1.042-.543-1.959-1.648-1.959h-.12c0-2.317-.723-3.708-2.487-4.944 0 0 .792-1.134 0-1.696-.791-.562-1.772.679-1.772.679s-.973-.572-1.771-.572"
			/>
			<Path
				stroke={props.color || "#ECE7F5"}
				strokeLinecap="round"
				d="M23.75 19.25c0-.828.503-1.5 1.125-1.5.621 0 1.125.672 1.125 1.5M11.488 16.936s-.817-.408-.898-1.436"
			/>
			<Circle cx={19.25} cy={13.25} r={3} stroke={props.color || "#ECE7F5"} />
		</Svg>
	);
}

export function MattressOutline(props: SvgProps) {
	return (
		<Svg width="40" height="40" viewBox="0 0 40 40" fill="none" {...props}>
			<Rect
				width={14}
				height={21.5}
				x={13}
				y={9.25}
				stroke="#ECE7F5"
				rx={1.5}
			/>
			<Path
				stroke="#ECE7F5"
				strokeLinecap="round"
				d="m22.25 14 1.5-1.5M22.25 12.5l1.5 1.5M16.25 27.5l1.5-1.5M16.25 26l1.5 1.5M16.25 14l1.5-1.5M16.25 12.5l1.5 1.5M22.25 27.5l1.5-1.5M22.25 26l1.5 1.5M16.25 20.75l1.5-1.5M16.25 19.25l1.5 1.5M22.25 20.75l1.5-1.5M22.25 19.25l1.5 1.5"
			/>
		</Svg>
	);
}
