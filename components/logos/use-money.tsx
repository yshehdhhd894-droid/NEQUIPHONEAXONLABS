import Svg, { Path, Rect, type SvgProps } from "react-native-svg";

export function Request(props: SvgProps) {
	return (
		<Svg width="40" height="40" viewBox="0 0 40 40" fill="none" {...props}>
			<Rect width={40} height={40} fill="#DA0081" rx={8} />
			<Path
				stroke="#fff"
				strokeLinecap="round"
				strokeLinejoin="round"
				strokeWidth={1.5}
				d="M19.438 26.75 12.688 20l6.75-6.75M13.625 20h13.688"
			/>
		</Svg>
	);
}

export function Cashout(props: SvgProps) {
	return (
		<Svg width="40" height="40" viewBox="0 0 40 40" fill="none" {...props}>
			<Rect width={40} height={40} fill="#DA0081" rx={8} />
			<Path
				stroke="#fff"
				strokeLinecap="round"
				strokeLinejoin="round"
				strokeWidth={1.5}
				d="m13.25 20.563 6.75 6.75 6.75-6.75M20 26.375V12.687"
			/>
		</Svg>
	);
}

export function Send(props: SvgProps) {
	return (
		<Svg width="40" height="40" viewBox="0 0 40 40" fill="none" {...props}>
			<Rect width={40} height={40} fill="#DA0081" rx={8} />
			<Path
				stroke="#fff"
				strokeLinecap="round"
				strokeLinejoin="round"
				strokeWidth={1.5}
				d="m20.563 26.75 6.75-6.75-6.75-6.75M26.375 20H12.687"
			/>
		</Svg>
	);
}

export function QRCode(props: SvgProps) {
	return (
		<Svg width="40" height="40" viewBox="0 0 40 40" fill="none" {...props}>
			<Rect width={40} height={40} fill="#DA0081" rx={8} />
			<Path
				fill="#fff"
				d="M25.733 20.586h-4.412a.735.735 0 0 0-.735.735v4.412c0 .406.33.735.735.735h4.412c.406 0 .735-.329.735-.735v-4.412a.735.735 0 0 0-.735-.735ZM22.645 27.656H20.88a.294.294 0 0 0-.294.294v1.765c0 .163.132.294.294.294h1.765a.294.294 0 0 0 .294-.294V27.95a.294.294 0 0 0-.294-.294ZM29.715 20.586H27.95a.294.294 0 0 0-.294.294v1.765c0 .162.132.294.294.294h1.765a.294.294 0 0 0 .294-.294V20.88a.294.294 0 0 0-.294-.294ZM29.573 26.465h-2.647a.441.441 0 0 0-.442.441v2.647c0 .244.198.441.442.441h2.647a.441.441 0 0 0 .44-.44v-2.648a.441.441 0 0 0-.44-.441ZM15.633 13.535h-1.882a.235.235 0 0 0-.235.236v1.882c0 .13.105.235.235.235h1.882c.13 0 .236-.105.236-.235V13.77a.235.235 0 0 0-.236-.235ZM26.22 13.535h-1.883a.235.235 0 0 0-.235.236v1.882c0 .13.105.235.235.235h1.882c.13 0 .235-.105.235-.235V13.77a.235.235 0 0 0-.235-.235ZM15.633 24.121h-1.882a.235.235 0 0 0-.235.235v1.883c0 .13.105.235.235.235h1.882c.13 0 .236-.105.236-.235v-1.883a.235.235 0 0 0-.236-.235Z"
			/>
			<Path
				stroke="#fff"
				strokeLinecap="round"
				strokeLinejoin="round"
				strokeWidth={1.25}
				d="M10.856 10.625h7.7a.23.23 0 0 1 .23.23v7.701a.23.23 0 0 1-.23.23h-7.7a.23.23 0 0 1-.231-.23v-7.7a.23.23 0 0 1 .23-.231ZM21.442 10.625h7.7a.23.23 0 0 1 .23.23v7.701a.23.23 0 0 1-.23.23h-7.7a.23.23 0 0 1-.231-.23v-7.7a.23.23 0 0 1 .23-.231ZM10.856 21.21h7.7a.23.23 0 0 1 .23.232v7.7a.23.23 0 0 1-.23.23h-7.7a.23.23 0 0 1-.231-.23v-7.7a.23.23 0 0 1 .23-.231Z"
			/>
		</Svg>
	);
}

export function CashIn(props: SvgProps) {
	return (
		<Svg width="40" height="40" viewBox="0 0 40 40" fill="none" {...props}>
			<Rect width={40} height={40} fill="#DA0081" rx={8} />
			<Path
				stroke="#fff"
				strokeLinecap="round"
				strokeLinejoin="round"
				strokeWidth={1.5}
				d="M26.75 19.438 20 12.688l-6.75 6.75M20 13.625v13.688"
			/>
		</Svg>
	);
}

export function Services(props: SvgProps) {
	return (
		<Svg width="40" height="40" viewBox="0 0 40 40" fill="none" {...props}>
			<Rect width={40} height={40} fill="#5A9EFB" rx={8} />
			<Path
				stroke="#fff"
				strokeLinecap="round"
				strokeLinejoin="round"
				strokeWidth={1.5}
				d="M9.94 9.748h8.47c.106 0 .192.086.192.191v8.472a.191.191 0 0 1-.192.191H9.94a.191.191 0 0 1-.192-.191V9.939c0-.105.085-.19.191-.19ZM21.59 21.396h8.47c.107 0 .192.086.192.191v8.471a.191.191 0 0 1-.191.192H21.59a.191.191 0 0 1-.192-.192v-8.47c0-.106.086-.192.192-.192ZM21.59 9.748h8.47c.107 0 .192.086.192.191v8.472a.191.191 0 0 1-.191.191H21.59a.191.191 0 0 1-.192-.191V9.939c0-.105.086-.19.192-.19ZM9.94 21.396h8.47c.106 0 .192.086.192.191v8.471a.191.191 0 0 1-.192.192H9.94a.191.191 0 0 1-.192-.192v-8.47c0-.106.085-.192.191-.192Z"
			/>
		</Svg>
	);
}
