import Svg, { Mask, Path, Rect, type SvgProps } from "react-native-svg";

export function HomeTab(props: SvgProps) {
	return (
		<Svg width="24" height="24" viewBox="0 0 24 24" fill="none" {...props}>
			<Mask id="a" fill="#fff">
				<Path
					fillRule="evenodd"
					d="M10 21H3L4.089 9.683a1 1 0 0 1 .315-.637l6.916-6.415a1 1 0 0 1 1.36 0l6.916 6.415a1 1 0 0 1 .315.637L21 21h-7v-4.31c0-.93-.896-1.69-2-1.69s-2 .753-2 1.69V21Z"
					clipRule="evenodd"
				/>
			</Mask>
			<Path
				fill="#200020"
				d="m3 21-.995-.096A1 1 0 0 0 3 22v-1Zm7 0v1a1 1 0 0 0 1-1h-1ZM4.089 9.683l-.996-.095.996.095Zm.315-.637.68.733-.68-.733Zm6.916-6.415.68.733-.68-.733Zm1.36 0-.68.733.68-.733Zm6.916 6.415-.68.733.68-.733Zm.315.637.996-.095-.996.095ZM21 21v1a1 1 0 0 0 .995-1.096L21 21Zm-7 0h-1a1 1 0 0 0 1 1v-1ZM3 22h7v-2H3v2Zm.093-12.412L2.005 20.904l1.99.192L5.084 9.779l-1.99-.191Zm.63-1.275a2 2 0 0 0-.63 1.275l1.991.191-1.36-1.466Zm6.917-6.415L3.724 8.313l1.36 1.466L12 3.364l-1.36-1.466Zm2.72 0a2 2 0 0 0-2.72 0L12 3.364l1.36-1.466Zm6.916 6.415L13.36 1.898 12 3.364l6.916 6.415 1.36-1.466Zm.63 1.275a2 2 0 0 0-.63-1.275l-1.36 1.466 1.99-.191Zm1.09 11.316-1.09-11.316-1.99.191 1.089 11.317 1.99-.192ZM14 22h7v-2h-7v2Zm-1-5.31V21h2v-4.31h-2ZM12 16c.715 0 1 .463 1 .69h2c0-1.632-1.507-2.69-3-2.69v2Zm-1 .69c0-.232.282-.69 1-.69v-2c-1.49 0-3 1.048-3 2.69h2ZM11 21v-4.31H9V21h2Z"
				mask="url(#a)"
			/>
		</Svg>
	);
}

export function HomeTabSelected(props: SvgProps) {
	return (
		<Svg width="24" height="24" viewBox="0 0 24 24" fill="none" {...props}>
			<Mask id="a" fill="#fff">
				<Path
					fillRule="evenodd"
					d="M10 21H3L4.089 9.683a1 1 0 0 1 .315-.637l6.916-6.415a1 1 0 0 1 1.36 0l6.916 6.415a1 1 0 0 1 .315.637L21 21h-7v-4.31c0-.93-.896-1.69-2-1.69s-2 .753-2 1.69V21Z"
					clipRule="evenodd"
				/>
			</Mask>
			<Path
				fill="#200020"
				fillRule="evenodd"
				d="M10 21H3L4.089 9.683a1 1 0 0 1 .315-.637l6.916-6.415a1 1 0 0 1 1.36 0l6.916 6.415a1 1 0 0 1 .315.637L21 21h-7v-4.31c0-.93-.896-1.69-2-1.69s-2 .753-2 1.69V21Z"
				clipRule="evenodd"
			/>
			<Path
				fill="#200020"
				d="m3 21-.995-.096A1 1 0 0 0 3 22v-1Zm7 0v1a1 1 0 0 0 1-1h-1ZM4.089 9.683l-.996-.095.996.095Zm.315-.637.68.733-.68-.733Zm6.916-6.415.68.733-.68-.733Zm1.36 0-.68.733.68-.733Zm6.916 6.415-.68.733.68-.733Zm.315.637.996-.095-.996.095ZM21 21v1a1 1 0 0 0 .995-1.096L21 21Zm-7 0h-1a1 1 0 0 0 1 1v-1ZM3 22h7v-2H3v2Zm.093-12.412L2.005 20.904l1.99.192L5.084 9.779l-1.99-.191Zm.63-1.275a2 2 0 0 0-.63 1.275l1.991.191-1.36-1.466Zm6.917-6.415L3.724 8.313l1.36 1.466L12 3.364l-1.36-1.466Zm2.72 0a2 2 0 0 0-2.72 0L12 3.364l1.36-1.466Zm6.916 6.415L13.36 1.898 12 3.364l6.916 6.415 1.36-1.466Zm.63 1.275a2 2 0 0 0-.63-1.275l-1.36 1.466 1.99-.191Zm1.09 11.316-1.09-11.316-1.99.191 1.089 11.317 1.99-.192ZM14 22h7v-2h-7v2Zm-1-5.31V21h2v-4.31h-2ZM12 16c.715 0 1 .463 1 .69h2c0-1.632-1.507-2.69-3-2.69v2Zm-1 .69c0-.232.282-.69 1-.69v-2c-1.49 0-3 1.048-3 2.69h2ZM11 21v-4.31H9V21h2Z"
				mask="url(#a)"
			/>
		</Svg>
	);
}

