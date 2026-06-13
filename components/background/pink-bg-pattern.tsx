import { Dimensions, View } from "react-native";
import Svg, {
	G,
	Mask,
	Path,
	Rect,
} from "react-native-svg";

const { width: SCREEN_W } = Dimensions.get("window");
const { height: SCREEN_H } = Dimensions.get("window");

const SVG_W = 250;
const SVG_H = 200;
const SCALE = Math.max(SCREEN_W / SVG_W, SCREEN_H / SVG_H) * 1.3;

export function PinkBgPattern() {
	return (
		<View
			style={{
				position: "absolute",
				top: 0,
				left: 0,
				right: 0,
				bottom: 0,
				backgroundColor: "#F1BFDA",
				overflow: "hidden",
			}}
			pointerEvents="none"
		>
			<View
				style={{
					position: "absolute",
					bottom: -20,
					left: SCREEN_W / 2 - (SVG_W * SCALE) / 2,
					opacity: 0.5,
				}}
			>
				<Svg
					width={SVG_W * SCALE}
					height={SVG_H * SCALE}
					viewBox="0 0 250 200"
				>
					<Mask id="mask0" maskType="luminance" x="0" y="0" width="250" height="200">
						<Path
							d="M250 200V13.5042C250 6.04738 244.598 0 237.938 0H12.0622C5.40163 0 0 6.04738 0 13.5042V200H250Z"
							fill="white"
						/>
					</Mask>
					<G mask="url(#mask0)">
						<Path
							opacity="0.3"
							d="M86.1666 136.617C102.73 136.617 116.157 123.179 116.157 106.603C116.157 90.0259 102.73 76.5879 86.1666 76.5879C69.6034 76.5879 56.1763 90.0259 56.1763 106.603C56.1763 123.179 69.6034 136.617 86.1666 136.617Z"
							fill="#7BECFF"
							stroke="#200020"
							strokeWidth="1.87807"
							strokeLinecap="round"
							strokeLinejoin="round"
						/>
						<Path
							d="M72.724 195.299L79.0895 98.102C79.9565 84.8634 91.397 74.8223 104.625 75.69L218.977 83.1911C232.205 84.0588 242.238 95.5086 241.371 108.747L235.006 205.944C234.139 219.183 222.698 229.224 209.471 228.356L95.1179 220.855C81.8901 219.987 71.857 208.538 72.724 195.299Z"
							fill="#DA0081"
						/>
						<Path
							d="M93.678 77.541C85.5925 80.9736 79.6885 88.7321 79.0773 98.1031L76.6587 135.079C79.6477 136.08 82.8442 136.621 86.1703 136.621C102.734 136.621 116.161 123.184 116.161 106.607C116.161 92.628 106.612 80.8809 93.6817 77.541H93.678Z"
							fill="#5A9EFB"
						/>
						<Path
							opacity="0.3"
							d="M111.123 89.957L60.7871 122.596C62.0983 124.672 63.6539 126.577 65.417 128.268L114.412 96.4997C113.582 94.1718 112.471 91.9773 111.123 89.957Z"
							fill="white"
						/>
						<Path
							opacity="0.3"
							d="M94.3332 77.7168L56.487 102.256C56.2795 103.676 56.1721 105.129 56.1721 106.605C56.1721 110.178 56.7981 113.607 57.9426 116.784L106.971 84.9934C103.467 81.6127 99.1445 79.0772 94.3295 77.7168H94.3332Z"
							fill="white"
						/>
						<Path
							d="M86.1666 136.617C102.73 136.617 116.157 123.179 116.157 106.603C116.157 90.0259 102.73 76.5879 86.1666 76.5879C69.6034 76.5879 56.1763 90.0259 56.1763 106.603C56.1763 123.179 69.6034 136.617 86.1666 136.617Z"
							stroke="#200020"
							strokeWidth="1.87807"
							strokeLinecap="round"
							strokeLinejoin="round"
						/>
						<Path
							d="M72.714 195.296C52.7538 195.296 41.1533 166.204 67.3175 154.209"
							stroke="#200020"
							strokeWidth="1.87807"
							strokeLinecap="round"
							strokeLinejoin="round"
						/>
						<Path
							d="M72.7139 202.841C72.7139 202.841 46.0089 202.892 46.446 181.137C46.883 159.381 54.7871 156.66 54.7871 156.66L75.5103 170.754L72.7139 202.841Z"
							fill="#C29CFF"
							stroke="#200020"
							strokeWidth="1.87807"
							strokeLinecap="round"
							strokeLinejoin="round"
						/>
						<Path
							d="M77.6256 142.361C77.6256 142.361 68.0881 142.346 67.314 154.212C66.5399 166.078 74.5328 168.398 80.2035 167.627C85.8741 166.853 85.1 161 83.5555 160.225C83.5555 160.225 88.3224 157.534 84.9741 150.987C84.9741 150.987 89.2261 142.361 77.6293 142.361H77.6256Z"
							stroke="#200020"
							strokeWidth="1.87807"
							strokeLinecap="round"
							strokeLinejoin="round"
						/>
						<Path
							d="M79.5588 150.943L84.9702 150.988"
							stroke="#200020"
							strokeWidth="1.87807"
							strokeLinecap="round"
							strokeLinejoin="round"
						/>
						<Path
							d="M83.5553 160.225H79.0439"
							stroke="#200020"
							strokeWidth="1.87807"
							strokeLinecap="round"
							strokeLinejoin="round"
						/>
						<Path
							d="M237.118 182.061L268.168 174.292C268.168 174.292 275.127 166.522 278.072 168.398C281.016 170.273 276.735 178.043 276.735 178.043C276.735 178.043 290.12 183.399 289.85 186.079C289.58 188.76 281.283 186.079 281.283 186.079C281.283 186.079 288.509 193.849 286.635 194.92C284.761 195.992 278.338 193.312 278.338 193.312C278.338 193.312 283.157 199.472 281.283 200.814C279.409 202.153 272.183 197.6 272.183 197.6L231.858 209.388"
							stroke="#200020"
							strokeWidth="1.87807"
							strokeLinecap="round"
							strokeLinejoin="round"
						/>
						<Path
							d="M141.854 78.1298V26.0444C146.64 19.5573 174.804 22.6526 180.093 28.7652L173.73 80.2205L141.854 78.1298Z"
							stroke="#200020"
							strokeWidth="1.87807"
							strokeLinecap="round"
							strokeLinejoin="round"
						/>
						<Path
							d="M190.134 81.9118C190.336 78.0908 176.286 74.2408 158.751 73.3126C141.216 72.3843 126.837 74.7293 126.635 78.5503C126.433 82.3712 140.483 86.2212 158.018 87.1495C175.553 88.0778 189.932 85.7327 190.134 81.9118Z"
							stroke="#200020"
							strokeWidth="1.87807"
							strokeLinecap="round"
							strokeLinejoin="round"
						/>
						<Path
							d="M177.304 81.2249C164.026 83.2786 151.144 82.793 138.743 79.1862L139.336 67.9395C152.055 71.9429 164.911 72.5545 177.897 69.9782L177.304 81.2249Z"
							fill="#7BECFF"
							stroke="#200020"
							strokeWidth="1.87807"
							strokeLinecap="round"
							strokeLinejoin="round"
						/>
						<Path
							d="M158.355 33.1787C155.225 33.9164 141.854 31.2771 141.854 26.043"
							stroke="#200020"
							strokeWidth="1.87807"
							strokeLinecap="round"
							strokeLinejoin="round"
						/>
						<Path
							d="M166.733 32.6452C166.733 32.6452 169.697 32.4302 171.837 31.2773"
							stroke="#200020"
							strokeWidth="1.87807"
							strokeLinecap="round"
							strokeLinejoin="round"
						/>
						<Path
							d="M234.611 177.928C234.611 177.928 198.28 190.613 200.213 241.097C200.213 241.097 238.867 248.018 245.701 237.142C252.538 226.262 245.701 222.726 245.701 222.726C245.701 222.726 252.782 214.897 246.608 209.392L269.087 202.875C269.087 202.875 258.712 185.598 261.924 172.742L234.611 177.936V177.928Z"
							fill="#C29CFF"
							stroke="#200020"
							strokeWidth="1.87807"
							strokeLinecap="round"
							strokeLinejoin="round"
						/>
						<Path
							d="M75.2914 174.756C75.2914 174.756 66.0391 177.084 68.8133 188.749C69.6023 192.074 68.7578 194.903 68.7578 194.903C68.7578 194.903 63.6835 207.717 70.2282 214.394C70.2282 214.394 57.6795 234.033 97.8555 233.803C97.8555 233.803 97.8554 208.003 88.8772 188.749C88.8772 188.749 84.677 181.469 75.2914 174.756Z"
							fill="#C29CFF"
							stroke="#200020"
							strokeWidth="1.87807"
							strokeLinecap="round"
							strokeLinejoin="round"
						/>
						<Path
							d="M82.2661 198.2C82.2661 198.2 71.3656 199.019 68.7581 194.9L82.2661 198.2Z"
							fill="#C29CFF"
						/>
						<Path
							d="M82.2661 198.2C82.2661 198.2 71.3656 199.019 68.7581 194.9"
							stroke="#200020"
							strokeWidth="1.87807"
							strokeLinecap="round"
							strokeLinejoin="round"
						/>
						<Path
							d="M76.6547 135.59L75.5103 142.355C75.5103 142.355 79.166 141.936 80.792 142.355L81.7809 136.613L76.6511 135.586L76.6547 135.59Z"
							fill="#200020"
							stroke="#200020"
							strokeWidth="1.87807"
							strokeLinecap="round"
							strokeLinejoin="round"
						/>
						<Path
							d="M107.886 115.485C110.138 115.485 111.964 112.957 111.964 109.839C111.964 106.721 110.138 104.193 107.886 104.193C105.634 104.193 103.808 106.721 103.808 109.839C103.808 112.957 105.634 115.485 107.886 115.485Z"
							fill="#200020"
						/>
						<Path
							d="M136.206 117.633C138.458 117.633 140.284 115.105 140.284 111.987C140.284 108.869 138.458 106.342 136.206 106.342C133.954 106.342 132.128 108.869 132.128 111.987C132.128 115.105 133.954 117.633 136.206 117.633Z"
							fill="#200020"
						/>
						<Path
							d="M117.59 131.891C117.59 131.891 125.846 132.785 128.143 127.039"
							stroke="#200020"
							strokeWidth="1.87807"
							strokeLinecap="round"
							strokeLinejoin="round"
						/>
						<Path
							d="M32.9135 170.341C32.9135 170.341 15.6531 160.035 19.1142 154.342C22.6626 148.505 28.5923 156.072 28.5923 156.072C28.5923 156.072 29.7207 148.391 35.6498 150.312C41.579 152.234 32.9168 170.334 32.9168 170.334L32.9135 170.341Z"
							stroke="#200020"
							strokeWidth="2.60001"
							strokeLinecap="round"
							strokeLinejoin="round"
						/>
						<Path
							d="M42.3269 119.45C42.3269 119.45 11.8592 113.663 15.1289 102.642C18.4839 91.3433 31.3465 100.003 31.3465 100.003C31.3465 100.003 30.4177 84.2697 41.1551 84.8681C51.8924 85.4666 42.3318 119.448 42.3318 119.448L42.3269 119.45Z"
							stroke="#200020"
							strokeWidth="2.60001"
							strokeLinecap="round"
							strokeLinejoin="round"
						/>
						<Path
							d="M74.4246 16.8125L72.854 69.6784"
							stroke="#200020"
							strokeWidth="2.60001"
							strokeLinecap="round"
							strokeLinejoin="round"
						/>
						<Path
							d="M100.053 44.0271L47.2258 42.4551"
							stroke="#200020"
							strokeWidth="2.60001"
							strokeLinecap="round"
							strokeLinejoin="round"
						/>
						<Path
							d="M86.0443 31.2555L61.2345 55.2385"
							stroke="#200020"
							strokeWidth="2.60001"
							strokeLinecap="round"
							strokeLinejoin="round"
						/>
						<Path
							d="M85.619 55.658L61.6597 30.8281"
							stroke="#200020"
							strokeWidth="2.60001"
							strokeLinecap="round"
							strokeLinejoin="round"
						/>
						<Path
							d="M53.5251 22.332L53.5209 22.476"
							stroke="#200020"
							strokeWidth="2.60001"
							strokeLinecap="round"
							strokeLinejoin="round"
						/>
						<Path
							d="M94.6602 23.5547L94.6559 23.6987"
							stroke="#200020"
							strokeWidth="2.60001"
							strokeLinecap="round"
							strokeLinejoin="round"
						/>
						<Path
							d="M52.3503 61.8652L52.3461 62.0093"
							stroke="#200020"
							strokeWidth="2.60001"
							strokeLinecap="round"
							strokeLinejoin="round"
						/>
						<Path
							d="M93.4854 63.0898L93.4811 63.2339"
							stroke="#200020"
							strokeWidth="2.60001"
							strokeLinecap="round"
							strokeLinejoin="round"
						/>
					</G>
				</Svg>
			</View>
		</View>
	);
}
