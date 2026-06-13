import { useEffect } from "react";
import { StyleSheet, View } from "react-native";
import Animated, {
	Easing,
	useAnimatedStyle,
	useSharedValue,
	withRepeat,
	withTiming,
} from "react-native-reanimated";
import Svg, { Circle } from "react-native-svg";

const AnimatedView = Animated.createAnimatedComponent(View);

interface NequiSpinnerProps {
	size?: number;
	color?: string;
	opacity?: number;
}

export default function NequiSpinner({
	size = 28,
	color = "#f4f5f8",
	opacity = 0.5,
}: NequiSpinnerProps) {
	const rotation = useSharedValue(0);

	useEffect(() => {
		rotation.value = withRepeat(
			withTiming(360, {
				duration: 900,
				easing: Easing.linear,
			}),
			-1,
		);
	}, []);

	const animatedStyle = useAnimatedStyle(() => ({
		transform: [{ rotate: `${rotation.value}deg` }],
	}));

	const radius = size / 2;
	const strokeWidth = size / 16;

	return (
		<AnimatedView style={[styles.container, animatedStyle, { opacity }]}>
			<Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
				<Circle
					cx={radius}
					cy={radius}
					r={radius - strokeWidth / 2}
					stroke={color}
					strokeWidth={strokeWidth}
					strokeLinecap="round"
					strokeDasharray={`${Math.PI * radius * 0.75}, ${Math.PI * radius * 2}`}
					fill="none"
				/>
			</Svg>
		</AnimatedView>
	);
}

const styles = StyleSheet.create({
	container: {
		alignItems: "center",
		justifyContent: "center",
	},
});
