import { useEffect, useRef } from "react";
import {
	Animated,
	type StyleProp,
	StyleSheet,
	View,
	type ViewStyle,
} from "react-native";

interface SkeletonProps {
	width: number;
	height: number;
	borderRadius?: number;
	style?: StyleProp<ViewStyle>;
}

export const Skeleton = ({
	width,
	height,
	borderRadius = 8,
	style,
}: SkeletonProps) => {
	const shimmerAnimation = useRef(new Animated.Value(0)).current;

	useEffect(() => {
		Animated.loop(
			Animated.sequence([
				Animated.timing(shimmerAnimation, {
					toValue: 1,
					duration: 1500,
					useNativeDriver: true,
				}),
				Animated.timing(shimmerAnimation, {
					toValue: 0,
					duration: 1500,
					useNativeDriver: true,
				}),
			]),
		).start();
	}, []);

	const translateX = shimmerAnimation.interpolate({
		inputRange: [0, 1],
		outputRange: [-width, width],
	});

	return (
		<View
			style={[
				{
					width,
					height,
					borderRadius,
					backgroundColor: "rgba(255, 255, 255, 0.15)",
					overflow: "hidden",
				},
				style,
			]}
		>
			<Animated.View
				style={[
					StyleSheet.absoluteFill,
					{
						transform: [{ translateX }],
						backgroundColor: "transparent",
					},
				]}
			>
				<View
					style={{
						flex: 1,
						backgroundColor: "rgba(255, 255, 255, 0.3)",
						width: width * 0.5,
					}}
				/>
			</Animated.View>
		</View>
	);
};
