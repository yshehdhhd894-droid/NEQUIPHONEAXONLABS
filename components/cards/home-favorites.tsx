import Ionicons from "@expo/vector-icons/Ionicons";
import { LinearGradient } from "expo-linear-gradient";
import { type ReactElement, useEffect, useRef } from "react";
import {
	Animated,
	Image,
	type ImageSourcePropType,
	Pressable,
	StyleSheet,
	View,
} from "react-native";
import type { SvgProps } from "react-native-svg";
import Text from "@/components/basic/text";
import { useHomeLayoutMetrics } from "@/hooks/useHomeLayoutMetrics";

/** Valores base (DPI normal); en pantalla se usan métricas escaladas. */
export const FAVORITE_BOX_SIZE = 60;
export const FAVORITE_ICON_SIZE = 42;
export const FAVORITE_ITEM_WIDTH = 76;
export const FAVORITE_ITEM_GAP = 32;
export const FAVORITE_ROW_MIN_HEIGHT = FAVORITE_BOX_SIZE + 8 + 16 * 2 + 12;

export type FavoriteCardContent =
	| {
			kind: "svg";
			element: (props: SvgProps) => ReactElement;
			width?: number;
			height?: number;
	  }
	| {
			kind: "image";
			source: ImageSourcePropType;
			width: number;
			height: number;
	  };

interface ServiceCardProps {
	content: FavoriteCardContent;
	cross?: () => void;
	onPress?: () => void;
	name: string;
	itemWidth?: number;
}

export function ServiceCard(props: ServiceCardProps) {
	const m = useHomeLayoutMetrics();

	const body = (() => {
		if (props.content.kind === "image") {
			const { source, width, height } = props.content;
			return (
				<Image
					source={source}
					style={{ width, height }}
					resizeMode="contain"
				/>
			);
		}

		const w = props.content.width ?? m.iconSize;
		const h = props.content.height ?? m.iconSize;
		const Element = props.content.element;
		return <Element width={w} height={h} />;
	})();

	const itemWidth = props.itemWidth ?? m.itemWidth;
	const labelLineHeight = Math.round(m.labelFontSize * 1.28);

	return (
		<Pressable
			onPress={props?.onPress}
			className="flex items-center gap-2"
			style={{ width: itemWidth }}
		>
			<View
				style={[
					styles.cardBox,
					{ width: m.boxSize, height: m.boxSize },
				]}
				className="bg-white items-center justify-center relative"
			>
				{body}
				{props.cross && (
					<Pressable
						onPress={props.cross}
						className="absolute top-0 right-0 pl-3 pb-3"
					>
						<Ionicons name="close-outline" size={16} color="#6b7280" />
					</Pressable>
				)}
			</View>
			<Text
				fontWeight="medium"
				className="text-home-label text-center"
				style={{
					width: itemWidth,
					minHeight: labelLineHeight * 2 + 10,
					paddingBottom: 5,
					fontSize: m.labelFontSize,
					lineHeight: labelLineHeight,
					fontFamily: "ManropeMedium",
				}}
				numberOfLines={2}
				includeFontPadding
			>
				{props.name}
			</Text>
		</Pressable>
	);
}

const styles = StyleSheet.create({
	cardBox: {
		borderRadius: 4,
		borderWidth: 1,
		borderColor: "#f0f0f0",
	},
});

export function ServiceCardSkeleton() {
	const m = useHomeLayoutMetrics();
	const shimmerAnim = useRef(new Animated.Value(0)).current;

	useEffect(() => {
		const loop = Animated.loop(
			Animated.sequence([
				Animated.timing(shimmerAnim, {
					toValue: 1,
					duration: 1300,
					useNativeDriver: true,
				}),
				Animated.timing(shimmerAnim, {
					toValue: 0,
					duration: 0,
					useNativeDriver: true,
				}),
			]),
		);
		loop.start();
		return () => loop.stop();
	}, [shimmerAnim]);

	const translateX = shimmerAnim.interpolate({
		inputRange: [0, 1],
		outputRange: [-100, 100],
	});

	return (
		<View className="flex gap-2 items-center" style={{ width: m.itemWidth }}>
			<View
				style={[styles.cardBox, { width: m.boxSize, height: m.boxSize }]}
				className="bg-[#eeefef] overflow-hidden"
			>
				<Animated.View
					style={[
						StyleSheet.absoluteFillObject,
						{ transform: [{ translateX }] },
					]}
				>
					<LinearGradient
						colors={["#eeefef", "#e6e6e6", "#e6e6e6", "#eeefef"]}
						start={{ x: 0, y: 0.5 }}
						end={{ x: 1, y: 0.5 }}
						style={StyleSheet.absoluteFill}
					/>
				</Animated.View>
			</View>

			<View
				className="overflow-hidden bg-[#eeefef]"
				style={{ width: m.scale(50), height: m.scale(12) }}
			/>
		</View>
	);
}

/** Compat: tarjetas solo con SVG (p. ej. add-card sheet). */
export function ServiceCardSvg(props: {
	element: (props: SvgProps) => ReactElement;
	name: string;
	onPress?: () => void;
	cross?: () => void;
	width?: number;
	height?: number;
}) {
	const m = useHomeLayoutMetrics();
	return (
		<ServiceCard
			name={props.name}
			onPress={props.onPress}
			cross={props.cross}
			content={{
				kind: "svg",
				element: props.element,
				width: props.width ?? m.iconSize,
				height: props.height ?? m.iconSize,
			}}
		/>
	);
}
