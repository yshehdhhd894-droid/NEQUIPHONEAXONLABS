import type { ReactNode } from "react";
import { View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import Animated from "react-native-reanimated";
import { useHomeLayoutMetrics } from "@/hooks/useHomeLayoutMetrics";

const AnimatedScrollView = Animated.createAnimatedComponent(ScrollView);

type HomeBodyBaseProps = {
	children: ReactNode;
	scrollHandler?: ReturnType<
		typeof import("react-native-reanimated").useAnimatedScrollHandler
	>;
};

/**
 * Base blanca fija: el marco y la tapa superior NO scrollean.
 * Solo el contenido del ScrollView se mueve; la tapa blanca tapa la tarjetilla al subir.
 */
export function HomeBodyBase({ children, scrollHandler }: HomeBodyBaseProps) {
	const { bodyBaseTop, bodyScrollPaddingTop, bodyFixedCapHeight, sheetBorderRadius, bodyScrollBottom } =
		useHomeLayoutMetrics();

	return (
		<View
			collapsable={false}
			style={{
				flex: 1,
				marginTop: bodyBaseTop,
				backgroundColor: "#ffffff",
				borderTopLeftRadius: sheetBorderRadius,
				borderTopRightRadius: sheetBorderRadius,
				overflow: "hidden",
			}}
		>
			<AnimatedScrollView
				style={{ flex: 1 }}
				contentContainerStyle={{
					paddingTop: bodyScrollPaddingTop,
					paddingBottom: bodyScrollBottom,
					flexGrow: 1,
				}}
				showsVerticalScrollIndicator={false}
				alwaysBounceVertical
				overScrollMode="always"
				bounces
				nestedScrollEnabled
				scrollEventThrottle={16}
				onScroll={scrollHandler}
				removeClippedSubviews
			>
				{children}
			</AnimatedScrollView>

			<View
				pointerEvents="none"
				collapsable={false}
				style={{
					position: "absolute",
					top: 0,
					left: 0,
					right: 0,
					height: bodyFixedCapHeight,
					backgroundColor: "#ffffff",
					zIndex: 10,
				}}
			/>
		</View>
	);
}