export function MovementsTab(props: SvgProps) {
	return (
		<Svg width="24" height="24" viewBox="0 0 24 24" fill="none" {...props}>
			<Path
				stroke="#200020"
				strokeLinecap="round"
				strokeLinejoin="round"
				d="M17.835 19.147a.5.5 0 0 0-.252-.069l-10.036-.031C5.873 19.04 4.5 17.65 4.5 15.91V3a.5.5 0 0 1 .5-.5h11.546c1.62 0 2.954 1.346 2.954 3.03v14.596l-1.665-.979Z"
			/>
			<Path
				stroke="#200020"
				strokeLinecap="round"
				d="M8 6.75h8M8 10.972h8M8 15.194h8"
			/>
		</Svg>
	);
}

export function MovementsTabSelected(props: SvgProps) {
	return (
		<Svg width="24" height="24" viewBox="0 0 24 24" fill="none" {...props}>
			<Path
				fill="#200020"
				fillRule="evenodd"
				d="m17.581 19.578-10.036-.031C5.585 19.54 4 17.915 4 15.91V3a1 1 0 0 1 1-1h11.546C18.453 2 20 3.58 20 5.53V21l-2.419-1.422ZM8 6.25a.5.5 0 0 0 0 1h8a.5.5 0 0 0 0-1H8Zm-.5 4.722a.5.5 0 0 1 .5-.5h8a.5.5 0 0 1 0 1H8a.5.5 0 0 1-.5-.5Zm.5 3.723a.5.5 0 1 0 0 1h8a.5.5 0 0 0 0-1H8Z"
				clipRule="evenodd"
			/>
		</Svg>
	);
}

export function ClosetTab(props: SvgProps) {
	return (
		<Svg width="24" height="24" viewBox="0 0 24 24" fill="none" {...props}>
			<Rect width={7} height={7} x={3.5} y={3.5} stroke="#200020" rx={0.5} />
			<Rect width={7} height={7} x={13.5} y={3.5} stroke="#200020" rx={0.5} />
			<Rect width={7} height={7} x={3.5} y={13.5} stroke="#200020" rx={0.5} />
			<Rect width={7} height={7} x={13.5} y={13.5} stroke="#200020" rx={0.5} />
		</Svg>
	);
}

export function ClosetTabSelected(props: SvgProps) {
	return (
		<Svg width="24" height="24" viewBox="0 0 24 24" fill="none" {...props}>
			<Rect
				width={7}
				height={7}
				x={3.5}
				y={3.5}
				fill="#200020"
				stroke="#200020"
				rx={0.5}
			/>
			<Rect
				width={7}
				height={7}
				x={13.5}
				y={3.5}
				fill="#200020"
				stroke="#200020"
				rx={0.5}
			/>
			<Rect
				width={7}
				height={7}
				x={3.5}
				y={13.5}
				fill="#200020"
				stroke="#200020"
				rx={0.5}
			/>
			<Rect
				width={7}
				height={7}
				x={13.5}
				y={13.5}
				fill="#200020"
				stroke="#200020"
				rx={0.5}
			/>
		</Svg>
	);
}
