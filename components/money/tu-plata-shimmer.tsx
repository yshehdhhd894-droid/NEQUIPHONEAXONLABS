import { LinearGradient } from "expo-linear-gradient";
import { useEffect, useRef } from "react";
import { Animated, ScrollView, StyleSheet, View } from "react-native";

const CARD_BACKGROUNDS = ["#4D334D", "#4D334D", "#4D334D", "#2b0d2b", "#2b0d2b"];

function ShimmerCard({ background }: { background: string }) {
	const shimmerAnim = useRef(new Animated.Value(0)).current;

	useEffect(() => {
		const loop = Animated.loop(
			Animated.timing(shimmerAnim, {
				toValue: 1,
				duration: 1200,
				useNativeDriver: true,
			}),
		);
		loop.start();
		return () => loop.stop();
	}, [shimmerAnim]);

	const translateX = shimmerAnim.interpolate({
		inputRange: [0, 1],
		outputRange: [-220, 220],
	});

	return (
		<View
			style={[styles.card, { backgroundColor: background }]}
			className="overflow-hidden"
		>
			<View style={styles.iconPlaceholder} />
			<View style={styles.textBlock}>
				<View style={[styles.line, { width: 120, height: 14 }]} />
				<View style={[styles.line, { width: 80, height: 12, marginTop: 6 }]} />
			</View>

			<Animated.View
				pointerEvents="none"
				style={[
					StyleSheet.absoluteFillObject,
					{ transform: [{ translateX }] },
				]}
			>
				<LinearGradient
					colors={[
						"rgba(255,255,255,0)",
						"rgba(255,255,255,0.12)",
						"rgba(255,255,255,0.35)",
						"rgba(255,255,255,0.12)",
						"rgba(255,255,255,0)",
					]}
					start={{ x: 0, y: 0.5 }}
					end={{ x: 1, y: 0.5 }}
					style={StyleSheet.absoluteFillObject}
				/>
			</Animated.View>
		</View>
	);
}

export default function TuPlataShimmer() {
	return (
		<ScrollView
			showsVerticalScrollIndicator={false}
			contentContainerStyle={styles.list}
		>
			{CARD_BACKGROUNDS.map((bg, index) => (
				<ShimmerCard key={index} background={bg} />
			))}
		</ScrollView>
	);
}

const styles = StyleSheet.create({
	list: {
		paddingHorizontal: 16,
		paddingTop: 8,
		gap: 12,
	},
	card: {
		flexDirection: "row",
		alignItems: "center",
		borderRadius: 8,
		paddingHorizontal: 14,
		paddingVertical: 18,
		minHeight: 72,
	},
	iconPlaceholder: {
		width: 28,
		height: 28,
		borderRadius: 6,
		backgroundColor: "rgba(255,255,255,0.2)",
	},
	textBlock: {
		marginLeft: 16,
		flex: 1,
	},
	line: {
		borderRadius: 6,
		backgroundColor: "rgba(255,255,255,0.2)",
	},
});
