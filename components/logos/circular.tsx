import Svg, { Circle, G } from "react-native-svg";

type Props = {
	progress?: number;
};

export default function CircularProgress({ progress = 0.75 }: Props) {
	const p = Math.max(0, Math.min(1, progress));

	const half = 24 / 2;
	const radius = half - 3 / 2;
	const circumference = 2 * Math.PI * radius;
	const strokeDashoffset = circumference * (1 - p);

	return (
		<Svg width={24} height={24} viewBox={`0 0 ${24} ${24}`}>
			<G transform={`rotate(-90 ${half} ${half})`}>
				<Circle
					cx={half}
					cy={half}
					r={radius}
					stroke="#fbe5f2"
					strokeWidth={3}
					fill="none"
					strokeLinecap="round"
				/>
				<Circle
					cx={half}
					cy={half}
					r={radius}
					stroke="#da0081"
					strokeWidth={3}
					fill="none"
					strokeLinecap="round"
					strokeDasharray={`${circumference} ${circumference}`}
					strokeDashoffset={strokeDashoffset}
				/>
			</G>
		</Svg>
	);
}
