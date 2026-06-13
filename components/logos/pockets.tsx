import Svg, {
	ClipPath,
	Defs,
	G,
	Path,
	Rect,
	type SvgProps,
} from "react-native-svg";

export function Avaliable(props: SvgProps) {
	return (
		<Svg width="48" height="48" viewBox="0 0 48 48" fill="none" {...props}>
			<G clipPath="url(#a)">
				<Rect width={48} height={48} fill="#DA0081" rx={4} />
				<G clipPath="url(#b)">
					<Path
						fill="#E366A7"
						d="M22.6 21.2V4.4A1.4 1.4 0 0 0 21.2 3H4.4A1.4 1.4 0 0 0 3 4.4v16.8a1.4 1.4 0 0 0 1.4 1.4h16.8a1.4 1.4 0 0 0 1.4-1.4Z"
					/>
					<Path
						fill="#F1BFDA"
						d="M12.8 36.6h8.4a1.4 1.4 0 0 0 1.4-1.4v-8.4a1.4 1.4 0 0 0-1.4-1.4h-8.4a1.4 1.4 0 0 0-1.4 1.4v8.4a1.4 1.4 0 0 0 1.4 1.4Z"
					/>
					<Path
						fill="#ECE7F5"
						d="M4.4 45h4.2a1.4 1.4 0 0 0 1.4-1.4v-4.2A1.4 1.4 0 0 0 8.6 38H4.4A1.4 1.4 0 0 0 3 39.4v4.2A1.4 1.4 0 0 0 4.4 45Z"
					/>
					<Path
						fill="#E366A7"
						d="M25.4 26.8v16.8a1.4 1.4 0 0 0 1.4 1.4h16.8a1.4 1.4 0 0 0 1.4-1.4V26.8a1.4 1.4 0 0 0-1.4-1.4H26.8a1.4 1.4 0 0 0-1.4 1.4Z"
					/>
					<Path
						fill="#ECE7F5"
						d="M35.2 11.4h-8.4a1.4 1.4 0 0 0-1.4 1.4v8.4a1.4 1.4 0 0 0 1.4 1.4h8.4a1.4 1.4 0 0 0 1.4-1.4v-8.4a1.4 1.4 0 0 0-1.4-1.4Z"
					/>
					<Path
						fill="#F1BFDA"
						d="M43.6 3h-4.2A1.4 1.4 0 0 0 38 4.4v4.2a1.4 1.4 0 0 0 1.4 1.4h4.2A1.4 1.4 0 0 0 45 8.6V4.4A1.4 1.4 0 0 0 43.6 3Z"
					/>
				</G>
			</G>
			<Defs>
				<ClipPath id="a">
					<Path fill="#fff" d="M0 0h48v48H0z" />
				</ClipPath>
				<ClipPath id="b">
					<Path fill="#fff" d="M45 3v42H3V3z" />
				</ClipPath>
			</Defs>
		</Svg>
	);
}
