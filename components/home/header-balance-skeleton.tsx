import { LinearGradient } from "expo-linear-gradient";
import { useEffect, useRef } from "react";
import { Animated, StyleSheet, View } from "react-native";
import { useHomeLayoutMetrics } from "@/hooks/useHomeLayoutMetrics";

type Variant = "large" | "small";

export function HeaderBalanceSkeleton({
	variant,
	style,
}: {
	variant: Variant;
	style?: object;
}) {
	const m = useHomeLayoutMetrics();
	const width = variant === "large" ? m.scale(170) : m.scale(100);
	const height = variant === "large" ? m.scale(23) : m.scale(17);
	const borderRadius = m.scale(6);
	const shimmerAnim = useRef(new Animated.Value(0)).current;

	useEffect(() => {
		const loop = Animated.loop(
			Animated.timing(shimmerAnim, {
				toValue: 1,
				duration: 2500,
				useNativeDriver: true,
			}),
		);
		loop.start();
		return () => loop.stop();
	}, [shimmerAnim]);

	const translateX = shimmerAnim.interpolate({
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
					backgroundColor: "#7f52ba",
					overflow: "hidden",
				},
				style,
			]}
		>
			<Animated.View
				pointerEvents="none"
				style={[
					StyleSheet.absoluteFillObject,
					{ transform: [{ translateX }] },
				]}
			>
				<LinearGradient
					colors={[
						"rgba(216, 141, 184, 0)",
						"rgba(216, 141, 184, 0.35)",
						"rgba(216, 141, 184, 0.65)",
						"rgba(216, 141, 184, 0.35)",
						"rgba(216, 141, 184, 0)",
					]}
					start={{ x: 0, y: 0.5 }}
					end={{ x: 1, y: 0.5 }}
					style={StyleSheet.absoluteFillObject}
				/>
			</Animated.View>
		</View>
	);
}

export function HeaderBalanceSkeletonGroup({ style }: { style?: object }) {
	const m = useHomeLayoutMetrics();

	return (
		<View
			style={[
				{ alignItems: "center", gap: m.scaleV(10) },
				style,
			]}
		>
			<HeaderBalanceSkeleton
				variant="large"
				style={{ marginTop: m.scaleV(8) }}
			/>
			<HeaderBalanceSkeleton variant="small" />
		</View>
	);
}
