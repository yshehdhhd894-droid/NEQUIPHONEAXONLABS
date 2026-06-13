import { useEffect } from "react";
import type { ViewStyle } from "react-native";
import Animated, {
	Easing,
	useAnimatedStyle,
	useSharedValue,
	withTiming,
} from "react-native-reanimated";

type ScreenZoomInProps = {
	children: React.ReactNode;
	style?: ViewStyle;
};

/** Entrada 3D hacia el usuario (misma idea que el overlay de rombos, pantalla completa). */
export function ScreenZoomIn({ children, style }: ScreenZoomInProps) {
	const scale = useSharedValue(0.86);
	const opacity = useSharedValue(0);

	useEffect(() => {
		scale.value = withTiming(1, {
			duration: 400,
			easing: Easing.out(Easing.exp),
		});
		opacity.value = withTiming(1, { duration: 300 });
	}, [opacity, scale]);

	const animatedStyle = useAnimatedStyle(() => ({
		flex: 1,
		opacity: opacity.value,
		transform: [{ perspective: 900 }, { scale: scale.value }],
	}));

	return (
		<Animated.View style={[animatedStyle, style]}>{children}</Animated.View>
	);
}
