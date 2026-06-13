import { LinearGradient } from "expo-linear-gradient";
import { useEffect, useRef, type ReactNode } from "react";
import {
	Animated,
	StyleSheet,
	View,
} from "react-native";
import { useHomeLayoutMetrics } from "@/hooks/useHomeLayoutMetrics";

function ShimmerBlock({
	children,
	style,
}: {
	children: ReactNode;
	style?: object;
}) {
	const shimmerAnim = useRef(new Animated.Value(0)).current;

	useEffect(() => {
		const loop = Animated.loop(
			Animated.timing(shimmerAnim, {
				toValue: 1,
				duration: 1500,
				useNativeDriver: true,
			}),
		);
		loop.start();
		return () => loop.stop();
	}, [shimmerAnim]);

	const translateX = shimmerAnim.interpolate({
		inputRange: [0, 1],
		outputRange: [-260, 260],
	});

	return (
		<View style={[styles.shimmerWrap, style]} className="overflow-hidden">
			{children}
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
						"rgba(255,255,255,0.45)",
						"rgba(255,255,255,0.85)",
						"rgba(255,255,255,0.45)",
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

function IconSkeletonRow({
	count = 4,
	iconSize,
	labelWidth,
	labelHeight,
}: {
	count?: number;
	iconSize: number;
	labelWidth: number;
	labelHeight: number;
}) {
	return (
		<View style={styles.iconRow}>
			{Array.from({ length: count }).map((_, index) => (
				<View key={index} style={styles.iconItem}>
					<View style={[styles.iconBox, { width: iconSize, height: iconSize }]} />
					<View
						style={[
							styles.iconLabel,
							{ width: labelWidth, height: labelHeight },
						]}
					/>
				</View>
			))}
		</View>
	);
}

export function HomeTarjetillaShimmer() {
	const m = useHomeLayoutMetrics();
	const cardWidth = m.width - m.shimmerCardPadding * 2;

	return (
		<ShimmerBlock style={{ marginHorizontal: m.shimmerCardPadding }}>
			<View
				style={[
					styles.tarjetillaCard,
					{
						width: cardWidth,
						height: m.shimmerCardHeight,
						borderRadius: m.shimmerCardRadius,
					},
				]}
			>
				<View style={styles.tarjetillaTextCol}>
					<View
						style={[
							styles.line,
							{ width: m.scale(90), height: m.scale(14) },
						]}
					/>
					<View
						style={[
							styles.line,
							{
								width: m.scale(180),
								height: m.scale(12),
								marginTop: m.scaleV(16),
							},
						]}
					/>
					<View
						style={[
							styles.line,
							{
								width: m.scale(120),
								height: m.scale(12),
								marginTop: m.scaleV(10),
							},
						]}
					/>
				</View>
				<View
					style={[
						styles.tarjetillaImage,
						{
							width: m.shimmerImageWidth,
							height: m.shimmerCardHeight,
							borderTopRightRadius: m.shimmerCardRadius,
							borderBottomRightRadius: m.shimmerCardRadius,
						},
					]}
				/>
			</View>
		</ShimmerBlock>
	);
}

export function HomeBottomShimmer() {
	const m = useHomeLayoutMetrics();
	const iconSize = m.scale(55);

	return (
		<ShimmerBlock style={[styles.bottomWrap, { marginTop: m.scaleV(20) }]}>
			<View
				style={[
					styles.sectionLine,
					{
						marginHorizontal: m.scale(18),
						height: m.scale(10),
						marginTop: m.scaleV(5),
					},
				]}
			/>
			<IconSkeletonRow
				iconSize={iconSize}
				labelWidth={m.scale(50)}
				labelHeight={m.scale(8)}
			/>
			<View
				style={[
					styles.sectionLine,
					{
						marginHorizontal: m.scale(18),
						height: m.scale(10),
						marginTop: m.scaleV(20),
					},
				]}
			/>
			<IconSkeletonRow
				iconSize={iconSize}
				labelWidth={m.scale(50)}
				labelHeight={m.scale(8)}
			/>
		</ShimmerBlock>
	);
}

export default function HomeLoadingShimmer({
	showTarjetilla = true,
	showBottom = true,
}: {
	showTarjetilla?: boolean;
	showBottom?: boolean;
}) {
	return (
		<View>
			{showTarjetilla ? <HomeTarjetillaShimmer /> : null}
			{showBottom ? <HomeBottomShimmer /> : null}
		</View>
	);
}

const styles = StyleSheet.create({
	shimmerWrap: {
		backgroundColor: "#FFFFFF",
	},
	tarjetillaCard: {
		flexDirection: "row",
		alignItems: "center",
		backgroundColor: "#EDEDED",
		paddingLeft: 20,
		overflow: "hidden",
	},
	tarjetillaTextCol: {
		flex: 1,
	},
	line: {
		backgroundColor: "#D5D5D5",
		borderRadius: 4,
	},
	tarjetillaImage: {
		backgroundColor: "#D5D5D5",
	},
	bottomWrap: {
		paddingBottom: 12,
	},
	sectionLine: {
		backgroundColor: "#E0E0E0",
		borderRadius: 4,
	},
	iconRow: {
		flexDirection: "row",
		paddingHorizontal: 18,
		marginTop: 15,
	},
	iconItem: {
		flex: 1,
		alignItems: "center",
	},
	iconBox: {
		borderRadius: 10,
		backgroundColor: "#E0E0E0",
	},
	iconLabel: {
		marginTop: 8,
		borderRadius: 4,
		backgroundColor: "#E0E0E0",
	},
});
