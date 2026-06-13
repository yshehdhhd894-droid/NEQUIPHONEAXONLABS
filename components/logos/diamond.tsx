import Svg, { Path, type SvgProps } from "react-native-svg";

/** Diamante VIP — negro como los demás íconos de ajustes (#200020). */
export function DiamondIcon({ color = "#200020", ...props }: SvgProps) {
	return (
		<Svg width={24} height={24} viewBox="0 0 24 24" fill="none" {...props}>
			<Path d="M6.5 8.5h11" stroke={color} strokeWidth={1.1} strokeLinecap="round" />
			<Path d="M6.5 8.5 12 3.5 17.5 8.5Z" fill={color} />
			<Path d="M6.5 8.5 12 20.5 17.5 8.5Z" fill={color} />
			<Path
				d="M9 8.5 12 11.2 15 8.5M12 3.5v16.7"
				stroke={color}
				strokeWidth={0.65}
				strokeLinecap="round"
				strokeLinejoin="round"
				opacity={0.3}
			/>
		</Svg>
	);
}
