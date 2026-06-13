import { useEffect } from "react";
import { StyleSheet } from "react-native";
import Animated, {
	useAnimatedStyle,
	useSharedValue,
} from "react-native-reanimated";
import NequiSpinner from "@/components/basic/spinner";

const SPINNER_MIN_HEIGHT = 14;

export function HomeRefreshPanel({
	height,
	isRefreshing,
}: {
	height: Animated.SharedValue<number>;
	isRefreshing: boolean;
}) {
	const refreshing = useSharedValue(isRefreshing);

	useEffect(() => {
		refreshing.value = isRefreshing;
	}, [isRefreshing, refreshing]);

	const panelStyle = useAnimatedStyle(() => ({
		height: height.value,
	}));

	const spinnerStyle = useAnimatedStyle(() => ({
		opacity:
			refreshing.value || height.value >= SPINNER_MIN_HEIGHT ? 1 : 0,
	}));

	return (
		<Animated.View style={[styles.panel, panelStyle]}>
			<Animated.View style={spinnerStyle}>
				<NequiSpinner size={22} color="#ffffff" opacity={1} />
			</Animated.View>
		</Animated.View>
	);
}

const styles = StyleSheet.create({
	panel: {
		backgroundColor: "#200020",
		alignItems: "center",
		justifyContent: "center",
		overflow: "hidden",
	},
});
